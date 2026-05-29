import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { processImage } from "@/lib/image-processor";
import { generatePdf } from "@/lib/pdf-generator";
import { uploadToR2 } from "@/lib/r2-upload";
import {
  getCategories,
  saveCategories,
  getImages,
  saveImages,
} from "@/lib/data-store";
import {
  ensureUniqueSlug,
  generateSeoFields,
  generateBilingualMetadata,
} from "@/lib/slug-generator";
import slugify from "slugify";
import type { ColoringImage } from "@/data/types";

const AGE_MAP: Record<string, number> = {
  "2": 2,
  "4": 4,
  "6": 6,
  "8": 8,
  erwachsene: 16,
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const categoryKey = formData.get("category") as string;
    const difficulty = formData.get("difficulty") as string;
    const ageKey = formData.get("age") as string;
    const titleDE = formData.get("titleDE") as string | null;
    const titleEN = formData.get("titleEN") as string | null;
    const customTitle = formData.get("title") as string | null;
    const status = (formData.get("status") as string) || "draft";

    if (!file) {
      return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
    }

    if (!categoryKey || !difficulty) {
      return NextResponse.json(
        { error: "Kategorie und Schwierigkeit sind Pflicht" },
        { status: 400 }
      );
    }

    // Read categories to validate
    const allCategories = await getCategories();
    const categorySlug = categoryKey;
    const validCategory = allCategories.find(
      (c) => c.slug === categorySlug
    );
    if (!validCategory) {
      return NextResponse.json(
        { error: `Unbekannte Kategorie: ${categoryKey}` },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine titles — prefer bilingual, fall back to single title
    const finalTitleDE = titleDE?.trim() || customTitle?.trim() || file.name.replace(/\.[^/.]+$/, "");
    const finalTitleEN = titleEN?.trim() || "";
    const ageMin = AGE_MAP[ageKey] || 4;

    // Generate slug from DE title (primary slug)
    const rawSlug = slugify(finalTitleDE, {
      lower: true,
      strict: true,
      locale: "de",
    });

    // Load existing images to check for slug duplicates
    const existingImages = await getImages(categorySlug);
    const existingSlugs = existingImages.map((img) => img.slug);
    const slug = ensureUniqueSlug(rawSlug, existingSlugs);

    // Process image with sharp (WebP + thumbnail + Pinterest)
    const { webpBuffer, thumbBuffer, pinterestBuffer } =
      await processImage(buffer);

    // Generate PDF
    const pdfBuffer = await generatePdf(buffer);

    // Upload all formats to R2 (or local fallback)
    const imageKey = `images/${categorySlug}/${slug}.webp`;
    const thumbKey = `thumbnails/${categorySlug}/${slug}-thumb.webp`;
    const pdfKey = `pdfs/${categorySlug}/${slug}.pdf`;
    const pinterestKey = `pinterest/${categorySlug}/${slug}-pinterest.jpg`;

    const [imageUrl, thumbnailUrl, pdfUrl, pinterestUrl] = await Promise.all([
      uploadToR2(imageKey, webpBuffer, "image/webp"),
      uploadToR2(thumbKey, thumbBuffer, "image/webp"),
      uploadToR2(pdfKey, pdfBuffer, "application/pdf"),
      uploadToR2(pinterestKey, pinterestBuffer, "image/jpeg"),
    ]);

    // Generate SEO fields (DE — backward compatible)
    const seo = generateSeoFields(finalTitleDE, categorySlug, ageMin);

    // Generate bilingual metadata if EN title provided
    const bilingual =
      finalTitleEN
        ? generateBilingualMetadata(finalTitleDE, finalTitleEN)
        : null;

    // Build the ColoringImage entry
    const entry: ColoringImage = {
      slug,
      title: finalTitleDE,
      titleSeo: seo.titleSeo,
      category: categorySlug,
      tags: [
        slug.split("-").join(", "),
        categorySlug.split("/").pop() || "",
      ],
      difficulty: difficulty as "einfach" | "mittel" | "komplex",
      ageMin,
      style: "cartoon",
      orientation: "hochformat",
      imageUrl,
      thumbnailUrl,
      pdfUrl,
      pinterestUrl,
      altText: seo.altText,
      seoDescription: seo.seoDescription,
      seoTextShort: seo.seoTextShort,
      seoTextLong: seo.seoTextLong,
      downloadCount: 0,
      publishedAt: status === "live" ? new Date().toISOString() : "",

      // Bilingual fields
      titleDE: finalTitleDE,
      titleEN: finalTitleEN || undefined,
      slugDE: bilingual?.slugDE || slug,
      slugEN: bilingual?.slugEN || undefined,
      titleSeoDE: bilingual?.titleSeoDE || seo.titleSeo,
      titleSeoEN: bilingual?.titleSeoEN || undefined,
      metaTitleDE: bilingual?.metaTitleDE || undefined,
      metaTitleEN: bilingual?.metaTitleEN || undefined,
      metaDescDE: bilingual?.metaDescDE || seo.seoDescription,
      metaDescEN: bilingual?.metaDescEN || undefined,
      altTextDE: bilingual?.altTextDE || seo.altText,
      altTextEN: bilingual?.altTextEN || undefined,
    };

    // Save images JSON to Scaleway
    existingImages.push(entry);
    await saveImages(categorySlug, existingImages);

    // Update imageCount in categories
    const catIndex = allCategories.findIndex((c) => c.slug === categorySlug);
    if (catIndex !== -1) {
      allCategories[catIndex].imageCount = existingImages.length;
      await saveCategories(allCategories);
    }

    revalidatePath(`/${categorySlug}`);
    revalidatePath(`/${categorySlug}/${slug}`);
    revalidatePath("/", "layout");

    return NextResponse.json({ success: true, image: entry });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload fehlgeschlagen: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
