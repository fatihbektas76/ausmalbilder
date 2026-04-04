import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { deleteFromR2 } from "@/lib/r2-upload";
import type { ColoringImage } from "@/data/types";

const IMAGES_DIR = path.join(process.cwd(), "src", "data", "images");

async function findImageInJsonFiles(
  slug: string
): Promise<{ image: ColoringImage; filePath: string; images: ColoringImage[]; index: number } | null> {
  let files: string[];
  try {
    files = await readdir(IMAGES_DIR);
  } catch {
    return null;
  }

  for (const file of files.filter((f) => f.endsWith(".json"))) {
    const filePath = path.join(IMAGES_DIR, file);
    const content = await readFile(filePath, "utf-8");
    const images: ColoringImage[] = JSON.parse(content);
    const index = images.findIndex((img) => img.slug === slug);
    if (index !== -1) {
      return { image: images[index], filePath, images, index };
    }
  }

  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const found = await findImageInJsonFiles(slug);

    if (!found) {
      return NextResponse.json({ error: "Bild nicht gefunden" }, { status: 404 });
    }

    const { images, filePath, index } = found;

    // Update allowed fields
    const updatable = [
      "title",
      "titleSeo",
      "difficulty",
      "ageMin",
      "style",
      "tags",
      "altText",
      "seoDescription",
      "seoTextShort",
      "seoTextLong",
    ];

    for (const key of updatable) {
      if (body[key] !== undefined) {
        (images[index] as any)[key] = body[key];
      }
    }

    // Handle status toggle (publish / unpublish)
    if (body.status === "live" && !images[index].publishedAt) {
      images[index].publishedAt = new Date().toISOString();
    } else if (body.status === "draft") {
      images[index].publishedAt = "";
    }

    await writeFile(filePath, JSON.stringify(images, null, 2), "utf-8");

    return NextResponse.json({ success: true, image: images[index] });
  } catch (error) {
    console.error("Patch error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const found = await findImageInJsonFiles(slug);

    if (!found) {
      return NextResponse.json({ error: "Bild nicht gefunden" }, { status: 404 });
    }

    const { image, images, filePath, index } = found;

    // Delete files from R2
    const categoryPath = image.category;
    const keys = [
      `images/${categoryPath}/${slug}.webp`,
      `thumbnails/${categoryPath}/${slug}-thumb.webp`,
      `pdfs/${categoryPath}/${slug}.pdf`,
    ];

    await Promise.allSettled(keys.map((key) => deleteFromR2(key)));

    // Remove from JSON
    images.splice(index, 1);
    await writeFile(filePath, JSON.stringify(images, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
