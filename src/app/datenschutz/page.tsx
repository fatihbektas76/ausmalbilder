import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung von ausmalbilder-gratis.com gemäß Art. 13 DSGVO — Informationen zur Verarbeitung personenbezogener Daten.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/datenschutz/' },
  robots: { index: true, follow: true },
}

const SECTIONS: { id: string; n: number; title: string }[] = [
  { id: 'verantwortlicher', n: 1, title: 'Verantwortlicher' },
  { id: 'allgemein', n: 2, title: 'Allgemeine Hinweise' },
  { id: 'hosting', n: 3, title: 'Hosting (Vercel)' },
  { id: 'server-logs', n: 4, title: 'Server-Log-Dateien' },
  { id: 'object-storage', n: 5, title: 'Objektspeicher (Scaleway)' },
  { id: 'gemini', n: 6, title: 'KI-Inhalte (Google Gemini)' },
  { id: 'cookies', n: 7, title: 'Cookies' },
  { id: 'kontakt', n: 8, title: 'Kontaktaufnahme per E-Mail' },
  { id: 'ausmaltool', n: 9, title: 'Online-Ausmaltool' },
  { id: 'social', n: 10, title: 'Soziale Netzwerke' },
  { id: 'kinder', n: 11, title: 'Kinder-Datenschutz' },
  { id: 'rechte', n: 12, title: 'Ihre Rechte' },
  { id: 'beschwerde', n: 13, title: 'Beschwerderecht' },
  { id: 'ssl', n: 14, title: 'SSL/TLS-Verschlüsselung' },
  { id: 'kein-tracking', n: 15, title: 'Kein Tracking, keine Werbung' },
  { id: 'aenderungen', n: 16, title: 'Änderungen' },
]

/* --- helpers --- */

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

