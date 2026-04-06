import { readFile, readdir } from 'fs/promises'
import path from 'path'
import type { Category, ColoringImage } from '@/data/types'
import categoriesData from '@/data/categories.json'

const DATA_DIR = path.join(process.cwd(), 'src', 'data')

/**
 * Load categories — uses static import for turbopack compatibility,
 * works reliably in both dev and production.
 */
export function loadCategories(): Category[] {
  return categoriesData as Category[]
}

/**
 * Load images for a category from disk at request time.
 * Category slug like "tiere/pferd" maps to file "tiere-pferd.json".
 * Uses async fs for turbopack compatibility.
 */
export async function loadImages(categorySlug: string): Promise<ColoringImage[]> {
  const jsonName = categorySlug.replace(/\//g, '-') + '.json'
  const filePath = path.join(DATA_DIR, 'images', jsonName)
  try {
    const content = await readFile(filePath, 'utf-8')
    return JSON.parse(content) as ColoringImage[]
  } catch {
    return []
  }
}

/**
 * Load ALL images across all category JSON files.
 */
export async function loadAllImages(): Promise<ColoringImage[]> {
  const imagesDir = path.join(DATA_DIR, 'images')
  try {
    const files = (await readdir(imagesDir)).filter(f => f.endsWith('.json'))
    const all: ColoringImage[] = []
    for (const file of files) {
      const content = await readFile(path.join(imagesDir, file), 'utf-8')
      const images: ColoringImage[] = JSON.parse(content)
      all.push(...images)
    }
    return all
  } catch {
    return []
  }
}
