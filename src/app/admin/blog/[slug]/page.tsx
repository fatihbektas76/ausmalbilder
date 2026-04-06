"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogEditor from "../BlogEditor";
import type { BlogArticle } from "@/data/types";

export default function EditArticlePage() {
  const params = useParams();
  const slug = params.slug as string;

  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/blog/${slug}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Artikel nicht gefunden");
          setLoading(false);
          return;
        }

        setArticle(data.article);
      } catch {
        setError("Netzwerkfehler beim Laden des Artikels");
      }
      setLoading(false);
    }

    if (slug) {
      load();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-sm text-gray-400">Artikel wird geladen...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <div className="text-sm text-red-500">{error}</div>
        <a
          href="/admin/blog"
          className="text-sm text-[#E8490F] hover:underline"
        >
          Zurück zur Blog-Übersicht
        </a>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
        <div className="text-sm text-gray-400">Artikel nicht gefunden</div>
        <a
          href="/admin/blog"
          className="text-sm text-[#E8490F] hover:underline"
        >
          Zurück zur Blog-Übersicht
        </a>
      </div>
    );
  }

  return <BlogEditor article={article} />;
}
