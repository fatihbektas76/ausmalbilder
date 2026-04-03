"use client";

import { useState } from "react";
import Link from "next/link";

type FilterTab = "Alle" | "Kinder" | "Erwachsene";

interface CategoryItem {
  name: string;
  href: string;
  count: string;
  badge?: string;
  audience: "kinder" | "erwachsene" | "alle";
}

const categories: CategoryItem[] = [
  { name: "Pferd", href: "/tiere/pferd/", count: "84 Bilder", audience: "kinder" },
  { name: "Mandala", href: "/mandala/", count: "220 Bilder", badge: "Erwachsene", audience: "erwachsene" },
  { name: "Drachen", href: "/fantasie/drachen/", count: "71 Bilder", audience: "kinder" },
  { name: "Blume & Natur", href: "/natur/blume/", count: "58 Bilder", audience: "alle" },
  { name: "Weihnachten", href: "/saisonal/weihnachten/", count: "95 Bilder", badge: "Saisonal", audience: "alle" },
];

const categoryIcons: Record<string, React.ReactNode> = {
  Pferd: (
    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
  ),
  Mandala: (
    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  ),
  Drachen: (
    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    </svg>
  ),
  "Blume & Natur": (
    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Z" />
    </svg>
  ),
  Weihnachten: (
    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
    </svg>
  ),
};

const tabs: FilterTab[] = ["Alle", "Kinder", "Erwachsene"];

export default function CategoryBrowser() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Alle");

  const filtered = categories.filter((cat) => {
    if (activeTab === "Alle") return true;
    if (activeTab === "Kinder") return cat.audience === "kinder" || cat.audience === "alle";
    if (activeTab === "Erwachsene") return cat.audience === "erwachsene" || cat.audience === "alle";
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

        {/* 3x2 Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filtered.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Thumbnail placeholder */}
              <div className="flex h-36 items-center justify-center bg-gray-50">
                {categoryIcons[cat.name] || (
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                  </svg>
                )}
              </div>
              {/* Info */}
              <div className="flex flex-1 items-center justify-between p-4">
                <div>
                  <h3 className="font-semibold text-brand-indigo group-hover:text-brand-coral transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-sm text-gray-400">{cat.count}</span>
                </div>
                {cat.badge && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                    {cat.badge}
                  </span>
                )}
              </div>
            </Link>
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
