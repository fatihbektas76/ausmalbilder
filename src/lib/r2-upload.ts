import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

const ENDPOINT = process.env.S3_ENDPOINT;
const REGION = process.env.S3_REGION || "fr-par";
const BUCKET = process.env.S3_BUCKET;
const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL;

const isConfigured = Boolean(
  ENDPOINT && BUCKET && ACCESS_KEY_ID && SECRET_ACCESS_KEY && ASSETS_URL
);

const s3 = isConfigured
  ? new S3Client({
      region: REGION,
      endpoint: ENDPOINT,
      credentials: {
        accessKeyId: ACCESS_KEY_ID!,
        secretAccessKey: SECRET_ACCESS_KEY!,
      },
    })
  : null;

/**
 * Upload a file to S3-compatible object storage (Scaleway, R2, etc.).
 * Falls back to local `public/uploads` when env vars are missing (dev only).
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  if (!s3) {
    return saveLocally(key, buffer);
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ACL: "public-read",
    })
  );

  return `${ASSETS_URL}/${key}`;
}

/**
 * Delete a file from object storage.
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!s3) {
    return deleteLocally(key);
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET!,
      Key: key,
    })
  );
}

// ---------------------------------------------------------------------------
// Local fallback (dev only — Vercel filesystem is read-only at runtime)
// ---------------------------------------------------------------------------

async function saveLocally(key: string, buffer: Buffer): Promise<string> {
  const dir = path.join(process.cwd(), "public", "uploads", path.dirname(key));
  await mkdir(dir, { recursive: true });
  const filePath = path.join(process.cwd(), "public", "uploads", key);
  await writeFile(filePath, buffer);
  return `/uploads/${key}`;
}

async function deleteLocally(key: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", "uploads", key);
  try {
    await unlink(filePath);
  } catch {
    // File might not exist
  }
}
