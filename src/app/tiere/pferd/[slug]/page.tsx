import type { Metadata } from 'next'
import type { ColoringImage } from '@/data/types'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'
import RelatedImages from '@/components/ui/RelatedImages'
import ColoringToolWrapper from './ColoringToolWrapper'
import imagesData from '@/data/images/tiere-pferd.json'

const images: ColoringImage[] = imagesData as ColoringImage[]

function getImage(slug: string): ColoringImage | undefined {
  return images.find((img) => img.slug === slug)
}

export async function generateStaticParams() {
  return images.map((img) => ({ slug: img.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const image = getImage(slug)
  if (!image) {
    return { title: 'Ausmalbild nicht gefunden' }
  }

  return {
    title: `${image.titleSeo} | Ausmalbilder Gratis`,
    description: image.seoDescription,
    keywords: image.tags.join(', '),
    alternates: {
      canonical: `https://ausmalbilder-gratis.com/${image.category}/${image.slug}`,
    },
    openGraph: {
      title: image.titleSeo,
      description: image.seoDescription,
      url: `https://ausmalbilder-gratis.com/${image.category}/${image.slug}`,
      siteName: 'Ausmalbilder Gratis',
      locale: 'de_DE',
      type: 'website',
      images: [
        {
          url: `https://ausmalbilder-gratis.com${image.thumbnailUrl}`,
          width: 800,
          height: 1131,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: image.titleSeo,
      description: image.seoDescription,
    },
  }
}

const difficultyColors = {
  einfach: 'bg-green-100 text-green-800',
  mittel: 'bg-amber-100 text-amber-800',
  komplex: 'bg-red-100 text-red-800',
}

export default async function PferdSinglePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const image = getImage(slug)

  if (!image) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Ausmalbild nicht gefunden.</p>
      </div>
    )
  }

  const relatedImages = images
    .filter((img) => img.slug !== slug)
    .slice(0, 4)
    .map((img) => ({
      slug: img.slug,
      title: img.title,
      thumbnailUrl: img.thumbnailUrl,
      altText: img.altText,
      category: img.category,
      difficulty: img.difficulty,
    }))

  const schemaImageObject = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    name: `${image.title} Ausmalbild`,
    description: `Kostenloses Ausmalbild ${image.title} für Kinder ab ${image.ageMin} Jahren.`,
    contentUrl: `https://ausmalbilder-gratis.com${image.imageUrl}`,
    thumbnailUrl: `https://ausmalbilder-gratis.com${image.thumbnailUrl}`,
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    creator: { '@type': 'Organization', name: 'Ausmalbilder Gratis' },
    keywords: image.tags.join(', '),
  }

  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://ausmalbilder-gratis.com/' },
      { '@type': 'ListItem', position: 2, name: 'Tiere', item: 'https://ausmalbilder-gratis.com/tiere/' },
      { '@type': 'ListItem', position: 3, name: 'Pferd', item: 'https://ausmalbilder-gratis.com/tiere/pferd/' },
      { '@type': 'ListItem', position: 4, name: image.title, item: `https://ausmalbilder-gratis.com/${image.category}/${image.slug}` },
    ],
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Tiere', href: '/tiere' },
            { name: 'Pferd', href: '/tiere/pferd' },
            { name: image.title, href: `/tiere/pferd/${image.slug}` },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold text-brand-indigo mb-4">
              {image.titleSeo}
            </h1>

            {/* Image Preview / Coloring Tool */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <ColoringToolWrapper image={image} />
            </div>
          </div>

          {/* Sidebar - Metadata Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-brand-indigo mb-4">Details</h2>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Schwierigkeit</span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${difficultyColors[image.difficulty]}`}
                  >
                    {image.difficulty.charAt(0).toUpperCase() + image.difficulty.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Empfohlen ab</span>
                  <span className="text-sm font-medium text-brand-indigo">
                    {image.ageMin} Jahren
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Format</span>
                  <span className="text-sm font-medium text-brand-indigo">
                    DIN A4, {image.orientation === 'hochformat' ? 'Hochformat' : 'Querformat'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Stil</span>
                  <span className="text-sm font-medium text-brand-indigo">
                    {image.style.charAt(0).toUpperCase() + image.style.slice(1)}
                  </span>
                </div>

                {image.downloadCount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Downloads</span>
                    <span className="text-sm font-medium text-brand-indigo">
                      {image.downloadCount.toLocaleString('de-DE')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Kategorie</span>
                  <a
                    href="/tiere/pferd"
                    className="text-sm font-medium text-brand-coral hover:underline"
                  >
                    Pferde
                  </a>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={image.pdfUrl}
                  download
                  className="w-full flex items-center justify-center gap-2 bg-brand-coral text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  PDF herunterladen — kostenlos
                </a>

                <a
                  href="#coloring-tool"
                  className="w-full flex items-center justify-center gap-2 border-2 border-brand-indigo text-brand-indigo font-semibold py-3 px-4 rounded-lg hover:bg-brand-indigo hover:text-white transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Online ausmalen
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Text Block */}
        <SeoText
          title={`${image.title} — Ausmalbild für ${image.ageMin <= 5 ? 'Kleinkinder' : image.ageMin <= 12 ? 'Kinder' : 'Erwachsene'}`}
          content={image.seoTextLong}
        />

        {/* Related Images */}
        <RelatedImages images={relatedImages} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaImageObject) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
    </div>
  )
}
