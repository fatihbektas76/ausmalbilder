import Link from "next/link";

const stats = [
  { label: "500+ Ausmalbilder" },
  { label: "100% Kostenlos" },
  { label: "Ohne Anmeldung" },
];

export default function Hero() {
  return (
    <section className="bg-brand-indigo py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 text-center">
        <h1 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          Ausmalbilder gratis zum Ausdrucken und Ausmalen
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-200">
          Entdecke tausende kostenlose Ausmalbilder f&uuml;r Kinder und
          Erwachsene. Lade PDFs herunter oder male direkt online im Browser
          &mdash; ohne Anmeldung.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/ausmalbilder"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-coral px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Ausmalbilder entdecken
          </Link>
          <Link
            href="/online-ausmalen"
            className="inline-flex h-12 items-center justify-center rounded-lg border-2 border-white px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Online ausmalen
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {stats.map((stat) => (
            <span
              key={stat.label}
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-medium text-white"
            >
              {stat.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
