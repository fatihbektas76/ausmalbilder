import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { BlogArticle } from "@/data/types";

const BLOG_DIR = path.join(process.cwd(), "src", "data", "blog");
const ARTICLES_FILE = path.join(BLOG_DIR, "articles.json");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureDir() {
  try {
    await mkdir(BLOG_DIR, { recursive: true });
  } catch {
    // directory already exists
  }
}

async function readArticles(): Promise<BlogArticle[]> {
  await ensureDir();
  try {
    const content = await readFile(ARTICLES_FILE, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeArticles(articles: BlogArticle[]): Promise<void> {
  await ensureDir();
  await writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
}

export async function GET() {
  try {
    const articles = await readArticles();

    // Sort by publishedAt desc (newest first), drafts on top
    articles.sort((a, b) => {
      // Drafts first
      const aIsDraft = a.status === "draft" || !a.publishedAt;
      const bIsDraft = b.status === "draft" || !b.publishedAt;
      if (aIsDraft && !bIsDraft) return -1;
      if (!aIsDraft && bIsDraft) return 1;

      // Then by publishedAt descending
      return (b.publishedAt || "").localeCompare(a.publishedAt || "");
    });

    return NextResponse.json({ articles, total: articles.length });
  } catch (error) {
    console.error("Blog list error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const articles = await readArticles();

    // Validate required fields
    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Titel ist erforderlich" },
        { status: 400 }
      );
    }
    if (!body.category) {
      return NextResponse.json(
        { error: "Kategorie ist erforderlich" },
        { status: 400 }
      );
    }
    if (!body.content || !body.content.trim()) {
      return NextResponse.json(
        { error: "Inhalt ist erforderlich" },
        { status: 400 }
      );
    }

    // Generate slug from title if not provided
    const slug = body.slug?.trim() ? slugify(body.slug.trim()) : slugify(body.title.trim());

    // Check for duplicate slug
    if (articles.some((a) => a.slug === slug)) {
      return NextResponse.json(
        { error: `Ein Artikel mit dem Slug "${slug}" existiert bereits` },
        { status: 409 }
      );
    }

    // Calculate reading time (words / 200, minimum 1 minute)
    const wordCount = body.content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.round(wordCount / 200));

    // Set defaults
    const now = new Date().toISOString();
    const status = body.status || "draft";
    const isLive = status === "live";

    const newArticle: BlogArticle = {
      slug,
      title: body.title.trim(),
      titleSeo: body.titleSeo?.trim() || body.title.trim(),
      metaTitle: body.metaTitle?.trim() || body.title.trim().slice(0, 60),
      metaDescription: body.metaDescription?.trim() || body.excerpt?.trim() || "",
      category: body.category,
      tags: Array.isArray(body.tags) ? body.tags : [],
      author: body.author?.trim() || "Redaktion Ausmalbilder Gratis",
      publishedAt: isLive ? now : "",
      updatedAt: now,
      readingTime,
      featuredImage: body.featuredImage?.trim() || "",
      featuredImageAlt: body.featuredImageAlt?.trim() || "",
      excerpt: body.excerpt?.trim() || "",
      content: body.content.trim(),
      relatedArticles: Array.isArray(body.relatedArticles) ? body.relatedArticles : [],
      relatedImages: Array.isArray(body.relatedImages) ? body.relatedImages : [],
      faq: Array.isArray(body.faq) ? body.faq : [],
      status,
    };

    articles.push(newArticle);
    await writeArticles(articles);

    return NextResponse.json({ success: true, article: newArticle }, { status: 201 });
  } catch (error) {
    console.error("Blog create error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
