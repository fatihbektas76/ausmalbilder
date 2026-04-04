"use client";

import { useState } from "react";
import Link from "next/link";
import categoriesData from "@/data/categories.json";
import type { Category } from "@/data/types";
import CategoryCard from "./CategoryCard";

type FilterTab = "Alle" | "Kinder" | "Erwachsene";

const tabs: FilterTab[] = ["Alle", "Kinder", "Erwachsene"];

// Which categories appear on the homepage (in this order)
const HOMEPAGE_SLUGS = [
  "tiere/pferd",
  "mandala",
  "fantasie/drachen",
  "natur/blume",
  "saisonal/weihnachten",
];

const homepageCategories = HOMEPAGE_SLUGS.map((slug) =>
  (categoriesData as Category[]).find((c) => c.slug === slug)
).filter((c): c is Category => c !== undefined);

export default function CategoryBrowser() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Alle");

  const filtered = homepageCategories.filter((cat) => {
    if (activeTab === "Alle") return true;
    if (activeTab === "Kinder")
      return cat.audience === "kinder" || cat.audience === "alle";
    if (activeTab === "Erwachsene")
      return cat.audience === "erwachsene" || cat.audience === "alle";
    return true;
  });

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand-coral">
              Kategorien
            </p>
            <h2 className="text-2xl font-semibold text-brand-indigo md:text-3xl">
              Für jeden Geschmack
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-brand-coral text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              href={cat.href || `/${cat.slug}/`}
              count={cat.displayCount || `${cat.imageCount} Bilder`}
              badge={cat.badge}
              thumbnails={cat.thumbnails || []}
              bgGradient={cat.bgGradient}
            />
          ))}

          {/* "+ Alle Kategorien" card */}
          <Link
            href="/ausmalbilder/"
            className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-8 transition-colors hover:border-brand-coral"
          >
            <span className="mb-2 text-3xl font-light text-brand-coral">+</span>
            <span className="font-semibold text-brand-indigo group-hover:text-brand-coral transition-colors">
              Alle Kategorien
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
