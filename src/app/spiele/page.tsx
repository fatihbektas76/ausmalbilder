import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata: Metadata = {
  title: "Spiele für Kinder — kostenlos im Browser",
  description:
    "Kostenlose Online-Spiele für Kinder — touch-optimiert für Tablet und Smartphone. Memory mit Tier-Pärchen und weitere Spiele rund um Ausmalbilder.",
  alternates: { canonical: "https://ausmalbilder-gratis.com/spiele/" },
};

interface Game {
  slug: string;
  title: string;
  description: string;
  ageHint: string;
  status: "live" | "soon";
  emoji: string;
}

const GAMES: Game[] = [
  {
    slug: "memory",
    title: "Memory",
    description:
      "Finde die Tier-Pärchen. Mit drei Schwierigkeitsstufen für Kleinkinder bis Vorschüler.",
    ageHint: "ab 3 Jahren",
    status: "live",
    emoji: "🧠",
  },
  {
    slug: "puzzle",
    title: "Tier-Puzzle",
    description:
      "Setze ein Ausmalbild aus großen Puzzle-Teilen zusammen. Snap-to-Place, frustfrei.",
    ageHint: "ab 4 Jahren",
    status: "soon",
    emoji: "🧩",
  },
  {
    slug: "verbinde-die-punkte",
    title: "Verbinde die Punkte",
    description:
      "Ziehe eine Linie von Zahl zu Zahl und ein verstecktes Bild taucht auf.",
    ageHint: "ab 5 Jahren",
    status: "soon",
    emoji: "✏️",
  },
];

export default function SpieleHubPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Spiele", href: "/spiele" },
          ]}
        />

        <header className="mt-6 mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-coral">
            Spielen
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-brand-indigo sm:text-4xl">
            Spiele für Kinder
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Kostenlose Browser-Spiele rund um unsere Ausmalbild-Motive.
            Touch-optimiert für Tablets und Smartphones, ohne Anmeldung, ohne
            Werbung, ohne Sound.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GAMES.map((g) => {
            const isLive = g.status === "live";
            const card = (
              <div
                className={`group flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 transition-all ${
                  isLive
                    ? "cursor-pointer ring-gray-100 hover:-translate-y-0.5 hover:shadow-md hover:ring-brand-coral/30"
                    : "cursor-default ring-gray-100 opacity-70"
                }`}
              >
                <div className="text-4xl">{g.emoji}</div>
                <h2 className="mt-3 text-lg font-bold text-brand-indigo">
                  {g.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600">{g.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-brand-cream px-2.5 py-1 text-xs font-medium text-brand-indigo">
                    {g.ageHint}
                  </span>
                  {isLive ? (
                    <span className="text-sm font-semibold text-brand-coral group-hover:underline">
                      Jetzt spielen →
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400">
                      Bald verfügbar
                    </span>
                  )}
                </div>
              </div>
            );

            return isLive ? (
              <Link key={g.slug} href={`/spiele/${g.slug}`} className="block">
                {card}
              </Link>
            ) : (
              <div key={g.slug}>{card}</div>
            );
          })}
        </div>

        <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100 sm:p-8">
          <h2 className="text-xl font-bold text-brand-indigo">
            Warum Browser-Spiele für Kinder?
          </h2>
          <div className="mt-4 space-y-3 text-gray-700">
            <p>
              Spielerisches Lernen am Tablet oder Smartphone macht Spaß und
              fördert verschiedene Fähigkeiten. Unsere Spiele sind bewusst
              einfach gehalten: große Tap-Flächen, keine Zeitbegrenzung,
              keine Werbung und keine Bezahl-Hürden. Eltern können beruhigt
              die Geräte aus der Hand geben.
            </p>
            <p>
              Alle Spiele laufen direkt im Browser, es muss nichts
              installiert werden. So kannst du auf jedem Gerät sofort
              starten — egal ob iPad, Android-Tablet oder Smartphone.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
