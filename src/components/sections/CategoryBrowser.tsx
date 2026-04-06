"use client";

import { useState } from "react";
import Link from "next/link";
import categoriesData from "@/data/categories.json";
import type { Category, ColoringImage } from "@/data/types";
import CategoryCard from "./CategoryCard";

// Import image data for categories that have real images
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const imageModules: Record<string, ColoringImage[]> = {};
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  imageModules["tiere/pferd"] = require("@/data/images/tiere-pferd.json");
} catch { /* no images yet */ }
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  imageModules["tiere/elefant"] = require("@/data/images/tiere-elefant.json");
} catch { /* no images yet */ }
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  imageModules["tiere/loewen"] = require("@/data/images/tiere-loewen.json");
} catch { /* no images yet */ }

function getRealThumbnails(slug: string): string[] {
  // For parent categories (e.g. "tiere"), collect thumbnails from all child modules
  const childSlugs = Object.keys(imageModules).filter(k => k.startsWith(slug + "/"));
  if (childSlugs.length > 0) {
    const allImages = childSlugs.flatMap(k => imageModules[k] || []);
    if (allImages.length > 0) return allImages.slice(0, 4).map(img => img.thumbnailUrl);
  }
  const images = imageModules[slug];
  if (!images || images.length === 0) return [];
  return images.slice(0, 4).map((img) => img.thumbnailUrl);
}

type FilterTab = "Alle" | "Kinder" | "Erwachsene";

const tabs: FilterTab[] = ["Alle", "Kinder", "Erwachsene"];

// Which categories appear on the homepage (in this order)
const HOMEPAGE_SLUGS = [
  "tiere",
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
          {filtered.map((cat) => {
            // Use real image thumbnails if available, fall back to SVG placeholders
            const realThumbs = getRealThumbnails(cat.slug);
            const thumbnails = realThumbs.length > 0 ? realThumbs : (cat.thumbnails || []);

            return (
              <CategoryCard
                key={cat.slug}
                name={cat.name}
                href={cat.href || `/${cat.slug}/`}
                count={cat.displayCount || `${cat.imageCount} Bilder`}
                badge={cat.badge}
                thumbnails={thumbnails}
                bgGradient={cat.bgGradient}
              />
            );
          })}

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
