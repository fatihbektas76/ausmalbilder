import { NextRequest, NextResponse } from "next/server";
import { getCategories, getImages } from "@/lib/data-store";
import type { ColoringImage } from "@/data/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");
    const statusFilter = searchParams.get("status"); // "live" | "draft"

    // Iterate categories and pull image lists in parallel
    const cats = await getCategories();
    const lists = await Promise.all(
      cats.map(async (c) => ({
        slug: c.slug,
        images: await getImages(c.slug),
      }))
    );

    const allImages: (ColoringImage & { _jsonFile?: string })[] = [];
    for (const { slug, images } of lists) {
      const jsonFile = `${slug.replace(/\//g, "-")}.json`;
      images.forEach((img) => allImages.push({ ...img, _jsonFile: jsonFile }));
    }

    let filtered = allImages;
    if (categoryFilter) {
      filtered = filtered.filter((img) => img.category === categoryFilter);
    }
    if (statusFilter === "live") {
      filtered = filtered.filter((img) => img.publishedAt !== "");
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((img) => img.publishedAt === "");
    }

    filtered.sort((a, b) => {
      if (!a.publishedAt && b.publishedAt) return -1;
      if (a.publishedAt && !b.publishedAt) return 1;
      return (b.publishedAt || "").localeCompare(a.publishedAt || "");
    });

    return NextResponse.json({ images: filtered, total: filtered.length });
  } catch (error) {
    console.error("Images list error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
