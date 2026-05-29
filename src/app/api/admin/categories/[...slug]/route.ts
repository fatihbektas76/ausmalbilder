import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/data/types";
import {
  getCategories,
  saveCategories,
  getImages,
  deleteObject,
} from "@/lib/data-store";

function getSlugFromParams(params: { slug: string[] }): string {
  return params.slug.join("/");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = getSlugFromParams(resolvedParams);
    const body = await request.json();

    const categories = await getCategories();
    const index = categories.findIndex((cat) => cat.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: `Kategorie '${slug}' nicht gefunden.` },
        { status: 404 }
      );
    }

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

    await saveCategories(categories);
    revalidatePath("/", "layout");
    revalidatePath(`/${slug}`);

    return NextResponse.json({ category: categories[index] });
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json(
      { error: "Kategorie konnte nicht aktualisiert werden." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = getSlugFromParams(resolvedParams);

    const categories = await getCategories();
    const index = categories.findIndex((cat) => cat.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: `Kategorie '${slug}' nicht gefunden.` },
        { status: 404 }
      );
    }

    const images = await getImages(slug);
    if (images.length > 0) {
      return NextResponse.json(
        {
          error: `Kategorie hat noch ${images.length} Bilder. Bitte zuerst alle Bilder löschen.`,
        },
        { status: 400 }
      );
    }

    const removed = categories.splice(index, 1)[0];
    await saveCategories(categories);

    // Best-effort cleanup of the (empty) images JSON in Scaleway
    const imagesKey = `data/images/${slug.replace(/\//g, "-")}.json`;
    try {
      await deleteObject(imagesKey);
    } catch {
      // ignore — non-critical
    }

    revalidatePath("/", "layout");

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
