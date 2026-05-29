// One-shot migration: upload public/uploads + public/images to Scaleway,
// then rewrite URL references in src/data/images/*.json.
//
// Run from project root:
//   node --env-file=.env.local scripts/migrate-to-scaleway.mjs

import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFile, writeFile, readdir, stat } from "node:fs/promises";
import { readFileSync, existsSync } from "node:fs";
import { join, extname, relative } from "node:path";

// Load .env.local manually (Node's --env-file chokes on Vercel-pulled multiline values).
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
  S3_ENDPOINT,
  S3_REGION,
  S3_BUCKET,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_ASSETS_URL,
} = process.env;

for (const [name, val] of Object.entries({
  S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, NEXT_PUBLIC_ASSETS_URL,
})) {
  if (!val) {
    console.error(`Missing env: ${name}. Run with: node --env-file=.env.local scripts/migrate-to-scaleway.mjs`);
    process.exit(1);
  }
}

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});

const CONTENT_TYPES = {
  ".webp": "image/webp",
  ".svg":  "image/svg+xml",
  ".pdf":  "application/pdf",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
};

async function walk(dir) {
  const out = [];
  let entries;
  try { entries = await readdir(dir); } catch { return out; }
  for (const name of entries) {
    const full = join(dir, name);
    const st = await stat(full);
    if (st.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

// Map local path → bucket key
function toKey(absPath) {
  const projectRoot = process.cwd();
  const rel = relative(projectRoot, absPath);
  // public/uploads/images/X.webp -> images/X.webp  (strip "public/uploads/")
  // public/images/tiere/X.svg    -> images/tiere/X.svg (strip "public/")
  // public/pdfs/X.pdf            -> pdfs/X.pdf (strip "public/")
  if (rel.startsWith("public/uploads/")) return rel.slice("public/uploads/".length);
  if (rel.startsWith("public/"))         return rel.slice("public/".length);
  return rel;
}

async function exists(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return true;
  } catch (e) {
    if (e.$metadata?.httpStatusCode === 404 || e.name === "NotFound") return false;
    throw e;
  }
}

async function uploadOne(absPath) {
  const key = toKey(absPath);
  const ext = extname(absPath).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || "application/octet-stream";

  if (await exists(key)) {
    await setPublic(key);
    return { key, status: "skip", reason: "exists — ACL refreshed" };
  }

  const body = await readFile(absPath);
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
    ACL: "public-read",
  }));
  return { key, status: "uploaded", size: body.length };
}

async function setPublic(key) {
  // For files that already exist — set ACL only.
  const { PutObjectAclCommand } = await import("@aws-sdk/client-s3");
  await s3.send(new PutObjectAclCommand({
    Bucket: S3_BUCKET,
    Key: key,
    ACL: "public-read",
  }));
}

// ---- Step 1: Upload all files ---------------------------------------------

console.log("\n┌─ Step 1: Upload to Scaleway ─────────────────────────────────────┐");
console.log(`│  Bucket: ${S3_BUCKET}`);
console.log(`│  Region: ${S3_REGION}`);
console.log("└──────────────────────────────────────────────────────────────────┘\n");

const sources = [
  join(process.cwd(), "public", "uploads"),
  join(process.cwd(), "public", "images"),
];

const allFiles = [];
for (const src of sources) allFiles.push(...(await walk(src)));

if (allFiles.length === 0) {
  console.log("Nothing to upload — public/uploads and public/images are empty.");
} else {
  console.log(`Found ${allFiles.length} files.\n`);
  let uploaded = 0, skipped = 0;
  for (const f of allFiles) {
    try {
      const res = await uploadOne(f);
      if (res.status === "uploaded") {
        uploaded++;
        console.log(`  ✓ ${res.key}  (${(res.size/1024).toFixed(1)} KB)`);
      } else {
        skipped++;
        console.log(`  · ${res.key}  (skip — ${res.reason})`);
      }
    } catch (e) {
      console.error(`  ✗ ${f}: ${e.message}`);
      process.exit(1);
    }
  }
  console.log(`\n  ${uploaded} uploaded, ${skipped} skipped.\n`);
}

// ---- Step 2: Rewrite URL references in JSON -------------------------------

console.log("┌─ Step 2: Rewrite URLs in src/data/images/*.json ──────────────────┐\n");

const dataDir = join(process.cwd(), "src", "data", "images");
const jsonFiles = (await readdir(dataDir)).filter(f => f.endsWith(".json"));

const URL_FIELDS = ["imageUrl", "thumbnailUrl", "pdfUrl", "pinterestUrl", "svgUrl"];

function rewriteUrl(value) {
  if (typeof value !== "string" || !value.startsWith("/")) return value;
  if (value.startsWith(NEXT_PUBLIC_ASSETS_URL)) return value; // already migrated

  // /uploads/X         -> {ASSETS}/X     (strip /uploads/)
  // /images/X, /pdfs/X -> {ASSETS}/images/X, {ASSETS}/pdfs/X
  let stripped;
  if (value.startsWith("/uploads/"))  stripped = value.slice("/uploads/".length);
  else if (value.startsWith("/"))     stripped = value.slice(1);
  return `${NEXT_PUBLIC_ASSETS_URL}/${stripped}`;
}

let totalChanged = 0;

for (const file of jsonFiles) {
  const fullPath = join(dataDir, file);
  const raw = await readFile(fullPath, "utf-8");
  const data = JSON.parse(raw);
  let changed = 0;

  for (const entry of data) {
    for (const field of URL_FIELDS) {
      if (field in entry) {
        const before = entry[field];
        const after = rewriteUrl(before);
        if (before !== after) { entry[field] = after; changed++; }
      }
    }
  }

  if (changed > 0) {
    await writeFile(fullPath, JSON.stringify(data, null, 2) + "\n", "utf-8");
    console.log(`  ✓ ${file}: ${changed} URLs rewritten`);
    totalChanged += changed;
  } else {
    console.log(`  · ${file}: no changes`);
  }
}

console.log(`\n  ${totalChanged} URLs rewritten total.\n`);
console.log("Done. Next: review the diff, then commit + push.\n");
