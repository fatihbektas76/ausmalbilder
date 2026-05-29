// Backfill LLM enrichment for existing images.
// Iterates every published image in Scaleway, calls Gemini for each motif
// that doesn't already have enrichment, writes back to the same JSON.
//
// Run: node scripts/backfill-enrichment.mjs [--force]
//   --force  re-generate even for images that already have enrichment

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

// Load .env.local
const envPath = join(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    let val = m[2];
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

const {
  S3_ENDPOINT, S3_REGION, S3_BUCKET,
  S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_ASSETS_URL, GEMINI_API_KEY,
} = process.env;

for (const [name, val] of Object.entries({
  S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_ASSETS_URL, GEMINI_API_KEY,
})) {
  if (!val) { console.error(`Missing env: ${name}`); process.exit(1); }
}

const FORCE = process.argv.includes("--force");

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});

const RESPONSE_SCHEMA = {
  type: "object",
  required: ["seoTextLong","motivFakten","lernziele","farbempfehlungen","customFaqs","semanticKeywords"],
  properties: {
    seoTextLong: { type: "string" },
    motivFakten: { type: "array", items: { type: "string" }, minItems: 5, maxItems: 5 },
    tierSteckbrief: {
      type: "object",
      properties: {
        lebensraum: { type: "string" }, groesse: { type: "string" },
        futter: { type: "string" }, lebenserwartung: { type: "string" },
        besonderheit: { type: "string" },
      },
      required: ["lebensraum","groesse","futter","lebenserwartung","besonderheit"],
    },
    lernziele: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    farbempfehlungen: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 5 },
    customFaqs: {
      type: "array", minItems: 5, maxItems: 5,
      items: {
        type: "object",
        required: ["question","answer"],
        properties: { question: { type: "string" }, answer: { type: "string" } },
      },
    },
    semanticKeywords: { type: "array", items: { type: "string" }, minItems: 8, maxItems: 15 },
  },
};

async function fetchJSON(key) {
  const res = await fetch(`${NEXT_PUBLIC_ASSETS_URL}/${key}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${key}: HTTP ${res.status}`);
  return res.json();
}

async function putJSON(key, data) {
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: JSON.stringify(data, null, 2),
    ContentType: "application/json",
    ACL: "public-read",
    CacheControl: "public, max-age=60",
  }));
}

function buildPrompt({ title, categorySlug, categoryName, difficulty, ageMin, orientation, style }) {
  const ageGroup =
    ageMin <= 5 ? "Kleinkinder (Kindergarten-Alter)"
    : ageMin <= 10 ? "Grundschulkinder"
    : ageMin <= 14 ? "ältere Kinder / Jugendliche"
    : "Erwachsene";

  const isTier = categorySlug.startsWith("tiere/");

  return `Du bist ein SEO-spezialisierter deutscher Content-Redakteur für eine Kinder-Ausmalbilder-Webseite.

Generiere strukturierten Inhalt für die Einzelseite eines Ausmalbilds:

**Motiv-Titel:** ${title}
**Kategorie:** ${categoryName} (Slug: ${categorySlug})
**Schwierigkeit:** ${difficulty}
**Zielgruppe:** ${ageGroup} ab ${ageMin} Jahren
**Format:** DIN A4, ${orientation}
**Stil:** ${style}

**Anforderungen:**
- Deutsche Sprache, kindgerechte Tonalität wo sinnvoll
- Motiv-SPEZIFISCH (echte Tier-Fakten, keine Generic-Templates)
- SEO-optimiert, semantisches Cluster
- E-E-A-T: konkrete, überprüfbare Fakten
- GEO-tauglich: beantwortet echte Nutzerfragen
- KEINE Phrasen wie "kostenloses PDF" im Long-Text

**Wichtig:** ${isTier ? "Die Kategorie ist ein konkretes Tier — fülle tierSteckbrief mit realen Fakten aus." : "Die Kategorie ist KEIN konkretes Tier — lass tierSteckbrief weg."}

Antworte mit JSON gemäß Schema.`;
}

async function enrich(input) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": GEMINI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });
  if (!res.ok) { console.error(`  ✗ Gemini ${res.status}: ${(await res.text()).slice(0,200)}`); return null; }
  const json = await res.json();
  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) return null;
  return JSON.parse(raw);
}

// Main
console.log("\nLoading categories from Scaleway...");
const categories = await fetchJSON("data/categories.json");

let totalImages = 0, enriched = 0, skipped = 0, failed = 0;

for (const cat of categories) {
  const key = `data/images/${cat.slug.replace(/\//g, "-")}.json`;
  let images;
  try { images = await fetchJSON(key); } catch { continue; }
  if (!Array.isArray(images) || images.length === 0) continue;

  console.log(`\nCategory: ${cat.slug} (${images.length} images)`);
  let mutated = false;

  for (const img of images) {
    totalImages++;
    if (img.enrichment && !FORCE) {
      console.log(`  · ${img.slug}  (skip — already enriched)`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ⋯ ${img.slug}  generating... `);
    const t0 = Date.now();
    const result = await enrich({
      title: img.title,
      categorySlug: img.category,
      categoryName: cat.name,
      difficulty: img.difficulty,
      ageMin: img.ageMin,
      orientation: img.orientation,
      style: img.style,
    });

    if (!result) {
      console.log("✗");
      failed++;
      continue;
    }

    img.enrichment = result;
    img.enrichmentGeneratedAt = new Date().toISOString();
    mutated = true;
    enriched++;
    console.log(`✓ (${((Date.now()-t0)/1000).toFixed(1)}s, ${result.seoTextLong.split(/\s+/).length} Wörter)`);
  }

  if (mutated) {
    await putJSON(key, images);
    console.log(`  ✓ Saved ${key}`);
  }
}

console.log(`\n--- Summary ---`);
console.log(`  Total:    ${totalImages}`);
console.log(`  Enriched: ${enriched}`);
console.log(`  Skipped:  ${skipped}`);
console.log(`  Failed:   ${failed}`);
