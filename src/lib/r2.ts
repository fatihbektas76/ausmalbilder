// Cloudflare R2 Client — wird in Phase 2 aktiviert wenn echte Bilder hochgeladen werden.
// In Phase 1 verwenden wir lokale/statische Bilder.

export const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_BUCKET_NAME || 'ausmalbilder-gratis-assets',
}

export const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || ''
