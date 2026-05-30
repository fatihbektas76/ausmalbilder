"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MiniSearch from "minisearch";
import type { SearchRecord } from "@/app/api/search-data/route";

interface Props {
  open: boolean;
  onClose: () => void;
}

const DIFFICULTY_BADGE: Record<string, string> = {
  einfach: "bg-green-100 text-green-700",
  mittel: "bg-amber-100 text-amber-700",
  komplex: "bg-red-100 text-red-700",
};

export default function SearchModal({ open, onClose }: Props) {
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lazy-build the index once we have the records
  const miniSearch = useMemo(() => {
    const ms = new MiniSearch<SearchRecord>({
      idField: "id",
      fields: ["title", "altText", "tags", "keywords", "categoryName"],
      storeFields: [
        "slug",
        "category",
        "categoryName",
        "title",
        "thumbnailUrl",
        "difficulty",
        "ageMin",
      ],
      searchOptions: {
        boost: { title: 3, keywords: 2, tags: 1.5, altText: 1, categoryName: 1 },
        prefix: true,
        fuzzy: 0.2,
        combineWith: "AND",
      },
      extractField: (doc, field) => {
        const v = (doc as unknown as Record<string, unknown>)[field];
        if (Array.isArray(v)) return (v as string[]).join(" ");
        return (v as string) ?? "";
      },
    });
    if (records.length > 0) ms.addAll(records);
    return ms;
  }, [records]);

  // Fetch data when the modal first opens
  useEffect(() => {
    if (!open || loaded || loadError) return;
    let cancelled = false;
    fetch("/api/search-data")
      .then((r) => r.json())
      .then((data: { records: SearchRecord[] }) => {
        if (cancelled) return;
        setRecords(data.records || []);
        setLoaded(true);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(String(err));
      });
    return () => {
      cancelled = true;
    };
  }, [open, loaded, loadError]);

  // Focus the input + reset state on open
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // ESC closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Run the actual search
  const results = useMemo(() => {
    const q = query.trim();
    if (!q || records.length === 0) return [];
    return miniSearch.search(q).slice(0, 12);
  }, [query, miniSearch, records.length]);

  // Reset selection when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  // Keyboard navigation
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, results.length - 1)));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[activeIndex]) {
        const r = results[activeIndex];
        window.location.href = `/${r.category}/${r.slug}`;
      }
    },
    [results, activeIndex]
  );

  // Scroll active result into view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-result-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[10vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-modal="true"
      role="dialog"
    >
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <svg
            aria-hidden
            className="h-5 w-5 shrink-0 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ausmalbilder suchen — z.B. Pferd, Galopp, Mandala…"
            className="flex-1 bg-transparent text-base text-brand-indigo placeholder:text-gray-400 focus:outline-none"
            aria-label="Suche"
          />
          <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 sm:inline-block">
            ESC
          </kbd>
        </div>

        {/* Body */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto">
          {!loaded && !loadError && (
            <div className="px-5 py-8 text-center text-sm text-gray-500">
              Suchindex wird geladen…
            </div>
          )}

          {loadError && (
            <div className="px-5 py-8 text-center text-sm text-red-600">
              Suche konnte nicht geladen werden.
            </div>
          )}

          {loaded && !query.trim() && (
            <div className="px-5 py-8 text-center text-sm text-gray-500">
              {records.length > 0
                ? `Tippe los — ${records.length} Ausmalbilder im Index.`
                : "Noch keine veröffentlichten Ausmalbilder."}
            </div>
          )}

          {loaded && query.trim() && results.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-500">
              Keine Treffer für „{query}".
            </div>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-gray-100">
              {results.map((r, i) => {
                const active = i === activeIndex;
                return (
                  <li key={r.id} data-result-index={i}>
                    <Link
                      href={`/${r.category}/${r.slug}`}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-5 py-3 transition-colors ${
                        active ? "bg-brand-cream" : "hover:bg-brand-cream/60"
                      }`}
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {r.thumbnailUrl && (
                          <Image
                            src={r.thumbnailUrl}
                            alt={r.title}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold text-brand-indigo">
                            {r.title}
                          </p>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                              DIFFICULTY_BADGE[r.difficulty] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {r.difficulty}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          {r.categoryName} · ab {r.ageMin} Jahren
                        </p>
                      </div>
                      <svg
                        aria-hidden
                        className={`h-4 w-4 shrink-0 transition-opacity ${
                          active ? "text-brand-coral" : "text-gray-300"
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer with hints */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-2.5 text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-medium">
                ↑
              </kbd>{" "}
              <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-medium">
                ↓
              </kbd>{" "}
              navigieren
            </span>
            <span>
              <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 font-medium">
                ⏎
              </kbd>{" "}
              öffnen
            </span>
          </div>
          <span>Fuzzy-Suche mit Tippfehler-Toleranz</span>
        </div>
      </div>
    </div>
  );
}
