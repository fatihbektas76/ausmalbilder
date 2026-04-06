import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import articlesData from "@/data/blog/articles.json";
import type { BlogArticle, BlogCategory } from "@/data/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ArticleCard from "@/components/blog/ArticleCard";

/* ---------- constants ---------- */

const ALL_CATEGORIES: BlogCategory[] = [
  "stressabbau",
  "kinder-entwicklung",
  "kreativitaet",
  "ratgeber",
  "saisonal",
];

const CATEGORY_META: Record<
  string,
  { label: string; description: string; seoTitle: string; seoDescription: string }
> = {
  stressabbau: {
    label: "Stressabbau",
    description:
      "Erfahre, wie Ausmalen wissenschaftlich belegt Stress reduziert, die Achtsamkeit fördert und als therapeutisches Werkzeug eingesetzt werden kann — für Erwachsene und Kinder.",
    seoTitle: "Stressabbau durch Ausmalen — Blog",
    seoDescription:
      "Wissenschaftlich belegte Tipps, wie Ausmalen Stress reduziert und die Achtsamkeit fördert. Therapeutisches Ausmalen für Erwachsene und Kinder.",
  },
  "kinder-entwicklung": {
    label: "Kinder & Entwicklung",
    description:
      "Entdecke, wie Ausmalen die Feinmotorik, Kreativität und kognitive Entwicklung von Kindern fördert — mit altersgerechten Tipps und Empfehlungen.",
    seoTitle: "Kinder & Entwicklung — Ausmalen als Lernwerkzeug — Blog",
    seoDescription:
      "Wie Ausmalen die Feinmotorik, Kreativität und kognitive Entwicklung von Kindern fördert. Altersgerechte Tipps und Empfehlungen.",
  },
  kreativitaet: {
    label: "Kreativität",
    description:
      "Tipps und Techniken, um deine Kreativität beim Ausmalen auf das nächste Level zu bringen — von Farbkombinationen bis zu Schattierungstechniken.",
    seoTitle: "Kreativitäts-Tipps fürs Ausmalen — Blog",
    seoDescription:
      "Kreativitäts-Tipps und Techniken fürs Ausmalen. Farbkombinationen, Schattierungen und Inspirationen für beeindruckende Ergebnisse.",
  },
  ratgeber: {
    label: "Ratgeber",
    description:
      "Praktische Ratgeber rund ums Ausmalen — die besten Stifte, das richtige Papier, Drucktipps und Empfehlungen für jedes Alter und Können.",
    seoTitle: "Ausmal-Ratgeber — Stifte, Papier & Tipps — Blog",
    seoDescription:
      "Praktische Ratgeber: die besten Stifte, das richtige Papier, Drucktipps und Materialempfehlungen fürs Ausmalen für jedes Alter.",
  },
  saisonal: {
    label: "Saisonal",
    description:
      "Saisonale Ausmal-Inspirationen — von Weihnachts- und Oster-Motiven bis zu Herbst- und Frühlings-Ideen für das ganze Jahr.",
    seoTitle: "Saisonale Ausmal-Ideen — Blog",
    seoDescription:
      "Saisonale Ausmal-Inspirationen für das ganze Jahr: Weihnachten, Ostern, Halloween, Herbst und Frühling — mit passenden kostenlosen Ausmalbildern.",
  },
};

const articles = articlesData as BlogArticle[];

/* ---------- static params ---------- */

export function generateStaticParams(): { kategorie: string }[] {
  return ALL_CATEGORIES.map((cat) => ({ kategorie: cat }));
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategorie: string }>;
}): Promise<Metadata> {
  const { kategorie } = await params;
  const meta = CATEGORY_META[kategorie];

  if (!meta) {
    return { title: "Kategorie nicht gefunden" };
  }

  return {
    title: meta.seoTitle,
    description: meta.seoDescription,
    alternates: {
      canonical: `https://ausmalbilder-gratis.com/blog/kategorie/${kategorie}/`,
    },
    openGraph: {
      title: meta.seoTitle,
      description: meta.seoDescription,
      url: `https://ausmalbilder-gratis.com/blog/kategorie/${kategorie}/`,
      siteName: "Ausmalbilder Gratis",
      locale: "de_DE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.seoTitle,
      description: meta.seoDescription,
    },
  };
}

/* ---------- page ---------- */

export default async function BlogKategoriePage({
  params,
}: {
  params: Promise<{ kategorie: string }>;
}) {
  const { kategorie } = await params;
  const meta = CATEGORY_META[kategorie];

  if (!meta) {
    notFound();
  }

  const categoryArticles = articles
    .filter((a) => a.category === kategorie && a.status !== "draft")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Blog", href: "/blog" },
            { name: meta.label, href: `/blog/kategorie/${kategorie}` },
          ]}
        />

        {/* Page header */}
        <div className="mt-6 mb-8">
          <h1 className="mb-3 text-3xl font-bold tracking-tight text-brand-indigo">
            {meta.label}
          </h1>
          <p className="max-w-3xl leading-relaxed text-gray-600">
            {meta.description}
          </p>
        </div>

        {/* Back to all articles */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-coral transition-colors hover:text-brand-coral/80"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Alle Blog-Artikel ansehen
          </Link>
        </div>

        {/* Articles grid */}
        {categoryArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryArticles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                featuredImage={article.featuredImage}
                featuredImageAlt={article.featuredImageAlt}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white py-16 text-center shadow-sm">
            <p className="text-lg text-gray-400">
              Noch keine Artikel in dieser Kategorie.
            </p>
            <Link
              href="/blog"
              className="mt-4 inline-block text-sm font-medium text-brand-coral hover:underline"
            >
              Alle Artikel ansehen
            </Link>
          </div>
        )}

        {/* Article count info */}
        {categoryArticles.length > 0 && (
          <p className="mt-8 text-center text-sm text-gray-400">
            {categoryArticles.length}{" "}
            {categoryArticles.length === 1 ? "Artikel" : "Artikel"} in der
            Kategorie {meta.label}
          </p>
        )}
      </div>
    </div>
  );
}
