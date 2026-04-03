import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Halloween Ausmalbilder kostenlos zum Ausdrucken',
  description: 'Kostenlose Halloween-Ausmalbilder zum Ausdrucken: Kürbisse, Geister, Hexen und mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/saisonal/halloween/' },
}

export default function HalloweenPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ name: 'Startseite', href: '/' }, { name: 'Saisonal', href: '/ausmalbilder' }, { name: 'Halloween', href: '/saisonal/halloween' }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">Halloween Ausmalbilder — kostenlos zum Ausdrucken</h1>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🎃</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">Halloween-Ausmalbilder kommen bald!</h2>
          <p className="text-gray-500 max-w-md mx-auto">Gruselige Kürbisse, freundliche Geister, Hexen und Fledermäuse — ab August verfügbar.</p>
          <a href="/tiere/pferd" className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Pferd-Ausmalbilder entdecken</a>
        </div>
        <SeoText title="Halloween Ausmalbilder — Gruselig-schöne Motive für Oktober" content={`Halloween wird auch in Deutschland immer beliebter — und mit unseren Halloween-Ausmalbildern wird die gruselige Jahreszeit noch kreativer. Von lächelnden Kürbissen für die Kleinsten bis hin zu detaillierten Spukhäusern für ältere Kinder bieten wir eine breite Auswahl an Halloween-Motiven.

Die Ausmalbilder eignen sich perfekt für Halloween-Partys, als Fensterdekoration oder als kreative Beschäftigung an regnerischen Herbsttagen. Verschiedene Schwierigkeitsgrade machen die Motive für alle Altersgruppen geeignet.

Alle Halloween-Ausmalbilder werden kostenlos als PDF zum Ausdrucken verfügbar sein — ab Mitte August, damit genug Zeit zum Ausmalen und Dekorieren bleibt.`} />
      </div>
    </div>
  )
}
