import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Weihnachts Ausmalbilder kostenlos zum Ausdrucken',
  description:
    'Kostenlose Weihnachts-Ausmalbilder zum Ausdrucken: Weihnachtsbaum, Schneemann, Nikolaus und mehr. Jetzt herunterladen oder online ausmalen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/saisonal/weihnachten/' },
}

export default function WeihnachtenPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Saisonal', href: '/ausmalbilder' },
            { name: 'Weihnachten', href: '/saisonal/weihnachten' },
          ]}
        />
        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Weihnachts Ausmalbilder — kostenlos zum Ausdrucken
        </h1>
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <div className="text-6xl mb-4">🎄</div>
          <h2 className="text-xl font-semibold text-brand-indigo mb-2">Weihnachts-Ausmalbilder kommen bald!</h2>
          <p className="text-gray-500 max-w-md mx-auto">Weihnachtsbäume, Schneemänner, Nikolaus und mehr — rechtzeitig zur Adventszeit verfügbar.</p>
          <a href="/tiere/pferd" className="inline-block mt-6 bg-brand-coral text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-opacity">Pferd-Ausmalbilder entdecken</a>
        </div>
        <SeoText
          title="Weihnachts Ausmalbilder — Festliche Motive für die Adventszeit"
          content={`Weihnachten ist die perfekte Zeit zum Basteln und Ausmalen. Unsere Weihnachts-Ausmalbilder werden eine vielfältige Sammlung festlicher Motive umfassen: Geschmückte Weihnachtsbäume, freundliche Schneemänner, der Nikolaus mit seinem Schlitten, Rentiere, Geschenke, Sterne und vieles mehr.

Die Motive werden in verschiedenen Schwierigkeitsgraden verfügbar sein — von einfachen Motiven für die Kleinsten bis hin zu detaillierten Weihnachtsmandalas für Erwachsene. Perfekt als Beschäftigung an kalten Wintertagen, als selbstgemachte Weihnachtsdekoration oder als persönliches Geschenk für Oma und Opa.

Alle Weihnachts-Ausmalbilder werden kostenlos als PDF zum Ausdrucken bereitstehen. Außerdem können sie direkt online ausgemalt und auf Pinterest, WhatsApp oder Instagram geteilt werden — perfekt für digitale Weihnachtsgrüße!

Tipp: Unsere Weihnachts-Ausmalbilder werden ab Mitte Oktober verfügbar sein, damit genug Zeit zum Ausmalen und Dekorieren bleibt.`}
        />
      </div>
    </div>
  )
}
