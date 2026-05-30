import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'Impressum',
  description:
    'Impressum von ausmalbilder-gratis.com gemäß § 5 TMG und § 18 MStV.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/impressum/' },
  robots: { index: true, follow: true },
}

export default function ImpressumPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'Impressum', href: '/impressum' },
          ]}
        />

        <h1 className="text-3xl font-bold text-brand-indigo mt-6 mb-8">
          Impressum
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-sm prose prose-indigo max-w-none">
          <h2>Angaben gemäß § 5 TMG</h2>
          <p>
            Fatih Bektas
            <br />
            Alte Bruchsaler Str. 28
            <br />
            69168 Wiesloch
            <br />
            Deutschland
          </p>

          <h2>Kontakt</h2>
          <p>
            E-Mail:{' '}
            <a href="mailto:fb@fb-re.de" className="text-brand-coral">
              fb@fb-re.de
            </a>
          </p>

          <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
          <p>
            Fatih Bektas
            <br />
            Alte Bruchsaler Str. 28
            <br />
            69168 Wiesloch
          </p>

          <h2>EU-Streitschlichtung</h2>
          <p>
            Die Europäische Kommission stellt eine Plattform zur
            Online-Streitbeilegung (OS) bereit:{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . Unsere E-Mail-Adresse finden Sie oben im Impressum.
          </p>

          <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
          <p>
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>

          <h2>Haftung für Inhalte</h2>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
            auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
            §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
            verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
            überwachen oder nach Umständen zu forschen, die auf eine
            rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung
            oder Sperrung der Nutzung von Informationen nach den allgemeinen
            Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
            jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
            Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
            Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h2>Haftung für Links</h2>
          <p>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren
            Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
            fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
            verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber
            der Seiten verantwortlich. Die verlinkten Seiten wurden zum
            Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht
            erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten
            Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung
            nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir
            derartige Links umgehend entfernen.
          </p>

          <h2>Urheberrecht</h2>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
            Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung,
            Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
            Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des
            jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite
            sind für den privaten, nicht kommerziellen Gebrauch gestattet.
          </p>
          <p>
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
            wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
            werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
            trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten
            wir um einen entsprechenden Hinweis. Bei Bekanntwerden von
            Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>

          <h2>Lizenz der Ausmalbilder</h2>
          <p>
            Die auf dieser Website bereitgestellten Ausmalbilder stehen unter
            der Creative-Commons-Lizenz CC&nbsp;BY-NC&nbsp;4.0
            (Namensnennung – Nicht-kommerziell). Eine kommerzielle Nutzung ist
            nicht gestattet. Details unter{' '}
            <a
              href="https://creativecommons.org/licenses/by-nc/4.0/deed.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-coral"
            >
              creativecommons.org/licenses/by-nc/4.0/deed.de
            </a>
            .
          </p>

          <p className="text-sm text-gray-500 mt-12">
            Stand: Mai&nbsp;2026
          </p>
        </div>
      </div>
    </div>
  )
}
