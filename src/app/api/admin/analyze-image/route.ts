import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const VALID_CATEGORIES = [
  "tiere/pferd",
  "tiere/elefant",
  "tiere/loewen",
  "mandala",
  "fantasie/drachen",
  "natur/blume",
  "saisonal/weihnachten",
  "saisonal/ostern",
  "saisonal/halloween",
  "saisonal/herbst",
  "saisonal/fruehling",
  "erwachsene",
] as const;

export async function POST(request: Request) {
  try {
    const { image, mediaType } = await request.json();

    if (!image || !mediaType) {
      return NextResponse.json(
        { error: "Bild und mediaType erforderlich" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY nicht konfiguriert" },
        { status: 500 }
      );
    }

    const client = new Anthropic({ apiKey });

    const categoryList = VALID_CATEGORIES.join("|");

    const response = await client.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/webp"
                  | "image/gif",
                data: image,
              },
            },
            {
              type: "text",
              text: `Du analysierst ein Ausmalbild (Schwarz-Weiß Lineart).
Antworte NUR mit validem JSON, kein Text davor oder danach:
{
  "titleDE": "3-5 Wörter auf Deutsch, beschreibt das Motiv präzise",
  "titleEN": "3-5 Wörter auf Englisch, SEO-optimiert für US-Markt",
  "category": "${categoryList}",
  "difficulty": "einfach|mittel|komplex",
  "confidence": 0.0-1.0
}

Regeln:
- titleDE: natürlicher deutscher Titel, kein "Ausmalbild" im Titel
- titleEN: SEO-freundlich für den englischsprachigen Markt
- category: die passendste der oben genannten Kategorien
- difficulty: einfach = wenige Linien/große Flächen, mittel = mittlere Details, komplex = viele feine Details
- confidence: wie sicher du dir bei der Kategorie-Zuordnung bist

Beispiele:
{"titleDE":"Pferd auf der Weide","titleEN":"Horse in the Meadow","category":"tiere/pferd","difficulty":"mittel","confidence":0.95}
{"titleDE":"Blumen Mandala","titleEN":"Floral Mandala","category":"mandala","difficulty":"komplex","confidence":0.9}
{"titleDE":"Drachen mit Flügeln","titleEN":"Dragon with Wings","category":"fantasie/drachen","difficulty":"mittel","confidence":0.85}`,
            },
          ],
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response (handle potential markdown wrapping)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "KI-Antwort enthält kein gültiges JSON" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate category
    if (!VALID_CATEGORIES.includes(parsed.category)) {
      parsed.category = "erwachsene"; // fallback
      parsed.confidence = Math.min(parsed.confidence || 0.5, 0.5);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI analysis error:", error);
    return NextResponse.json(
      { error: `KI-Analyse fehlgeschlagen: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
