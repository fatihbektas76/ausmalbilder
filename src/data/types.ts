export interface ColoringImage {
  slug: string
  title: string
  titleSeo: string
  category: string
  tags: string[]
  difficulty: 'einfach' | 'mittel' | 'komplex'
  ageMin: number
  ageMax?: number
  style: 'cartoon' | 'realistisch' | 'mandala' | 'geometrisch'
  orientation: 'hochformat' | 'querformat'
  imageUrl: string
  thumbnailUrl: string
  pdfUrl: string
  svgUrl?: string
  altText: string
  seoDescription: string
  seoTextShort: string
  seoTextLong: string
  downloadCount?: number
  publishedAt: string
  seasonal?: 'weihnachten' | 'ostern' | 'halloween' | 'herbst' | 'fruehling'
}

export interface Category {
  slug: string
  name: string
  parentSlug?: string
  description: string
  seoTitle: string
  seoDescription: string
  seoTextLong: string
  imageCount: number
  keywords: string[]
  thumbnails?: string[]
  audience?: 'kinder' | 'erwachsene' | 'alle'
  badge?: string
  displayCount?: string
  bgGradient?: string
  href?: string
}
