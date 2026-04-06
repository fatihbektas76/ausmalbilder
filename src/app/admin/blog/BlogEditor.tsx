"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { BlogArticle, BlogCategory } from "@/data/types";

interface BlogEditorProps {
  article?: BlogArticle;
}

const CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: "stressabbau", label: "Stressabbau" },
  { value: "kinder-entwicklung", label: "Kinder-Entwicklung" },
  { value: "kreativitaet", label: "Kreativität" },
  { value: "ratgeber", label: "Ratgeber" },
  { value: "saisonal", label: "Saisonal" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogEditor({ article }: BlogEditorProps) {
  const router = useRouter();
  const isEditMode = !!article;

  // Form state
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [titleSeo, setTitleSeo] = useState(article?.titleSeo || "");
  const [metaTitle, setMetaTitle] = useState(article?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    article?.metaDescription || ""
  );
  const [category, setCategory] = useState<BlogCategory>(
    article?.category || "ratgeber"
  );
  const [tagsInput, setTagsInput] = useState(
    article?.tags?.join(", ") || ""
  );
  const [author, setAuthor] = useState(
    article?.author || "Redaktion Ausmalbilder Gratis"
  );
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [featuredImage, setFeaturedImage] = useState(
    article?.featuredImage || ""
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    article?.featuredImageAlt || ""
  );
  const [content, setContent] = useState(article?.content || "");
  const [faq, setFaq] = useState<{ question: string; answer: string }[]>(
    article?.faq || []
  );
  const [status, setStatus] = useState<"draft" | "live">(
    article?.status || "draft"
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-generate fields from title
  const handleTitleChange = useCallback(
    (value: string) => {
      setTitle(value);
      if (!isEditMode || !article?.slug) {
        setSlug(slugify(value));
      }
      setTitleSeo(value);
      setMetaTitle(value.slice(0, 60));
      if (!metaDescription) {
        setMetaDescription(value.slice(0, 160));
      }
    },
    [isEditMode, article?.slug, metaDescription]
  );

  // FAQ management
  const addFaq = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const removeFaq = (index: number) => {
    setFaq(faq.filter((_, i) => i !== index));
  };

  const updateFaq = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const updated = [...faq];
    updated[index] = { ...updated[index], [field]: value };
    setFaq(updated);
  };

  // Save
  const handleSave = async (saveStatus: "draft" | "live") => {
    setError("");
    setSuccessMsg("");
    setSaving(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Filter out empty FAQ entries
    const cleanFaq = faq.filter(
      (f) => f.question.trim() && f.answer.trim()
    );

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      titleSeo: titleSeo.trim() || title.trim(),
      metaTitle: metaTitle.trim() || title.trim().slice(0, 60),
      metaDescription: metaDescription.trim(),
      category,
      tags,
      author: author.trim() || "Redaktion Ausmalbilder Gratis",
      excerpt: excerpt.trim(),
      featuredImage: featuredImage.trim(),
      featuredImageAlt: featuredImageAlt.trim(),
      content: content.trim(),
      faq: cleanFaq,
      status: saveStatus,
      relatedArticles: article?.relatedArticles || [],
      relatedImages: article?.relatedImages || [],
    };

    try {
      let res: Response;

      if (isEditMode && article) {
        res = await fetch(`/api/admin/blog/${article.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Fehler beim Speichern");
        setSaving(false);
        return;
      }

      setSuccessMsg(
        saveStatus === "live"
          ? "Artikel veröffentlicht!"
          : "Entwurf gespeichert!"
      );

      // Redirect to list after short delay
      setTimeout(() => {
        router.push("/admin/blog");
      }, 1000);
    } catch {
      setError("Netzwerkfehler beim Speichern");
    }

    setSaving(false);
  };

  // Word count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1D1448]">
            {isEditMode ? "Artikel bearbeiten" : "Neuer Artikel"}
          </h1>
          {isEditMode && (
            <p className="mt-1 text-sm text-gray-400">
              Zuletzt aktualisiert:{" "}
              {article?.updatedAt
                ? new Date(article.updatedAt).toLocaleString("de-DE")
                : "—"}
            </p>
          )}
        </div>
        <button
          onClick={() => router.push("/admin/blog")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Zurück zur Liste
        </button>
      </div>

      {/* Error / Success messages */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left column — Form fields */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic info card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1D1448]">
              Grundinformationen
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Titel <span className="text-[#E8490F]">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Artikeltitel eingeben..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  URL-Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    /blog/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="auto-generiert"
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                  />
                  <span className="text-xs text-gray-400">/</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Kategorie <span className="text-[#E8490F]">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as BlogCategory)
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Redaktion Ausmalbilder Gratis"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Tags (kommagetrennt)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="ausmalen, kinder, kreativität"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                />
                {tagsInput && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {tagsInput
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Auszug (Excerpt)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Kurze Zusammenfassung des Artikels (2-3 Sätze)..."
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                />
              </div>

              {/* Featured Image */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Featured Image URL
                  </label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://assets.ausmalbilder-gratis.com/blog/..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Image Alt-Text
                  </label>
                  <input
                    type="text"
                    value={featuredImageAlt}
                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                    placeholder="Beschreibung des Bildes..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content card — side by side editor + preview */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1D1448]">
                Inhalt (Markdown)
              </h2>
              <span className="text-xs text-gray-400">
                {wordCount} Wörter &middot; ~{readingTime} Min. Lesezeit
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Editor */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Markdown-Editor
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={"# Überschrift\n\nDein Artikeltext hier...\n\n## Unterüberschrift\n\n- Aufzählung 1\n- Aufzählung 2"}
                  rows={24}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm leading-relaxed focus:border-[#E8490F] focus:outline-none"
                />
              </div>

              {/* Live Preview */}
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">
                  Live-Vorschau
                </label>
                <div className="h-[calc(24*1.5rem+1.25rem)] overflow-auto rounded-lg border border-gray-200 bg-[#F7F6F2] px-4 py-3">
                  {content.trim() ? (
                    <div className="prose prose-sm max-w-none prose-headings:text-[#1D1448] prose-a:text-[#E8490F] prose-strong:text-[#1D1448]">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm italic text-gray-400">
                      Die Vorschau erscheint hier, sobald du Text eingibst...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* FAQ card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1D1448]">
                FAQ-Bereich
              </h2>
              <button
                type="button"
                onClick={addFaq}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                FAQ hinzufügen
              </button>
            </div>

            {faq.length === 0 ? (
              <p className="text-sm text-gray-400">
                Noch keine FAQ-Einträge. Klicke &quot;FAQ hinzufügen&quot; um zu
                starten.
              </p>
            ) : (
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 bg-gray-50/50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500">
                        FAQ #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) =>
                          updateFaq(index, "question", e.target.value)
                        }
                        placeholder="Frage..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                      />
                      <textarea
                        value={item.answer}
                        onChange={(e) =>
                          updateFaq(index, "answer", e.target.value)
                        }
                        placeholder="Antwort..."
                        rows={2}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — SEO Preview + Actions */}
        <div className="space-y-6">
          {/* Actions card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1D1448]">
              Veröffentlichung
            </h2>

            <div className="mb-4 flex items-center gap-2">
              <span className="text-xs text-gray-500">Status:</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  status === "live"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {status === "live" ? "Live" : "Entwurf"}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleSave("draft")}
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                {saving ? "Speichern..." : "Als Entwurf speichern"}
              </button>
              <button
                onClick={() => handleSave("live")}
                disabled={saving}
                className="w-full rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Speichern..." : "Veröffentlichen"}
              </button>
            </div>

            {isEditMode && article?.publishedAt && (
              <p className="mt-3 text-xs text-gray-400">
                Veröffentlicht am:{" "}
                {new Date(article.publishedAt).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            )}
          </div>

          {/* SEO Preview card */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#1D1448]">
              SEO-Vorschau
            </h2>

            {/* Google snippet preview */}
            <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
              <div className="mb-1 text-xs text-gray-400">
                Google-Suchergebnis
              </div>
              <div
                className="truncate text-lg leading-snug"
                style={{ color: "#1a0dab" }}
              >
                {metaTitle || title || "Seitentitel"}
                {metaTitle
                  ? " | Ausmalbilder Gratis"
                  : ""}
              </div>
              <div className="mt-0.5 truncate text-sm text-green-700">
                ausmalbilder-gratis.com/blog/{slug || "artikel-slug"}/
              </div>
              <div className="mt-1 text-sm leading-snug text-gray-600">
                {metaDescription ||
                  excerpt ||
                  "Meta-Beschreibung eingeben..."}
              </div>
            </div>

            {/* Meta Title */}
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">
                  Meta-Titel
                </label>
                <span
                  className={`text-xs ${
                    metaTitle.length > 60
                      ? "font-medium text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {metaTitle.length}/60
                </span>
              </div>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder="SEO-Titel (max. 60 Zeichen)"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              />
              {metaTitle.length > 60 && (
                <p className="mt-1 text-xs text-red-500">
                  Titel ist zu lang — wird in Google abgeschnitten.
                </p>
              )}
            </div>

            {/* Title SEO */}
            <div className="mb-3">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                SEO-Titel (H1)
              </label>
              <input
                type="text"
                value={titleSeo}
                onChange={(e) => setTitleSeo(e.target.value)}
                placeholder="Wird als H1 auf der Seite angezeigt"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              />
            </div>

            {/* Meta Description */}
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">
                  Meta-Beschreibung
                </label>
                <span
                  className={`text-xs ${
                    metaDescription.length > 160
                      ? "font-medium text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {metaDescription.length}/160
                </span>
              </div>
              <textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder="SEO-Beschreibung (max. 160 Zeichen)"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
              />
              {metaDescription.length > 160 && (
                <p className="mt-1 text-xs text-red-500">
                  Beschreibung ist zu lang — wird in Google abgeschnitten.
                </p>
              )}
            </div>
          </div>

          {/* Featured Image Preview */}
          {featuredImage && (
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-[#1D1448]">
                Bild-Vorschau
              </h2>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImage}
                  alt={featuredImageAlt || "Vorschau"}
                  className="h-auto w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              {featuredImageAlt && (
                <p className="mt-2 text-xs text-gray-400">
                  Alt: {featuredImageAlt}
                </p>
              )}
            </div>
          )}

          {/* Article info */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-lg font-semibold text-[#1D1448]">
              Info
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Wörter</dt>
                <dd className="font-medium text-[#1D1448]">{wordCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Lesezeit</dt>
                <dd className="font-medium text-[#1D1448]">
                  ~{readingTime} Min.
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">FAQ-Einträge</dt>
                <dd className="font-medium text-[#1D1448]">{faq.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Tags</dt>
                <dd className="font-medium text-[#1D1448]">
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean).length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
