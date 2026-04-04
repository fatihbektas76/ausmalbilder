"use client";

import { useEffect, useState, useCallback } from "react";

interface ImageEntry {
  slug: string;
  title: string;
  category: string;
  difficulty: "einfach" | "mittel" | "komplex";
  thumbnailUrl: string;
  publishedAt: string;
  downloadCount?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  "tiere/pferd": "Pferd",
  mandala: "Mandala",
  "fantasie/drachen": "Drachen",
  "natur/blume": "Blume & Natur",
  "saisonal/weihnachten": "Weihnachten",
  "saisonal/ostern": "Ostern",
  "saisonal/halloween": "Halloween",
  "saisonal/herbst": "Herbst",
  "saisonal/fruehling": "Frühling",
  "tiere/dino": "Dino",
  "tiere/hund": "Hund",
  "fantasie/meerjungfrau": "Meerjungfrau",
  "fantasie/prinzessin": "Prinzessin",
  "tiere/schmetterling": "Schmetterling",
  erwachsene: "Erwachsene",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  einfach: "bg-green-100 text-green-700",
  mittel: "bg-amber-100 text-amber-700",
  komplex: "bg-red-100 text-red-700",
};

export default function AdminImages() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const loadImages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter) params.set("category", categoryFilter);
    if (statusFilter) params.set("status", statusFilter);

    try {
      const res = await fetch(`/api/admin/images?${params}`);
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setImages([]);
    }
    setLoading(false);
  }, [categoryFilter, statusFilter]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const filtered = search
    ? images.filter((img) =>
        img.title.toLowerCase().includes(search.toLowerCase())
      )
    : images;

  const handleToggleStatus = async (slug: string, currentlyLive: boolean) => {
    await fetch(`/api/admin/images/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: currentlyLive ? "draft" : "live" }),
    });
    loadImages();
  };

  const handleSaveTitle = async (slug: string) => {
    await fetch(`/api/admin/images/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle }),
    });
    setEditingSlug(null);
    loadImages();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`"${slug}" wirklich löschen?`)) return;
    await fetch(`/api/admin/images/${slug}`, { method: "DELETE" });
    loadImages();
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1D1448]">
        Bilder verwalten
      </h1>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Suche nach Titel..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
        >
          <option value="">Alle Kategorien</option>
          {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
            <option key={slug} value={slug}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
        >
          <option value="">Alle Status</option>
          <option value="live">Live</option>
          <option value="draft">Entwurf</option>
        </select>

        <span className="ml-auto text-sm text-gray-400">
          {filtered.length} Bilder
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Laden...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Keine Bilder gefunden
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Bild</th>
                <th className="px-4 py-3 font-medium text-gray-500">Titel</th>
                <th className="px-4 py-3 font-medium text-gray-500">Kategorie</th>
                <th className="px-4 py-3 font-medium text-gray-500">Schwierigkeit</th>
                <th className="px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 font-medium text-gray-500">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((img, i) => {
                const isLive = !!img.publishedAt;
                const isEditing = editingSlug === img.slug;
                return (
                  <tr
                    key={img.slug}
                    className={`border-b border-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    {/* Thumbnail */}
                    <td className="px-4 py-2">
                      <div className="h-14 w-10 overflow-hidden rounded bg-gray-100">
                        {img.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img.thumbnailUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[8px] text-gray-300">
                            —
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveTitle(img.slug);
                              if (e.key === "Escape") setEditingSlug(null);
                            }}
                            className="rounded border border-[#E8490F] px-2 py-1 text-sm focus:outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveTitle(img.slug)}
                            className="rounded bg-[#E8490F] px-2 py-1 text-xs text-white"
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <span
                          onDoubleClick={() => {
                            setEditingSlug(img.slug);
                            setEditTitle(img.title);
                          }}
                          className="cursor-pointer text-[#1D1448] hover:text-[#E8490F]"
                          title="Doppelklick zum Bearbeiten"
                        >
                          {img.title}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-2 text-gray-500">
                      {CATEGORY_LABELS[img.category] || img.category}
                    </td>

                    {/* Difficulty */}
                    <td className="px-4 py-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          DIFFICULTY_STYLES[img.difficulty] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {img.difficulty}
                      </span>
                    </td>

                    {/* Status toggle */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleStatus(img.slug, isLive)}
                        className={`rounded-full px-3 py-0.5 text-xs font-medium transition-colors ${
                          isLive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        }`}
                      >
                        {isLive ? "Live" : "Entwurf"}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(img.slug)}
                        className="text-xs text-gray-400 hover:text-red-500"
                        title="Löschen"
                      >
                        Löschen
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
