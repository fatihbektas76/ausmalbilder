import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Online Ausmalen — kostenlos im Browser',
  description:
    'Male Ausmalbilder direkt online im Browser aus. Pinsel, Füllen, Farben und mehr — kostenlos und ohne Anmeldung. Jetzt ausprobieren!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/online-ausmalen/' },
}

export default function OnlineAusmalenPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Online Ausmalen', href: '/online-ausmalen' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Online Ausmalen — kostenlos im Browser
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-xl font-semibold text-brand-indigo mb-4">
              So funktioniert es
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: '1',
                  title: 'Ausmalbild auswählen',
                  desc: 'Wähle ein Ausmalbild aus unserer Sammlung — Tiere, Mandalas, saisonale Motive und mehr.',
                },
                {
                  step: '2',
                  title: 'Online ausmalen',
                  desc: 'Nutze Pinsel, Füllen und unsere Farbpalette mit 16+ Farben direkt im Browser.',
                },
                {
                  step: '3',
                  title: 'Speichern & Teilen',
                  desc: 'Speichere dein Werk als PNG oder teile es auf Pinterest, WhatsApp und Instagram.',
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
                  <div className="w-10 h-10 bg-brand-coral text-white rounded-full flex items-center justify-center font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-indigo">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-brand-indigo mb-4">
              Werkzeuge & Features
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-3">
              {[
                { icon: '🖌️', name: 'Pinsel', desc: '3 Größen (S, M, L) für feine Details und große Flächen' },
                { icon: '🪣', name: 'Füllen', desc: 'Klicke auf einen Bereich, um ihn mit Farbe zu füllen' },
                { icon: '🧹', name: 'Radierer', desc: 'Korrekturen einfach wegradieren' },
                { icon: '↩️', name: 'Rückgängig', desc: 'Bis zu 20 Schritte rückgängig machen (Strg+Z)' },
                { icon: '🎨', name: '16+ Farben', desc: 'Farbpalette mit Standardfarben + eigener Color-Picker' },
                { icon: '📱', name: 'Export', desc: 'PNG, Pinterest (1000×1500), Instagram Story, WhatsApp' },
              ].map((tool) => (
                <div key={tool.name} className="flex items-start gap-3">
                  <span className="text-2xl">{tool.icon}</span>
                  <div>
                    <span className="font-medium text-brand-indigo">{tool.name}</span>
                    <p className="text-sm text-gray-500">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/ausmalbilder"
            className="inline-block bg-brand-coral text-white font-semibold py-3 px-8 rounded-lg text-lg hover:opacity-90 transition-opacity"
          >
            Ausmalbilder entdecken und loslegen
          </a>
        </div>
      </div>
    </div>
  )
}
