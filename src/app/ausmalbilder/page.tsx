import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumb from '@/components/ui/Breadcrumb'
import SeoText from '@/components/ui/SeoText'

export const metadata: Metadata = {
  title: 'Ausmalbilder zum Ausdrucken — kostenlos',
  description:
    'Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken. Tiere, Mandalas, saisonale Motive und mehr — für Kinder und Erwachsene. Jetzt herunterladen!',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/ausmalbilder/' },
}

const categories = [
  { name: 'Tiere', href: '/tiere', count: '200+', emoji: '🦁' },
  { name: 'Mandala', href: '/mandala', count: '30+', emoji: '🔮' },
  { name: 'Weihnachten', href: '/saisonal/weihnachten', count: '40+', emoji: '🎄' },
  { name: 'Halloween', href: '/saisonal/halloween', count: '35+', emoji: '🎃' },
  { name: 'Ostern', href: '/saisonal/ostern', count: '25+', emoji: '🐣' },
  { name: 'Herbst', href: '/saisonal/herbst', count: '20+', emoji: '🍂' },
  { name: 'Frühling', href: '/saisonal/fruehling', count: '30+', emoji: '🌸' },
  { name: 'Erwachsene', href: '/erwachsene', count: '15+', emoji: '🧘' },
]

export default function AusmalbilderHubPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Ausmalbilder', href: '/ausmalbilder' },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-bold text-brand-indigo mt-6 mb-4">
          Ausmalbilder zum Ausdrucken — kostenlos herunterladen
        </h1>

        <p className="text-gray-600 mb-8 max-w-3xl text-lg leading-relaxed">
          Willkommen bei Ausmalbilder Gratis! Hier findest du hunderte kostenlose
          Ausmalbilder zum Ausdrucken und Online-Ausmalen. Wähle eine Kategorie und
          entdecke wunderschöne Motive für Kinder und Erwachsene.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="text-4xl mb-3">{cat.emoji}</div>
              <h2 className="text-lg font-semibold text-brand-indigo group-hover:text-brand-coral transition-colors">
                {cat.name}
              </h2>
              <span className="text-sm text-gray-500">{cat.count} Ausmalbilder</span>
            </Link>
          ))}
        </div>

        <SeoText
          title="Ausmalbilder zum Ausdrucken — für Kinder und Erwachsene"
          content={`Ausmalbilder sind eine wunderbare Möglichkeit, Kreativität und Feinmotorik zu fördern — und das in jedem Alter. Auf ausmalbilder-gratis.com findest du eine stetig wachsende Sammlung kostenloser Ausmalbilder zum Ausdrucken und Online-Ausmalen.

Unsere Ausmalbilder decken eine breite Palette an Motiven ab: Von niedlichen Tieren wie Pferden, Hunden und Schmetterlingen über faszinierende Mandalas bis hin zu saisonalen Themen wie Weihnachten, Ostern und Halloween. Jedes Motiv ist sorgfältig gestaltet und steht in verschiedenen Schwierigkeitsgraden zur Verfügung.

Alle Ausmalbilder können kostenlos und ohne Anmeldung als druckfertige PDF im DIN-A4-Format heruntergeladen werden. Alternativ können sie direkt im Browser mit unserem Online-Ausmaltool ausgemalt werden — perfekt für unterwegs oder wenn gerade keine Buntstifte zur Hand sind.

Für Kinder bieten einfache Motive mit großen Flächen und klaren Umrissen den perfekten Einstieg. Ältere Kinder und Erwachsene finden in unseren detaillierten Mandalas und realistischen Tiermotiven die richtige Herausforderung. Das Ausmalen ist nicht nur kreativ, sondern auch entspannend — viele Erwachsene nutzen Ausmalbilder als Achtsamkeitsübung und zur Stressreduktion.

Stöbere durch unsere Kategorien und finde dein perfektes Ausmalbild. Alle Motive sind 100% kostenlos — ohne versteckte Kosten, ohne Abo, ohne Anmeldung.`}
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Ausmalbilder zum Ausdrucken',
            description: 'Kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen für Kinder und Erwachsene.',
            numberOfItems: categories.length,
            itemListElement: categories.map((cat, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://ausmalbilder-gratis.com${cat.href}`,
              name: cat.name,
            })),
          }),
        }}
      />
    </div>
  )
}
