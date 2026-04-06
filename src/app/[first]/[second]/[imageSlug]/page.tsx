import type { Metadata } from 'next'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Category } from '@/data/types'
import { loadCategories, loadImages } from '@/lib/load-data'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'
import FaqSection from '@/components/ui/FaqSection'
import RelatedImages from '@/components/ui/RelatedImages'
import ColoringToolWrapper from '@/components/templates/ColoringToolWrapper'
import AutoDownload from '@/components/ui/AutoDownload'

const difficultyColors = {
  einfach: 'bg-green-100 text-green-800',
  mittel: 'bg-amber-100 text-amber-800',
  komplex: 'bg-red-100 text-red-800',
}

const difficultyAudience = {
  einfach: 'Kleinkinder und Vorschüler',
  mittel: 'Grundschulkinder',
  komplex: 'ältere Kinder und Erwachsene',
}

const difficultyDescription = {
  einfach: 'klaren, dicken Linien und großen Flächen machen es ideal für jüngere Kinder',
  mittel: 'ausgewogene Detailtiefe bietet genug Abwechslung ohne zu überfordern',
  komplex: 'feinen Linien und komplexen Details bieten auch Erwachsenen eine echte Herausforderung',
}

export async function generateStaticParams() {
  const categories = loadCategories()
  const params: { first: string; second: string; imageSlug: string }[] = []

  for (const cat of categories) {
    if (!cat.slug.includes('/')) continue
    const [first, second] = cat.slug.split('/')
    const images = await loadImages(cat.slug)
    for (const img of images) {
      params.push({ first, second, imageSlug: img.slug })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ first: string; second: string; imageSlug: string }>
}): Promise<Metadata> {
  const { first, second, imageSlug } = await params
  const categorySlug = `${first}/${second}`
  const categories = loadCategories()
  const category = categories.find((c: Category) => c.slug === categorySlug)
  const categoryName = category?.name || second.charAt(0).toUpperCase() + second.slice(1)
  const images = await loadImages(categorySlug)
  const image = images.find((img) => img.slug === imageSlug)

  if (!image) {
    return { title: 'Ausmalbild nicht gefunden' }
  }

  const pageUrl = `https://ausmalbilder-gratis.com/${image.category}/${image.slug}/`
  const imageUrl = `https://ausmalbilder-gratis.com${image.thumbnailUrl}`
  const metaTitle = image.metaTitleDE || `${image.title} Ausmalbild kostenlos zum Ausdrucken & Ausmalen | Ausmalbilder Gratis`
  const metaDesc = image.metaDescDE || `${image.title} Ausmalbild kostenlos als PDF herunterladen oder direkt online ausmalen. Schwierigkeit: ${image.difficulty}. Für Kinder ab ${image.ageMin} Jahren — ohne Anmeldung, 100% gratis.`

  // Rich keywords from tags + category + difficulty + style
  const keywordSet = new Set([
    ...image.tags,
    `${image.title.toLowerCase()} ausmalbild`,
    `${image.title.toLowerCase()} malvorlage`,
    `${image.title.toLowerCase()} ausmalvorlage kostenlos`,
    `${categoryName.toLowerCase()} ausmalbild`,
    `ausmalbild ${image.difficulty}`,
    `malvorlage ${image.style}`,
    'ausmalbild kostenlos',
    'malvorlage kostenlos',
    'ausmalbilder gratis',
    'pdf herunterladen',
    'online ausmalen',
  ])

  // Build hreflang alternates
  const alternates: Metadata['alternates'] = {
    canonical: pageUrl,
    languages: {
      'de': pageUrl,
      'x-default': pageUrl,
    },
  }

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: [...keywordSet].join(', '),
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
    alternates,
    openGraph: {
      title: `${image.title} — Ausmalbild kostenlos zum Ausdrucken`,
      description: metaDesc,
      url: pageUrl,
      siteName: 'Ausmalbilder Gratis',
      locale: 'de_DE',
      type: 'article',
      publishedTime: image.publishedAt || undefined,
      section: categoryName,
      tags: image.tags,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 1131,
          alt: image.altText,
          type: 'image/webp',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${image.title} — Ausmalbild kostenlos`,
      description: metaDesc,
      images: [imageUrl],
    },
  }
}

export default async function DynamicImagePage({
  params,
}: {
  params: Promise<{ first: string; second: string; imageSlug: string }>
}) {
  const { first, second, imageSlug } = await params
  const categorySlug = `${first}/${second}`
  const categories = loadCategories()
  const images = await loadImages(categorySlug)
  const image = images.find((img) => img.slug === imageSlug)

  if (!image) {
    notFound()
  }

  const category = categories.find((c: Category) => c.slug === categorySlug)
  const parent = categories.find((c: Category) => c.slug === first)

  const parentName = parent?.name || first.charAt(0).toUpperCase() + first.slice(1)
  const categoryName = category?.name || second.charAt(0).toUpperCase() + second.slice(1)

  const relatedImages = images
    .filter((img) => img.slug !== imageSlug)
    .slice(0, 4)
    .map((img) => ({
      slug: img.slug,
      title: img.title,
      thumbnailUrl: img.thumbnailUrl,
      altText: img.altText,
      category: img.category,
      difficulty: img.difficulty,
    }))

  // --- Dynamic short description ---
  const kurzbeschreibung = `Kostenloses ${image.title} Ausmalbild zum Ausdrucken oder online Ausmalen. Perfekt für ${difficultyAudience[image.difficulty]} ab ${image.ageMin} Jahren — jetzt gratis als PDF herunterladen.`

  // --- Dynamic SEO text (250 words) ---
  const seoTextDynamic = `Das ${image.title} Ausmalbild eignet sich besonders für Kinder ab ${image.ageMin} Jahren. Die ${difficultyDescription[image.difficulty]}.

Das Ausmalbild steht kostenlos als druckfertige PDF-Datei im DIN-A4-${image.orientation === 'hochformat' ? 'Hochformat' : 'Querformat'} zur Verfügung — ohne Anmeldung und ohne versteckte Kosten. Alternativ kannst du das ${image.title} Bild direkt online in unserem Browser-Ausmaltool einfärben. Mit dem Füllen-Werkzeug, verschiedenen Pinseln und einer großen Farbpalette macht das digitale Ausmalen genauso viel Spaß wie auf Papier. Das fertige Werk kannst du als PNG speichern oder direkt auf Pinterest oder WhatsApp teilen.

${image.title} gehört zur Kategorie ${categoryName}. Weitere beliebte ${categoryName} Ausmalbilder findest du in unserer Sammlung mit über ${images.length} kostenlosen Vorlagen.

Tipp zum Ausdrucken: Wähle in den Druckereinstellungen "Seite anpassen" für das beste Ergebnis auf DIN-A4-Papier. Für besonders schöne Ergebnisse empfehlen wir Buntstifte oder Filzstifte mit wasserfester Tinte.`

  // --- Dynamic FAQs ---
  const faqItems = [
    {
      question: `Ist das ${image.title} Ausmalbild wirklich kostenlos?`,
      answer: `Ja — das ${image.title} Ausmalbild ist 100% kostenlos und ohne Anmeldung als PDF herunterladbar. Alle Ausmalbilder auf ausmalbilder-gratis.com sind dauerhaft gratis.`,
    },
    {
      question: `Für welches Alter eignet sich das ${image.title} Ausmalbild?`,
      answer: `Das ${image.title} Ausmalbild ist für Kinder ab ${image.ageMin} Jahren geeignet. Der Schwierigkeitsgrad ist ${image.difficulty} — ideal für ${difficultyAudience[image.difficulty]}.`,
    },
    {
      question: `Kann ich das ${image.title} Ausmalbild online ausmalen?`,
      answer: `Ja — mit unserem kostenlosen Online-Ausmaltool kannst du das ${image.title} Bild direkt im Browser ausmalen. Kein Download, keine Installation. Anschließend als PNG speichern oder auf Pinterest und WhatsApp teilen.`,
    },
  ]

  const pageUrl = `https://ausmalbilder-gratis.com/${image.category}/${image.slug}/`
  const fullImageUrl = `https://ausmalbilder-gratis.com${image.imageUrl}`
  const fullThumbUrl = `https://ausmalbilder-gratis.com${image.thumbnailUrl}`

  // --- Schema: ImageObject (enhanced) ---
  const schemaImageObject = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${pageUrl}#image`,
    name: `${image.title} Ausmalbild`,
    description: `Kostenloses ${image.title} Ausmalbild für Kinder ab ${image.ageMin} Jahren — Schwierigkeit: ${image.difficulty}`,
    contentUrl: fullImageUrl,
    thumbnailUrl: fullThumbUrl,
    url: pageUrl,
    width: image.orientation === 'hochformat' ? 2480 : 3508,
    height: image.orientation === 'hochformat' ? 3508 : 2480,
    encodingFormat: 'image/webp',
    license: 'https://creativecommons.org/licenses/by-nc/4.0/',
    acquireLicensePage: pageUrl,
    creditText: 'Ausmalbilder Gratis',
    copyrightNotice: 'Ausmalbilder Gratis — kostenlos zum persönlichen Gebrauch',
    creator: { '@type': 'Organization', name: 'Ausmalbilder Gratis', url: 'https://ausmalbilder-gratis.com' },
    datePublished: image.publishedAt || undefined,
    keywords: image.tags.join(', '),
    isAccessibleForFree: true,
    isFamilyFriendly: true,
  }

  // --- Schema: CreativeWork (coloring page as downloadable work) ---
  const schemaCreativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': pageUrl,
    name: `${image.title} — Ausmalbild kostenlos`,
    description: kurzbeschreibung,
    url: pageUrl,
    image: { '@id': `${pageUrl}#image` },
    datePublished: image.publishedAt || undefined,
    inLanguage: 'de',
    isAccessibleForFree: true,
    isFamilyFriendly: true,
    audience: {
      '@type': 'EducationalAudience',
      educationalRole: 'student',
      suggestedMinAge: image.ageMin,
      suggestedMaxAge: image.ageMax || (image.difficulty === 'komplex' ? 99 : 12),
    },
    genre: `${categoryName} Ausmalbild`,
    keywords: image.tags.join(', '),
    publisher: {
      '@type': 'Organization',
      name: 'Ausmalbilder Gratis',
      url: 'https://ausmalbilder-gratis.com',
      logo: { '@type': 'ImageObject', url: 'https://ausmalbilder-gratis.com/logo.png' },
    },
    potentialAction: [
      {
        '@type': 'DownloadAction',
        target: `https://ausmalbilder-gratis.com${image.pdfUrl}`,
        name: 'PDF herunterladen',
      },
      {
        '@type': 'ViewAction',
        target: `${pageUrl}#ausmalen`,
        name: 'Online ausmalen',
      },
    ],
  }

  // --- Schema: HowTo (how to use this coloring page) ---
  const schemaHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${image.title} Ausmalbild ausmalen — so geht's`,
    description: `Anleitung zum Ausmalen des ${image.title} Ausmalbilds — als PDF ausdrucken oder direkt online im Browser ausmalen.`,
    image: fullThumbUrl,
    totalTime: 'PT15M',
    supply: [
      { '@type': 'HowToSupply', name: 'Drucker (optional)' },
      { '@type': 'HowToSupply', name: 'Buntstifte oder Filzstifte (optional)' },
    ],
    tool: [
      { '@type': 'HowToTool', name: 'Browser mit Internetzugang' },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Ausmalbild öffnen',
        text: `Öffne das ${image.title} Ausmalbild auf ausmalbilder-gratis.com.`,
        url: pageUrl,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'PDF herunterladen oder online ausmalen',
        text: 'Klicke auf "PDF herunterladen" zum Ausdrucken oder auf "Online ausmalen" für das Browser-Ausmaltool.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Ausmalen und genießen',
        text: 'Male das Bild mit Buntstiften aus oder nutze das Online-Tool mit über 30 Farben, verschiedenen Pinseln und dem Füllen-Werkzeug.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Speichern oder teilen',
        text: 'Speichere dein fertiges Kunstwerk als PNG oder teile es direkt auf Pinterest oder WhatsApp.',
      },
    ],
  }

  // --- Schema: BreadcrumbList ---
  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://ausmalbilder-gratis.com/' },
      { '@type': 'ListItem', position: 2, name: parentName, item: `https://ausmalbilder-gratis.com/${first}/` },
      { '@type': 'ListItem', position: 3, name: categoryName, item: `https://ausmalbilder-gratis.com/${categorySlug}/` },
      { '@type': 'ListItem', position: 4, name: image.title, item: pageUrl },
    ],
  }

  // --- Schema: FAQPage ---
  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 1. Breadcrumb */}
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: parentName, href: `/${first}` },
            { name: categoryName, href: `/${categorySlug}` },
            { name: image.title, href: `/${image.category}/${image.slug}` },
          ]}
        />

        {/* Auto-Download when ?action=download */}
        <Suspense fallback={null}>
          <AutoDownload pdfUrl={image.pdfUrl} />
        </Suspense>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (60%) */}
          <div className="lg:col-span-2">
            {/* 2. H1 */}
            <h1 className="text-2xl md:text-3xl font-bold text-brand-indigo mb-3">
              {image.title} — Ausmalbild kostenlos
            </h1>

            {/* 3. Short description */}
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base mb-4">
              {kurzbeschreibung}
            </p>

            {/* 7. Online-Ausmalen-Tool */}
            <div id="ausmalen" className="scroll-mt-24 bg-white rounded-xl shadow-sm p-4">
              <ColoringToolWrapper image={image} />
            </div>
          </div>

          {/* Sidebar (40%) — Download + Metadata */}
          <div className="lg:col-span-1">
            <div id="download-section" className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-brand-indigo mb-4">Details</h2>

              {/* 6. Metadaten-Panel */}
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

                {image.downloadCount != null && image.downloadCount > 0 && (
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
                    href={`/${categorySlug}`}
                    className="text-sm font-medium text-brand-coral hover:underline"
                  >
                    {categoryName}
                  </a>
                </div>
              </div>

              {/* 5. Action Buttons */}
              <div className="mt-6 space-y-3">
                <a
                  href={image.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  PDF offnen &amp; drucken
                </a>

                <a
                  href="#ausmalen"
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

        {/* 8. SEO-Textblock */}
        <SeoText
          title={`${image.title} — Ausmalbild für ${image.ageMin <= 5 ? 'Kleinkinder' : image.ageMin <= 12 ? 'Kinder' : 'Erwachsene'}`}
          content={image.seoTextLong || seoTextDynamic}
        />

        {/* 9. FAQ-Sektion */}
        <FaqSection
          title={`Häufige Fragen zum ${image.title} Ausmalbild`}
          items={faqItems}
        />

        {/* 10. Verwandte Bilder */}
        <RelatedImages
          images={relatedImages}
          title={`Weitere ${categoryName} Ausmalbilder`}
        />
      </div>

      {/* Schema Markup: ImageObject + CreativeWork + HowTo + BreadcrumbList + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaImageObject) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCreativeWork) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
      />
    </div>
  )
}
