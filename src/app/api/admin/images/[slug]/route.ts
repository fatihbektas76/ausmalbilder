import { NextRequest, NextResponse } from "next/server";
import { readdir, readFile, writeFile, mkdir, rename } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { deleteFromR2 } from "@/lib/r2-upload";
import type { ColoringImage } from "@/data/types";

const IMAGES_DIR = path.join(process.cwd(), "src", "data", "images");
const CATEGORIES_PATH = path.join(process.cwd(), "src", "data", "categories.json");

async function syncImageCount(categorySlug: string, count: number) {
  try {
    const raw = await readFile(CATEGORIES_PATH, "utf-8");
    const cats = JSON.parse(raw);
    const idx = cats.findIndex((c: any) => c.slug === categorySlug);
    if (idx !== -1) {
      cats[idx].imageCount = count;
      await writeFile(CATEGORIES_PATH, JSON.stringify(cats, null, 2) + "\n", "utf-8");
    }
  } catch {
    // Non-critical
  }
}

async function findImageInJsonFiles(
  slug: string
): Promise<{
  image: ColoringImage;
  filePath: string;
  images: ColoringImage[];
  index: number;
} | null> {
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
      return NextResponse.json(
        { error: "Bild nicht gefunden" },
        { status: 404 }
      );
    }

    const { images, filePath, index } = found;

    // Update allowed fields (including bilingual fields)
    const updatable = [
      "title",
      "titleSeo",
      "difficulty",
      "ageMin",
      "ageMax",
      "style",
      "orientation",
      "tags",
      "altText",
      "seoDescription",
      "seoTextShort",
      "seoTextLong",
      // Bilingual fields
      "titleDE",
      "titleEN",
      "slugDE",
      "slugEN",
      "titleSeoDE",
      "titleSeoEN",
      "metaTitleDE",
      "metaTitleEN",
      "metaDescDE",
      "metaDescEN",
      "altTextDE",
      "altTextEN",
    ];

    for (const key of updatable) {
      if (body[key] !== undefined) {
        (images[index] as any)[key] = body[key];
      }
    }

    // Keep title in sync with titleDE
    if (body.titleDE !== undefined) {
      images[index].title = body.titleDE;
    }

    // Handle status toggle (publish / unpublish)
    if (body.status === "live" && !images[index].publishedAt) {
      images[index].publishedAt = new Date().toISOString();
    } else if (body.status === "draft") {
      images[index].publishedAt = "";
    }

    // Handle category change — move image to new JSON file + move files
    if (body.category && body.category !== images[index].category) {
      const oldCategory = images[index].category;
      const newCategory = body.category;
      const newJsonName = newCategory.replace(/\//g, "-") + ".json";
      const newFilePath = path.join(IMAGES_DIR, newJsonName);

      // Create JSON file for target category if it doesn't exist
      if (!existsSync(newFilePath)) {
        await writeFile(newFilePath, "[]", "utf-8");
      }

      // Move local files (public/uploads/) to new category paths
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      const fileTypes = [
        { prefix: "images", ext: ".webp", urlField: "imageUrl" as const },
        {
          prefix: "thumbnails",
          ext: "-thumb.webp",
          urlField: "thumbnailUrl" as const,
        },
        { prefix: "pdfs", ext: ".pdf", urlField: "pdfUrl" as const },
        {
          prefix: "pinterest",
          ext: "-pinterest.jpg",
          urlField: "pinterestUrl" as const,
        },
      ];

      const movedImage: ColoringImage = {
        ...images[index],
        category: newCategory,
      };

      for (const ft of fileTypes) {
        const oldPath = path.join(
          uploadsDir,
          ft.prefix,
          oldCategory,
          `${slug}${ft.ext}`
        );
        const newDir = path.join(
          uploadsDir,
          ft.prefix,
          ...newCategory.split("/")
        );
        const newPath = path.join(newDir, `${slug}${ft.ext}`);

        if (existsSync(oldPath)) {
          await mkdir(newDir, { recursive: true });
          try {
            await rename(oldPath, newPath);
          } catch {
            // Cross-device move — fallback: copy + delete
            const { copyFile, unlink } = await import("fs/promises");
            await copyFile(oldPath, newPath);
            await unlink(oldPath);
          }
        }

        // Update URL fields
        (movedImage as any)[ft.urlField] =
          `/uploads/${ft.prefix}/${newCategory}/${slug}${ft.ext}`;
      }

      // Remove from old file
      images.splice(index, 1);
      await writeFile(filePath, JSON.stringify(images, null, 2), "utf-8");

      // Add to new file
      const newContent = await readFile(newFilePath, "utf-8");
      const newImages: ColoringImage[] = JSON.parse(newContent);
      newImages.push(movedImage);
      await writeFile(
        newFilePath,
        JSON.stringify(newImages, null, 2),
        "utf-8"
      );

      // Sync imageCount for both old and new categories
      await syncImageCount(oldCategory, images.length);
      await syncImageCount(newCategory, newImages.length);

      return NextResponse.json({ success: true, image: movedImage });
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
      return NextResponse.json(
        { error: "Bild nicht gefunden" },
        { status: 404 }
      );
    }

    const { image, images, filePath, index } = found;

    // Delete files from R2 (including Pinterest)
    const categoryPath = image.category;
    const keys = [
      `images/${categoryPath}/${slug}.webp`,
      `thumbnails/${categoryPath}/${slug}-thumb.webp`,
      `pdfs/${categoryPath}/${slug}.pdf`,
      `pinterest/${categoryPath}/${slug}-pinterest.jpg`,
    ];

    await Promise.allSettled(keys.map((key) => deleteFromR2(key)));

    // Remove from JSON
    images.splice(index, 1);
    await writeFile(filePath, JSON.stringify(images, null, 2), "utf-8");

    // Sync imageCount after deletion
    await syncImageCount(image.category, images.length);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
