// ---------------------------------------------------------------------------
// ColoringTool v2 — Konstanten, Typen, Presets
// ---------------------------------------------------------------------------

// --- Tool types -----------------------------------------------------------

export type DrawingTool =
  | "fill"
  | "brush-round"
  | "brush-flat"
  | "pencil"
  | "marker"
  | "eraser";

export type ShapeTool =
  | "circle"
  | "rect"
  | "star"
  | "heart"
  | "flower";

export type SpecialTool = "text" | "stamp";

export type Tool = DrawingTool | ShapeTool | SpecialTool;

export type ToolGroup = "drawing" | "shapes" | "special";

export const TOOL_GROUPS: Record<Tool, ToolGroup> = {
  fill: "drawing",
  "brush-round": "drawing",
  "brush-flat": "drawing",
  pencil: "drawing",
  marker: "drawing",
  eraser: "drawing",
  circle: "shapes",
  rect: "shapes",
  star: "shapes",
  heart: "shapes",
  flower: "shapes",
  text: "special",
  stamp: "special",
};

// --- Canvas dimensions ----------------------------------------------------

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 1131;

// --- History --------------------------------------------------------------

export const MAX_HISTORY = 30;

// --- Flood fill -----------------------------------------------------------

export const FILL_TOLERANCE = 32;

// --- Brush presets --------------------------------------------------------

export interface BrushPreset {
  label: string;
  shortLabel: string;
  size: number;
}

export const BRUSH_PRESETS: BrushPreset[] = [
  { label: "XS", shortLabel: "XS", size: 2 },
  { label: "S", shortLabel: "S", size: 5 },
  { label: "M", shortLabel: "M", size: 10 },
  { label: "L", shortLabel: "L", size: 20 },
  { label: "XL", shortLabel: "XL", size: 40 },
];

// --- 30-Color Palette -----------------------------------------------------

export interface ColorGroup {
  name: string;
  colors: string[];
}

export const COLOR_PALETTE: ColorGroup[] = [
  {
    name: "Hauttöne",
    colors: ["#FDDCB5", "#F5D5C8", "#D4A373", "#8B5E3C", "#5C3A21"],
  },
  {
    name: "Grundfarben",
    colors: ["#FF0000", "#FF8C00", "#FFD700", "#008000", "#0000FF", "#800080"],
  },
  {
    name: "Pastell",
    colors: ["#FFB3BA", "#FFDFBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E8BAFF"],
  },
  {
    name: "Natur",
    colors: ["#228B22", "#90EE90", "#87CEEB", "#4682B4", "#8B4513", "#DEB887"],
  },
  {
    name: "Standard",
    colors: ["#FF69B4", "#FF1493", "#808080", "#404040", "#000000", "#FFFFFF"],
  },
];

// Flat list of all palette colors
export const ALL_PALETTE_COLORS = COLOR_PALETTE.flatMap((g) => g.colors);

// --- Shape SVG paths (for star, heart, flower preset shapes) --------------

// Star path (5-pointed, centered at 0,0, radius ~50)
export const STAR_PATH =
  "M 0 -50 L 11.8 -16.2 L 47.6 -15.5 L 19.1 8.2 L 29.4 43.4 L 0 22 L -29.4 43.4 L -19.1 8.2 L -47.6 -15.5 L -11.8 -16.2 Z";

// Heart path (centered at 0,0, ~100 wide)
export const HEART_PATH =
  "M 0 -20 C -25 -55, -65 -30, -50 0 C -35 30, 0 55, 0 55 C 0 55, 35 30, 50 0 C 65 -30, 25 -55, 0 -20 Z";

// Flower path (simple 5-petal, centered at 0,0)
export const FLOWER_PATH =
  "M 0 -30 C 10 -40, 30 -35, 25 -15 C 20 5, 5 0, 0 0 C -5 0, -20 5, -25 -15 C -30 -35, -10 -40, 0 -30 Z " +
  "M 0 0 C 5 0, 20 5, 25 -15 " +
  "M 0 0 C 0 5, -5 25, -20 25 C -35 25, -35 5, -25 -15 " +
  "M 0 0 C 0 5, 5 25, 20 25 C 35 25, 35 5, 25 -15 " +
  "M 0 0 C -5 0, -20 -5, -20 -25";

// --- Stamp icons ----------------------------------------------------------

export interface StampDef {
  label: string;
  path: string;
  viewBox: string;
  scale: number;
}

export const STAMPS: StampDef[] = [
  {
    label: "Stern",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    viewBox: "0 0 24 24",
    scale: 1,
  },
  {
    label: "Herz",
    path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    viewBox: "0 0 24 24",
    scale: 1,
  },
  {
    label: "Sonne",
    path: "M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z",
    viewBox: "0 0 24 24",
    scale: 1,
  },
  {
    label: "Blume",
    path: "M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.34.56 2.56 1.45 3.44C8.1 14.75 9.66 15.3 11 14.95c-1.1-1.65-.98-3.86.3-5.38a5.003 5.003 0 00-5.7.68zM12 2C7.03 2 3 6.03 3 11c4.97 0 9-4.03 9-9zM18.4 10.25a5.003 5.003 0 00-5.7-.68c1.28 1.52 1.4 3.73.3 5.38 1.34.35 2.9-.2 3.95-1.26a4.98 4.98 0 001.45-3.44z",
    viewBox: "0 0 24 24",
    scale: 1,
  },
];
