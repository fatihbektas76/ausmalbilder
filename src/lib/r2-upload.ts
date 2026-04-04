import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "http://localhost:9000", // fallback for local dev
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "ausmalbilder-gratis-assets";
const ASSETS_URL =
  process.env.NEXT_PUBLIC_ASSETS_URL || "/uploads"; // fallback to local

/**
 * Upload a file to Cloudflare R2.
 * Returns the public URL.
 */
export async function uploadToR2(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  // If no R2 credentials, save locally instead
  if (!process.env.R2_ACCESS_KEY_ID) {
    return saveLocally(key, buffer);
  }

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    })
  );

  return `${ASSETS_URL}/${key}`;
}

/**
 * Delete a file from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  if (!process.env.R2_ACCESS_KEY_ID) {
    return deleteLocally(key);
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

// ---------------------------------------------------------------------------
// Local fallback (when R2 is not configured)
// ---------------------------------------------------------------------------
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

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
