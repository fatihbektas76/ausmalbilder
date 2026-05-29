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
  pinterestUrl?: string
  altText: string
  seoDescription: string
  seoTextShort: string
  seoTextLong: string
  downloadCount?: number
  publishedAt: string
  seasonal?: 'weihnachten' | 'ostern' | 'halloween' | 'herbst' | 'fruehling'

  // Bilingual fields (DE + EN)
  titleDE?: string
  titleEN?: string
  slugDE?: string
  slugEN?: string
  titleSeoDE?: string
  titleSeoEN?: string
  metaTitleDE?: string
  metaTitleEN?: string
  metaDescDE?: string
  metaDescEN?: string
  altTextDE?: string
  altTextEN?: string

  // LLM-generated enrichment for SEO/GEO (Gemini)
  enrichment?: ImageEnrichment
  enrichmentGeneratedAt?: string
}

export interface TierSteckbrief {
  lebensraum: string
  groesse: string
  futter: string
  lebenserwartung: string
  besonderheit: string
}

export interface ImageEnrichment {
  /** 300–400 word motif-specific SEO long text (Markdown allowed) */
  seoTextLong: string
  /** 5 motif-specific bullet facts */
  motivFakten: string[]
  /** Animal profile — only for tier/* categories, otherwise undefined */
  tierSteckbrief?: TierSteckbrief
  /** Educational/developmental aspects, 3–5 bullets */
  lernziele: string[]
  /** Concrete color suggestions, 3–5 bullets */
  farbempfehlungen: string[]
  /** 5 motif-specific FAQs (replaces the generic 3) */
  customFaqs: FaqItem[]
  /** LSI keywords used for the SEO text — surface as a tag cloud */
  semanticKeywords: string[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface Category {
  slug: string
  name: string
  parentSlug?: string
  description: string
  introText?: string
  seoTitle: string
  seoDescription: string
  seoTextLong: string
  seoTextTitle?: string
  metaKeywords?: string
  faqItems?: FaqItem[]
  imageCount: number
  keywords: string[]
  thumbnails?: string[]
  audience?: 'kinder' | 'erwachsene' | 'alle'
  badge?: string
  displayCount?: string
  bgGradient?: string
  href?: string
  coloringTips?: string
}

export type BlogCategory =
  | 'stressabbau'
  | 'kinder-entwicklung'
  | 'kreativitaet'
  | 'ratgeber'
  | 'saisonal'

export interface BlogArticle {
  slug: string
  title: string
  titleSeo: string
  metaTitle: string
  metaDescription: string
  category: BlogCategory
  tags: string[]
  author: string
  publishedAt: string
  updatedAt: string
  readingTime: number
  featuredImage: string
  featuredImageAlt: string
  excerpt: string
  content: string
  relatedArticles: string[]
  relatedImages: string[]
  faq: FaqItem[]
  status?: 'draft' | 'live'
}
