import type { ImageEnrichment } from "@/data/types";

interface Props {
  enrichment: ImageEnrichment;
  imageTitle: string;
}

/**
 * Renders the LLM-generated enrichment blocks on a single image page.
 * Motif facts → animal profile (if tierSteckbrief present) → color tips →
 * learning goals → semantic keyword cloud.
 */
export default function EnrichmentSections({ enrichment, imageTitle }: Props) {
  return (
    <div className="mt-12 space-y-10">
      {/* Motiv-Fakten */}
      {enrichment.motivFakten.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-brand-indigo mb-4">
            5 Fakten über {imageTitle}
          </h2>
          <ul className="space-y-3">
            {enrichment.motivFakten.map((fakt, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="inline-flex shrink-0 items-center justify-center h-6 w-6 rounded-full bg-brand-coral text-white text-xs font-semibold"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{fakt}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tier-Steckbrief */}
      {enrichment.tierSteckbrief && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-brand-indigo mb-4">
            Tier-Steckbrief: {imageTitle}
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
              ["Lebensraum", enrichment.tierSteckbrief.lebensraum],
              ["Größe", enrichment.tierSteckbrief.groesse],
              ["Futter", enrichment.tierSteckbrief.futter],
              ["Lebenserwartung", enrichment.tierSteckbrief.lebenserwartung],
              ["Besonderheit", enrichment.tierSteckbrief.besonderheit],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {label}
                </dt>
                <dd className="mt-1 text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* Farbempfehlungen */}
      {enrichment.farbempfehlungen.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-brand-indigo mb-4">
            Farbtipps für dein {imageTitle} Ausmalbild
          </h2>
          <ul className="space-y-2">
            {enrichment.farbempfehlungen.map((tip, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span aria-hidden="true">🎨</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Lernziele */}
      {enrichment.lernziele.length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-brand-indigo mb-4">
            Was Kinder beim Ausmalen lernen
          </h2>
          <ul className="space-y-2">
            {enrichment.lernziele.map((ziel, i) => (
              <li key={i} className="flex gap-3 text-gray-700">
                <span aria-hidden="true" className="text-brand-coral">✓</span>
                <span className="leading-relaxed">{ziel}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Semantic keywords cloud */}
      {enrichment.semanticKeywords.length > 0 && (
        <section className="rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Verwandte Begriffe
          </h2>
          <div className="flex flex-wrap gap-2">
            {enrichment.semanticKeywords.map((kw) => (
              <span
                key={kw}
                className="inline-block rounded-full bg-brand-cream px-3 py-1 text-xs font-medium text-brand-indigo"
              >
                {kw}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
