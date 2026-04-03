const SITE_URL = 'https://ausmalbilder-gratis.com'

export function getShareUrls(slug: string, category: string, title: string) {
  const pageUrl = `${SITE_URL}/${category}/${slug}`
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(`${title} Ausmalbild kostenlos — ausmalbilder-gratis.com`)

  return {
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Schau mal was ich ausgemalt habe! 🎨 ${pageUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    copyUrl: pageUrl,
  }
}
