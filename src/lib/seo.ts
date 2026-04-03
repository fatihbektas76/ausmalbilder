import type { Metadata } from 'next'

const SITE_URL = 'https://ausmalbilder-gratis.com'
const SITE_NAME = 'Ausmalbilder Gratis'

export function generatePageMetadata({
  title,
  description,
  path,
  ogImageUrl = '/og-default.jpg',
  keywords,
}: {
  title: string
  description: string
  path: string
  ogImageUrl?: string
  keywords?: string[]
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const ogImage = ogImageUrl.startsWith('http') ? ogImageUrl : `${SITE_URL}${ogImageUrl}`

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: 'de_DE',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

export function generateImageObjectSchema(image: {
  title: string
  description: string
  slug: string
  category: string
  keywords: string[]
  ageMin: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${image.title} Ausmalbild`,
    description: `Kostenloses Ausmalbild ${image.title} für Kinder ab ${image.ageMin} Jahren.`,
    contentUrl: `${SITE_URL}/images/${image.category}/${image.slug}.png`,
    thumbnailUrl: `${SITE_URL}/images/${image.category}/${image.slug}.png`,
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    creator: { '@type': 'Organization', name: SITE_NAME },
    keywords: image.keywords.join(', '),
  }
}

export function generateItemListSchema(
  name: string,
  description: string,
  items: { url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}${item.url}`,
    })),
  }
}
