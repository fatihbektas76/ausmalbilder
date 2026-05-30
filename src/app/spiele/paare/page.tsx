import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PaerchenGame from "@/components/games/PaerchenGame";

export const metadata: Metadata = {
  title: "Pärchen-Spiel — Tier-Paare finden",
  description:
    "Kostenloses Pärchen-Spiel für Kinder ab 3 Jahren — finde die Tier-Paare. Direkt im Browser spielbar, optimiert für Tablet und Smartphone, ohne Anmeldung.",
  alternates: { canonical: "https://ausmalbilder-gratis.com/spiele/paare/" },
  openGraph: {
    title: "Pärchen-Spiel mit Tier-Motiven — kostenlos",
    description:
      "Touch-optimiertes Pärchen-Spiel für Kleinkinder. 4, 6 oder 8 Paare, ohne Anmeldung, ohne Werbung.",
    url: "https://ausmalbilder-gratis.com/spiele/paare/",
    type: "website",
  },
};

export default function PaerchenSpielPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Spiele", href: "/spiele" },
            { name: "Pärchen-Spiel", href: "/spiele/paare" },
          ]}
        />

        <header className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Spiel
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-indigo sm:text-4xl">
              Pärchen-Spiel — finde die Paare
            </h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Tippe auf eine Karte zum Umdrehen und finde das passende Bild.
              Für Kinder ab 3 Jahren, kein Lesen nötig, keine Zeit­begrenzung.
            </p>
          </div>
          <Link
            href="/spiele"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-cream"
          >
            ← Alle Spiele
          </Link>
        </header>

        <PaerchenGame />

        {/* SEO text below */}
        <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="text-xl font-bold text-brand-indigo">
            Pärchen-Spiel kostenlos online — was steckt dahinter?
          </h2>
          <div className="mt-4 space-y-3 text-gray-700">
            <p>
              Ein Pärchen-Spiel ist mehr als nur ein Zeitvertreib. Es
              trainiert das visuelle Gedächtnis, die Konzentration und das
              räumliche Vorstellungs­vermögen. Schon Kleinkinder ab drei
              Jahren können mit einer kleinen Anzahl an Karten starten und
              sich schrittweise an mehr Paare herantasten.
            </p>
            <p>
              Unser Pärchen-Spiel nutzt liebevoll gestaltete Tier-Motive aus
              unserer Ausmalbilder-Sammlung. Die Karten sind groß genug für
              kleine Finger und das Spiel funktioniert reibungslos auf Tablets
              und Smartphones, ohne dass eine App installiert werden muss.
            </p>
            <p>
              <strong>Drei Schwierigkeitsstufen</strong>: „Leicht" mit nur 4
              Paaren ist ideal für die ganz Kleinen. „Mittel" mit 6 Paaren
              fordert Kinder ab etwa vier Jahren. „Schwer" mit 8 Paaren ist
              eine schöne Herausforderung für Vorschulkinder und Grundschüler.
              Wer ein Paar gefunden hat, sieht eine grüne Markierung. Wenn
              alle Paare gefunden sind, gibt es ein kleines Erfolgserlebnis.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
