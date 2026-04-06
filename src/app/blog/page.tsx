import type { Metadata } from "next";
import BlogOverview from "./BlogOverview";
import type { BlogArticle } from "@/data/types";
import articlesData from "@/data/blog/articles.json";

export const metadata: Metadata = {
  title: "Blog — Ausmalen, Kreativität & Stressabbau",
  description:
    "Tipps zum Ausmalen für Kinder und Erwachsene, Stressabbau durch Malvorlagen, Kreativitäts-Ratgeber und saisonale Ideen — kostenlos auf ausmalbilder-gratis.com",
  alternates: {
    canonical: "https://ausmalbilder-gratis.com/blog/",
  },
  openGraph: {
    title: "Blog — Ausmalen, Kreativität & Stressabbau",
    description:
      "Tipps zum Ausmalen für Kinder und Erwachsene, Stressabbau durch Malvorlagen und mehr.",
    url: "https://ausmalbilder-gratis.com/blog/",
    siteName: "Ausmalbilder Gratis",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Ausmalen, Kreativität & Stressabbau",
    description:
      "Tipps zum Ausmalen für Kinder und Erwachsene, Stressabbau durch Malvorlagen und mehr.",
  },
};

export default function BlogPage() {
  const articles = (articlesData as BlogArticle[])
    .filter((a) => a.status !== "draft")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return <BlogOverview articles={articles} />;
}
