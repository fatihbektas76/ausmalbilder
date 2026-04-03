import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import FeatureCards from "@/components/sections/FeatureCards";
import UniqueSellingPoints from "@/components/sections/UniqueSellingPoints";
import CategoryBrowser from "@/components/sections/CategoryBrowser";
import FreemiumPitch from "@/components/sections/FreemiumPitch";

export const metadata: Metadata = {
  title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen | Ausmalbilder Gratis",
  description:
    "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene — Tiere, Mandalas, saisonale Motive und mehr. 100% kostenlos, ohne Anmeldung.",
  alternates: {
    canonical: "https://ausmalbilder-gratis.com/",
  },
  openGraph: {
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene — Tiere, Mandalas, saisonale Motive und mehr.",
    url: "https://ausmalbilder-gratis.com/",
    siteName: "Ausmalbilder Gratis",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke tausende kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene.",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <UniqueSellingPoints />
      <CategoryBrowser />
      <FreemiumPitch />
    </main>
  );
}
