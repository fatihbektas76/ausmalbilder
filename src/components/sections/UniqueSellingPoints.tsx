export default function UniqueSellingPoints() {
  return (
    <section className="bg-brand-cream py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Section label */}
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-brand-coral">
          Warum ausmalbilder-gratis.com anders ist
        </p>
        <h2 className="mb-12 text-center text-2xl font-semibold text-brand-indigo md:text-3xl">
          Was kein anderer Anbieter hat
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Karte 1 — Online ausmalen */}
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4">
              <svg
                className="h-10 w-10 text-brand-coral"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-brand-indigo">
              Online ausmalen im Browser
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Kein Download, kein Drucken nötig. Färbe dein Bild direkt im Browser
              — inkl. Speichern &amp; Teilen.
            </p>
            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              Einzigartig in DE
            </span>
          </div>

          {/* Karte 2 — Für Kinder & Erwachsene */}
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4">
              <svg
                className="h-10 w-10 text-brand-coral"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-brand-indigo">
              Für Kinder &amp; Erwachsene
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Schwierigkeitsfilter von Kleinkind (2+) bis Experte. Therapeutische
              Achtsamkeits-Serien für Erwachsene, Lernbilder für die Schule.
            </p>
            <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Alle Altersgruppen
            </span>
          </div>

          {/* Karte 3 — 100% kostenlos */}
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4">
              <svg
                className="h-10 w-10 text-brand-coral"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-brand-indigo">
              100% kostenlos — ohne Anmeldung
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              Alle Ausmalbilder als druckfertige PDF sofort herunterladen. Kein
              Account, keine versteckten Kosten, keine Werbeanmeldung.
            </p>
            <span className="inline-block rounded-full bg-brand-coral-light px-3 py-1 text-xs font-semibold text-brand-coral">
              Immer gratis
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
