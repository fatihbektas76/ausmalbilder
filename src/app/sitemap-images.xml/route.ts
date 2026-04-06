import { NextResponse } from 'next/server'
import { loadAllImages, loadCategories } from '@/lib/load-data'

const BASE_URL = 'https://ausmalbilder-gratis.com'

export async function GET() {
  const allImages = await loadAllImages()
  const categories = loadCategories()

  const catMap = new Map(categories.map((c) => [c.slug, c.name]))

  const urls = allImages
    .filter((img) => img.publishedAt)
    .map((img) => {
      const pageUrl = `${BASE_URL}/${img.category}/${img.slug}/`
      const imageUrl = `${BASE_URL}${img.imageUrl}`
      const thumbUrl = `${BASE_URL}${img.thumbnailUrl}`
      const catName = catMap.get(img.category) || img.category
      const caption = `${img.title} — kostenloses Ausmalbild zum Ausdrucken (${catName})`
      const geoLocation = 'Deutschland'
      const license = 'https://creativecommons.org/licenses/by-nc/4.0/'

      return `  <url>
    <loc>${escapeXml(pageUrl)}</loc>
    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
      <image:title>${escapeXml(img.title + ' Ausmalbild kostenlos')}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>${escapeXml(geoLocation)}</image:geo_location>
      <image:license>${escapeXml(license)}</image:license>
    </image:image>
    <image:image>
      <image:loc>${escapeXml(thumbUrl)}</image:loc>
      <image:title>${escapeXml(img.title + ' Ausmalbild Vorschau')}</image:title>
      <image:caption>${escapeXml(caption)}</image:caption>
      <image:geo_location>${escapeXml(geoLocation)}</image:geo_location>
      <image:license>${escapeXml(license)}</image:license>
    </image:image>
  </url>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
