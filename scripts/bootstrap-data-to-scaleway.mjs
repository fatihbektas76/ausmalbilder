// One-shot: upload current bundled JSON data to Scaleway under data/ prefix.
// Required after enabling Scaleway-backed data-store; idempotent.
//
// Run: node scripts/bootstrap-data-to-scaleway.mjs

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile, readdir } from "node:fs/promises";
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
} = process.env;

for (const [name, val] of Object.entries({
  S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY,
})) {
  if (!val) { console.error(`Missing env: ${name}`); process.exit(1); }
}

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});

async function putJSON(key, localPath) {
  const body = await readFile(localPath);
  await s3.send(new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
    Body: body,
    ContentType: "application/json",
    ACL: "public-read",
    CacheControl: "public, max-age=60",
  }));
  console.log(`  ✓ ${key}  (${(body.length/1024).toFixed(1)} KB)`);
}

console.log("\nBootstrapping data/ to Scaleway...\n");

// categories.json
await putJSON("data/categories.json", "src/data/categories.json");

// blog/articles.json (if exists)
if (existsSync("src/data/blog/articles.json")) {
  await putJSON("data/blog/articles.json", "src/data/blog/articles.json");
}

// images/*.json
const imagesDir = "src/data/images";
const files = (await readdir(imagesDir)).filter(f => f.endsWith(".json"));
for (const f of files) {
  await putJSON(`data/images/${f}`, join(imagesDir, f));
}

console.log(`\n  ${files.length + 2} files uploaded.\n`);
