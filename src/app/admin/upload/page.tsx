"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const DIFFICULTIES = ["einfach", "mittel", "komplex"] as const;
const AGES = [
  { key: "2", label: "ab 2 Jahren" },
  { key: "4", label: "ab 4 Jahren" },
  { key: "6", label: "ab 6 Jahren" },
  { key: "8", label: "ab 8 Jahren" },
  { key: "erwachsene", label: "Erwachsene" },
];

const ACCEPTED = ".jpeg,.jpg,.png,.webp,.svg,.pdf";

type AiStatus = "idle" | "analyzing" | "done" | "error";

interface QueueItem {
  file: File;
  titleDE: string;
  titleEN: string;
  category: string;
  difficulty: string;
  aiStatus: AiStatus;
  aiConfidence: number;
  aiCategoryMismatch: boolean;
  uploadStatus: "pending" | "processing" | "uploading" | "done" | "error";
  error?: string;
  preview?: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data:... prefix
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMediaType(
  file: File
): "image/jpeg" | "image/png" | "image/webp" | "image/gif" {
  const typeMap: Record<string, string> = {
    "image/jpeg": "image/jpeg",
    "image/jpg": "image/jpeg",
    "image/png": "image/png",
    "image/webp": "image/webp",
    "image/svg+xml": "image/png", // SVG fallback
  };
  return (typeMap[file.type] || "image/jpeg") as any;
}

const DIFFICULTY_STYLES: Record<string, string> = {
  einfach: "bg-green-100 text-green-700",
  mittel: "bg-amber-100 text-amber-700",
  komplex: "bg-red-100 text-red-700",
};

export default function AdminUpload() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [categories, setCategories] = useState<
    { key: string; label: string }[]
  >([]);
  const [defaultCategory, setDefaultCategory] = useState("");
  const [defaultAge, setDefaultAge] = useState("4");
  const [defaultStatus, setDefaultStatus] = useState<"draft" | "live">(
    "draft"
  );
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ done: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data) => {
        const allCats = data.categories || [];
        const uploadable = allCats
          .filter((c: any) => {
            const isParentOnly = allCats.some(
              (other: any) => other.parentSlug === c.slug
            );
            return c.parentSlug || !isParentOnly;
          })
          .map((c: any) => ({ key: c.slug, label: c.name }));
        setCategories(uploadable);
        if (uploadable.length > 0) setDefaultCategory(uploadable[0].key);
      })
      .catch(() => {});
  }, []);

  const analyzeImage = useCallback(
    async (file: File, index: number) => {
      // Skip non-image files (PDF)
      if (!file.type.startsWith("image/")) {
        setQueue((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, aiStatus: "done" as const, aiConfidence: 0 } : item
          )
        );
        return;
      }

      setQueue((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, aiStatus: "analyzing" as const } : item
        )
      );

      try {
        const base64 = await fileToBase64(file);
        const mediaType = getMediaType(file);

        const res = await fetch("/api/admin/analyze-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64, mediaType }),
        });

        if (!res.ok) throw new Error("API Fehler");

        const result = await res.json();

        setQueue((prev) =>
          prev.map((item, i) => {
            if (i !== index) return item;
            const categoryMismatch =
              defaultCategory && result.category !== defaultCategory;
            return {
              ...item,
              titleDE: result.titleDE || item.titleDE,
              titleEN: result.titleEN || "",
              category: result.category || item.category,
              difficulty: result.difficulty || item.difficulty,
              aiStatus: "done" as const,
              aiConfidence: result.confidence || 0.5,
              aiCategoryMismatch: !!categoryMismatch,
            };
          })
        );
      } catch {
        setQueue((prev) =>
          prev.map((item, i) =>
            i === index ? { ...item, aiStatus: "error" as const } : item
          )
        );
      }
    },
    [defaultCategory]
  );

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const startIndex = queue.length;
      const items: QueueItem[] = Array.from(files).map((file) => ({
        file,
        titleDE: "",
        titleEN: "",
        category: defaultCategory,
        difficulty: "einfach",
        aiStatus: "idle" as const,
        aiConfidence: 0,
        aiCategoryMismatch: false,
        uploadStatus: "pending" as const,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setQueue((prev) => [...prev, ...items]);

      // Trigger AI analysis for all new files
      items.forEach((item, i) => {
        analyzeImage(item.file, startIndex + i);
      });
    },
    [defaultCategory, queue.length, analyzeImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
        e.target.value = "";
      }
    },
    [addFiles]
  );

  const updateItem = (index: number, updates: Partial<QueueItem>) => {
    setQueue((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);
    const total = queue.filter(
      (q) => q.uploadStatus !== "done"
    ).length;
    setUploadProgress({ done: 0, total });

    let doneCount = 0;

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.uploadStatus === "done") continue;

      setQueue((prev) =>
        prev.map((q, idx) =>
          idx === i ? { ...q, uploadStatus: "processing" } : q
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("category", item.category);
        formData.append("difficulty", item.difficulty);
        formData.append("age", defaultAge);
        formData.append("titleDE", item.titleDE);
        formData.append("titleEN", item.titleEN);
        formData.append("title", item.titleDE); // backward compat
        formData.append("status", defaultStatus);

        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, uploadStatus: "uploading" } : q
          )
        );

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Upload fehlgeschlagen");
        }

        doneCount++;
        setUploadProgress({ done: doneCount, total });

        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, uploadStatus: "done" } : q
          )
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i
              ? {
                  ...q,
                  uploadStatus: "error",
                  error: (err as Error).message,
                }
              : q
          )
        );
      }
    }

    setUploading(false);
  };

  const pendingCount = queue.filter(
    (q) => q.uploadStatus === "pending" || q.uploadStatus === "error"
  ).length;
  const doneCount = queue.filter((q) => q.uploadStatus === "done").length;
  const analyzingCount = queue.filter(
    (q) => q.aiStatus === "analyzing"
  ).length;
  const allAnalyzed = queue.length > 0 && analyzingCount === 0;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1D1448]">
        Bilder hochladen
      </h1>

      {/* Global settings row */}
      <div className="mb-6 grid grid-cols-3 gap-4 rounded-xl bg-white p-4 shadow-sm">
        {/* Default Category */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Standard-Kategorie (KI erkennt automatisch)
          </label>
          <select
            value={defaultCategory}
            onChange={(e) => setDefaultCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Age */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Alter ab
          </label>
          <select
            value={defaultAge}
            onChange={(e) => setDefaultAge(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
          >
            {AGES.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Default Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Status
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setDefaultStatus("draft")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                defaultStatus === "draft"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Entwurf
            </button>
            <button
              onClick={() => setDefaultStatus("live")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                defaultStatus === "live"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Live
            </button>
          </div>
        </div>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-colors ${
          isDragging
            ? "border-[#E8490F] bg-[#E8490F]/5"
            : "border-gray-300 bg-white hover:border-[#E8490F]/50"
        }`}
      >
        <svg
          className={`mb-3 h-12 w-12 ${isDragging ? "text-[#E8490F]" : "text-gray-400"}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
        <p className="text-sm font-medium text-gray-600">
          JPEG, PNG, WebP, SVG oder PDF hierher ziehen — oder klicken
        </p>
        <p className="mt-1 text-xs text-gray-400">
          KI erkennt Motive automatisch und generiert Titel auf Deutsch + Englisch
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* AI analysis status banner */}
      {analyzingCount > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-3">
          <svg
            className="h-5 w-5 animate-spin text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-sm text-blue-700">
            KI analysiert {analyzingCount} Bild
            {analyzingCount !== 1 ? "er" : ""}...
          </span>
        </div>
      )}

      {/* Upload progress bar */}
      {uploading && uploadProgress.total > 0 && (
        <div className="mb-4">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>
              {uploadProgress.done} von {uploadProgress.total} hochgeladen
            </span>
            <span>
              {Math.round(
                (uploadProgress.done / uploadProgress.total) * 100
              )}
              %
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#E8490F] transition-all"
              style={{
                width: `${(uploadProgress.done / uploadProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Review table */}
      {queue.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {queue.length} Datei{queue.length !== 1 ? "en" : ""} in der
              Warteschlange
              {doneCount > 0 && ` (${doneCount} fertig)`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setQueue([])}
                className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-500 hover:bg-gray-50"
              >
                Alle entfernen
              </button>
              <button
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0 || !allAnalyzed}
                className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {uploading
                  ? "Wird hochgeladen..."
                  : `${pendingCount} hochladen`}
              </button>
            </div>
          </div>

          {/* Batch review table */}
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="w-16 px-3 py-3 font-medium text-gray-500">
                    Bild
                  </th>
                  <th className="px-3 py-3 font-medium text-gray-500">
                    Titel DE
                  </th>
                  <th className="px-3 py-3 font-medium text-gray-500">
                    Titel EN
                  </th>
                  <th className="w-36 px-3 py-3 font-medium text-gray-500">
                    Kategorie
                  </th>
                  <th className="w-28 px-3 py-3 font-medium text-gray-500">
                    Schwierigkeit
                  </th>
                  <th className="w-24 px-3 py-3 font-medium text-gray-500">
                    KI
                  </th>
                  <th className="w-24 px-3 py-3 font-medium text-gray-500">
                    Status
                  </th>
                  <th className="w-12 px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {queue.map((item, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-50 ${
                      item.aiCategoryMismatch ? "bg-orange-50/50" : ""
                    }`}
                  >
                    {/* Preview */}
                    <td className="px-3 py-2">
                      <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-gray-100">
                        {item.preview ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.preview}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            PDF
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title DE (editable) */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.titleDE}
                        onChange={(e) =>
                          updateItem(i, { titleDE: e.target.value })
                        }
                        placeholder={
                          item.aiStatus === "analyzing"
                            ? "KI analysiert..."
                            : "Titel deutsch"
                        }
                        disabled={item.uploadStatus === "done"}
                        className="w-full rounded border border-transparent px-2 py-1 text-sm text-[#1D1448] hover:border-gray-200 focus:border-[#E8490F] focus:outline-none disabled:opacity-50"
                      />
                    </td>

                    {/* Title EN (editable) */}
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={item.titleEN}
                        onChange={(e) =>
                          updateItem(i, { titleEN: e.target.value })
                        }
                        placeholder={
                          item.aiStatus === "analyzing"
                            ? "AI analyzing..."
                            : "Title english"
                        }
                        disabled={item.uploadStatus === "done"}
                        className="w-full rounded border border-transparent px-2 py-1 text-sm text-[#1D1448] hover:border-gray-200 focus:border-[#E8490F] focus:outline-none disabled:opacity-50"
                      />
                    </td>

                    {/* Category (dropdown) */}
                    <td className="px-3 py-2">
                      <select
                        value={item.category}
                        onChange={(e) =>
                          updateItem(i, {
                            category: e.target.value,
                            aiCategoryMismatch: false,
                          })
                        }
                        disabled={item.uploadStatus === "done"}
                        className={`w-full rounded border px-2 py-1 text-xs focus:border-[#E8490F] focus:outline-none disabled:opacity-50 ${
                          item.aiCategoryMismatch
                            ? "border-orange-300 bg-orange-50"
                            : "border-transparent"
                        }`}
                      >
                        {categories.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Difficulty (dropdown) */}
                    <td className="px-3 py-2">
                      <select
                        value={item.difficulty}
                        onChange={(e) =>
                          updateItem(i, { difficulty: e.target.value })
                        }
                        disabled={item.uploadStatus === "done"}
                        className="w-full rounded border border-transparent px-2 py-1 text-xs focus:border-[#E8490F] focus:outline-none disabled:opacity-50"
                      >
                        {DIFFICULTIES.map((d) => (
                          <option key={d} value={d}>
                            {d.charAt(0).toUpperCase() + d.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* AI Status */}
                    <td className="px-3 py-2">
                      {item.aiStatus === "idle" && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                      {item.aiStatus === "analyzing" && (
                        <span className="flex items-center gap-1 text-xs text-blue-500">
                          <svg
                            className="h-3 w-3 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Analysiert
                        </span>
                      )}
                      {item.aiStatus === "done" &&
                        item.aiConfidence >= 0.7 && (
                          <span className="text-xs font-medium text-green-600">
                            Erkannt
                          </span>
                        )}
                      {item.aiStatus === "done" &&
                        item.aiConfidence > 0 &&
                        item.aiConfidence < 0.7 && (
                          <span className="text-xs font-medium text-orange-500">
                            Unsicher
                          </span>
                        )}
                      {item.aiStatus === "done" &&
                        item.aiConfidence === 0 && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      {item.aiStatus === "error" && (
                        <span className="text-xs text-red-500">Fehler</span>
                      )}
                    </td>

                    {/* Upload status */}
                    <td className="px-3 py-2 text-right">
                      {item.uploadStatus === "pending" && (
                        <span className="text-xs text-gray-400">Wartend</span>
                      )}
                      {item.uploadStatus === "processing" && (
                        <span className="text-xs text-amber-500">
                          Verarbeitet
                        </span>
                      )}
                      {item.uploadStatus === "uploading" && (
                        <span className="text-xs text-blue-500">
                          Hochladen
                        </span>
                      )}
                      {item.uploadStatus === "done" && (
                        <span className="text-xs font-medium text-green-600">
                          Fertig
                        </span>
                      )}
                      {item.uploadStatus === "error" && (
                        <span
                          className="text-xs text-red-500"
                          title={item.error}
                        >
                          Fehler
                        </span>
                      )}
                    </td>

                    {/* Remove */}
                    <td className="px-3 py-2">
                      {item.uploadStatus !== "done" && (
                        <button
                          onClick={() => removeFromQueue(i)}
                          className="text-gray-400 hover:text-red-500"
                          title="Entfernen"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          {queue.some((q) => q.aiCategoryMismatch) && (
            <p className="mt-3 text-xs text-orange-500">
              Orange markierte Zeilen: KI erkannte eine andere Kategorie als die
              Standard-Vorgabe — bitte prüfen.
            </p>
          )}
        </>
      )}
    </div>
  );
}
