import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Impressum von ausmalbilder-gratis.com gemäß § 5 TMG und § 18 MStV.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/impressum/' },
  robots: { index: true, follow: true },
}

const SECTIONS: { id: string; n: number; title: string }[] = [
  { id: 'angaben', n: 1, title: 'Angaben gemäß § 5 TMG' },
  { id: 'kontakt', n: 2, title: 'Kontakt' },
  { id: 'verantwortlich-inhalt', n: 3, title: 'Verantwortlich für Inhalt' },
  { id: 'verbraucherstreit', n: 4, title: 'Verbraucherstreitbeilegung' },
  { id: 'haftung-inhalte', n: 5, title: 'Haftung für Inhalte' },
  { id: 'haftung-links', n: 6, title: 'Haftung für Links' },
  { id: 'urheberrecht', n: 7, title: 'Urheberrecht' },
  { id: 'lizenz', n: 8, title: 'Lizenz der Ausmalbilder' },
]

/* --- helpers (mirrors Datenschutz page) --- */

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

/* --- page --- */

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Impressum', href: '/impressum' },
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
                Impressum
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Pflichtangaben gemäß § 5 TMG und § 18 Abs. 2 MStV sowie
                Hinweise zur Streitbeilegung, Haftung und zum Urheberrecht.
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
            {/* 1. Angaben — hero card */}
            <Card>
              <SectionHeading n={1} id="angaben">
                Angaben gemäß § 5 TMG
              </SectionHeading>
              <div className="mt-2 rounded-xl bg-brand-indigo p-5 text-white sm:p-6">
                <p className="text-lg font-semibold">Fatih Bektas</p>
                <p className="mt-1 text-white/85">
                  Alte Bruchsaler Str. 28
                  <br />
                  69168 Wiesloch, Deutschland
                </p>
              </div>
            </Card>

            {/* 2. Kontakt */}
            <Card>
              <SectionHeading n={2} id="kontakt">
                Kontakt
              </SectionHeading>
              <p>
                Anfragen erreichen mich am schnellsten per E-Mail:
              </p>
              <p className="mt-4">
                <a
                  href="mailto:fb@fb-re.de"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-indigo px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  <svg
                    aria-hidden
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 6h16v12H4z" />
                    <path d="M4 6l8 7 8-7" />
                  </svg>
                  fb@fb-re.de
                </a>
              </p>
            </Card>

            {/* 3. Verantwortlich Inhalt */}
            <Card>
              <SectionHeading n={3} id="verantwortlich-inhalt">
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </SectionHeading>
              <div className="rounded-xl bg-brand-cream/60 p-5">
                <p className="font-semibold text-brand-indigo">Fatih Bektas</p>
                <p className="mt-1 text-sm text-gray-700">
                  Alte Bruchsaler Str. 28
                  <br />
                  69168 Wiesloch
                </p>
              </div>
            </Card>

            {/* 4. Verbraucherstreitbeilegung */}
            <Card>
              <SectionHeading n={4} id="verbraucherstreit">
                Verbraucherstreitbeilegung / Universalschlichtungsstelle
              </SectionHeading>
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
                <p className="text-sm leading-relaxed text-gray-700">
                  Wir sind <strong>nicht bereit oder verpflichtet</strong>, an
                  Streitbeilegungsverfahren vor einer
                  Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </Card>

            {/* 5. Haftung Inhalte */}
            <Card>
              <SectionHeading n={5} id="haftung-inhalte">
                Haftung für Inhalte
              </SectionHeading>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>
              <p className="mt-3">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
                Informationen nach den allgemeinen Gesetzen bleiben hiervon
                unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem
                Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung
                möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend
                entfernen.
              </p>
            </Card>

            {/* 6. Haftung Links */}
            <Card>
              <SectionHeading n={6} id="haftung-links">
                Haftung für Links
              </SectionHeading>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir
                für diese fremden Inhalte auch keine Gewähr übernehmen. Für
                die Inhalte der verlinkten Seiten ist stets der jeweilige
                Anbieter oder Betreiber der Seiten verantwortlich.
              </p>
              <p className="mt-3">
                Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf
                mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte
                waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine
                permanente inhaltliche Kontrolle der verlinkten Seiten ist
                jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
                nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen
                werden wir derartige Links umgehend entfernen.
              </p>
            </Card>

            {/* 7. Urheberrecht */}
            <Card>
              <SectionHeading n={7} id="urheberrecht">
                Urheberrecht
              </SectionHeading>
              <p>
                Die durch den Seitenbetreiber erstellten Inhalte und Werke
                auf diesen Seiten unterliegen dem deutschen Urheberrecht.
                Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art
                der Verwertung außerhalb der Grenzen des Urheberrechtes
                bedürfen der schriftlichen Zustimmung des jeweiligen Autors
                bzw. Erstellers. Downloads und Kopien dieser Seite sind für
                den privaten, nicht kommerziellen Gebrauch gestattet.
              </p>
              <p className="mt-3">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber
                erstellt wurden, werden die Urheberrechte Dritter beachtet.
                Insbesondere werden Inhalte Dritter als solche
                gekennzeichnet. Sollten Sie trotzdem auf eine
                Urheberrechtsverletzung aufmerksam werden, bitten wir um
                einen entsprechenden Hinweis. Bei Bekanntwerden von
                Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
              </p>
            </Card>

            {/* 8. Lizenz */}
            <Card>
              <SectionHeading n={8} id="lizenz">
                Lizenz der Ausmalbilder
              </SectionHeading>
              <p>
                Die auf dieser Website bereitgestellten Ausmalbilder stehen
                unter der Creative-Commons-Lizenz:
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-gray-200 p-5">
                <span className="rounded-full bg-brand-coral/10 px-3 py-1 text-sm font-semibold text-brand-coral">
                  CC&nbsp;BY-NC&nbsp;4.0
                </span>
                <span className="text-sm text-gray-700">
                  Namensnennung – Nicht-kommerziell
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Eine kommerzielle Nutzung ist nicht gestattet. Vollständige
                Lizenzbedingungen:{' '}
                <ExtLink href="https://creativecommons.org/licenses/by-nc/4.0/deed.de">
                  creativecommons.org/licenses/by-nc/4.0/deed.de
                </ExtLink>
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
