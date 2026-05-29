import type { Category, ColoringImage } from '@/data/types'
import {
  getCategories,
  getImages,
  getAllImages,
} from '@/lib/data-store'

/**
 * Load categories from Scaleway-backed data store.
 * Used by pages — wraps the async data-store call in a sync-friendly shape
 * for legacy callers; new code should call getCategories() directly.
 */
export async function loadCategories(): Promise<Category[]> {
  return getCategories()
}

/**
 * Load images for one category. Category slug like "tiere/pferd" → fetches
 * data/images/tiere-pferd.json from Scaleway.
 */
export async function loadImages(categorySlug: string): Promise<ColoringImage[]> {
  return getImages(categorySlug)
}

/**
 * Load ALL images across every category — iterates categories.json then
 * fetches each category's image list in parallel.
 */
export async function loadAllImages(): Promise<ColoringImage[]> {
  return getAllImages()
}
