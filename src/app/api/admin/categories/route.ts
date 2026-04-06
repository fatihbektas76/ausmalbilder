import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
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

// GET /api/admin/categories — return all categories
export async function GET() {
  try {
    const categories = await readCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Failed to read categories:", error);
    return NextResponse.json(
      { error: "Kategorien konnten nicht geladen werden." },
      { status: 500 }
    );
  }
}

// POST /api/admin/categories — create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      return NextResponse.json(
        { error: "Feld 'name' ist erforderlich." },
        { status: 400 }
      );
    }
    if (!body.slug || typeof body.slug !== "string" || !body.slug.trim()) {
      return NextResponse.json(
        { error: "Feld 'slug' ist erforderlich." },
        { status: 400 }
      );
    }

    const name = body.name.trim();
    const slug = body.slug.trim();

    // Read existing categories
    const categories = await readCategories();

    // Check for duplicate slug
    if (categories.some((cat) => cat.slug === slug)) {
      return NextResponse.json(
        { error: `Kategorie mit Slug '${slug}' existiert bereits.` },
        { status: 409 }
      );
    }

    // Build the new category with defaults
    const newCategory: Category = {
      slug,
      name,
      description:
        body.description?.trim() ||
        `${name} Ausmalbilder — kostenlos zum Ausdrucken oder online Ausmalen.`,
      seoTitle:
        body.seoTitle?.trim() ||
        `${name} Ausmalbilder kostenlos zum Ausdrucken | Ausmalbilder Gratis`,
      seoDescription:
        body.seoDescription?.trim() ||
        `Kostenlose ${name} Ausmalbilder zum Ausdrucken oder online Ausmalen. Jetzt gratis herunterladen!`,
      seoTextLong: "",
      imageCount: 0,
      keywords: [name.toLowerCase()],
      audience: body.audience || "alle",
    };

    // Set optional parentSlug
    if (body.parentSlug && typeof body.parentSlug === "string" && body.parentSlug.trim()) {
      newCategory.parentSlug = body.parentSlug.trim();
    }

    // Add to array and persist
    categories.push(newCategory);
    await writeCategories(categories);

    // Create the corresponding empty images JSON file
    // Slug like "tiere/pferd" becomes "tiere-pferd.json"
    const imageFileName = slug.replace(/\//g, "-") + ".json";
    const imageFilePath = path.join(imagesDir, imageFileName);
    await writeFile(imageFilePath, "[]\n", "utf-8");

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Kategorie konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
