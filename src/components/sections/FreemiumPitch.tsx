import Link from "next/link";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  price: string;
  subtitle: string;
  features: PlanFeature[];
  cta: string;
  active: boolean;
  highlighted: boolean;
}

const plans: Plan[] = [
  {
    name: "Free",
    price: "Kostenlos",
    subtitle: "Alle Downloads, Online-Ausmalen, ohne Anmeldung",
    features: [
      { text: "Alle Ausmalbilder herunterladen", included: true },
      { text: "Online-Ausmalen im Browser", included: true },
      { text: "Export als PNG", included: true },
      { text: "Alle Kategorien zug\u00e4nglich", included: true },
      { text: "Ohne Anmeldung nutzbar", included: true },
    ],
    cta: "Jetzt starten",
    active: true,
    highlighted: true,
  },
  {
    name: "Plus",
    price: "4,99\u20ac/Monat",
    subtitle: "Profi-Tools, Werke speichern, werbefrei",
    features: [
      { text: "Alles aus Free", included: true },
      { text: "Profi-Ausmalwerkzeuge", included: true },
      { text: "Werke im Account speichern", included: true },
      { text: "Community-Galerie", included: true },
      { text: "Werbefrei", included: true },
    ],
    cta: "Bald verf\u00fcgbar",
    active: false,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "9,99\u20ac/Monat",
    subtitle: "Kollaborativ ausmalen, Foto-Konverter, B2B",
    features: [
      { text: "Alles aus Plus", included: true },
      { text: "Kollaboratives Ausmalen", included: true },
      { text: "Foto \u2192 Ausmalbild Konverter", included: true },
      { text: "B2B-Lizenz f\u00fcr Schulen/Kitas", included: true },
      { text: "Priorit\u00e4ts-Support", included: true },
    ],
    cta: "Bald verf\u00fcgbar",
    active: false,
    highlighted: false,
  },
];

export default function FreemiumPitch() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-4 text-center text-2xl font-semibold text-brand-indigo md:text-3xl">
          Kostenlos starten &mdash; jederzeit upgraden
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center text-gray-600">
          Starte kostenlos und ohne Anmeldung. Erweiterte Funktionen kommen
          bald.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl bg-brand-white p-8 shadow-sm ${
                plan.highlighted
                  ? "border-2 border-brand-coral"
                  : "border border-gray-200"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-coral px-4 py-1 text-xs font-semibold text-white">
                  Empfohlen
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-indigo">
                  {plan.name}
                </h3>
                <p className="mt-2 text-3xl font-bold text-brand-indigo">
                  {plan.price}
                </p>
                <p className="mt-2 text-sm text-gray-500">{plan.subtitle}</p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature.text}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <svg
                      className="mt-0.5 h-4 w-4 shrink-0 text-brand-coral"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 12.75 6 6 9-13.5"
                      />
                    </svg>
                    {feature.text}
                  </li>
                ))}
              </ul>

              {plan.active ? (
                <Link
                  href="/ausmalbilder"
                  className="inline-flex h-12 items-center justify-center rounded-lg bg-brand-coral px-6 text-base font-semibold text-white transition-opacity hover:opacity-90"
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex h-12 cursor-not-allowed items-center justify-center rounded-lg bg-gray-200 px-6 text-base font-semibold text-gray-400"
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
