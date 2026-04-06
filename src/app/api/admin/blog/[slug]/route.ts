import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { BlogArticle } from "@/data/types";

const BLOG_DIR = path.join(process.cwd(), "src", "data", "blog");
const ARTICLES_FILE = path.join(BLOG_DIR, "articles.json");

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articles = await readArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ article });
  } catch (error) {
    console.error("Blog get error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const articles = await readArticles();
    const index = articles.findIndex((a) => a.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();

    // Updatable fields
    const updatable: (keyof BlogArticle)[] = [
      "title",
      "titleSeo",
      "metaTitle",
      "metaDescription",
      "category",
      "tags",
      "author",
      "featuredImage",
      "featuredImageAlt",
      "excerpt",
      "content",
      "relatedArticles",
      "relatedImages",
      "faq",
      "slug",
    ];

    for (const key of updatable) {
      if (body[key] !== undefined) {
        (articles[index] as any)[key] = body[key];
      }
    }

    // Handle status change
    if (body.status !== undefined) {
      articles[index].status = body.status;
      if (body.status === "live" && !articles[index].publishedAt) {
        articles[index].publishedAt = now;
      }
    }

    // Recalculate reading time if content changed
    if (body.content) {
      const wordCount = body.content.trim().split(/\s+/).length;
      articles[index].readingTime = Math.max(1, Math.round(wordCount / 200));
    }

    // Always update updatedAt
    articles[index].updatedAt = now;

    await writeArticles(articles);

    return NextResponse.json({ success: true, article: articles[index] });
  } catch (error) {
    console.error("Blog patch error:", error);
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
    const articles = await readArticles();
    const index = articles.findIndex((a) => a.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    articles.splice(index, 1);
    await writeArticles(articles);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
