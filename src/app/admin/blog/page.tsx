"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface ArticleEntry {
  slug: string;
  title: string;
  category: string;
  status?: "draft" | "live";
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  author: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  stressabbau: "bg-purple-100 text-purple-700",
  "kinder-entwicklung": "bg-blue-100 text-blue-700",
  kreativitaet: "bg-pink-100 text-pink-700",
  ratgeber: "bg-amber-100 text-amber-700",
  saisonal: "bg-green-100 text-green-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  stressabbau: "Stressabbau",
  "kinder-entwicklung": "Kinder-Entwicklung",
  kreativitaet: "Kreativität",
  ratgeber: "Ratgeber",
  saisonal: "Saisonal",
};

export default function AdminBlog() {
  const [articles, setArticles] = useState<ArticleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      setArticles([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`"${title}" wirklich löschen?`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Fehler beim Löschen");
        return;
      }

      loadArticles();
    } catch {
      alert("Netzwerkfehler beim Löschen");
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1D1448]">Blog verwalten</h1>
        <Link
          href="/admin/blog/neu"
          className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Neuer Artikel
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">Laden...</div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Keine Blog-Artikel vorhanden.{" "}
            <Link
              href="/admin/blog/neu"
              className="text-[#E8490F] hover:underline"
            >
              Jetzt den ersten Artikel erstellen
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Titel</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Kategorie
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Datum</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => {
                const isLive =
                  article.status === "live" && !!article.publishedAt;
                const categoryStyle =
                  CATEGORY_STYLES[article.category] ||
                  "bg-gray-100 text-gray-600";
                const categoryLabel =
                  CATEGORY_LABELS[article.category] || article.category;

                return (
                  <tr
                    key={article.slug}
                    className={`border-b border-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    {/* Title */}
                    <td className="px-4 py-3">
                      <div>
                        <span className="font-medium text-[#1D1448]">
                          {article.title}
                        </span>
                        <div className="mt-0.5 text-xs text-gray-400">
                          /{article.slug}/ &middot; {article.readingTime} Min.
                          Lesezeit
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryStyle}`}
                      >
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          isLive
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {isLive ? "Live" : "Entwurf"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-500">
                      <div className="text-xs">
                        {isLive ? (
                          <>
                            <div>
                              Veröffentlicht: {formatDate(article.publishedAt)}
                            </div>
                            {article.updatedAt !== article.publishedAt && (
                              <div className="text-gray-400">
                                Aktualisiert: {formatDate(article.updatedAt)}
                              </div>
                            )}
                          </>
                        ) : (
                          <div>Erstellt: {formatDate(article.updatedAt)}</div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/blog/${article.slug}`}
                          className="text-xs text-[#E8490F] hover:underline"
                        >
                          Bearbeiten
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(article.slug, article.title)
                          }
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          Löschen
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Article count footer */}
      {!loading && articles.length > 0 && (
        <p className="mt-3 text-right text-xs text-gray-400">
          {articles.length} Artikel gesamt
        </p>
      )}
    </div>
  );
}