function LegalBasis({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg border-l-4 border-brand-coral bg-brand-cream/60 px-4 py-3">
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
        <path d="M2 4h12v16H2z" />
        <path d="M14 4h8v16h-8z" />
        <path d="M2 8h20" />
      </svg>
      <p className="text-sm leading-relaxed text-gray-700">
        <span className="font-semibold text-brand-indigo">Rechtsgrundlage:</span>{' '}
        {children}
      </p>
    </div>
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

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Datenschutz', href: '/datenschutz' },
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
                Datenschutzerklärung
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Informationen gemäß Art. 13 DSGVO über die Verarbeitung
                personenbezogener Daten auf dieser Website.
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
            {/* 1. Verantwortlicher — hero card */}
            <Card>
              <SectionHeading n={1} id="verantwortlicher">
                Verantwortlicher
              </SectionHeading>
              <p>
                Verantwortlicher im Sinne der DSGVO und sonstiger nationaler
                Datenschutzgesetze sowie sonstiger datenschutzrechtlicher
                Bestimmungen ist:
              </p>
              <div className="mt-4 rounded-xl bg-brand-indigo p-5 text-white sm:p-6">
                <p className="text-lg font-semibold">Fatih Bektas</p>
                <p className="mt-1 text-white/85">
                  Alte Bruchsaler Str. 28
                  <br />
                  69168 Wiesloch, Deutschland
                </p>
                <p className="mt-3">
                  <a
                    href="mailto:fb@fb-re.de"
                    className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/25"
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
              </div>
            </Card>

            {/* 2. Allgemein */}
            <Card>
              <SectionHeading n={2} id="allgemein">
                Allgemeine Hinweise
              </SectionHeading>
              <p>
                Diese Datenschutzerklärung informiert Sie über Art, Umfang und
                Zweck der Verarbeitung personenbezogener Daten auf dieser
                Website. Personenbezogene Daten sind alle Daten, mit denen Sie
                persönlich identifiziert werden können.
              </p>
              <p className="mt-3">
                Die Website wird grundsätzlich ohne Anmeldung, ohne
                Benutzerkonten und ohne Tracking-Cookies betrieben. Die Nutzung
                der Website ist überwiegend anonym möglich.
              </p>
            </Card>

            {/* 3. Hosting */}
            <Card>
              <SectionHeading n={3} id="hosting">
                Hosting (Vercel)
              </SectionHeading>
              <p>
                Diese Website wird über die <strong>Vercel Inc.</strong>, 340 S
                Lemon Ave #4133, Walnut, CA 91789, USA, betrieben (Hosting in
                EU-Regionen, u.&nbsp;a. Frankfurt-Edge). Beim Aufruf der
                Website verarbeitet Vercel die Server-Log-Daten, die Ihr
                Browser automatisch übermittelt (siehe Ziff.&nbsp;4).
              </p>
              <p className="mt-3">
                Bei Vercel handelt es sich um ein US-amerikanisches
                Unternehmen; eine Verarbeitung Ihrer Daten kann daher auch in
                den USA erfolgen. Rechtsgrundlage des Datentransfers in die USA
                ist der Angemessenheitsbeschluss der Europäischen Kommission
                vom 10. Juli 2023 zum EU-U.S. Data Privacy Framework (DPF)
                gemäß Art.&nbsp;45 DSGVO; Vercel ist unter dem DPF zertifiziert.
                Ergänzend hat Vercel die EU-Standardvertragsklauseln
                (Art.&nbsp;46 Abs.&nbsp;2 DSGVO) in Form eines Data Processing
                Addendum vereinbart, die insbesondere für nicht vom
                Angemessenheitsbeschluss erfasste Konstellationen greifen. Mit
                Vercel besteht ein Auftragsverarbeitungsvertrag (Data
                Processing Addendum) gemäß Art.&nbsp;28 DSGVO.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Weitere Informationen:{' '}
                <ExtLink href="https://vercel.com/legal/privacy-policy">
                  vercel.com/legal/privacy-policy
                </ExtLink>{' '}
                ·{' '}
                <ExtLink href="https://vercel.com/legal/dpa">
                  vercel.com/legal/dpa
                </ExtLink>
              </p>
              <LegalBasis>
                Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes
                Interesse an der technisch fehlerfreien Darstellung und
                Auslieferung der Website).
              </LegalBasis>
            </Card>

            {/* 4. Server-Logs */}
            <Card>
              <SectionHeading n={4} id="server-logs">
                Server-Log-Dateien
              </SectionHeading>
              <p>
                Der Hosting-Provider erhebt und speichert automatisch
                Informationen in sogenannten Server-Log-Dateien, die Ihr
                Browser automatisch übermittelt. Dies sind:
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  'Browsertyp und Browserversion',
                  'verwendetes Betriebssystem',
                  'Referrer URL',
                  'Hostname des zugreifenden Rechners',
                  'Uhrzeit der Serveranfrage',
                  'IP-Adresse (anonymisiert in Auswertungen)',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 rounded-lg bg-brand-cream/50 px-3 py-2 text-sm text-gray-700"
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-coral"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4">
                Diese Daten werden nicht mit anderen Datenquellen
                zusammengeführt. Die Speicherung erfolgt aus Sicherheits- und
                Betriebsgründen (Erkennung und Abwehr von Angriffen) für
                maximal <strong>30 Tage</strong>.
              </p>
              <LegalBasis>Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</LegalBasis>
            </Card>

            {/* 5. Scaleway */}
            <Card>
              <SectionHeading n={5} id="object-storage">
                Objektspeicher / Auslieferung von Mediendateien (Scaleway)
              </SectionHeading>
              <p>
                Bilder, PDF-Dateien und Metadaten dieser Website werden bei der{' '}
                <strong>Scaleway SAS</strong>, 8 rue de la Ville l’Évêque,
                75008 Paris, Frankreich, in Rechenzentren in Paris (Region{' '}
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  fr-par
                </code>
                ) gespeichert und ausgeliefert. Scaleway ist ein französisches
                Unternehmen, eine Datenübermittlung in Drittländer findet nicht
                statt. Es besteht ein Auftragsverarbeitungsvertrag gemäß
                Art.&nbsp;28 DSGVO.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Weitere Informationen:{' '}
                <ExtLink href="https://www.scaleway.com/en/privacy/">
                  scaleway.com/en/privacy/
                </ExtLink>
              </p>
              <LegalBasis>Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO.</LegalBasis>
            </Card>

            {/* 6. Gemini */}
            <Card>
              <SectionHeading n={6} id="gemini">
                KI-gestützte Generierung von Inhaltsbeschreibungen (Google
                Gemini)
              </SectionHeading>
              <p>
                Für die Erstellung von redaktionellen Texten zu einzelnen
                Ausmalbildern (Bildbeschreibungen, FAQ, Fakten) verwenden wir
                die Gemini-API der <strong>Google Ireland Limited</strong>,
                Gordon House, Barrow Street, Dublin 4, Irland. Hierbei werden
                ausschließlich nicht-personenbezogene Metadaten (Bildtitel,
                Kategoriename, Schwierigkeitsstufe, Altersempfehlung) an Google
                übertragen.{' '}
                <strong>
                  Eine Verarbeitung von Daten von Website-Besucherinnen und
                  -Besuchern findet im Rahmen dieser KI-Generierung nicht
                  statt.
                </strong>
              </p>
              <p className="mt-3">
                Die Datenübermittlung kann technisch bedingt auch in die USA
                erfolgen. Rechtsgrundlage des Datentransfers ist der
                Angemessenheitsbeschluss der Europäischen Kommission zum
                EU-U.S. Data Privacy Framework (DPF) gemäß Art.&nbsp;45 DSGVO,
                unter dem Google zertifiziert ist; ergänzend werden die
                EU-Standardvertragsklauseln (Art.&nbsp;46 Abs.&nbsp;2 DSGVO)
                herangezogen.
              </p>
              <p className="mt-3 text-sm text-gray-600">
                Weitere Informationen:{' '}
                <ExtLink href="https://policies.google.com/privacy">
                  policies.google.com/privacy
                </ExtLink>
              </p>
              <LegalBasis>
                Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO (berechtigtes
                Interesse an der effizienten Erstellung redaktioneller
                Inhalte).
              </LegalBasis>
            </Card>

            {/* 7. Cookies */}
            <Card>
              <SectionHeading n={7} id="cookies">
                Cookies
              </SectionHeading>
              <p>
                Diese Website setzt grundsätzlich{' '}
                <strong>keine Cookies</strong> zu Werbe- oder Tracking-Zwecken.
              </p>
              <p className="mt-3">
                Ausschließlich im internen Verwaltungsbereich (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  /admin
                </code>
                ) wird nach erfolgreicher Anmeldung ein einziges technisch
                notwendiges Session-Cookie (
                <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs">
                  admin_session
                </code>
                ) gesetzt, das ausschließlich der Authentifizierung dient.
                Dieses Cookie ist für reguläre Besucher der Website nicht
                relevant und wird im öffentlichen Bereich nicht gesetzt.
              </p>
              <LegalBasis>
                §&nbsp;25 Abs.&nbsp;2 Nr.&nbsp;2 TDDDG (technisch unbedingt
                erforderlich) i.&nbsp;V.&nbsp;m. Art.&nbsp;6 Abs.&nbsp;1
                lit.&nbsp;f DSGVO.
              </LegalBasis>
            </Card>

            {/* 8. Kontakt */}
            <Card>
              <SectionHeading n={8} id="kontakt">
                Kontaktaufnahme per E-Mail
              </SectionHeading>
              <p>
                Bei einer Kontaktaufnahme per E-Mail werden die mitgeteilten
                Daten (E-Mail-Adresse, Nachrichteninhalt) zur Bearbeitung der
                Anfrage sowie für eventuelle Anschlussfragen gespeichert. Eine
                Weitergabe an Dritte findet nicht statt. Die Daten werden
                gelöscht, sobald sie für die Zweckerreichung nicht mehr
                erforderlich sind, spätestens nach Ablauf der jeweiligen
                gesetzlichen Aufbewahrungspflichten.
              </p>
              <LegalBasis>
                Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO (vorvertragliche
                Maßnahmen) bzw. Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO
                (Beantwortung Ihrer Anfrage).
              </LegalBasis>
            </Card>

            {/* 9. Ausmaltool */}
            <Card>
              <SectionHeading n={9} id="ausmaltool">
                Online-Ausmaltool
              </SectionHeading>
              <p>
                Das im Browser angebotene Online-Ausmaltool verarbeitet alle
                Mal-Eingaben (gewählte Farben, Pinselstriche, Reset, Export){' '}
                <strong>ausschließlich lokal in Ihrem Browser</strong>. Es
                findet keine Übertragung der Mal-Aktivität an unsere Server
                statt. Beim Export als PNG-Datei verbleibt das fertige Bild auf
                Ihrem Endgerät.
              </p>
            </Card>

            {/* 10. Social */}
            <Card>
              <SectionHeading n={10} id="social">
                Soziale Netzwerke (Pinterest, WhatsApp)
              </SectionHeading>
              <p>
                Im Online-Ausmaltool stehen Schaltflächen zum Teilen über
                Pinterest und WhatsApp zur Verfügung. Diese Schaltflächen sind
                keine eingebetteten Widgets der Anbieter, sondern{' '}
                <strong>einfache Verlinkungen</strong> auf die jeweiligen
                Plattformen. Solange Sie keine dieser Schaltflächen aktiv
                anklicken, werden keinerlei Daten an Pinterest oder WhatsApp
                übertragen.
              </p>
              <p className="mt-3">
                Klicken Sie eine Schaltfläche an, stellt Ihr Browser eine
                Verbindung zu den Servern des jeweiligen Anbieters her und
                übermittelt dabei mindestens die IP-Adresse, ggf.
                Browser-Header sowie den Titel und die Bild-URL Ihres geteilten
                Werks. Die weitere Verarbeitung erfolgt ausschließlich durch
                den jeweiligen Anbieter nach dessen Datenschutzbestimmungen:
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-brand-indigo">
                    Pinterest
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Pinterest Europe Ltd., Palmerston House, 2nd Floor, Fenian
                    Street, Dublin&nbsp;2, Irland.
                    <br />
                    Mutterunternehmen Pinterest, Inc. (USA).
                  </p>
                  <ExtLink href="https://policy.pinterest.com/de/privacy-policy">
                    <span className="mt-3 inline-block text-sm">
                      Datenschutz öffnen →
                    </span>
                  </ExtLink>
                </div>
                <div className="rounded-xl border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-brand-indigo">
                    WhatsApp
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal
                    Harbour, Dublin&nbsp;2, Irland.
                    <br />
                    Mutterunternehmen Meta Platforms, Inc. (USA).
                  </p>
                  <ExtLink href="https://www.whatsapp.com/legal/privacy-policy-eea">
                    <span className="mt-3 inline-block text-sm">
                      Datenschutz öffnen →
                    </span>
                  </ExtLink>
                </div>
              </div>
              <p className="mt-4">
                Bei beiden Anbietern kann eine Datenübermittlung in die USA
                erfolgen. Rechtsgrundlage des Datentransfers ist der
                Angemessenheitsbeschluss der Europäischen Kommission zum
                EU-U.S. Data Privacy Framework (DPF) gemäß Art.&nbsp;45 DSGVO,
                unter dem die jeweiligen US-Mutterunternehmen zertifiziert
                sind; ergänzend werden die EU-Standardvertragsklauseln
                (Art.&nbsp;46 Abs.&nbsp;2 DSGVO) herangezogen. Wir haben
                keinen Einfluss auf Art, Umfang und Zweck der
                Datenverarbeitung durch die jeweiligen Anbieter.
              </p>
              <LegalBasis>
                Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO (Einwilligung durch
                aktives Klicken auf die Schaltfläche).
              </LegalBasis>
            </Card>

            {/* 11. Kinder */}
            <Card>
              <SectionHeading n={11} id="kinder">
                Kinder-Datenschutz
              </SectionHeading>
              <p>
                Diese Website richtet sich auch an Kinder. Es wird keine
                personalisierte Werbung ausgespielt, es werden keine
                Tracking-Cookies gesetzt und keine personenbezogenen Daten von
                Kindern aktiv erhoben. Downloads und das Online-Ausmaltool sind
                ohne Registrierung möglich.
              </p>
              <LegalBasis>Art.&nbsp;8 DSGVO.</LegalBasis>
            </Card>

            {/* 12. Rechte */}
            <Card>
              <SectionHeading n={12} id="rechte">
                Ihre Rechte als betroffene Person
              </SectionHeading>
              <p>Sie haben jederzeit folgende Rechte:</p>
              <ul className="mt-4 space-y-3">
                {[
                  {
                    art: 'Art. 15 DSGVO',
                    label: 'Auskunftsrecht',
                    text: 'unentgeltliche Auskunft über Ihre gespeicherten Daten',
                  },
                  {
                    art: 'Art. 16 DSGVO',
                    label: 'Recht auf Berichtigung',
                    text: 'Korrektur unrichtiger oder unvollständiger Daten',
                  },
                  {
                    art: 'Art. 17 DSGVO',
                    label: 'Recht auf Löschung',
                    text: '„Recht auf Vergessenwerden"',
                  },
                  {
                    art: 'Art. 18 DSGVO',
                    label: 'Einschränkung der Verarbeitung',
                    text: 'Beschränkung in bestimmten Konstellationen',
                  },
                  {
                    art: 'Art. 20 DSGVO',
                    label: 'Datenübertragbarkeit',
                    text: 'Erhalt Ihrer Daten in einem strukturierten Format',
                  },
                  {
                    art: 'Art. 21 DSGVO',
                    label: 'Widerspruchsrecht',
                    text: 'insbesondere gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO',
                  },
                  {
                    art: 'Art. 7 Abs. 3 DSGVO',
                    label: 'Widerruf von Einwilligungen',
                    text: 'soweit die Verarbeitung auf einer Einwilligung beruht',
                  },
                ].map((r) => (
                  <li
                    key={r.art}
                    className="flex flex-col gap-1 rounded-lg border-l-2 border-brand-coral/40 bg-brand-cream/40 px-4 py-3 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-brand-coral">
                      {r.art}
                    </span>
                    <span className="text-sm text-gray-700">
                      <strong className="text-brand-indigo">{r.label}</strong>{' '}
                      — {r.text}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5">
                Zur Ausübung dieser Rechte genügt eine formlose E-Mail an{' '}
                <a
                  href="mailto:fb@fb-re.de"
                  className="font-semibold text-brand-coral hover:underline"
                >
                  fb@fb-re.de
                </a>
                .
              </p>
            </Card>

            {/* 13. Beschwerde */}
            <Card>
              <SectionHeading n={13} id="beschwerde">
                Beschwerderecht bei der Aufsichtsbehörde
              </SectionHeading>
              <p>
                Sie haben das Recht, sich bei einer
                Datenschutzaufsichtsbehörde zu beschweren (Art.&nbsp;77 DSGVO).
                Zuständig für den Verantwortlichen ist:
              </p>
              <div className="mt-4 rounded-xl bg-brand-cream/60 p-5">
                <p className="font-semibold text-brand-indigo">
                  Der Landesbeauftragte für den Datenschutz und die
                  Informationsfreiheit Baden-Württemberg (LfDI&nbsp;BW)
                </p>
                <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Adresse
                    </dt>
                    <dd>Lautenschlagerstraße 20, 70173 Stuttgart</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Telefon
                    </dt>
                    <dd>0711 / 61 55 41 - 0</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      E-Mail
                    </dt>
                    <dd>
                      <ExtLink href="mailto:poststelle@lfdi.bwl.de">
                        poststelle@lfdi.bwl.de
                      </ExtLink>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Web
                    </dt>
                    <dd>
                      <ExtLink href="https://www.baden-wuerttemberg.datenschutz.de/">
                        baden-wuerttemberg.datenschutz.de
                      </ExtLink>
                    </dd>
                  </div>
                </dl>
              </div>
            </Card>

            {/* 14. SSL */}
            <Card>
              <SectionHeading n={14} id="ssl">
                SSL-/TLS-Verschlüsselung
              </SectionHeading>
              <p>
                Diese Seite nutzt aus Sicherheitsgründen eine
                SSL/TLS-Verschlüsselung (HTTPS). Sie erkennen die
                Verschlüsselung am „https://“ in der Adresszeile Ihres
                Browsers.
              </p>
            </Card>

            {/* 15. Kein Tracking */}
            <Card>
              <SectionHeading n={15} id="kein-tracking">
                Keine Analyse-Tools, kein Tracking, keine Werbung
              </SectionHeading>
              <p>
                Es werden derzeit keine Webanalyse-Tools (z.&nbsp;B. Google
                Analytics, Matomo, Plausible, Vercel Web Analytics)
                eingesetzt. Es werden keine personalisierten Werbeanzeigen
                ausgespielt und keine Drittanbieter-Tracking-Pixel
                eingebunden. Sollten sich daran Änderungen ergeben, wird diese
                Datenschutzerklärung entsprechend aktualisiert.
              </p>
            </Card>

            {/* 16. Änderungen */}
            <Card>
              <SectionHeading n={16} id="aenderungen">
                Änderungen dieser Datenschutzerklärung
              </SectionHeading>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen,
                damit sie stets den aktuellen rechtlichen Anforderungen
                entspricht oder um Änderungen unserer Leistungen in der
                Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch
                gilt dann die neue Datenschutzerklärung.
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
