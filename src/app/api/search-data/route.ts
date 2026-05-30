import { NextResponse } from "next/server";
import { getCategories, getImages } from "@/lib/data-store";

export const revalidate = 60; // ISR — Scaleway is the source of truth

/**
 * Flat, slim record for the client-side MiniSearch index.
 * Only fields the search/UI actually needs.
 */
export interface SearchRecord {
  id: string;                 // "tiere/pferd::pferd-im-galopp"
  slug: string;
  category: string;
  categoryName: string;
  title: string;
  thumbnailUrl: string;
  difficulty: "einfach" | "mittel" | "komplex";
  ageMin: number;
  altText: string;
  tags: string[];
  keywords: string[];         // LLM semanticKeywords if present
}

export async function GET() {
  try {
    const cats = await getCategories();
    const catName = new Map(cats.map((c) => [c.slug, c.name]));

    const lists = await Promise.all(
      cats.map(async (c) => ({ cat: c.slug, images: await getImages(c.slug) }))
    );

    const records: SearchRecord[] = [];
    for (const { cat, images } of lists) {
      for (const img of images) {
        // Only published images appear in search
        if (!img.publishedAt) continue;
        records.push({
          id: `${cat}::${img.slug}`,
          slug: img.slug,
          category: cat,
          categoryName: catName.get(cat) || cat,
          title: img.title,
          thumbnailUrl: img.thumbnailUrl,
          difficulty: img.difficulty,
          ageMin: img.ageMin,
          altText: img.altText || "",
          tags: img.tags || [],
          keywords: img.enrichment?.semanticKeywords || [],
        });
      }
    }

    return NextResponse.json(
      { records, count: records.length, generatedAt: new Date().toISOString() },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    console.error("search-data error:", err);
    return NextResponse.json(
      { error: (err as Error).message, records: [], count: 0 },
      { status: 500 }
    );
  }
}
