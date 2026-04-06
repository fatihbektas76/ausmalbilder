import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, unlink } from "fs/promises";
import path from "path";
import type { Category } from "@/data/types";

const categoriesPath = path.join(process.cwd(), "src", "data", "categories.json");
const imagesDir = path.join(process.cwd(), "src", "data", "images");

async function readCategories(): Promise<Category[]> {
  const raw = await readFile(categoriesPath, "utf-8");
  return JSON.parse(raw) as Category[];
}

async function writeCategories(categories: Category[]): Promise<void> {
  await writeFile(categoriesPath, JSON.stringify(categories, null, 2) + "\n", "utf-8");
}

function getSlugFromParams(params: { slug: string[] }): string {
  // [...slug] captures path segments as an array, e.g. ["tiere", "pferd"]
  return params.slug.join("/");
}

// PATCH /api/admin/categories/[...slug] — update a category
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = getSlugFromParams(resolvedParams);
    const body = await request.json();

    const categories = await readCategories();
    const index = categories.findIndex((cat) => cat.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: `Kategorie '${slug}' nicht gefunden.` },
        { status: 404 }
      );
    }

    // Update only the fields that are provided
    const updatableFields: (keyof Category)[] = [
      "name",
      "description",
      "seoTitle",
      "seoDescription",
      "seoTextLong",
      "audience",
      "keywords",
      "parentSlug",
      "badge",
      "displayCount",
      "bgGradient",
      "thumbnails",
    ];

    for (const field of updatableFields) {
      if (body[field] !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (categories[index] as any)[field] = body[field];
      }
    }

    await writeCategories(categories);

    return NextResponse.json({ category: categories[index] });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Kategorie konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[...slug] — delete a category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = getSlugFromParams(resolvedParams);

    const categories = await readCategories();
    const index = categories.findIndex((cat) => cat.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: `Kategorie '${slug}' nicht gefunden.` },
        { status: 404 }
      );
    }

    // Check if the corresponding images file has entries
    const imageFileName = slug.replace(/\//g, "-") + ".json";
    const imageFilePath = path.join(imagesDir, imageFileName);

    try {
      const imagesRaw = await readFile(imageFilePath, "utf-8");
      const images = JSON.parse(imagesRaw);
      if (Array.isArray(images) && images.length > 0) {
        return NextResponse.json(
          {
            error: `Kategorie hat noch ${images.length} Bilder. Bitte zuerst alle Bilder löschen.`,
          },
          { status: 400 }
        );
      }
    } catch {
      // Images file doesn't exist — that's fine, we can proceed with deletion
    }

    // Remove category from array
    const removed = categories.splice(index, 1)[0];
    await writeCategories(categories);

    // Delete the images JSON file if it exists
    try {
      await unlink(imageFilePath);
    } catch {
      // File didn't exist — ignore
    }

    return NextResponse.json({
      message: `Kategorie '${removed.name}' (${slug}) wurde gelöscht.`,
    });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json(
      { error: "Kategorie konnte nicht gelöscht werden." },
      { status: 500 }
    );
  }
}
