"use client";

import { useState } from "react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ArticleCard from "@/components/blog/ArticleCard";
import BlogFilterTabs from "@/components/blog/BlogFilterTabs";
import type { BlogArticle } from "@/data/types";

export default function BlogOverview({
  articles,
}: {
  articles: BlogArticle[];
}) {
  const [activeCategory, setActiveCategory] = useState("");

  /* Count articles per category */
  const counts: Record<string, number> = {};
  for (const a of articles) {
    counts[a.category] = (counts[a.category] || 0) + 1;
  }

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles;

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { name: "Startseite", href: "/" },
          { name: "Blog", href: "/blog" },
        ]}
      />

      {/* Page header */}
      <h1
        className="mb-3 text-3xl font-bold tracking-tight"
        style={{ color: "#1D1448" }}
      >
        Blog — Rund ums Ausmalen
      </h1>
      <p className="mb-8 max-w-2xl leading-relaxed text-gray-600">
        Entdecke Tipps, Anleitungen und Wissenswertes rund ums Ausmalen — für
        Kinder und Erwachsene. Von Stressabbau-Techniken bis zu den besten
        Stiften für jedes Alter.
      </p>

      {/* Category filter tabs */}
      <BlogFilterTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        counts={counts}
      />

      {/* Featured article */}
      {featured && (
        <div className="mt-8">
          <ArticleCard
            slug={featured.slug}
            title={featured.title}
            excerpt={featured.excerpt}
            category={featured.category}
            publishedAt={featured.publishedAt}
            readingTime={featured.readingTime}
            featuredImage={featured.featuredImage}
            featuredImageAlt={featured.featuredImageAlt}
            featured
          />
        </div>
      )}

      {/* Article grid */}
      {rest.length > 0 && (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
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
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          Keine Artikel in dieser Kategorie gefunden.
        </div>
      )}

      {/* SEO text block */}
      <section className="mt-16 rounded-xl bg-white p-6 shadow-sm sm:p-8">
        <h2
          className="mb-4 text-xl font-semibold"
          style={{ color: "#1D1448" }}
        >
          Ausmalbilder Blog — Kreativität, Stressabbau und mehr
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-600 sm:text-base">
          <p>
            Willkommen im Blog von ausmalbilder-gratis.com! Hier findest du
            fundierte Artikel rund ums Ausmalen — von wissenschaftlich
            belegten Vorteilen des Malens für die kindliche Entwicklung bis
            hin zu Stressabbau-Techniken mit Mandalas und Ausmalbildern für
            Erwachsene.
          </p>
          <p>
            Unsere Ratgeber helfen dir, die richtigen Stifte und Materialien
            für jedes Alter zu finden, geben saisonale Inspirationen und
            zeigen, wie Ausmalen als therapeutisches Werkzeug eingesetzt
            werden kann. Alle Tipps sind kostenlos — genau wie unsere
            Ausmalbilder.
          </p>
        </div>
      </section>
    </div>
  );
}
