import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Tier Ausmalbilder kostenlos zum Ausdrucken',
  description:
    'Entdecke kostenlose Tier-Ausmalbilder zum Ausdrucken: Pferde, Hunde, Schmetterlinge und viele mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/tiere/' },
}

const subcategories = [
  { name: 'Pferde', href: '/tiere/pferd', count: 5, description: 'Galoppierende Pferde, Fohlen und Einhörner' },
  { name: 'Hunde', href: '/tiere/hund', count: 0, description: 'Süße Hunde und Welpen — bald verfügbar' },
  { name: 'Dinos', href: '/tiere/dino', count: 0, description: 'T-Rex, Triceratops und mehr — bald verfügbar' },
  { name: 'Schmetterlinge', href: '/tiere/schmetterling', count: 0, description: 'Bunte Schmetterlinge — bald verfügbar' },
]

export default function TierePage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Tiere', href: '/tiere' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Tier Ausmalbilder — kostenlos zum Ausdrucken
        </h1>

        <p className="text-gray-600 mb-8 max-w-3xl">
          Entdecke unsere Sammlung an Tier-Ausmalbildern. Von süßen Pferden über
          majestätische Drachen bis hin zu bunten Schmetterlingen — hier findest du
          das perfekte Motiv für jedes Alter.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subcategories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-brand-coral-light rounded-lg flex items-center justify-center text-2xl mb-4">
                🐴
              </div>
              <h2 className="text-lg font-semibold text-brand-indigo mb-1">{cat.name}</h2>
              <p className="text-sm text-gray-500 mb-2">{cat.description}</p>
              {cat.count > 0 && (
                <span className="inline-block text-xs bg-brand-coral-light text-brand-coral px-2 py-1 rounded-full">
                  {cat.count} Bilder
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
