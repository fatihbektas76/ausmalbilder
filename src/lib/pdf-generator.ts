import { PDFDocument } from "pdf-lib";

// DIN A4 dimensions in points (72 dpi)
const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_MM = 10;
const MARGIN_PT = (MARGIN_MM / 25.4) * 72; // ~28.35pt

/**
 * Generate a print-ready DIN A4 PDF with the image centered
 * and 10mm margins on all sides.
 */
export async function generatePdf(imageBuffer: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // Embed the image (try PNG first, fall back to JPEG)
  let image;
  try {
    image = await pdfDoc.embedPng(imageBuffer);
  } catch {
    image = await pdfDoc.embedJpg(imageBuffer);
  }

  // Calculate dimensions to fit within margins while keeping aspect ratio
  const maxWidth = A4_WIDTH - 2 * MARGIN_PT;
  const maxHeight = A4_HEIGHT - 2 * MARGIN_PT;
  const imgAspect = image.width / image.height;
  const pageAspect = maxWidth / maxHeight;

  let drawWidth: number;
  let drawHeight: number;

  if (imgAspect > pageAspect) {
    // Image is wider → fit to width
    drawWidth = maxWidth;
    drawHeight = maxWidth / imgAspect;
  } else {
    // Image is taller → fit to height
    drawHeight = maxHeight;
    drawWidth = maxHeight * imgAspect;
  }

  // Center on page
  const x = (A4_WIDTH - drawWidth) / 2;
  const y = (A4_HEIGHT - drawHeight) / 2;

  page.drawImage(image, { x, y, width: drawWidth, height: drawHeight });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
