import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PuzzleGame from "@/components/games/PuzzleGame";

export const metadata: Metadata = {
  title: "Tier-Puzzle — Bilder zusammensetzen",
  description:
    "Kostenloses Tier-Puzzle für Kinder ab 4 Jahren. Setze die Puzzle-Teile mit Drag-and-Drop zusammen, direkt im Browser, optimiert für Tablet und Smartphone.",
  alternates: { canonical: "https://ausmalbilder-gratis.com/spiele/puzzle/" },
  openGraph: {
    title: "Tier-Puzzle online — kostenlos",
    description:
      "Touch-optimiertes Puzzle-Spiel für Kleinkinder. 4, 9 oder 16 Teile, ohne Anmeldung, ohne Werbung.",
    url: "https://ausmalbilder-gratis.com/spiele/puzzle/",
    type: "website",
  },
};

export default function PuzzlePage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Spiele", href: "/spiele" },
            { name: "Tier-Puzzle", href: "/spiele/puzzle" },
          ]}
        />

        <header className="mt-6 mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
              Spiel
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-indigo sm:text-4xl">
              Tier-Puzzle
            </h1>
            <p className="mt-2 max-w-xl text-gray-600">
              Ziehe die Puzzle-Teile auf das umrandete Feld. Sie rasten
              automatisch an der richtigen Stelle ein. Für Kinder ab 4 Jahren,
              ohne Zeitdruck.
            </p>
          </div>
          <Link
            href="/spiele"
            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-cream"
          >
            ← Alle Spiele
          </Link>
        </header>

        <PuzzleGame />

        <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="text-xl font-bold text-brand-indigo">
            Tier-Puzzle online — was Kinder lernen
          </h2>
          <div className="mt-4 space-y-3 text-gray-700">
            <p>
              Puzzeln gehört zu den klassischsten Lernspielen für Kinder. Es
              fördert die Hand-Augen-Koordination, das räumliche Vorstellungs­vermögen
              und die Konzentration. Unser digitales Puzzle ist so gestaltet,
              dass es auch auf einem Tablet oder Smartphone mit kleinen Fingern
              funktioniert.
            </p>
            <p>
              Die <strong>Snap-Funktion</strong> sorgt dafür, dass Puzzle-Teile
              schon dann einrasten, wenn sie ungefähr an der richtigen Stelle
              losgelassen werden. Das verhindert Frustration und macht das
              Spiel auch für die Jüngsten gut spielbar.
            </p>
            <p>
              <strong>Drei Schwierigkeitsstufen</strong>: 4 Teile (2×2) für die
              ersten Versuche, 9 Teile (3×3) für etwas geübtere Kinder und 16
              Teile (4×4) als Herausforderung für Vorschulkinder und
              Grundschüler. Jedes Mal kann ein anderes Motiv aus unserer
              Ausmalbilder-Sammlung gewählt werden.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
