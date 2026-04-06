import sharp from "sharp";

/**
 * Process an uploaded image:
 * 1. Sharpen for lineart (removes JPEG artifacts)
 * 2. Convert to WebP
 * 3. Generate thumbnail
 */
export async function processImage(inputBuffer: Buffer): Promise<{
  webpBuffer: Buffer;
  thumbBuffer: Buffer;
  pinterestBuffer: Buffer;
  width: number;
  height: number;
}> {
  // Get metadata first
  const metadata = await sharp(inputBuffer).metadata();
  const width = metadata.width || 2480;
  const height = metadata.height || 3508;

  // Full-size WebP with sharpening for lineart
  const webpBuffer = await sharp(inputBuffer)
    .sharpen({ sigma: 1.2, m1: 1.5, m2: 0.7 })
    .webp({ quality: 92 })
    .toBuffer();

  // Thumbnail: 400x566 (A4 proportions)
  const thumbBuffer = await sharp(inputBuffer)
    .resize(400, 566, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // Pinterest-optimized format (1000x1500, white background)
  const pinterestBuffer = await sharp(inputBuffer)
    .resize(1000, 1500, { fit: "contain", background: "#ffffff" })
    .jpeg({ quality: 90 })
    .toBuffer();

  return { webpBuffer, thumbBuffer, pinterestBuffer, width, height };
}

/**
 * Get image dimensions from a buffer.
 */
export async function getImageDimensions(
  buffer: Buffer
): Promise<{ width: number; height: number }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
  };
}
