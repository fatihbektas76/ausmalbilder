import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { processImage } from "@/lib/image-processor";
import { generatePdf } from "@/lib/pdf-generator";
import { uploadToR2 } from "@/lib/r2-upload";
import {
  filenameToSlug,
  filenameToTitle,
  ensureUniqueSlug,
  generateSeoFields,
  categoryToJsonName,
} from "@/lib/slug-generator";
import type { ColoringImage } from "@/data/types";

// Category slug → path mapping
const CATEGORY_MAP: Record<string, string> = {
  pferd: "tiere/pferd",
  mandala: "mandala",
  drachen: "fantasie/drachen",
  "blume-natur": "natur/blume",
  weihnachten: "saisonal/weihnachten",
  ostern: "saisonal/ostern",
  halloween: "saisonal/halloween",
  herbst: "saisonal/herbst",
  fruehling: "saisonal/fruehling",
  dino: "tiere/dino",
  hund: "tiere/hund",
  meerjungfrau: "fantasie/meerjungfrau",
  prinzessin: "fantasie/prinzessin",
  schmetterling: "tiere/schmetterling",
  erwachsene: "erwachsene",
};

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
    const customTitle = formData.get("title") as string | null;
    const status = formData.get("status") as string || "draft";

    if (!file) {
      return NextResponse.json({ error: "Keine Datei" }, { status: 400 });
    }

    if (!categoryKey || !difficulty) {
      return NextResponse.json(
        { error: "Kategorie und Schwierigkeit sind Pflicht" },
        { status: 400 }
      );
    }

    const categorySlug = CATEGORY_MAP[categoryKey];
    if (!categorySlug) {
      return NextResponse.json(
        { error: `Unbekannte Kategorie: ${categoryKey}` },
        { status: 400 }
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate slug and title from filename
    const rawSlug = filenameToSlug(file.name);
    const title = customTitle?.trim() || filenameToTitle(file.name);
    const ageMin = AGE_MAP[ageKey] || 4;

    // Load existing images to check for slug duplicates
    const jsonName = categoryToJsonName(categorySlug);
    const jsonPath = path.join(
      process.cwd(),
      "src",
      "data",
      "images",
      `${jsonName}.json`
    );

    let existingImages: ColoringImage[] = [];
    try {
      const raw = await readFile(jsonPath, "utf-8");
      existingImages = JSON.parse(raw);
    } catch {
      // File doesn't exist yet — will create
    }

    const existingSlugs = existingImages.map((img) => img.slug);
    const slug = ensureUniqueSlug(rawSlug, existingSlugs);

    // Process image with sharp
    const { webpBuffer, thumbBuffer } = await processImage(buffer);

    // Generate PDF
    const pdfBuffer = await generatePdf(buffer);

    // Upload to R2 (or local fallback)
    const imageKey = `images/${categorySlug}/${slug}.webp`;
    const thumbKey = `thumbnails/${categorySlug}/${slug}-thumb.webp`;
    const pdfKey = `pdfs/${categorySlug}/${slug}.pdf`;

    const [imageUrl, thumbnailUrl, pdfUrl] = await Promise.all([
      uploadToR2(imageKey, webpBuffer, "image/webp"),
      uploadToR2(thumbKey, thumbBuffer, "image/webp"),
      uploadToR2(pdfKey, pdfBuffer, "application/pdf"),
    ]);

    // Generate SEO fields
    const seo = generateSeoFields(title, categorySlug, ageMin);

    // Build the ColoringImage entry
    const entry: ColoringImage = {
      slug,
      title,
      titleSeo: seo.titleSeo,
      category: categorySlug,
      tags: [slug.split("-").join(", "), categorySlug.split("/").pop() || ""],
      difficulty: difficulty as "einfach" | "mittel" | "komplex",
      ageMin,
      style: "cartoon",
      orientation: "hochformat",
      imageUrl,
      thumbnailUrl,
      pdfUrl,
      altText: seo.altText,
      seoDescription: seo.seoDescription,
      seoTextShort: seo.seoTextShort,
      seoTextLong: seo.seoTextLong,
      downloadCount: 0,
      publishedAt: status === "live" ? new Date().toISOString() : "",
    };

    // Save to JSON
    existingImages.push(entry);
    await writeFile(jsonPath, JSON.stringify(existingImages, null, 2), "utf-8");

    return NextResponse.json({ success: true, image: entry });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload fehlgeschlagen: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
