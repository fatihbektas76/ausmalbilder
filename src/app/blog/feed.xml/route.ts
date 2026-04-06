import { NextResponse } from "next/server";
import articlesData from "@/data/blog/articles.json";
import type { BlogArticle } from "@/data/types";

export async function GET() {
  const articles = (articlesData as BlogArticle[])
    .filter((a) => a.status !== "draft")
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const BASE_URL = "https://ausmalbilder-gratis.com";

  const rssItems = articles.map((article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${BASE_URL}/blog/${article.slug}/</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${article.slug}/</guid>
      <description><![CDATA[${article.excerpt}]]></description>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <category>${article.category}</category>
      ${article.tags.map((t) => `<category>${t}</category>`).join("\n      ")}
    </item>`).join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ausmalbilder Gratis — Blog</title>
    <link>${BASE_URL}/blog/</link>
    <description>Tipps zum Ausmalen für Kinder und Erwachsene, Stressabbau durch Malvorlagen, Kreativitäts-Ratgeber und mehr.</description>
    <language>de-de</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
