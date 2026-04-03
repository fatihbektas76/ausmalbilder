import type { Metadata } from 'next'
import Breadcrumb from '@/components/ui/Breadcrumb'

export const metadata: Metadata = {
  title: 'AGB — Allgemeine Geschäftsbedingungen',
  description: 'Allgemeine Geschäftsbedingungen von ausmalbilder-gratis.com.',
  alternates: { canonical: 'https://ausmalbilder-gratis.com/agb/' },
}

export default function AGBPage() {
  return (
    <div className="bg-brand-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: 'Startseite', href: '/' },
            { name: 'AGB', href: '/agb' },
          ]}
        />

        <h1 className="text-3xl font-bold text-brand-indigo mt-6 mb-8">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="bg-white rounded-xl p-8 shadow-sm prose prose-indigo max-w-none">
          <h2>§ 1 Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Website
            ausmalbilder-gratis.com und aller damit verbundenen Dienste.
          </p>

          <h2>§ 2 Kostenlose Nutzung</h2>
          <p>
            Die Grundfunktionen der Website — insbesondere das Herunterladen von
            Ausmalbildern als PDF und das Online-Ausmalen im Browser — sind kostenlos
            und ohne Registrierung nutzbar.
          </p>

          <h2>§ 3 Nutzungsrechte an Ausmalbildern</h2>
          <p>
            Die auf dieser Website bereitgestellten Ausmalbilder stehen unter der
            Creative Commons Lizenz CC BY-NC 4.0. Das bedeutet:
          </p>
          <ul>
            <li>Sie dürfen die Bilder kostenlos herunterladen und ausdrucken.</li>
            <li>Sie dürfen die ausgemalten Bilder privat nutzen und teilen.</li>
            <li>Eine kommerzielle Nutzung ist ohne schriftliche Genehmigung nicht gestattet.</li>
            <li>Bei Weitergabe ist die Quelle (ausmalbilder-gratis.com) zu nennen.</li>
          </ul>

          <h2>§ 4 Premium-Dienste (Zukünftig)</h2>
          <p>
            Zukünftig können kostenpflichtige Premium-Dienste angeboten werden (z.B.
            Plus- und Pro-Abonnements). Die genauen Konditionen werden vor deren
            Einführung hier ergänzt und gelten erst nach ausdrücklicher Zustimmung.
          </p>

          <h2>§ 5 Haftungsbeschränkung</h2>
          <p>
            Die Ausmalbilder werden „wie besehen" bereitgestellt. Der Betreiber übernimmt
            keine Garantie für die Druckqualität oder Eignung für bestimmte Zwecke.
            Die Haftung für leichte Fahrlässigkeit wird ausgeschlossen, soweit keine
            wesentlichen Vertragspflichten betroffen sind.
          </p>

          <h2>§ 6 Schlussbestimmungen</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland. Sollten einzelne
            Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt. Der Betreiber behält sich vor, diese AGB jederzeit
            zu ändern.
          </p>

          <p className="text-sm text-gray-500 mt-8">Stand: Januar 2025</p>
        </div>
      </div>
    </div>
  )
}
