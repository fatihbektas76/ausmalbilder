import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readdir, readFile } from "fs/promises";
import path from "path";
import articlesData from "@/data/blog/articles.json";
import type { BlogArticle, ColoringImage } from "@/data/types";
import Breadcrumb from "@/components/ui/Breadcrumb";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import TableOfContents from "@/components/blog/TableOfContents";
import FaqSection from "@/components/ui/FaqSection";
import ImageCard from "@/components/ui/ImageCard";
import ArticleCard from "@/components/blog/ArticleCard";

/* ---------- constants ---------- */

const CATEGORY_LABELS: Record<string, string> = {
  stressabbau: "Stressabbau",
  "kinder-entwicklung": "Kinder & Entwicklung",
  kreativitaet: "Kreativität",
  ratgeber: "Ratgeber",
  saisonal: "Saisonal",
};

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  stressabbau: "bg-purple-100 text-purple-700",
  "kinder-entwicklung": "bg-blue-100 text-blue-700",
  kreativitaet: "bg-pink-100 text-pink-700",
  ratgeber: "bg-amber-100 text-amber-700",
  saisonal: "bg-green-100 text-green-700",
};

const articles = articlesData as BlogArticle[];

/* ---------- helpers ---------- */

function getArticle(slug: string): BlogArticle | undefined {
  return articles.find((a) => a.slug === slug && a.status !== "draft");
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function loadAllImages(): Promise<ColoringImage[]> {
  try {
    const dir = path.join(process.cwd(), "src", "data", "images");
    const files = await readdir(dir);
    const allImages: ColoringImage[] = [];

    for (const file of files.filter((f) => f.endsWith(".json"))) {
      const content = await readFile(path.join(dir, file), "utf-8");
      const parsed = JSON.parse(content) as ColoringImage[];
      allImages.push(...parsed);
    }

    return allImages;
  } catch {
    return [];
  }
}

/* ---------- static params ---------- */

export function generateStaticParams(): { slug: string }[] {
  return articles
    .filter((a) => a.status !== "draft")
    .map((a) => ({ slug: a.slug }));
}

/* ---------- metadata ---------- */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return { title: "Artikel nicht gefunden" };
  }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `https://ausmalbilder-gratis.com/blog/${article.slug}/`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://ausmalbilder-gratis.com/blog/${article.slug}/`,
      siteName: "Ausmalbilder Gratis",
      locale: "de_DE",
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      images: article.featuredImage
        ? [
            {
              url: article.featuredImage.startsWith("http")
                ? article.featuredImage
                : `https://ausmalbilder-gratis.com${article.featuredImage}`,
              width: 1200,
              height: 630,
              alt: article.featuredImageAlt,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
      images: article.featuredImage
        ? [
            article.featuredImage.startsWith("http")
              ? article.featuredImage
              : `https://ausmalbilder-gratis.com${article.featuredImage}`,
          ]
        : [],
    },
  };
}

