import slugify from "slugify";

/**
 * Generate a URL-safe slug from a filename.
 * "Mein Pferd 2024 FINAL(1).jpg" → "mein-pferd"
 */
export function filenameToSlug(filename: string): string {
  // Remove extension
  const name = filename.replace(/\.[^/.]+$/, "");

  // Remove common junk suffixes: numbers in parens, FINAL, copy, etc.
  const cleaned = name
    .replace(/\s*\(\d+\)\s*/g, "") // (1), (2), etc.
    .replace(/\s*-?\s*(?:FINAL|final|copy|Copy|COPY)\s*/gi, "")
    .replace(/\s*\d{4}\s*/g, " ") // Year numbers like 2024
    .replace(/[_]+/g, " ") // underscores to spaces
    .trim();

  return slugify(cleaned, {
    lower: true,
    strict: true,
    locale: "de",
  });
}

/**
 * Convert a filename to a human-readable title.
 * "pferd-auf-der-weide.jpg" → "Pferd auf der Weide"
 */
export function filenameToTitle(filename: string): string {
  return (
    filename
      .replace(/\.[^/.]+$/, "") // remove extension
      .replace(/[-_]+/g, " ") // dashes/underscores → spaces
      .replace(/\s*\(\d+\)\s*/g, "") // remove (1), (2)
      .replace(/\s*(?:FINAL|final|copy|Copy|COPY)\s*/gi, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ")
  );
}

/**
 * Ensure slug is unique within existing slugs by appending -2, -3, etc.
 */
export function ensureUniqueSlug(
  slug: string,
  existingSlugs: string[]
): string {
  if (!existingSlugs.includes(slug)) return slug;

  let counter = 2;
  while (existingSlugs.includes(`${slug}-${counter}`)) {
    counter++;
  }
  return `${slug}-${counter}`;
}

/**
 * Generate SEO fields from title and category.
 */
export function generateSeoFields(
  title: string,
  category: string,
  ageMin: number
) {
  return {
    titleSeo: `${title} — Ausmalbild kostenlos`,
    altText: `${title} Ausmalbild kostenlos zum Ausdrucken`,
    seoDescription: `Kostenloses Ausmalbild ${title} für Kinder ab ${ageMin} Jahren. PDF herunterladen oder direkt online ausmalen — ohne Anmeldung.`,
    seoTextShort: `${title} — kostenloses Ausmalbild zum Ausdrucken und online Ausmalen.`,
    seoTextLong: "",
  };
}

/**
 * Map category slug to the JSON filename.
 * "tiere/pferd" → "tiere-pferd"
 */
export function categoryToJsonName(categorySlug: string): string {
  return categorySlug.replace(/\//g, "-");
}
