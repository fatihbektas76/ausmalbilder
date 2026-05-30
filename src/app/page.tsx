import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import FeatureCards from "@/components/sections/FeatureCards";
import UniqueSellingPoints from "@/components/sections/UniqueSellingPoints";
import CategoryBrowser from "@/components/sections/CategoryBrowser";
import FreemiumPitch from "@/components/sections/FreemiumPitch";
import SeoText from "@/components/ui/SeoText";
import LatestArticles from "@/components/sections/LatestArticles";

export const metadata: Metadata = {
  title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen | Ausmalbilder Gratis",
  description:
    "Entdecke kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene — Tiere, Mandalas, saisonale Motive und mehr. 100% kostenlos, ohne Anmeldung.",
  alternates: {
    canonical: "https://ausmalbilder-gratis.com/",
  },
  openGraph: {
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene — Tiere, Mandalas, saisonale Motive und mehr.",
    url: "https://ausmalbilder-gratis.com/",
    siteName: "Ausmalbilder Gratis",
    locale: "de_DE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ausmalbilder gratis zum Ausdrucken und Ausmalen",
    description:
      "Entdecke kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Für Kinder und Erwachsene.",
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
      <LatestArticles />
      <SeoText
        title="Kostenlose Ausmalbilder für Kinder und Erwachsene"
        content={`Willkommen auf ausmalbilder-gratis.com — deiner Anlaufstelle für kostenlose Ausmalbilder zum Ausdrucken und Online-Ausmalen. Unsere wachsende Sammlung umfasst Malvorlagen in verschiedenen Kategorien: von beliebten Tiermotiven wie Pferde, Hunde und Schmetterlinge über kreative Mandalas bis hin zu saisonalen Ausmalbildern für Weihnachten, Ostern und Halloween. Alle Ausmalbilder sind kostenlos und ohne Anmeldung verfügbar.\n\nBei uns findest du Ausmalbilder gratis für jedes Alter und jeden Geschmack. Für Kleinkinder ab 3 Jahren bieten wir einfache Motive mit dicken Linien und großen Flächen, die das erste Ausmalen zum Erfolgserlebnis machen. Grundschulkinder freuen sich über detailreichere Malvorlagen mit ihren Lieblingstieren und Fantasy-Motiven. Und für Erwachsene haben wir eine Kollektion mit anspruchsvollen Mandalas und Zentangle-Mustern — perfekt zum Entspannen und Abschalten.\n\nNeben dem klassischen PDF-Download zum Ausdrucken kannst du jedes Ausmalbild auch direkt im Browser online ausmalen. Das kostenlose Ausmaltool bietet eine große Auswahl an Farben, verschiedene Pinselgrößen, einen Farbeimer zum Füllen ganzer Flächen und geometrische Formen zum Dekorieren. Die fertigen Kunstwerke lassen sich als PNG speichern und auf Pinterest, WhatsApp oder Instagram teilen.\n\nAlle Malvorlagen sind als druckfertige PDF im DIN-A4-Format optimiert und können auf jedem handelsüblichen Drucker ausgegeben werden. Ob für den Kindergeburtstag, den Regennachmittag zu Hause oder als kreative Pause im Büro — die Ausmalbilder für Kinder und Erwachsene bieten Spaß und Entspannung.\n\nStöbere jetzt durch die Kategorien und entdecke dein nächstes Lieblings-Ausmalbild. Neu hinzugefügte Motive findest du direkt auf dieser Seite. Von Mandalas zum Ausmalen bis zu niedlichen Cartoon-Tieren — bei ausmalbilder-gratis.com findest du eine wachsende Auswahl.`}
      />
    </main>
  );
}
