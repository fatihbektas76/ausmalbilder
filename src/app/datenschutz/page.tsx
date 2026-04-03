import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  description: 'Datenschutzerklärung von ausmalbilder-gratis.com — Informationen gemäß Art. 13 DSGVO.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/datenschutz/' },
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

        <h1 className="text-3xl font-bold text-brand-indigo mt-6 mb-8">Datenschutzerklärung</h1>

        <div className="bg-white rounded-xl p-8 shadow-sm prose prose-indigo max-w-none">
          <h2>1. Datenschutz auf einen Blick</h2>
          <h3>Allgemeine Hinweise</h3>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren
            personenbezogenen Daten passiert, wenn Sie diese Website besuchen.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert
            werden können.
          </p>

          <h3>Datenerfassung auf dieser Website</h3>
          <p>
            <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
            Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>

          <h2>2. Hosting</h2>
          <p>
            Diese Website wird bei Vercel Inc. gehostet. Die Server befinden sich in der EU.
            Details zum Datenschutz von Vercel finden Sie unter:
            https://vercel.com/legal/privacy-policy
          </p>

          <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
          <h3>Datenschutz</h3>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr
            ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend
            der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </p>

          <h3>Hinweis zur verantwortlichen Stelle</h3>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
            [Name und Adresse — siehe Impressum]<br />
            E-Mail: [kontakt@ausmalbilder-gratis.com]
          </p>

          <h2>4. Datenerfassung auf dieser Website</h2>
          <h3>Cookies</h3>
          <p>
            Diese Website verwendet Cookies. Bei Cookies handelt es sich um Textdateien,
            die im Internetbrowser bzw. vom Internetbrowser auf dem Computersystem des
            Nutzers gespeichert werden. Technisch notwendige Cookies werden auf Grundlage
            von Art. 6 Abs. 1 lit. f DSGVO gespeichert. Für alle weiteren Cookies
            (z.B. Analyse, Werbung) holen wir Ihre Einwilligung ein.
          </p>

          <h3>Server-Log-Dateien</h3>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in
            sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
            Dies sind: Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer URL,
            Hostname des zugreifenden Rechners, Uhrzeit der Serveranfrage, IP-Adresse.
          </p>

          <h2>5. Kinder-Datenschutz</h2>
          <p>
            Diese Website richtet sich auch an Kinder. Wir erheben keine personalisierten
            Daten von Minderjährigen unter 16 Jahren. Downloads sind ohne Tracking-Cookies
            und ohne Registrierung möglich. Es wird keine personalisierte Werbung für
            identifizierte Kinder ausgespielt. Dies entspricht Art. 8 DSGVO.
          </p>

          <h2>6. Ihre Rechte</h2>
          <p>
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre
            gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den
            Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder
            Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema
            personenbezogene Daten können Sie sich jederzeit an uns wenden.
          </p>

          <h2>7. Analyse-Tools und Werbung</h2>
          <p>
            Details zu eingesetzten Analyse-Tools und Werbepartnern werden hier ergänzt,
            sobald diese aktiviert werden. Derzeit werden keine Analyse-Tools oder
            personalisierte Werbung eingesetzt.
          </p>
        </div>
      </div>
    </div>
  )
}
