import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Frühlings Ausmalbilder kostenlos zum Ausdrucken',
  description: 'Kostenlose Frühlings-Ausmalbilder zum Ausdrucken: Blumen, Schmetterlinge und mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/saisonal/fruehling/' },
}

export default function FruehlingPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ name: 'Startseite', href: '/' }, { name: 'Saisonal', href: '/ausmalbilder' }, { name: 'Frühling', href: '/saisonal/fruehling' }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">Frühlings Ausmalbilder — kostenlos zum Ausdrucken</h1>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🌸</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">Frühlings-Ausmalbilder kommen bald!</h2>
          <p className="text-gray-500 max-w-md mx-auto">Blühende Blumen, bunte Schmetterlinge, Marienkäfer und Frühlingswiesen.</p>
          <a href="/tiere/pferd" className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Pferd-Ausmalbilder entdecken</a>
        </div>
        <SeoText title="Frühlings Ausmalbilder — Blühende Motive zum Ausmalen" content={`Der Frühling bringt neues Leben und frische Farben — perfekt zum Ausmalen! Unsere Frühlings-Ausmalbilder werden eine bunte Sammlung an Motiven bieten: Blühende Tulpen und Narzissen, flatternde Schmetterlinge, fleißige Bienen, niedliche Marienkäfer und saftig grüne Frühlingswiesen.

Die Motive eignen sich hervorragend als Fensterdekoration, als Geschenk zum Muttertag oder einfach als kreative Beschäftigung an den ersten warmen Tagen. Von einfachen Blumenmotiven für Kleinkinder bis hin zu detaillierten Gartenszenen für ältere Kinder — für jeden Schwierigkeitsgrad ist etwas dabei.

Alle Frühlings-Ausmalbilder werden ab Mitte Januar kostenlos verfügbar sein — rechtzeitig, um die Vorfreude auf den Frühling zu wecken.`} />
      </div>
    </div>
  )
}
