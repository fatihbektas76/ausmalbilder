"use client";

import { useEffect, useState, useCallback } from "react";

interface ImageEntry {
  slug: string;
  title: string;
  titleDE?: string;
  titleEN?: string;
  category: string;
  difficulty: "einfach" | "mittel" | "komplex";
  ageMin: number;
  ageMax?: number;
  style: string;
  thumbnailUrl: string;
  publishedAt: string;
  downloadCount?: number;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  einfach: "bg-green-100 text-green-700",
  mittel: "bg-amber-100 text-amber-700",
  komplex: "bg-red-100 text-red-700",
};

const DIFFICULTIES = ["einfach", "mittel", "komplex"] as const;
const STYLES = ["cartoon", "realistisch", "mandala", "geometrisch"] as const;

export default function AdminImages() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [editData, setEditData] = useState<
    Partial<ImageEntry> & { titleDE?: string; titleEN?: string }
  >({});
  const [saving, setSaving] = useState(false);
  const [categoryLabels, setCategoryLabels] = useState<
    Record<string, string>
  >({});
  const [allCategories, setAllCategories] = useState<
    { slug: string; name: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        const cats = data.categories || [];
        const labels: Record<string, string> = {};
        cats.forEach((c: any) => {
          labels[c.slug] = c.name;
        });
        setCategoryLabels(labels);
        setAllCategories(
          cats.map((c: any) => ({ slug: c.slug, name: c.name }))
        );
      })
      .catch(() => {});
  }, []);

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
    ? images.filter(
        (img) =>
          img.title.toLowerCase().includes(search.toLowerCase()) ||
          (img.titleDE || "").toLowerCase().includes(search.toLowerCase()) ||
          (img.titleEN || "").toLowerCase().includes(search.toLowerCase())
      )
    : images;

  const handleToggleStatus = async (
    slug: string,
    currentlyLive: boolean
  ) => {
    await fetch(`/api/admin/images/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: currentlyLive ? "draft" : "live" }),
    });
    loadImages();
  };

  const handleExpand = (img: ImageEntry) => {
    if (expandedSlug === img.slug) {
      setExpandedSlug(null);
      return;
    }
    setExpandedSlug(img.slug);
    setEditData({
      title: img.title,
      titleDE: img.titleDE || img.title,
      titleEN: img.titleEN || "",
      category: img.category,
      difficulty: img.difficulty,
      ageMin: img.ageMin,
      ageMax: img.ageMax,
      style: img.style,
    });
  };

  const handleSave = async () => {
    if (!expandedSlug) return;
    setSaving(true);
    await fetch(`/api/admin/images/${expandedSlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setSaving(false);
    setExpandedSlug(null);
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
          placeholder="Suche nach Titel (DE/EN)..."
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
        >
          <option value="">Alle Kategorien</option>
          {allCategories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
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
                <th className="px-4 py-3 font-medium text-gray-500">
                  Titel DE
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Titel EN
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Kategorie
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Schwierigkeit
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((img, i) => {
                const isLive = !!img.publishedAt;
                const isExpanded = expandedSlug === img.slug;

                return (
                  <tr
                    key={img.slug}
                    className={`border-b border-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    {!isExpanded ? (
                      <>
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

                        {/* Title DE */}
                        <td className="px-4 py-2">
                          <span className="text-[#1D1448]">
                            {img.titleDE || img.title}
                          </span>
                        </td>

                        {/* Title EN */}
                        <td className="px-4 py-2">
                          <span className="text-gray-500">
                            {img.titleEN || (
                              <span className="text-gray-300">—</span>
                            )}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-2 text-gray-500">
                          {categoryLabels[img.category] || img.category}
                        </td>

                        {/* Difficulty */}
                        <td className="px-4 py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              DIFFICULTY_STYLES[img.difficulty] ||
                              "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {img.difficulty}
                          </span>
                        </td>

                        {/* Status toggle */}
                        <td className="px-4 py-2">
                          <button
                            onClick={() =>
                              handleToggleStatus(img.slug, isLive)
                            }
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
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleExpand(img)}
                              className="text-xs text-[#E8490F] hover:underline"
                            >
                              Bearbeiten
                            </button>
                            <button
                              onClick={() => handleDelete(img.slug)}
                              className="text-xs text-gray-400 hover:text-red-500"
                            >
                              Löschen
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      /* Expanded edit row */
                      <td colSpan={7} className="px-4 py-4">
                        <div className="rounded-lg border border-[#E8490F]/20 bg-[#FEF0EB]/30 p-4">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-[#1D1448]">
                              Bearbeiten: {img.titleDE || img.title}
                            </h3>
                            <button
                              onClick={() => setExpandedSlug(null)}
                              className="text-xs text-gray-400 hover:text-gray-600"
                            >
                              Abbrechen
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {/* Title DE */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Titel DE
                              </label>
                              <input
                                type="text"
                                value={editData.titleDE || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    titleDE: e.target.value,
                                    title: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              />
                            </div>

                            {/* Title EN */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Titel EN
                              </label>
                              <input
                                type="text"
                                value={editData.titleEN || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    titleEN: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              />
                            </div>

                            {/* Category */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Kategorie
                              </label>
                              <select
                                value={editData.category || ""}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    category: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              >
                                {allCategories.map((c) => (
                                  <option key={c.slug} value={c.slug}>
                                    {c.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Difficulty */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Schwierigkeit
                              </label>
                              <select
                                value={editData.difficulty || "einfach"}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    difficulty: e.target
                                      .value as ImageEntry["difficulty"],
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              >
                                {DIFFICULTIES.map((d) => (
                                  <option key={d} value={d}>
                                    {d.charAt(0).toUpperCase() + d.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Age Min */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Alter ab (Jahre)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={99}
                                value={editData.ageMin || 3}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    ageMin: parseInt(e.target.value) || 3,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              />
                            </div>

                            {/* Style */}
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-500">
                                Stil
                              </label>
                              <select
                                value={editData.style || "cartoon"}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    style: e.target.value,
                                  })
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                              >
                                {STYLES.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={handleSave}
                              disabled={saving}
                              className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                            >
                              {saving ? "Speichern..." : "Speichern"}
                            </button>
                            <button
                              onClick={() => setExpandedSlug(null)}
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                            >
                              Abbrechen
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
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
