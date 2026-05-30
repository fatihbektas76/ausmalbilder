import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ConnectDotsGame from "@/components/games/ConnectDotsGame";

export const metadata: Metadata = {
  title: "Verbinde die Punkte — Online-Spiel für Kinder",
  description:
    "Kostenloses Verbinde-die-Punkte-Spiel für Kinder ab 5 Jahren. Tippe die Zahlen der Reihe nach an und entdecke das versteckte Tier-Motiv.",
  alternates: { canonical: "https://ausmalbilder-gratis.com/spiele/punkte/" },
  openGraph: {
    title: "Verbinde die Punkte — Zahlen lernen mit Spaß",
    description:
      "Touch-optimiertes Zahlen-Verbinden-Spiel. Drei Schwierigkeitsstufen, ohne Anmeldung, ohne Werbung.",
    url: "https://ausmalbilder-gratis.com/spiele/punkte/",
    type: "website",
  },
};

export default function PunktePage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Spiele", href: "/spiele" },
            { name: "Verbinde die Punkte", href: "/spiele/punkte" },
          ]}
        />

        <header className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Spiel
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-indigo sm:text-4xl">
              Verbinde die Punkte
            </h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Tippe die nummerierten Punkte der Reihe nach an. Mit jedem Punkt
              wächst die Linie und ein verstecktes Motiv taucht auf. Für
              Kinder ab 5 Jahren.
            </p>
          </div>
          <Link
            href="/spiele"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-cream"
          >
            ← Alle Spiele
          </Link>
        </header>

        <ConnectDotsGame />

        <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="text-xl font-bold text-brand-indigo">
            Verbinde die Punkte — pädagogischer Wert
          </h2>
          <div className="mt-4 space-y-3 text-gray-700">
            <p>
              „Verbinde die Punkte" ist ein Klassiker der frühkindlichen
              Bildung. Beim Folgen der Zahlenreihe lernen Kinder spielerisch
              die Zahlenreihenfolge bis 10, 15 oder 20. Gleichzeitig wird die
              Hand-Augen-Koordination und das vorausschauende Denken
              gefördert: Wo ist die nächste Zahl? Welches Bild entsteht?
            </p>
            <p>
              Unsere digitale Version ist <strong>frustfrei gestaltet</strong>:
              Wenn auf einen falschen Punkt getippt wird, wackelt er kurz,
              aber es passiert sonst nichts. Kein Punkteabzug, kein Game Over.
              Das Spiel kann jederzeit von vorn begonnen werden.
            </p>
            <p>
              <strong>Drei Schwierigkeitsstufen</strong>: 10 Punkte (Fisch)
              für die ersten Versuche, 15 Punkte (Schmetterling) für etwas
              geübtere Kinder und 20 Punkte (Stern) für Vorschul- und
              Grundschulkinder, die schon sicher bis 20 zählen können.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
