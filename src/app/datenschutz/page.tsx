import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description:
    'Datenschutzerklärung von ausmalbilder-gratis.com gemäß Art. 13 DSGVO — Informationen zur Verarbeitung personenbezogener Daten.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/datenschutz/' },
  robots: { index: true, follow: true },
}

export default function DatenschutzPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Datenschutz', href: '/datenschutz' },
          ]}
        />

        <h1 className="text-3xl font-bold text-brand-indigo mt-6 mb-8">
          Datenschutzerklärung
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-sm prose prose-indigo max-w-none">
          <h2>1. Verantwortlicher</h2>
          <p>
            Verantwortlicher im Sinne der DSGVO und sonstiger nationaler
            Datenschutzgesetze sowie sonstiger datenschutzrechtlicher
            Bestimmungen ist:
          </p>
          <p>
            Fatih Bektas
            <br />
            Alte Bruchsaler Str. 28
            <br />
            69168 Wiesloch
            <br />
            Deutschland
            <br />
            E-Mail:{' '}
            <a href="mailto:fb@fb-re.de" className="text-brand-coral">
              fb@fb-re.de
            </a>
          </p>

          <h2>2. Allgemeine Hinweise</h2>
          <p>
            Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck
            der Verarbeitung personenbezogener Daten auf dieser Website.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich
            identifiziert werden können.
          </p>
          <p>
            Die Website wird grundsätzlich ohne Anmeldung, ohne
            Benutzerkonten und ohne Tracking-Cookies betrieben. Die Nutzung der
            Website ist überwiegend anonym möglich.
          </p>

          <h2>3. Hosting (Vercel)</h2>
          <p>
            Diese Website wird bei der Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, USA, gehostet (Hosting im EU-Raum, Frankfurt-Edge
            sowie weitere EU-Regionen). Beim Besuch unserer Website verarbeitet
            Vercel Server-Log-Daten Ihres Browsers.
          </p>
          <p>
            Bei Vercel handelt es sich um ein US-amerikanisches Unternehmen.
            Datenübermittlungen in die USA werden auf Grundlage der
            EU-Standardvertragsklauseln sowie des EU-US Data Privacy Frameworks
            durchgeführt. Mit Vercel besteht ein Auftragsverarbeitungsvertrag
            (AVV) gemäß Art. 28 DSGVO. Weitere Informationen:{' '}
            <a
              href="https://vercel.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              vercel.com/legal/privacy-policy
            </a>
            .
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der technisch fehlerfreien Darstellung
            und Auslieferung der Website).
          </p>

          <h2>4. Server-Log-Dateien</h2>
          <p>
            Der Hosting-Provider erhebt und speichert automatisch Informationen
            in sogenannten Server-Log-Dateien, die Ihr Browser automatisch
            übermittelt. Dies sind:
          </p>
          <ul>
            <li>Browsertyp und Browserversion</li>
            <li>verwendetes Betriebssystem</li>
            <li>Referrer URL</li>
            <li>Hostname des zugreifenden Rechners</li>
            <li>Uhrzeit der Serveranfrage</li>
            <li>IP-Adresse (anonymisiert in Auswertungen)</li>
          </ul>
          <p>
            Diese Daten werden nicht mit anderen Datenquellen zusammengeführt.
            Die Speicherung erfolgt aus Sicherheits- und Betriebsgründen
            (Erkennung und Abwehr von Angriffen) für maximal 30 Tage.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h2>5. Objektspeicher / Auslieferung von Mediendateien (Scaleway)</h2>
          <p>
            Bilder, PDF-Dateien und Metadaten dieser Website werden bei der
            Scaleway SAS, 8 rue de la Ville l’Évêque, 75008 Paris, Frankreich,
            in Rechenzentren in Paris (Region <code>fr-par</code>) gespeichert
            und ausgeliefert. Scaleway ist ein französisches Unternehmen, eine
            Datenübermittlung in Drittländer findet nicht statt. Es besteht ein
            Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO. Weitere
            Informationen:{' '}
            <a
              href="https://www.scaleway.com/en/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              scaleway.com/en/privacy/
            </a>
            .
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h2>6. KI-gestützte Generierung von Inhaltsbeschreibungen (Google Gemini)</h2>
          <p>
            Für die Erstellung von redaktionellen Texten zu einzelnen
            Ausmalbildern (Bildbeschreibungen, FAQ, Fakten) verwenden wir die
            Gemini-API der Google Ireland Limited, Gordon House, Barrow Street,
            Dublin 4, Irland. Hierbei werden ausschließlich nicht-personenbezogene
            Metadaten (Bildtitel, Kategoriename, Schwierigkeitsstufe,
            Altersempfehlung) an Google übertragen. Eine Verarbeitung von Daten
            von Website-Besucherinnen und Besuchern findet im Rahmen dieser
            KI-Generierung nicht statt.
          </p>
          <p>
            Die Datenübermittlung kann technisch bedingt auch in die USA
            erfolgen. Datenübermittlungen werden auf Grundlage der
            EU-Standardvertragsklauseln sowie des EU-US Data Privacy Frameworks
            durchgeführt. Weitere Informationen:{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              policies.google.com/privacy
            </a>
            .
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO
            (berechtigtes Interesse an der effizienten Erstellung redaktioneller
            Inhalte).
          </p>

          <h2>7. Cookies</h2>
          <p>
            Diese Website setzt grundsätzlich keine Cookies zu Werbe- oder
            Tracking-Zwecken.
          </p>
          <p>
            Ausschließlich im internen Verwaltungsbereich (
            <code>/admin</code>) wird nach erfolgreicher Anmeldung ein einziges
            technisch notwendiges Session-Cookie (
            <code>admin_session</code>) gesetzt, das ausschließlich der
            Authentifizierung dient. Dieses Cookie ist für reguläre Besucher
            der Website nicht relevant und wird auf dem öffentlichen Bereich
            nicht gesetzt.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> § 25 Abs. 2 Nr. 2 TTDSG (technisch
            unbedingt erforderlich) i.V.m. Art. 6 Abs. 1 lit. f DSGVO.
          </p>

          <h2>8. Kontaktaufnahme per E-Mail</h2>
          <p>
            Bei einer Kontaktaufnahme per E-Mail werden die mitgeteilten Daten
            (E-Mail-Adresse, Nachrichteninhalt) zur Bearbeitung der Anfrage
            sowie für eventuelle Anschlussfragen gespeichert. Eine Weitergabe an
            Dritte findet nicht statt. Die Daten werden gelöscht, sobald sie
            für die Zweckerreichung nicht mehr erforderlich sind, spätestens
            nach Ablauf der jeweiligen gesetzlichen Aufbewahrungspflichten.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO
            (vorvertragliche Maßnahmen) bzw. Art. 6 Abs. 1 lit. f DSGVO
            (Beantwortung Ihrer Anfrage).
          </p>

          <h2>9. Online-Ausmaltool</h2>
          <p>
            Das im Browser angebotene Online-Ausmaltool verarbeitet alle
            Mal-Eingaben (gewählte Farben, Pinselstriche, Reset, Export)
            ausschließlich lokal in Ihrem Browser. Es findet keine Übertragung
            der Mal-Aktivität an unsere Server statt. Beim Export als PNG-Datei
            verbleibt das fertige Bild auf Ihrem Endgerät.
          </p>

          <h2>10. Kinder-Datenschutz</h2>
          <p>
            Diese Website richtet sich auch an Kinder. Es werden keine
            personalisierten Werbung ausgespielt, keine Tracking-Cookies
            gesetzt und keine personenbezogenen Daten von Kindern aktiv
            erhoben. Downloads und das Online-Ausmaltool sind ohne
            Registrierung möglich.
          </p>
          <p>
            <strong>Rechtsgrundlage:</strong> Art. 8 DSGVO.
          </p>

          <h2>11. Ihre Rechte als betroffene Person</h2>
          <p>Sie haben jederzeit folgende Rechte:</p>
          <ul>
            <li>
              <strong>Auskunftsrecht</strong> (Art. 15 DSGVO) — unentgeltliche
              Auskunft über Ihre gespeicherten Daten
            </li>
            <li>
              <strong>Recht auf Berichtigung</strong> (Art. 16 DSGVO)
            </li>
            <li>
              <strong>Recht auf Löschung</strong> („Recht auf
              Vergessenwerden“, Art. 17 DSGVO)
            </li>
            <li>
              <strong>Recht auf Einschränkung der Verarbeitung</strong> (Art. 18
              DSGVO)
            </li>
            <li>
              <strong>Recht auf Datenübertragbarkeit</strong> (Art. 20 DSGVO)
            </li>
            <li>
              <strong>Widerspruchsrecht</strong> (Art. 21 DSGVO) — insbesondere
              gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO
            </li>
            <li>
              <strong>Widerruf von Einwilligungen</strong> (Art. 7 Abs. 3 DSGVO),
              soweit die Verarbeitung auf einer Einwilligung beruht
            </li>
          </ul>
          <p>
            Zur Ausübung dieser Rechte genügt eine formlose E-Mail an{' '}
            <a href="mailto:fb@fb-re.de" className="text-brand-coral">
              fb@fb-re.de
            </a>
            .
          </p>

          <h2>12. Beschwerderecht bei der Aufsichtsbehörde</h2>
          <p>
            Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu
            beschweren (Art. 77 DSGVO). Zuständig für den Verantwortlichen ist:
          </p>
          <p>
            <strong>
              Der Landesbeauftragte für den Datenschutz und die
              Informationsfreiheit Baden-Württemberg (LfDI BW)
            </strong>
            <br />
            Lautenschlagerstraße 20, 70173 Stuttgart
            <br />
            Telefon: 0711/61 55 41 - 0
            <br />
            E-Mail:{' '}
            <a
              href="mailto:poststelle@lfdi.bwl.de"
              className="text-brand-coral"
            >
              poststelle@lfdi.bwl.de
            </a>
            <br />
            Web:{' '}
            <a
              href="https://www.baden-wuerttemberg.datenschutz.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              baden-wuerttemberg.datenschutz.de
            </a>
          </p>

          <h2>13. SSL-/TLS-Verschlüsselung</h2>
          <p>
            Diese Seite nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung
            (HTTPS). Sie erkennen die Verschlüsselung am „https://“ in der
            Adresszeile Ihres Browsers.
          </p>

          <h2>14. Keine Analyse-Tools, kein Tracking, keine Werbung</h2>
          <p>
            Es werden derzeit keine Webanalyse-Tools (z.&nbsp;B. Google
            Analytics, Matomo, Plausible) eingesetzt. Es werden keine
            personalisierten Werbeanzeigen ausgespielt und keine
            Drittanbieter-Tracking-Pixel eingebunden. Sollten sich daran
            Änderungen ergeben, wird diese Datenschutzerklärung entsprechend
            aktualisiert.
          </p>

          <h2>15. Änderungen dieser Datenschutzerklärung</h2>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit
            sie stets den aktuellen rechtlichen Anforderungen entspricht oder
            um Änderungen unserer Leistungen in der Datenschutzerklärung
            umzusetzen. Für Ihren erneuten Besuch gilt dann die neue
            Datenschutzerklärung.
          </p>

          <p className="text-sm text-gray-500 mt-12">
            Stand: Mai&nbsp;2026
          </p>
        </div>
      </div>
    </div>
  )
}
