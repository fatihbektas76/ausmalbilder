'use client'

import { useState, useMemo } from 'react'
import type { Category, ColoringImage } from '@/data/types'
import ImageCard from '@/components/ui/ImageCard'
import FilterBar from '@/components/ui/FilterBar'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'
import FaqSection from '@/components/ui/FaqSection'
import AdUnit from '@/components/ui/AdUnit'

interface CategoryTemplateProps {
  category: Category
  images: ColoringImage[]
  breadcrumbs: { name: string; href: string }[]
  relatedCategories?: { name: string; href: string; description?: string }[]
  childCategories?: { name: string; href: string; description?: string; slug: string }[]
}

function ageToRange(age: string): [number, number] | null {
  switch (age) {
    case '3-5 J.': return [3, 5]
    case '6-8 J.': return [6, 8]
    case '9-12 J.': return [9, 12]
    case 'Erwachsene': return [16, 99]
    default: return null
  }
}

export default function CategoryTemplate({
  category,
  images,
  breadcrumbs,
  relatedCategories,
  childCategories,
}: CategoryTemplateProps) {
  const [filters, setFilters] = useState({ difficulty: 'Alle', age: 'Alle', style: 'Alle' })

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      if (filters.difficulty !== 'Alle' && img.difficulty !== filters.difficulty.toLowerCase()) return false
      if (filters.style !== 'Alle' && img.style !== filters.style.toLowerCase()) return false
      if (filters.age !== 'Alle') {
        const range = ageToRange(filters.age)
        if (range && (img.ageMin > range[1] || (img.ageMax ?? 99) < range[0])) return false
      }
      return true
    })
  }, [images, filters])

  const minAge = images.length > 0
    ? Math.min(...images.map((img) => img.ageMin))
    : 3

  const catName = category.name

  // --- Dynamic intro text (before filters) ---
  const einleitung = `Entdecke unsere Sammlung mit ${images.length} kostenlosen ${catName} Ausmalbildern für Kinder ab ${minAge} Jahren und Erwachsene. Von einfachen ${catName}-Vorlagen mit dicken Linien für Kleinkinder bis zu detaillierten Motiven für Schulkinder und Erwachsene — alle Malvorlagen kostenlos als PDF herunterladen oder direkt online im Browser ausmalen, ohne Anmeldung. Unsere ${catName} Ausmalbilder gibt es in drei Schwierigkeitsgraden: Einfach für Kindergartenkinder, Mittel für Grundschüler und Komplex für Erwachsene und Profis. Alle Vorlagen sind druckfertig im DIN-A4-Format und können auch direkt in unserem Online-Ausmaltool im Browser eingefärbt, gespeichert und geteilt werden.`

  // --- Dynamic SEO text (after grid, 5 paragraphs) ---
  const seoText = category.seoTextLong || [
    `${catName} Ausmalbilder zählen zu den beliebtesten Malvorlagen im deutschsprachigen Raum. Kinder und Erwachsene lieben Ausmalbilder von ${catName}-Motiven, weil sie so vielfältig dargestellt werden können. Unsere kostenlose Sammlung an ${catName} Ausmalbildern bietet für jeden Geschmack das passende Motiv — von einfachen Umrissen bis zu detailreichen Szenen.`,
    `Die ${catName} Malvorlagen sind in drei Schwierigkeitsgrade unterteilt: Einfache ${catName} Ausmalbilder für Kinder ab ${minAge} Jahren mit dicken Linien und großen Flächen, mittelschwere ${catName} Malvorlagen für Grundschulkinder mit mehr Details und feineren Konturen, sowie komplexe Motive für ältere Kinder und Erwachsene mit realistischen Proportionen und aufwendigen Hintergründen.`,
    `Alle ${catName} Ausmalbilder können direkt im Browser mit unserem kostenlosen Online-Ausmaltool koloriert werden — ganz ohne Installation oder Anmeldung. Wähle aus über 30 Farben, nutze verschiedene Pinselgrößen und füge sogar Formen hinzu. Das fertige Kunstwerk kann als PNG gespeichert oder auf Pinterest, WhatsApp und Instagram geteilt werden. Natürlich lassen sich alle Ausmalbilder auch als PDF herunterladen und auf DIN-A4-Papier ausdrucken.`,
    `Für besonders schöne Ergebnisse empfehlen wir hochwertige Buntstifte oder Filzstifte. Filzstifte eignen sich hervorragend für die einfachen Cartoon-Motive, während Aquarellstifte bei den detaillierten ${catName} Ausmalbildern für sanfte Farbübergänge sorgen. Alle ${catName} Ausmalbilder sind kostenlos — ohne versteckte Kosten und ohne Anmeldung.`,
    `Entdecke auch unsere verwandten Kategorien für noch mehr kreative Ausmalmotive. Alle Malvorlagen sind liebevoll gestaltet und werden regelmäßig durch neue ${catName}-Motive ergänzt.`,
  ].join('\n\n')

  const seoTitle = category.seoTextTitle || `${catName} Ausmalbilder — Malvorlagen kostenlos herunterladen`

  // --- Dynamic FAQs ---
  const faqItems = category.faqItems && category.faqItems.length > 0
    ? category.faqItems
    : [
        {
          question: `Sind alle ${catName} Ausmalbilder wirklich kostenlos?`,
          answer: `Ja — alle ${catName} Ausmalbilder auf ausmalbilder-gratis.com sind 100% kostenlos und ohne Anmeldung als PDF herunterladbar.`,
        },
        {
          question: `Für welches Alter eignen sich die ${catName} Ausmalbilder?`,
          answer: `Unsere ${catName} Ausmalbilder gibt es für alle Altersgruppen — von einfachen Vorlagen für Kleinkinder ab ${minAge} Jahren bis zu komplexen Motiven für Erwachsene. Nutze den Schwierigkeits-Filter um die passenden Bilder zu finden.`,
        },
        {
          question: `Kann ich die ${catName} Ausmalbilder online ausmalen?`,
          answer: `Ja — mit unserem kostenlosen Online-Ausmaltool kannst du jedes ${catName} Bild direkt im Browser ausmalen. Kein Download, keine Installation. Anschließend als PNG speichern oder teilen.`,
        },
      ]

  // --- Schema: ItemList ---
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${catName} Ausmalbilder`,
    description: category.seoDescription,
    numberOfItems: images.length,
    itemListElement: images.map((img, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://ausmalbilder-gratis.com/${img.category}/${img.slug}/`,
    })),
  }

  // --- Schema: FAQPage ---
  const faqSchema = {
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
        <Breadcrumb items={breadcrumbs} />

        {/* 2. H1 */}
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          {catName} Ausmalbilder — kostenlos zum Ausdrucken
        </h1>

        {/* 3. Stat-Chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-1 text-sm bg-brand-coral-light text-brand-coral px-3 py-1 rounded-full font-medium">
            {images.length} Bilder
          </span>
          <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
            Kostenloser Download
          </span>
          <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
            Ab {minAge} Jahren
          </span>
        </div>

        {/* 4. Einleitungstext (before filters) */}
        <p className="text-sm leading-relaxed text-gray-700 sm:text-base mb-6">
          {einleitung}
        </p>

        {/* 4b. Unter-Kategorien (for hub pages like /tiere/) */}
        {childCategories && childCategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-brand-indigo mb-4">
              {catName} Kategorien
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {childCategories.map((child) => (
                <a
                  key={child.href}
                  href={child.href}
                  className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                >
                  <span className="text-brand-indigo font-semibold group-hover:text-brand-coral transition-colors">
                    {child.name}
                  </span>
                  {child.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{child.description}</p>
                  )}
                  <span className="inline-block mt-2 text-xs text-brand-coral font-medium">
                    Alle Ausmalbilder &rarr;
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 5. Filter */}
        <FilterBar onFilterChange={setFilters} />

        {/* 6. Ad Placeholder */}
        <AdUnit className="my-6" />

        {/* 7. Bilder-Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {filteredImages.map((image) => (
            <ImageCard
              key={image.slug}
              slug={image.slug}
              title={image.title}
              thumbnailUrl={image.thumbnailUrl}
              altText={image.altText}
              difficulty={image.difficulty}
              ageMin={image.ageMin}
              ageMax={image.ageMax}
              category={image.category}
              pdfUrl={image.pdfUrl}
            />
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Keine Bilder gefunden für diese Filter.</p>
            <button
              onClick={() => setFilters({ difficulty: 'Alle', age: 'Alle', style: 'Alle' })}
              className="mt-4 text-brand-coral hover:underline"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {/* 8. SEO-Textblock (after grid) */}
        <SeoText title={seoTitle} content={seoText} />

        {/* 9. FAQ-Sektion */}
        <FaqSection
          title={`Häufige Fragen zu ${catName} Ausmalbildern`}
          items={faqItems}
        />

        {/* 10. Verwandte Kategorien */}
        {relatedCategories && relatedCategories.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-brand-indigo mb-4">Das könnte dir auch gefallen</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedCategories.map((cat) => (
                <a
                  key={cat.href}
                  href={cat.href}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="text-brand-indigo font-medium">{cat.name}</span>
                  {cat.description && (
                    <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 11. Schema Markup: ItemList + FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  )
}
