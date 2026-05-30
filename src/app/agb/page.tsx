import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'AGB — Allgemeine Geschäftsbedingungen',
  description:
    'Allgemeine Geschäftsbedingungen und Nutzungsbedingungen von ausmalbilder-gratis.com.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/agb/' },
  robots: { index: true, follow: true },
}

const SECTIONS: { id: string; n: number; title: string }[] = [
  { id: 'geltungsbereich', n: 1, title: 'Geltungsbereich' },
  { id: 'leistungen', n: 2, title: 'Leistungen & Kostenlosigkeit' },
  { id: 'lizenz', n: 3, title: 'Lizenz der Ausmalbilder' },
  { id: 'verfuegbarkeit', n: 4, title: 'Verfügbarkeit & Änderungen' },
  { id: 'pflichten', n: 5, title: 'Pflichten der Nutzer' },
  { id: 'haftung', n: 6, title: 'Haftung' },
  { id: 'aenderungen-agb', n: 7, title: 'Änderungen dieser AGB' },
  { id: 'schluss', n: 8, title: 'Recht & Schlussbestimmungen' },
]

/* --- helpers (mirror Impressum/Datenschutz) --- */

function SectionHeading({
  n,
  id,
  children,
}: {
  n: number
  id: string
  children: React.ReactNode
}) {
  return (
    <h2
      id={id}
      className="group scroll-mt-24 mb-4 flex items-center gap-3 text-xl font-bold text-brand-indigo"
    >
      <span
        aria-hidden
        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-coral/10 text-sm font-semibold text-brand-coral"
      >
        {n}
      </span>
      <span>{children}</span>
      <a
        href={`#${id}`}
        aria-label="Direktlink zu diesem Abschnitt"
        className="ml-1 text-gray-300 opacity-0 transition-opacity hover:text-brand-coral group-hover:opacity-100"
      >
        #
      </a>
    </h2>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section className="scroll-mt-24 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
      {children}
    </section>
  )
}

function ExtLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-brand-coral underline-offset-2 hover:underline"
    >
      {children}
    </a>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-lg border-l-4 border-brand-coral bg-brand-cream/60 px-4 py-3">
      <svg
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </svg>
      <p className="text-sm leading-relaxed text-gray-700">{children}</p>
    </div>
  )
}

