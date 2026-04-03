'use client'

import { useState, useMemo } from 'react'
import type { ColoringImage } from '@/data/types'
import ImageCard from '@/components/ui/ImageCard'
import FilterBar from '@/components/ui/FilterBar'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'
import AdUnit from '@/components/ui/AdUnit'
import imagesData from '@/data/images/tiere-pferd.json'

const images: ColoringImage[] = imagesData as ColoringImage[]

const categoryData = {
  name: 'Pferd',
  seoTextLong: `Pferde gehören zu den beliebtesten Ausmalmotiven bei Kindern und Erwachsenen. Unsere Sammlung an Pferd Ausmalbildern bietet für jedes Alter und jeden Schwierigkeitsgrad das passende Motiv. Vom einfachen Pferd mit Fohlen für die Kleinsten ab 3 Jahren bis zum detaillierten Pferdekopf für fortgeschrittene Ausmaler — hier findet jeder sein Lieblingsbild.

Alle Pferd Ausmalbilder sind kostenlos und können ohne Anmeldung als PDF heruntergeladen werden. Das druckfertige DIN-A4-Format sorgt dafür, dass jedes Bild perfekt auf dem Papier aussieht. Alternativ können alle Motive auch direkt hier auf der Website online ausgemalt werden — mit unserem kostenlosen Ausmaltool im Browser.

Unsere Pferde-Motive umfassen galoppierende Pferde, friedlich grasende Pferde auf der Weide, liebevolle Szenen mit Stute und Fohlen sowie fantasievolle Einhörner. Die verschiedenen Schwierigkeitsgrade (einfach, mittel, komplex) machen die Bilder sowohl für Kindergartenkinder als auch für Grundschulkinder und sogar Erwachsene geeignet.

Das Ausmalen von Pferdebildern fördert die Feinmotorik, Konzentration und Kreativität. Es ist eine wunderbare Beschäftigung für regnerische Nachmittage, lange Autofahrten (einfach vorher ausdrucken!) oder als Ergänzung zum Reitunterricht. Viele Kinder lieben es, die ausgemalten Bilder an die Wand zu hängen oder als Geschenk zu verschenken.

Tipp: Für besonders schöne Ergebnisse empfehlen wir hochwertige Buntstifte oder Filzstifte. Bei den realistischen Pferdemotiven können auch Aquarellstifte für sanfte Farbübergänge verwendet werden.`,
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

export default function PferdCategoryPage() {
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
  }, [filters])

  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Tiere', href: '/tiere' },
            { name: 'Pferd', href: '/tiere/pferd' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Pferd Ausmalbilder — kostenlos zum Ausdrucken
        </h1>

        <div className="flex flex-wrap gap-3 mb-6">
          <span className="inline-flex items-center gap-1 text-sm bg-brand-coral-light text-brand-coral px-3 py-1 rounded-full font-medium">
            {images.length} Bilder
          </span>
          <span className="inline-flex items-center gap-1 text-sm bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
            Kostenloser Download
          </span>
          <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
            Ab 3 Jahren
          </span>
        </div>

        <FilterBar onFilterChange={setFilters} />

        <AdUnit className="my-6" />

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

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-brand-indigo mb-4">Verwandte Kategorien</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Mandala', href: '/mandala' },
              { name: 'Weihnachten', href: '/saisonal/weihnachten' },
              { name: 'Erwachsene', href: '/erwachsene' },
              { name: 'Halloween', href: '/saisonal/halloween' },
            ].map((cat) => (
              <a
                key={cat.href}
                href={cat.href}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-brand-indigo font-medium">{cat.name}</span>
              </a>
            ))}
          </div>
        </div>

        <SeoText
          title="Pferd Ausmalbilder — Ausmalbild für Kinder und Erwachsene"
          content={categoryData.seoTextLong}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Pferd Ausmalbilder',
            description: '5 kostenlose Pferd Ausmalbilder zum Ausdrucken oder online Ausmalen.',
            numberOfItems: images.length,
            itemListElement: images.map((img, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://ausmalbilder-gratis.com/${img.category}/${img.slug}`,
            })),
          }),
        }}
      />
    </div>
  )
}
