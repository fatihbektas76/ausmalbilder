import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import FeatureCards from "@/components/sections/FeatureCards";
import CategoryBrowser from "@/components/sections/CategoryBrowser";
import FreemiumPitch from "@/components/sections/FreemiumPitch";

export const metadata: Metadata = {
  title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen | Ausmalbilder Gratis",
  description:
    "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. F\u00fcr Kinder und Erwachsene \u2014 Tiere, Mandalas, saisonale Motive und mehr.",
  alternates: {
    canonical: "https://ausmalbilder-gratis.com/",
  },
  openGraph: {
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. F\u00fcr Kinder und Erwachsene \u2014 Tiere, Mandalas, saisonale Motive und mehr.",
    url: "https://ausmalbilder-gratis.com/",
    siteName: "Ausmalbilder Gratis",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. F\u00fcr Kinder und Erwachsene.",
  },
};

export default function Home() {
  return (
    <main className="bg-brand-cream">
      <Hero />
      <FeatureCards />
      <CategoryBrowser />
      <FreemiumPitch />
    </main>
  );
}