/* ---------- page ---------- */

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  /* Related coloring images */
  const allImages = await loadAllImages();
  const relatedColoringImages = article.relatedImages
    .map((imgSlug) => allImages.find((img) => img.slug === imgSlug))
    .filter((img): img is ColoringImage => img !== undefined)
    .slice(0, 4);

  /* Related articles */
  const relatedArticleObjects = article.relatedArticles
    .map((aSlug) =>
      articles.find((a) => a.slug === aSlug && a.status !== "draft"),
    )
    .filter((a): a is BlogArticle => a !== undefined)
    .slice(0, 3);

  const categoryLabel =
    CATEGORY_LABELS[article.category] ?? article.category;
  const categoryBadgeClass =
    CATEGORY_BADGE_CLASSES[article.category] ?? "bg-gray-100 text-gray-700";

  /* Schema: Article */
  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.titleSeo,
    description: article.metaDescription,
    image: article.featuredImage
      ? article.featuredImage.startsWith("http")
        ? article.featuredImage
        : `https://ausmalbilder-gratis.com${article.featuredImage}`
      : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Ausmalbilder Gratis",
      url: "https://ausmalbilder-gratis.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://ausmalbilder-gratis.com/blog/${article.slug}/`,
    },
    keywords: article.tags.join(", "),
    wordCount: article.content.split(/\s+/).length,
    timeRequired: `PT${article.readingTime}M`,
  };

  /* Schema: FAQPage (optional) */
  const schemaFaq =
    article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { name: "Startseite", href: "/" },
            { name: "Blog", href: "/blog" },
            {
              name: categoryLabel,
              href: `/blog/kategorie/${article.category}`,
            },
            { name: article.title, href: `/blog/${article.slug}` },
          ]}
        />

        {/* Article header */}
        <header className="mt-6 mb-8">
          {/* Category badge + reading time */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/blog/kategorie/${article.category}`}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity hover:opacity-80 ${categoryBadgeClass}`}
            >
              {categoryLabel}
            </Link>
            <span className="text-sm text-gray-400">
              {article.readingTime} Min. Lesezeit
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-2xl font-bold leading-tight text-brand-indigo sm:text-3xl md:text-4xl">
            {article.titleSeo}
          </h1>

          {/* Meta line */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>Von {article.author}</span>
            <span aria-hidden="true">&middot;</span>
            <time dateTime={article.publishedAt}>
              {formatDate(article.publishedAt)}
            </time>
            {article.updatedAt !== article.publishedAt && (
              <>
                <span aria-hidden="true">&middot;</span>
                <span>
                  Aktualisiert:{" "}
                  <time dateTime={article.updatedAt}>
                    {formatDate(article.updatedAt)}
                  </time>
                </span>
              </>
            )}
            <span aria-hidden="true">&middot;</span>
            <span>{article.readingTime} Min. Lesezeit</span>
          </div>
        </header>

        {/* Featured image */}
        {article.featuredImage && (
          <div className="relative mb-8 aspect-[2/1] w-full overflow-hidden rounded-xl bg-gray-100">
            <Image
              src={article.featuredImage}
              alt={article.featuredImageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1120px"
              priority
            />
          </div>
        )}

        {/* Two-column layout: content + sidebar */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_280px]">
          {/* Main content */}
          <article className="min-w-0">
            <MarkdownRenderer content={article.content} />
          </article>

          {/* Sidebar — sticky Table of Contents */}
          <aside className="hidden lg:block">
            <TableOfContents content={article.content} />
          </aside>
        </div>

        {/* FAQ section */}
        {article.faq.length > 0 && (
          <div className="mt-12">
            <FaqSection
              title="Häufig gestellte Fragen"
              items={article.faq}
            />
          </div>
        )}

        {/* Related coloring images */}
        {relatedColoringImages.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-brand-indigo sm:text-2xl">
              Passende Ausmalbilder
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedColoringImages.map((img) => (
                <ImageCard
                  key={img.slug}
                  slug={img.slug}
                  title={img.title}
                  thumbnailUrl={img.thumbnailUrl}
                  altText={img.altText}
                  difficulty={img.difficulty}
                  ageMin={img.ageMin}
                  ageMax={img.ageMax}
                  category={img.category}
                  pdfUrl={img.pdfUrl}
                />
              ))}
            </div>
          </section>
        )}

        {/* Related articles */}
        {relatedArticleObjects.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-semibold text-brand-indigo sm:text-2xl">
              Weitere Artikel
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticleObjects.map((a) => (
                <ArticleCard
                  key={a.slug}
                  slug={a.slug}
                  title={a.title}
                  excerpt={a.excerpt}
                  category={a.category}
                  publishedAt={a.publishedAt}
                  readingTime={a.readingTime}
                  featuredImage={a.featuredImage}
                  featuredImageAlt={a.featuredImageAlt}
                />
              ))}
            </div>
          </section>
        )}

        {/* Back to blog link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-brand-indigo px-6 py-3 text-sm font-semibold text-brand-indigo transition-colors hover:bg-brand-indigo hover:text-white"
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
      </div>

      {/* JSON-LD: Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle) }}
      />

      {/* JSON-LD: FAQPage (if faq items exist) */}
      {schemaFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq) }}
        />
      )}
    </div>
  );
}
