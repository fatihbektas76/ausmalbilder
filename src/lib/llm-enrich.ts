/**
 * LLM-driven content enrichment for coloring image pages.
 *
 * One call to Gemini 2.5 Flash per image returns a structured payload
 * (long SEO text, motif facts, animal profile, learning goals, color
 * suggestions, custom FAQs, semantic keywords). Designed for SEO + GEO:
 * answers concrete user questions LLMs cite, uses LSI keywords, surfaces
 * E-E-A-T signals via specific facts rather than generic filler.
 */

import type { ImageEnrichment, TierSteckbrief } from "@/data/types";

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

interface EnrichInput {
  title: string;
  categorySlug: string;
  categoryName: string;
  difficulty: "einfach" | "mittel" | "komplex";
  ageMin: number;
  orientation: "hochformat" | "querformat";
  style: string;
}

const RESPONSE_SCHEMA = {
  type: "object",
  required: [
    "seoTextLong",
    "motivFakten",
    "lernziele",
    "farbempfehlungen",
    "customFaqs",
    "semanticKeywords",
  ],
  properties: {
    seoTextLong: {
      type: "string",
      description:
        "300-400 Wörter, deutsch, motiv-spezifisch (nicht generisch). Markdown erlaubt für Absätze. Beantwortet was das Motiv ist, warum es zum Ausmalen geeignet ist, welche pädagogischen Vorteile es hat, und gibt konkrete praktische Tipps. KEIN generisches Boilerplate über 'kostenlose PDFs' oder 'ohne Anmeldung'.",
    },
    motivFakten: {
      type: "array",
      items: { type: "string" },
      minItems: 5,
      maxItems: 5,
      description:
        "Exakt 5 motiv-spezifische, kindgerechte Fakten als prägnante Sätze (max 20 Wörter). Konkret und überprüfbar.",
    },
    tierSteckbrief: {
      type: "object",
      description:
        "NUR ausfüllen wenn das Motiv ein konkretes Tier ist. Sonst weglassen.",
      properties: {
        lebensraum: { type: "string" },
        groesse: { type: "string" },
        futter: { type: "string" },
        lebenserwartung: { type: "string" },
        besonderheit: { type: "string" },
      },
      required: [
        "lebensraum",
        "groesse",
        "futter",
        "lebenserwartung",
        "besonderheit",
      ],
    },
    lernziele: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
      description:
        "3-5 pädagogische Lernziele beim Ausmalen DIESES Motivs (Feinmotorik, Farbtheorie, Tierwissen, etc.). Konkret auf Motiv und Alter bezogen.",
    },
    farbempfehlungen: {
      type: "array",
      items: { type: "string" },
      minItems: 3,
      maxItems: 5,
      description:
        "3-5 konkrete Farbempfehlungen, jede mit Begründung. Beispiel: 'Schimmel-Weiß mit grauen Schatten in der Mähne für einen realistischen Look'.",
    },
    customFaqs: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      description:
        "Exakt 5 motiv-spezifische FAQs. KEINE generischen wie 'Ist es kostenlos?'. Fragen, die jemand wirklich googelt, z.B. 'Wie schnell galoppiert ein Pferd?' oder 'Welche Farben hat eine Maus?'",
      items: {
        type: "object",
        required: ["question", "answer"],
        properties: {
          question: { type: "string" },
          answer: { type: "string" },
        },
      },
    },
    semanticKeywords: {
      type: "array",
      items: { type: "string" },
      minItems: 8,
      maxItems: 15,
      description:
        "8-15 LSI-Keywords / verwandte Begriffe rund um das Motiv. Beispiel für Pferd: ['Schimmel', 'Stute', 'Hengst', 'Mähne', 'Reiten', 'Galopp', 'Pony']. Werden als Tag-Cloud auf der Seite gerendert.",
    },
  },
};

function buildPrompt(input: EnrichInput): string {
  const ageGroup =
    input.ageMin <= 5
      ? "Kleinkinder (Kindergarten-Alter)"
      : input.ageMin <= 10
      ? "Grundschulkinder"
      : input.ageMin <= 14
      ? "ältere Kinder / Jugendliche"
      : "Erwachsene";

  return `Du bist ein SEO-spezialisierter deutscher Content-Redakteur für eine Kinder-Ausmalbilder-Webseite.

Generiere strukturierten Inhalt für die Einzelseite eines Ausmalbilds:

**Motiv-Titel:** ${input.title}
**Kategorie:** ${input.categoryName} (Slug: ${input.categorySlug})
**Schwierigkeit:** ${input.difficulty}
**Zielgruppe:** ${ageGroup} ab ${input.ageMin} Jahren
**Format:** DIN A4, ${input.orientation}
**Stil:** ${input.style}

**Anforderungen:**
- Deutsche Sprache, kindgerechte Tonalität wo sinnvoll
- Motiv-SPEZIFISCH (z.B. echte Tier-Fakten, keine Generic-Templates)
- SEO-optimiert: natürlich vorkommende Keywords, semantisches Cluster
- E-E-A-T: konkrete, überprüfbare Fakten, keine Phrasen
- GEO-tauglich: beantwortet Fragen, die echte Nutzer in ChatGPT/Perplexity stellen würden
- Keine reine Phrasen wie "kostenloses PDF" oder "ohne Anmeldung" — das gehört nicht in den Long-Text

**Wichtig:** Wenn die Kategorie ein konkretes Tier beschreibt (z.B. ${input.categorySlug.startsWith("tiere/") ? "JA — das ist hier der Fall" : "NEIN — diese Kategorie ist kein Tier"}), fülle \`tierSteckbrief\` aus mit realen Fakten. Sonst lass das Feld weg.

Antworte mit dem JSON-Objekt gemäß Schema.`;
}

export async function enrichImageContent(
  input: EnrichInput
): Promise<ImageEnrichment | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not set — skipping enrichment");
    return null;
  }

  const body = {
    contents: [
      { role: "user", parts: [{ text: buildPrompt(input) }] },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  };

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("Gemini fetch failed:", err);
    return null;
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error(`Gemini ${res.status}: ${text.slice(0, 200)}`);
    return null;
  }

  const json = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const raw = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) {
    console.error("Gemini: no text in response");
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ImageEnrichment;
    // Sanity-check shape; trust schema otherwise
    if (
      typeof parsed.seoTextLong !== "string" ||
      !Array.isArray(parsed.motivFakten) ||
      !Array.isArray(parsed.lernziele) ||
      !Array.isArray(parsed.farbempfehlungen) ||
      !Array.isArray(parsed.customFaqs) ||
      !Array.isArray(parsed.semanticKeywords)
    ) {
      console.error("Gemini: enrichment shape invalid");
      return null;
    }
    // Drop tierSteckbrief if incomplete
    if (
      parsed.tierSteckbrief &&
      (["lebensraum", "groesse", "futter", "lebenserwartung", "besonderheit"] as const).some(
        (k) => typeof (parsed.tierSteckbrief as TierSteckbrief)?.[k] !== "string"
      )
    ) {
      parsed.tierSteckbrief = undefined;
    }
    return parsed;
  } catch (err) {
    console.error("Gemini: JSON parse failed:", err);
    return null;
  }
}
