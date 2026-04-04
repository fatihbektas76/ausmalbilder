import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile } from "fs/promises";
import path from "path";
import type { ColoringImage } from "@/data/types";

const IMAGES_DIR = path.join(process.cwd(), "src", "data", "images");

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get("category");
    const statusFilter = searchParams.get("status"); // "live" | "draft"

    // Read all JSON files in the images directory
    let files: string[];
    try {
      files = await readdir(IMAGES_DIR);
    } catch {
      files = [];
    }

    const jsonFiles = files.filter((f) => f.endsWith(".json"));
    const allImages: (ColoringImage & { _jsonFile?: string })[] = [];

    for (const file of jsonFiles) {
      const content = await readFile(path.join(IMAGES_DIR, file), "utf-8");
      const images: ColoringImage[] = JSON.parse(content);
      images.forEach((img) => {
        allImages.push({ ...img, _jsonFile: file });
      });
    }

    // Filter
    let filtered = allImages;
    if (categoryFilter) {
      filtered = filtered.filter((img) => img.category === categoryFilter);
    }
    if (statusFilter === "live") {
      filtered = filtered.filter((img) => img.publishedAt !== "");
    } else if (statusFilter === "draft") {
      filtered = filtered.filter((img) => img.publishedAt === "");
    }

    // Sort by publishedAt desc (newest first), drafts on top
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
