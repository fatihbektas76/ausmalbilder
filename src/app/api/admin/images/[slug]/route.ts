import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFromR2 } from "@/lib/r2-upload";
import {
  getCategories,
  saveCategories,
  getImages,
  saveImages,
  copyObject,
  deleteObject,
} from "@/lib/data-store";
import type { ColoringImage } from "@/data/types";

async function syncImageCount(categorySlug: string, count: number) {
  try {
    const cats = await getCategories();
    const idx = cats.findIndex((c) => c.slug === categorySlug);
    if (idx !== -1) {
      cats[idx].imageCount = count;
      await saveCategories(cats);
    }
  } catch {
    // Non-critical
  }
}

interface FoundImage {
  image: ColoringImage;
  categorySlug: string;
  images: ColoringImage[];
  index: number;
}

async function findImage(slug: string): Promise<FoundImage | null> {
  const cats = await getCategories();
  for (const cat of cats) {
    const images = await getImages(cat.slug);
    const index = images.findIndex((img) => img.slug === slug);
    if (index !== -1) {
      return { image: images[index], categorySlug: cat.slug, images, index };
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
    const found = await findImage(slug);

    if (!found) {
      return NextResponse.json(
        { error: "Bild nicht gefunden" },
        { status: 404 }
      );
    }

    const { images, categorySlug, index } = found;

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (images[index] as any)[key] = body[key];
      }
    }

    if (body.titleDE !== undefined) {
      images[index].title = body.titleDE;
    }

    if (body.status === "live" && !images[index].publishedAt) {
      images[index].publishedAt = new Date().toISOString();
    } else if (body.status === "draft") {
      images[index].publishedAt = "";
    }

    // Cross-category move
    if (body.category && body.category !== images[index].category) {
      const oldCategory = images[index].category;
      const newCategory = body.category;

      const fileTypes = [
        { prefix: "images", ext: ".webp", urlField: "imageUrl" as const },
        { prefix: "thumbnails", ext: "-thumb.webp", urlField: "thumbnailUrl" as const },
        { prefix: "pdfs", ext: ".pdf", urlField: "pdfUrl" as const },
        { prefix: "pinterest", ext: "-pinterest.jpg", urlField: "pinterestUrl" as const },
      ];

      const movedImage: ColoringImage = {
        ...images[index],
        category: newCategory,
      };

      const ASSETS_URL = process.env.NEXT_PUBLIC_ASSETS_URL || "";

      for (const ft of fileTypes) {
        const oldKey = `${ft.prefix}/${oldCategory}/${slug}${ft.ext}`;
        const newKey = `${ft.prefix}/${newCategory}/${slug}${ft.ext}`;
        // Copy + delete in S3
        await copyObject(oldKey, newKey);
        try {
          await deleteObject(oldKey);
        } catch {
          // ignore — copy succeeded; orphan old key
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (movedImage as any)[ft.urlField] = `${ASSETS_URL}/${newKey}`;
      }

      // Remove from old category and save
      images.splice(index, 1);
      await saveImages(categorySlug, images);

      // Add to new category
      const targetImages = await getImages(newCategory);
      targetImages.push(movedImage);
      await saveImages(newCategory, targetImages);

      await syncImageCount(oldCategory, images.length);
      await syncImageCount(newCategory, targetImages.length);

      revalidatePath(`/${oldCategory}`);
      revalidatePath(`/${newCategory}`);
      revalidatePath(`/${newCategory}/${slug}`);

      return NextResponse.json({ success: true, image: movedImage });
    }

    await saveImages(categorySlug, images);

    revalidatePath(`/${categorySlug}`);
    revalidatePath(`/${categorySlug}/${slug}`);

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
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const found = await findImage(slug);

    if (!found) {
      return NextResponse.json(
        { error: "Bild nicht gefunden" },
        { status: 404 }
      );
    }

    const { image, images, categorySlug, index } = found;

    // Delete the image binaries from object storage
    const categoryPath = image.category;
    const keys = [
      `images/${categoryPath}/${slug}.webp`,
      `thumbnails/${categoryPath}/${slug}-thumb.webp`,
      `pdfs/${categoryPath}/${slug}.pdf`,
      `pinterest/${categoryPath}/${slug}-pinterest.jpg`,
    ];

    await Promise.allSettled(keys.map((key) => deleteFromR2(key)));

    images.splice(index, 1);
    await saveImages(categorySlug, images);

    await syncImageCount(image.category, images.length);

    revalidatePath(`/${categorySlug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
