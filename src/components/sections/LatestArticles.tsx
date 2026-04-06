import Link from "next/link";
import articlesData from "@/data/blog/articles.json";
import type { BlogArticle } from "@/data/types";

const CATEGORY_LABELS: Record<string, { label: string; className: string }> = {
  stressabbau: { label: "Stressabbau", className: "bg-purple-100 text-purple-700" },
  "kinder-entwicklung": { label: "Kinder & Entwicklung", className: "bg-blue-100 text-blue-700" },
  kreativitaet: { label: "Kreativität", className: "bg-pink-100 text-pink-700" },
  ratgeber: { label: "Ratgeber", className: "bg-amber-100 text-amber-700" },
  saisonal: { label: "Saisonal", className: "bg-green-100 text-green-700" },
};

export default function LatestArticles() {
  const articles = (articlesData as BlogArticle[])
    .filter((a) => a.status !== "draft")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#1D1448" }}>
            Neueste Artikel
          </h2>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:underline"
            style={{ color: "#E8490F" }}
          >
            Alle Artikel →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const cat = CATEGORY_LABELS[article.category];
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className="group overflow-hidden rounded-xl bg-[#F7F6F2] shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image placeholder */}
                <div className="flex h-40 items-center justify-center bg-gray-100">
                  {cat && (
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${cat.className}`}>
                      {cat.label}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold leading-snug line-clamp-2 group-hover:underline" style={{ color: "#1D1448" }}>
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    <span>
                      {new Date(article.publishedAt).toLocaleDateString("de-DE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span>{article.readingTime} Min. Lesezeit</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
