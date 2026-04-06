import type { MetadataRoute } from 'next'
import { loadCategories, loadAllImages } from '@/lib/load-data'

const BASE_URL = 'https://ausmalbilder-gratis.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categories = loadCategories()
  const allImages = await loadAllImages()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/ausmalbilder`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/online-ausmalen`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/impressum`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/datenschutz`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  // Category pages (auto-generated from categories.json)
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: cat.parentSlug ? 0.8 : 0.85,
  }))

  // Individual image pages (auto-generated from all image JSONs)
  const imagePages: MetadataRoute.Sitemap = allImages
    .filter((img) => img.publishedAt)
    .map((img) => ({
      url: `${BASE_URL}/${img.category}/${img.slug}`,
      lastModified: new Date(img.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...categoryPages, ...imagePages]
}