/* --- page --- */

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'AGB', href: '/agb' },
          ]}
        />

        {/* Header */}
        <header className="mt-6 mb-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
                Rechtliche Informationen
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-indigo sm:text-4xl">
                Allgemeine Geschäftsbedingungen
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Nutzungsbedingungen für ausmalbilder-gratis.com — Umfang der
                Leistungen, Lizenz der Inhalte, Haftung und Schluss­bestimmungen.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Stand: Mai 2026
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* TOC sidebar */}
          <aside className="hidden lg:block">
            <nav
              aria-label="Inhaltsverzeichnis"
              className="sticky top-24 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
            >
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Inhalt
              </h2>
              <ol className="space-y-1.5 text-sm">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="flex gap-2 rounded-md px-2 py-1.5 text-gray-600 transition-colors hover:bg-brand-cream hover:text-brand-indigo"
                    >
                      <span className="w-5 shrink-0 text-right text-xs font-semibold text-gray-400">
                        {s.n}
                      </span>
                      <span className="leading-snug">{s.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          {/* Content */}
          <main className="space-y-6 leading-relaxed text-gray-700">
            {/* 1. Geltungsbereich */}
            <Card>
              <SectionHeading n={1} id="geltungsbereich">
                Geltungsbereich
              </SectionHeading>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (nachfolgend „AGB")
                regeln das Verhältnis zwischen dem Betreiber der Website{' '}
                <strong>ausmalbilder-gratis.com</strong> (Fatih Bektas, Alte
                Bruchsaler Str. 28, 69168 Wiesloch) und den Nutzerinnen und
                Nutzern der Website (nachfolgend „Nutzer").
              </p>
              <p className="mt-3">
                Mit der Nutzung der Website erkennt der Nutzer diese AGB an.
                Abweichende Bedingungen des Nutzers werden nicht anerkannt, es
                sei denn, sie wurden ausdrücklich schriftlich vereinbart.
              </p>
            </Card>

            {/* 2. Leistungen */}
            <Card>
              <SectionHeading n={2} id="leistungen">
                Leistungen & Kostenlosigkeit
              </SectionHeading>
              <p>
                Auf der Website werden Ausmalbilder zum Herunterladen als PDF
                sowie ein browserbasiertes Online-Ausmaltool kostenlos zur
                Verfügung gestellt.
              </p>
              <div className="mt-4 rounded-xl bg-brand-cream/60 p-5">
                <p className="text-sm font-semibold text-brand-indigo">
                  Was kostenlos ist:
                </p>
                <ul className="mt-3 space-y-2 text-sm text-gray-700">
                  {[
                    'Download der Ausmalbilder als druckfertige PDF im DIN-A4-Format',
                    'Nutzung des Online-Ausmaltools im Browser',
                    'Speichern und Teilen der fertigen Werke (z. B. als PNG)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span aria-hidden className="text-brand-coral">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="mt-4">
                Eine Anmeldung oder die Anlage eines Benutzerkontos ist hierfür
                nicht erforderlich. Ein Anspruch auf eine ständige
                Verfügbarkeit der Website besteht nicht (siehe Ziff. 4).
              </p>
            </Card>

            {/* 3. Lizenz */}
            <Card>
              <SectionHeading n={3} id="lizenz">
                Lizenz der Ausmalbilder
              </SectionHeading>
              <p>
                Sämtliche auf der Website bereitgestellten Ausmalbilder stehen
                unter der folgenden Creative-Commons-Lizenz:
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-5">
                <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-sm font-semibold text-brand-coral">
                  CC&nbsp;BY-NC&nbsp;4.0
                </span>
                <span className="text-sm text-gray-700">
                  Namensnennung – Nicht-kommerziell
                </span>
              </div>

              <p className="mt-5 font-semibold text-brand-indigo">
                Was Sie dürfen:
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  'Die Bilder kostenlos herunterladen und ausdrucken.',
                  'Die ausgemalten Bilder im privaten und schulischen Kontext nutzen, anfertigen lassen und mit Familie und Freunden teilen.',
                  'Die Inhalte zur eigenen kreativen Nutzung bearbeiten.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="text-green-600">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 font-semibold text-brand-indigo">
                Was nicht gestattet ist:
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  'Eine kommerzielle Nutzung der Bilder (z. B. Verkauf, kommerzielle Druckerzeugnisse, Werbeprodukte).',
                  'Die Vermarktung der Bilder als Teil eigener kostenpflichtiger Angebote.',
                  'Die Weiterverbreitung ohne Quellennennung („ausmalbilder-gratis.com").',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span aria-hidden className="text-red-500">
                      ✗
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-gray-600">
                Vollständige Lizenzbedingungen:{' '}
                <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/deed.de">
                  creativecommons.org/licenses/by-nc/4.0/deed.de
                </ExtLink>
              </p>
            </Card>

            {/* 4. Verfügbarkeit */}
            <Card>
              <SectionHeading n={4} id="verfuegbarkeit">
                Verfügbarkeit & Änderungen der Inhalte
              </SectionHeading>
              <p>
                Der Betreiber bemüht sich, die Website durchgängig verfügbar
                zu halten. Ein Anspruch auf eine ununterbrochene Verfügbarkeit
                besteht jedoch nicht. Wartungsarbeiten, technische Störungen
                oder höhere Gewalt können zu zeitweiligen Einschränkungen
                führen.
              </p>
              <p className="mt-3">
                Der Betreiber behält sich vor, das Angebot der Website
                jederzeit zu ändern, einzelne Inhalte zu entfernen oder zu
                ergänzen sowie das Angebot ganz oder teilweise einzustellen,
                ohne dass hieraus Ansprüche des Nutzers entstehen.
              </p>
            </Card>

            {/* 5. Pflichten */}
            <Card>
              <SectionHeading n={5} id="pflichten">
                Pflichten der Nutzer
              </SectionHeading>
              <p>Nutzer verpflichten sich, die Website nicht zu missbrauchen,
                insbesondere nicht:</p>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  'die technische Infrastruktur der Website durch übermäßige automatisierte Zugriffe (Scraping, Bots) zu beeinträchtigen,',
                  'Sicherheitsmechanismen zu umgehen oder unbefugten Zugang zu nicht öffentlichen Bereichen zu versuchen,',
                  'die Bilder oder Inhalte entgegen der Lizenz (siehe Ziff. 3) kommerziell zu verwerten,',
                  'rechtswidrige Inhalte über die Plattform (z. B. das Online-Ausmaltool) zu erzeugen oder zu verbreiten.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-gray-700">
                    <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* 6. Haftung */}
            <Card>
              <SectionHeading n={6} id="haftung">
                Haftung
              </SectionHeading>
              <p>
                Der Betreiber haftet unbeschränkt bei Vorsatz und grober
                Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens,
                des Körpers oder der Gesundheit. Eine Haftung nach dem
                Produkthaftungsgesetz bleibt unberührt.
              </p>
              <p className="mt-3">
                Im Übrigen ist die Haftung des Betreibers für leicht
                fahrlässige Pflichtverletzungen auf den vorhersehbaren,
                vertragstypischen Schaden begrenzt, soweit wesentliche
                Vertragspflichten (Kardinalpflichten) betroffen sind. Bei der
                Verletzung unwesentlicher Vertragspflichten ist die Haftung
                für leichte Fahrlässigkeit ausgeschlossen.
              </p>
              <div className="mt-4">
                <Callout>
                  Die Ausmalbilder werden „wie besehen" zur Verfügung gestellt.
                  Der Betreiber übernimmt keine Gewähr für die Eignung für
                  einen bestimmten Zweck, die Druckqualität auf jedem
                  Endgerät oder die ständige Aktualität der Inhalte.
                </Callout>
              </div>
            </Card>

            {/* 7. Änderungen AGB */}
            <Card>
              <SectionHeading n={7} id="aenderungen-agb">
                Änderungen dieser AGB
              </SectionHeading>
              <p>
                Der Betreiber behält sich vor, diese AGB jederzeit mit Wirkung
                für die Zukunft zu ändern, soweit dies aus sachlichem Grund
                (z. B. Änderung der Rechtslage, technische Entwicklungen,
                Änderung des Leistungsumfangs) erforderlich ist. Die jeweils
                aktuelle Fassung ist auf dieser Seite einsehbar.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Für die Beurteilung der Rechte und Pflichten des Nutzers ist
                stets die zum Zeitpunkt der Nutzung gültige Fassung
                maßgeblich.
              </p>
            </Card>

            {/* 8. Schluss */}
            <Card>
              <SectionHeading n={8} id="schluss">
                Anwendbares Recht & Schlussbestimmungen
              </SectionHeading>
              <p>
                Für alle Rechtsbeziehungen zwischen dem Betreiber und dem
                Nutzer gilt ausschließlich das Recht der Bundesrepublik
                Deutschland unter Ausschluss des UN-Kaufrechts. Bei
                Verbrauchern bleiben zwingende Schutzvorschriften des Staates,
                in dem der Verbraucher seinen gewöhnlichen Aufenthalt hat,
                unberührt.
              </p>
              <p className="mt-3">
                Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise
                unwirksam sein oder werden, berührt dies die Wirksamkeit der
                übrigen Bestimmungen nicht. An die Stelle der unwirksamen
                Bestimmung tritt die gesetzlich zulässige Regelung, die dem
                Sinn der unwirksamen Bestimmung am nächsten kommt.
              </p>
            </Card>

            <p className="pt-4 text-center text-sm text-gray-500">
              Stand: Mai&nbsp;2026
            </p>
          </main>
        </div>
      </div>
    </div>
  )
}
