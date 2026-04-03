import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Ausmalbilder für Erwachsene kostenlos',
  description:
    'Kostenlose Ausmalbilder für Erwachsene: Detaillierte Mandalas, Zentangle und mehr. Entspannung durch kreatives Ausmalen. Jetzt herunterladen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/erwachsene/' },
}

export default function ErwachsenePage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Erwachsene', href: '/erwachsene' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Ausmalbilder für Erwachsene — kostenlos zum Ausdrucken
        </h1>

        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🧘</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">
            Erwachsenen-Ausmalbilder kommen bald!
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Komplexe Mandalas, Zentangle-Muster und therapeutische Ausmalmotive
            für Erwachsene sind in Vorbereitung.
          </p>
          <a
            href="/tiere/pferd"
            className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
          >
            Pferd-Ausmalbilder entdecken
          </a>
        </div>

        <SeoText
          title="Ausmalbilder für Erwachsene — Kreative Entspannung im Alltag"
          content={`Ausmalbilder sind längst nicht mehr nur für Kinder. Immer mehr Erwachsene entdecken das kreative Ausmalen als Methode zur Entspannung und Stressreduktion. Studien zeigen, dass das Ausmalen von detaillierten Mustern ähnliche Effekte wie Meditation haben kann — es senkt den Cortisol-Spiegel und fördert die Achtsamkeit.

Unsere Ausmalbilder für Erwachsene werden speziell für anspruchsvolle Ausmaler entwickelt: Feine Linien, komplexe Muster und detaillierte Motive, die zum stundenlangen kreativen Arbeiten einladen. Von intricate Mandalas über Zentangle-Designs bis hin zu realistischen Natur- und Tiermotiven — die Auswahl wird vielfältig sein.

Alle Ausmalbilder für Erwachsene werden kostenlos und ohne Anmeldung als druckfertige PDF verfügbar sein. Das hochauflösende DIN-A4-Format eignet sich perfekt für Buntstifte, Fineliner oder Aquarellstifte. Außerdem können alle Motive direkt online in unserem Browser-Ausmaltool bearbeitet werden.

Ob als Feierabend-Ritual, in der Mittagspause oder am Wochenende — kreatives Ausmalen ist eine wunderbare Möglichkeit, den Kopf frei zu bekommen und gleichzeitig etwas Schönes zu erschaffen.`}
        />
      </div>
    </div>
  )
}
