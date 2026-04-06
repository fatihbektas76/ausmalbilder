"use client";

import { useEffect, useState, useCallback } from "react";

interface Category {
  name: string;
  slug: string;
  parentSlug?: string;
  description?: string;
  audience?: string;
  imageCount?: number;
}

function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  // New category form state
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentSlug, setParentSlug] = useState("");
  const [description, setDescription] = useState("");
  const [audience, setAudience] = useState("alle");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAudience, setEditAudience] = useState("alle");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const topLevelCategories = categories.filter((c) => !c.parentSlug);

  const fullSlug = parentSlug ? `${parentSlug}/${slug}` : slug;

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(nameToSlug(value));
  };

  const resetForm = () => {
    setName("");
    setSlug("");
    setParentSlug("");
    setDescription("");
    setAudience("alle");
    setShowForm(false);
  };

  const handleCreate = async () => {
    if (!name.trim() || !slug.trim()) return;

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: fullSlug,
          parentSlug: parentSlug || undefined,
          description: description.trim() || undefined,
          audience,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Fehler beim Erstellen");
        return;
      }

      resetForm();
      loadCategories();
    } catch {
      alert("Netzwerkfehler beim Erstellen");
    }
  };

  const handleStartEdit = (cat: Category) => {
    setEditingSlug(cat.slug);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditAudience(cat.audience || "alle");
  };

  const handleSaveEdit = async (originalSlug: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${originalSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || undefined,
          audience: editAudience,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Fehler beim Speichern");
        return;
      }

      setEditingSlug(null);
      loadCategories();
    } catch {
      alert("Netzwerkfehler beim Speichern");
    }
  };

  const handleDelete = async (categorySlug: string) => {
    const cat = categories.find((c) => c.slug === categorySlug);
    if (!confirm(`"${cat?.name || categorySlug}" wirklich löschen?`)) return;

    try {
      const res = await fetch(`/api/admin/categories/${categorySlug}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Fehler beim Löschen");
        return;
      }

      loadCategories();
    } catch {
      alert("Netzwerkfehler beim Löschen");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1D1448]">
          Kategorien verwalten
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          {showForm ? "Abbrechen" : "Neue Kategorie"}
        </button>
      </div>

      {/* New category form */}
      {showForm && (
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1D1448]">
            Neue Kategorie erstellen
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Name <span className="text-[#E8490F]">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="z.B. Pferd"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              />
            </div>

            {/* Parent category */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Übergeordnete Kategorie
              </label>
              <select
                value={parentSlug}
                onChange={(e) => setParentSlug(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              >
                <option value="">— Keine (Top-Level) —</option>
                {topLevelCategories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                URL-Pfad (Slug)
              </label>
              <div className="flex items-center gap-1">
                {parentSlug && (
                  <span className="text-sm text-gray-400">
                    {parentSlug}/
                  </span>
                )}
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generiert"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                />
              </div>
              {fullSlug && (
                <p className="mt-1 text-xs text-gray-400">
                  Vollständiger Pfad: /{fullSlug}/
                </p>
              )}
            </div>

            {/* Audience */}
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Zielgruppe
              </label>
              <div className="flex gap-3 pt-1">
                {[
                  { value: "kinder", label: "Kinder" },
                  { value: "erwachsene", label: "Erwachsene" },
                  { value: "alle", label: "Alle" },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-1.5 text-sm"
                  >
                    <input
                      type="radio"
                      name="audience"
                      value={opt.value}
                      checked={audience === opt.value}
                      onChange={(e) => setAudience(e.target.value)}
                      className="accent-[#E8490F]"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Beschreibung (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kurze Beschreibung der Kategorie..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              />
            </div>
          </div>

          {/* Form actions */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={handleCreate}
              disabled={!name.trim() || !slug.trim()}
              className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Erstellen
            </button>
            <button
              onClick={resetForm}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* Categories table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Laden...
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-400">
            Keine Kategorien vorhanden
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  URL-Pfad
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Übergeordnet
                </th>
                <th className="px-4 py-3 font-medium text-gray-500">Bilder</th>
                <th className="px-4 py-3 font-medium text-gray-500">
                  Aktionen
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => {
                const isEditing = editingSlug === cat.slug;
                const parentCat = cat.parentSlug
                  ? categories.find((c) => c.slug === cat.parentSlug)
                  : null;

                return (
                  <tr
                    key={cat.slug}
                    className={`border-b border-gray-50 ${
                      i % 2 === 1 ? "bg-gray-50/50" : ""
                    }`}
                  >
                    {/* Name */}
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(cat.slug);
                            if (e.key === "Escape") setEditingSlug(null);
                          }}
                          className="w-full rounded border border-[#E8490F] px-2 py-1 text-sm focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium text-[#1D1448]">
                          {cat.name}
                        </span>
                      )}
                    </td>

                    {/* Slug / URL path */}
                    <td className="px-4 py-2">
                      <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">
                        /{cat.slug}/
                      </code>
                    </td>

                    {/* Parent */}
                    <td className="px-4 py-2 text-gray-500">
                      {parentCat ? parentCat.name : "—"}
                    </td>

                    {/* Image count */}
                    <td className="px-4 py-2 text-gray-500">
                      {cat.imageCount ?? 0}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          {/* Description edit */}
                          <input
                            type="text"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Beschreibung"
                            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-[#E8490F] focus:outline-none"
                          />

                          {/* Audience edit */}
                          <select
                            value={editAudience}
                            onChange={(e) => setEditAudience(e.target.value)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-[#E8490F] focus:outline-none"
                          >
                            <option value="kinder">Kinder</option>
                            <option value="erwachsene">Erwachsene</option>
                            <option value="alle">Alle</option>
                          </select>

                          <button
                            onClick={() => handleSaveEdit(cat.slug)}
                            className="rounded bg-[#E8490F] px-2 py-1 text-xs text-white"
                          >
                            OK
                          </button>
                          <button
                            onClick={() => setEditingSlug(null)}
                            className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600"
                          >
                            Abbrechen
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          {/* Edit button (pencil icon) */}
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="text-gray-400 hover:text-[#E8490F]"
                            title="Bearbeiten"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                              />
                            </svg>
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(cat.slug)}
                            className="text-xs text-gray-400 hover:text-red-500"
                            title="Löschen"
                          >
                            Löschen
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Category count footer */}
      {!loading && categories.length > 0 && (
        <p className="mt-3 text-right text-xs text-gray-400">
          {categories.length} Kategorie{categories.length !== 1 ? "n" : ""}{" "}
          gesamt
        </p>
      )}
    </div>
  );
}
