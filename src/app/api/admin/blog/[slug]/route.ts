import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { BlogArticle } from "@/data/types";
import { getArticles, saveArticles } from "@/lib/data-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articles = await getArticles();
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
    const articles = await getArticles();
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

    await saveArticles(articles);

    revalidatePath("/blog");
    revalidatePath(`/blog/${articles[index].slug}`);

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
    const articles = await getArticles();
    const index = articles.findIndex((a) => a.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Artikel nicht gefunden" },
        { status: 404 }
      );
    }

    articles.splice(index, 1);
    await saveArticles(articles);

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Blog delete error:", error);
    return NextResponse.json(
      { error: `Fehler: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
