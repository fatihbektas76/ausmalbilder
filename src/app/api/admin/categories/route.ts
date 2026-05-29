import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/data/types";
import {
  getCategories,
  saveCategories,
  saveImages,
} from "@/lib/data-store";

// GET /api/admin/categories — return all categories
export async function GET() {
  try {
    const categories = await getCategories();
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

    const categories = await getCategories();

    if (categories.some((cat) => cat.slug === slug)) {
      return NextResponse.json(
        { error: `Kategorie mit Slug '${slug}' existiert bereits.` },
        { status: 409 }
      );
    }

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

    if (body.parentSlug && typeof body.parentSlug === "string" && body.parentSlug.trim()) {
      newCategory.parentSlug = body.parentSlug.trim();
    }

    categories.push(newCategory);
    await saveCategories(categories);

    // Create an empty images list so the page resolves to []
    await saveImages(slug, []);

    revalidatePath("/", "layout");
    revalidatePath(`/${slug}`);

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Kategorie konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
