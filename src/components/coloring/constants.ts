// ---------------------------------------------------------------------------
// ColoringTool v3 — Konstanten, Typen, Presets
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
  | "triangle";

export type Tool = DrawingTool | ShapeTool;

export type ToolGroup = "drawing" | "shapes";

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
  triangle: "shapes",
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

// --- Shape SVG paths (for star, heart preset shapes) ---------------------

// Star path (5-pointed, centered at 0,0, radius ~50)
export const STAR_PATH =
  "M 0 -50 L 11.8 -16.2 L 47.6 -15.5 L 19.1 8.2 L 29.4 43.4 L 0 22 L -29.4 43.4 L -19.1 8.2 L -47.6 -15.5 L -11.8 -16.2 Z";

// Heart path (centered at 0,0, ~100 wide)
export const HEART_PATH =
  "M 0 -20 C -25 -55, -65 -30, -50 0 C -35 30, 0 55, 0 55 C 0 55, 35 30, 50 0 C 65 -30, 25 -55, 0 -20 Z";
