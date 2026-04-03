import Link from "next/link";

const categories = [
  { name: "Pferde", href: "/tiere/pferd", count: "50+" },
  { name: "Mandala", href: "/mandala", count: "30+" },
  { name: "Weihnachten", href: "/saisonal/weihnachten", count: "40+" },
  { name: "Halloween", href: "/saisonal/halloween", count: "35+" },
  { name: "Ostern", href: "/saisonal/ostern", count: "25+" },
  { name: "Drachen", href: "/fantasie/drachen", count: "20+" },
  { name: "Erwachsene", href: "/erwachsene", count: "15+" },
  {
    name: "Fr\u00fchling",
    href: "/saisonal/fruehling",
    count: "30+",
  },
];

const cardColors = [
  "bg-brand-coral-light",
  "bg-purple-50",
  "bg-red-50",
  "bg-orange-50",
  "bg-yellow-50",
  "bg-green-50",
  "bg-blue-50",
  "bg-pink-50",
];

export default function CategoryBrowser() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <h2 className="mb-10 text-center text-2xl font-semibold text-brand-indigo md:text-3xl">
          Beliebte Kategorien
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative flex flex-col items-center justify-center rounded-xl p-6 text-center transition-shadow hover:shadow-md md:p-8"
              style={{}}
            >
              <div
                className={`absolute inset-0 rounded-xl ${cardColors[index % cardColors.length]} transition-opacity group-hover:opacity-80`}
              />
              <div className="relative z-10">
                <span className="mb-2 inline-block rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-brand-coral">
                  {category.count} Bilder
                </span>
                <h3 className="text-base font-semibold text-brand-indigo md:text-lg">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
