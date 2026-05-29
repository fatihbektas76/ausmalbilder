// Apply CORS policy to the Scaleway bucket so the in-browser coloring tool
// can fetch images with crossOrigin="anonymous".
//
// Run: node scripts/set-scaleway-cors.mjs

import { S3Client, PutBucketCorsCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

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
  S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY,
} = process.env;
for (const [k, v] of Object.entries({ S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY })) {
  if (!v) { console.error(`Missing env: ${k}`); process.exit(1); }
}

const s3 = new S3Client({
  region: S3_REGION,
  endpoint: S3_ENDPOINT,
  credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
});

const CORS_CONFIG = {
  CORSRules: [
    {
      AllowedHeaders: ["*"],
      AllowedMethods: ["GET", "HEAD"],
      AllowedOrigins: [
        "https://ausmalbilder-gratis.com",
        "https://ausmalbilder-xi.vercel.app",
        "https://*.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      ExposeHeaders: ["ETag", "Content-Length", "Content-Type"],
      MaxAgeSeconds: 86400,
    },
  ],
};

await s3.send(new PutBucketCorsCommand({ Bucket: S3_BUCKET, CORSConfiguration: CORS_CONFIG }));
console.log("✓ CORS policy applied to", S3_BUCKET);

const verify = await s3.send(new GetBucketCorsCommand({ Bucket: S3_BUCKET }));
console.log("\nActive rules:");
console.log(JSON.stringify(verify.CORSRules, null, 2));
