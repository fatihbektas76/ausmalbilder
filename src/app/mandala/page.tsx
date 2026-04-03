import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Mandala Ausmalbilder kostenlos zum Ausdrucken',
  description:
    'Kostenlose Mandala Ausmalbilder zum Ausdrucken. Entspannende Muster für Kinder und Erwachsene. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/mandala/' },
}

export default function MandalaPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Mandala', href: '/mandala' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Mandala Ausmalbilder — kostenlos zum Ausdrucken
        </h1>

        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🔮</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">
            Mandala-Ausmalbilder kommen bald!
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Wir arbeiten an einer wunderschönen Sammlung von Mandala-Ausmalbildern
            für Kinder und Erwachsene. Schau bald wieder vorbei!
          </p>
          <a
            href="/tiere/pferd"
            className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Pferd-Ausmalbilder entdecken
          </a>
        </div>

        <SeoText
          title="Mandalas zum Ausdrucken — Entspannung durch kreatives Ausmalen"
          content={`Mandalas sind kreisförmige, symmetrische Muster, die ihren Ursprung in der hinduistischen und buddhistischen Tradition haben. Heute sind Mandala-Ausmalbilder eines der beliebtesten Motive für entspannendes und meditatives Ausmalen — sowohl für Kinder als auch für Erwachsene.

Das Ausmalen von Mandalas fördert die Konzentration, reduziert Stress und wirkt beruhigend auf Körper und Geist. Die repetitiven Muster laden dazu ein, sich ganz auf den kreativen Prozess zu konzentrieren und den Alltag für eine Weile hinter sich zu lassen. Viele Therapeuten empfehlen Mandala-Ausmalen als Achtsamkeitsübung.

Unsere Mandala-Ausmalbilder werden in verschiedenen Schwierigkeitsgraden verfügbar sein: Von einfachen Mandalas mit großen Flächen für Kinder ab 4 Jahren bis hin zu hochdetaillierten Zentangle-Mustern für Erwachsene, die eine echte Herausforderung suchen.

Alle Mandalas werden kostenlos als druckfertige PDF zum Download bereitstehen. Außerdem können sie direkt online in unserem Browser-Ausmaltool ausgemalt werden — perfekt für eine schnelle Entspannungspause zwischendurch.`}
        />
      </div>
    </div>
  )
}
