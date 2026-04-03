import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Herbst Ausmalbilder kostenlos zum Ausdrucken',
  description: 'Kostenlose Herbst-Ausmalbilder zum Ausdrucken: Blätter, Igel, Pilze und mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/saisonal/herbst/' },
}

export default function HerbstPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ name: 'Startseite', href: '/' }, { name: 'Saisonal', href: '/ausmalbilder' }, { name: 'Herbst', href: '/saisonal/herbst' }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">Herbst Ausmalbilder — kostenlos zum Ausdrucken</h1>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🍂</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">Herbst-Ausmalbilder kommen bald!</h2>
          <p className="text-gray-500 max-w-md mx-auto">Bunte Blätter, niedliche Igel, Pilze und Herbstlandschaften — bald verfügbar.</p>
          <a href="/tiere/pferd" className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Pferd-Ausmalbilder entdecken</a>
        </div>
        <SeoText title="Herbst Ausmalbilder — Bunte Motive für die goldene Jahreszeit" content={`Der Herbst bietet eine Fülle an wunderschönen Motiven zum Ausmalen: Bunte Blätter in Rot, Orange und Gold, niedliche Igel, die sich auf den Winterschlaf vorbereiten, prächtige Pilze und malerische Herbstlandschaften.

Unsere Herbst-Ausmalbilder laden dazu ein, die Farben des Herbstes kreativ zu erkunden. Kinder können experimentieren, welche Farbkombinationen am schönsten aussehen — ein roter Ahorn? Ein goldener Eichenblatt? Der Kreativität sind keine Grenzen gesetzt.

Alle Herbst-Ausmalbilder werden kostenlos als PDF verfügbar sein und können auch direkt online ausgemalt werden.`} />
      </div>
    </div>
  )
}
