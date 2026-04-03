import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Oster Ausmalbilder kostenlos zum Ausdrucken',
  description: 'Kostenlose Oster-Ausmalbilder zum Ausdrucken: Osterhasen, Ostereier und mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/saisonal/ostern/' },
}

export default function OsternPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ name: 'Startseite', href: '/' }, { name: 'Saisonal', href: '/ausmalbilder' }, { name: 'Ostern', href: '/saisonal/ostern' }]} />
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">Oster Ausmalbilder — kostenlos zum Ausdrucken</h1>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🐣</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">Oster-Ausmalbilder kommen bald!</h2>
          <p className="text-gray-500 max-w-md mx-auto">Osterhasen, bunte Ostereier, Küken und Frühlingsblumen — rechtzeitig zu Ostern verfügbar.</p>
          <a href="/tiere/pferd" className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Pferd-Ausmalbilder entdecken</a>
        </div>
        <SeoText title="Oster Ausmalbilder — Kreative Ideen für die Osterzeit" content={`Ostern ist für Kinder eine besonders kreative Zeit. Neben dem Eierfärben gehört das Ausmalen von Oster-Motiven zu den beliebtesten Aktivitäten. Unsere Oster-Ausmalbilder werden niedliche Osterhasen, kunstvoll verzierte Ostereier, flauschige Küken und bunte Frühlingsblumen umfassen.

Die Motive eignen sich perfekt als Osterdekoration, als Geschenkanhänger oder einfach als kreative Beschäftigung in den Osterferien. Verschiedene Schwierigkeitsgrade sorgen dafür, dass sowohl Kleinkinder als auch ältere Kinder und Erwachsene passende Motive finden.

Alle Oster-Ausmalbilder werden kostenlos als PDF zum Ausdrucken verfügbar sein — rechtzeitig vor dem Osterfest. Außerdem können sie direkt online ausgemalt werden.`} />
      </div>
    </div>
  )
}
