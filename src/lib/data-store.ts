/**
 * Centralized data store backed by Scaleway Object Storage.
 *
 * All admin write paths and page read paths go through here so the app works
 * on Vercel (read-only filesystem at runtime). Falls back to empty data when
 * Scaleway is unreachable so the build never hard-fails.
 */

import {
  S3Client,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import type { Category, ColoringImage, BlogArticle } from "@/data/types";

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

const PREFIX = "data/";
const REVALIDATE_SECONDS = 60;

// ---------------------------------------------------------------------------
// Low-level JSON IO
// ---------------------------------------------------------------------------

async function getJSON<T>(key: string, fallback: T): Promise<T> {
  if (!ASSETS_URL) return fallback;
  try {
    const res = await fetch(`${ASSETS_URL}/${key}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

async function putJSON(key: string, data: unknown): Promise<void> {
  if (!s3) {
    throw new Error(
      "Object storage not configured — set S3_* env vars to enable writes."
    );
  }
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET!,
      Key: key,
      Body: JSON.stringify(data, null, 2),
      ContentType: "application/json",
      ACL: "public-read",
      CacheControl: `public, max-age=${REVALIDATE_SECONDS}`,
    })
  );
}

// ---------------------------------------------------------------------------
// Object-level copy / delete (for cross-category moves)
// ---------------------------------------------------------------------------

export async function copyObject(srcKey: string, dstKey: string): Promise<void> {
  if (!s3) return;
  try {
    await s3.send(
      new CopyObjectCommand({
        Bucket: BUCKET!,
        Key: dstKey,
        CopySource: `/${BUCKET}/${encodeURIComponent(srcKey).replace(/%2F/g, "/")}`,
        ACL: "public-read",
      })
    );
  } catch (err: unknown) {
    const code = (err as { $metadata?: { httpStatusCode?: number } })?.$metadata
      ?.httpStatusCode;
    if (code !== 404) throw err;
  }
}

export async function deleteObject(key: string): Promise<void> {
  if (!s3) return;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET!, Key: key }));
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  return getJSON<Category[]>(`${PREFIX}categories.json`, []);
}

export async function saveCategories(cats: Category[]): Promise<void> {
  await putJSON(`${PREFIX}categories.json`, cats);
}

// ---------------------------------------------------------------------------
// Images per category
// ---------------------------------------------------------------------------

function imagesKey(categorySlug: string): string {
  return `${PREFIX}images/${categorySlug.replace(/\//g, "-")}.json`;
}

export async function getImages(categorySlug: string): Promise<ColoringImage[]> {
  return getJSON<ColoringImage[]>(imagesKey(categorySlug), []);
}

export async function saveImages(
  categorySlug: string,
  images: ColoringImage[]
): Promise<void> {
  await putJSON(imagesKey(categorySlug), images);
}

export async function getAllImages(): Promise<ColoringImage[]> {
  const cats = await getCategories();
  const lists = await Promise.all(cats.map((c) => getImages(c.slug)));
  return lists.flat();
}

// ---------------------------------------------------------------------------
// Blog articles
// ---------------------------------------------------------------------------

export async function getArticles(): Promise<BlogArticle[]> {
  return getJSON<BlogArticle[]>(`${PREFIX}blog/articles.json`, []);
}

export async function saveArticles(articles: BlogArticle[]): Promise<void> {
  await putJSON(`${PREFIX}blog/articles.json`, articles);
}
