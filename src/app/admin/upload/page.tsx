"use client";

import { useState, useRef, useCallback } from "react";

const CATEGORIES = [
  { key: "pferd", label: "Pferd" },
  { key: "mandala", label: "Mandala" },
  { key: "drachen", label: "Drachen" },
  { key: "blume-natur", label: "Blume & Natur" },
  { key: "weihnachten", label: "Weihnachten" },
  { key: "ostern", label: "Ostern" },
  { key: "halloween", label: "Halloween" },
  { key: "herbst", label: "Herbst" },
  { key: "fruehling", label: "Frühling" },
  { key: "dino", label: "Dino" },
  { key: "hund", label: "Hund" },
  { key: "meerjungfrau", label: "Meerjungfrau" },
  { key: "prinzessin", label: "Prinzessin" },
  { key: "schmetterling", label: "Schmetterling" },
  { key: "erwachsene", label: "Erwachsene" },
];

const DIFFICULTIES = ["einfach", "mittel", "komplex"] as const;
const AGES = [
  { key: "2", label: "ab 2 Jahren" },
  { key: "4", label: "ab 4 Jahren" },
  { key: "6", label: "ab 6 Jahren" },
  { key: "8", label: "ab 8 Jahren" },
  { key: "erwachsene", label: "Erwachsene" },
];

const ACCEPTED = ".jpeg,.jpg,.png,.webp,.svg,.pdf";

interface QueueItem {
  file: File;
  title: string;
  status: "pending" | "processing" | "uploading" | "done" | "error";
  error?: string;
  preview?: string;
}

function filenameToTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s*\(\d+\)\s*/g, "")
    .replace(/\s*(?:FINAL|final|copy|Copy|COPY)\s*/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function AdminUpload() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [category, setCategory] = useState("pferd");
  const [difficulty, setDifficulty] = useState<string>("einfach");
  const [age, setAge] = useState("4");
  const [status, setStatus] = useState<"draft" | "live">("draft");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: FileList | File[]) => {
    const items: QueueItem[] = Array.from(files).map((file) => ({
      file,
      title: filenameToTitle(file.name),
      status: "pending" as const,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setQueue((prev) => [...prev, ...items]);
  }, []);

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
        e.target.value = ""; // reset so same file can be selected again
      }
    },
    [addFiles]
  );

  const updateTitle = (index: number, title: string) => {
    setQueue((prev) =>
      prev.map((item, i) => (i === index ? { ...item, title } : item))
    );
  };

  const removeFromQueue = (index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadAll = async () => {
    setUploading(true);

    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      if (item.status === "done") continue;

      // Update status to processing
      setQueue((prev) =>
        prev.map((q, idx) =>
          idx === i ? { ...q, status: "processing" } : q
        )
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        formData.append("category", category);
        formData.append("difficulty", difficulty);
        formData.append("age", age);
        formData.append("title", item.title);
        formData.append("status", status);

        // Update to uploading
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: "uploading" } : q
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

        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i ? { ...q, status: "done" } : q
          )
        );
      } catch (err) {
        setQueue((prev) =>
          prev.map((q, idx) =>
            idx === i
              ? { ...q, status: "error", error: (err as Error).message }
              : q
          )
        );
      }
    }

    setUploading(false);
  };

  const publishAll = async () => {
    const doneSlugs = queue
      .filter((q) => q.status === "done")
      .map((q) =>
        q.title
          .toLowerCase()
          .replace(/[^a-z0-9äöüß]+/g, "-")
          .replace(/^-|-$/g, "")
      );

    // This is a simplified approach — the actual slugs are generated server-side
    // For batch publish, we'd need to track the returned slugs
    alert(
      `${doneSlugs.length} Bilder wurden hochgeladen. Status kann in der Verwaltung geändert werden.`
    );
  };

  const pendingCount = queue.filter(
    (q) => q.status === "pending" || q.status === "error"
  ).length;
  const doneCount = queue.filter((q) => q.status === "done").length;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-[#1D1448]">
        Bilder hochladen
      </h1>

      {/* Settings row */}
      <div className="mb-6 grid grid-cols-4 gap-4 rounded-xl bg-white p-4 shadow-sm">
        {/* Category */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Kategorie
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Schwierigkeit
          </label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  difficulty === d
                    ? d === "einfach"
                      ? "bg-green-100 text-green-700"
                      : d === "mittel"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Alter
          </label>
          <select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#E8490F] focus:outline-none"
          >
            {AGES.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">
            Status
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setStatus("draft")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                status === "draft"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Entwurf
            </button>
            <button
              onClick={() => setStatus("live")}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                status === "live"
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
          Mehrere Dateien gleichzeitig möglich
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

      {/* Queue */}
      {queue.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {queue.length} Datei{queue.length !== 1 ? "en" : ""} in der
              Warteschlange
              {doneCount > 0 && ` (${doneCount} fertig)`}
            </p>
            <div className="flex gap-2">
              {doneCount > 0 && (
                <button
                  onClick={publishAll}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Alle veröffentlichen
                </button>
              )}
              <button
                onClick={uploadAll}
                disabled={uploading || pendingCount === 0}
                className="rounded-lg bg-[#E8490F] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {uploading
                  ? "Wird hochgeladen..."
                  : `${pendingCount} hochladen`}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {queue.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-lg bg-white p-3 shadow-sm"
              >
                {/* Preview */}
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

                {/* Title (editable) */}
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateTitle(i, e.target.value)}
                  className="flex-1 rounded border border-transparent px-2 py-1 text-sm text-[#1D1448] hover:border-gray-200 focus:border-[#E8490F] focus:outline-none"
                  disabled={item.status === "done"}
                />

                {/* Status indicator */}
                <div className="w-28 text-right text-xs">
                  {item.status === "pending" && (
                    <span className="text-gray-400">Wartend</span>
                  )}
                  {item.status === "processing" && (
                    <span className="text-amber-500">Verarbeitet...</span>
                  )}
                  {item.status === "uploading" && (
                    <span className="text-blue-500">Hochladen...</span>
                  )}
                  {item.status === "done" && (
                    <span className="font-medium text-green-600">Fertig</span>
                  )}
                  {item.status === "error" && (
                    <span className="text-red-500" title={item.error}>
                      Fehler
                    </span>
                  )}
                </div>

                {/* Remove button */}
                {item.status !== "done" && (
                  <button
                    onClick={() => removeFromQueue(i)}
                    className="text-gray-400 hover:text-red-500"
                    title="Entfernen"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
