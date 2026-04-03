"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface ColoringToolProps {
  imageSrc: string;
  imageTitle: string;
  imageSlug: string;
  onShare?: (imageDataUrl: string) => void;
}

type Tool = "fill" | "brush" | "eraser";

const PALETTE_COLORS = [
  "#F5D5C8", // hautfarben
  "#8B4513", // braun
  "#F5DEB3", // beige
  "#FFD700", // gelb
  "#FF8C00", // orange
  "#FF0000", // rot
  "#FF69B4", // rosa
  "#800080", // lila
  "#0000FF", // blau
  "#87CEEB", // hellblau
  "#008000", // gruen
  "#90EE90", // hellgruen
  "#808080", // grau
  "#404040", // dunkelgrau
  "#000000", // schwarz
  "#FFFFFF", // weiss
];

const BRUSH_SIZES: { label: string; width: number }[] = [
  { label: "S", width: 3 },
  { label: "M", width: 8 },
  { label: "L", width: 15 },
];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 1131;
const MAX_HISTORY = 20;

export default function ColoringTool({
  imageSrc,
  imageTitle,
  imageSlug,
  onShare,
}: ColoringToolProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<string[]>([]);
  const isRestoringRef = useRef(false);

  const [activeTool, setActiveTool] = useState<Tool>("brush");
  const [brushSize, setBrushSize] = useState<number>(8);
  const [activeColor, setActiveColor] = useState<string>("#000000");
  const [fabricLoaded, setFabricLoaded] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [fillToastVisible, setFillToastVisible] = useState(false);

  // ------------------------------------------------------------------
  // Save a canvas state snapshot for undo
  // ------------------------------------------------------------------
  const saveState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || isRestoringRef.current) return;

    const json = JSON.stringify(canvas.toJSON());
    const history = historyRef.current;

    // If we undid some steps and then draw, discard the "future" states
    if (historyIndex < history.length - 1) {
      historyRef.current = history.slice(0, historyIndex + 1);
    }

    historyRef.current.push(json);

    // Trim to MAX_HISTORY
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(
        historyRef.current.length - MAX_HISTORY
      );
    }

    setHistoryIndex(historyRef.current.length - 1);
  }, [historyIndex]);

  // ------------------------------------------------------------------
  // Dynamic fabric.js import + canvas initialisation
  // ------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    async function init() {
      // Dynamic import avoids SSR issues — fabric accesses window/document
      const fabricModule = await import("fabric");
      if (cancelled) return;

      const fabricNs = (fabricModule as any).fabric ?? fabricModule;
      if (!fabricNs || !fabricNs.Canvas) {
        console.error("fabric namespace not found");
        return;
      }

      // Expose on window so later helpers can access it easily
      (window as any).__fabric = fabricNs;
      setFabricLoaded(true);

      if (!canvasRef.current) return;

      const canvas = new fabricNs.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: "#FFFFFF",
      });

      fabricCanvasRef.current = canvas;

      // Default brush
      canvas.freeDrawingBrush = new fabricNs.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = "#000000";
      canvas.freeDrawingBrush.width = 8;

      // Load background image
      fabricNs.Image.fromURL(
        imageSrc,
        (img: any) => {
          if (cancelled || !img) return;

          // Scale image to fit canvas while preserving aspect ratio
          const scaleX = CANVAS_WIDTH / (img.width || CANVAS_WIDTH);
          const scaleY = CANVAS_HEIGHT / (img.height || CANVAS_HEIGHT);
          const scale = Math.min(scaleX, scaleY);

          img.set({
            scaleX: scale,
            scaleY: scale,
            originX: "left",
            originY: "top",
            left: (CANVAS_WIDTH - (img.width || 0) * scale) / 2,
            top: (CANVAS_HEIGHT - (img.height || 0) * scale) / 2,
          });

          canvas.setBackgroundImage(img, () => {
            canvas.renderAll();
            // Save initial state
            historyRef.current = [JSON.stringify(canvas.toJSON())];
            setHistoryIndex(0);
            setCanvasReady(true);
          });
        },
        { crossOrigin: "anonymous" }
      );

      // Listen for drawing events to save history
      canvas.on("path:created", () => {
        saveState();
      });
      canvas.on("object:added", () => {
        // path:created also triggers object:added, but we guard via isRestoring
        // We save here for fill-circles added programmatically
      });
    }

    init();

    return () => {
      cancelled = true;
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  // ------------------------------------------------------------------
  // Responsive scaling
  // ------------------------------------------------------------------
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current || !canvasRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const scale = Math.min(1, containerWidth / CANVAS_WIDTH);
      const wrapper = canvasRef.current.parentElement;
      if (wrapper) {
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.transformOrigin = "top left";
        wrapper.style.width = `${CANVAS_WIDTH}px`;
        wrapper.style.height = `${CANVAS_HEIGHT}px`;
        // Set container height so page layout knows the visible height
        containerRef.current.style.height = `${CANVAS_HEIGHT * scale}px`;
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [fabricLoaded, canvasReady]);

  // ------------------------------------------------------------------
  // Update brush whenever tool / color / size changes
  // ------------------------------------------------------------------
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs) return;

    if (activeTool === "brush") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabricNs.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = activeColor;
      canvas.freeDrawingBrush.width = brushSize;
    } else if (activeTool === "eraser") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabricNs.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = "#FFFFFF";
      canvas.freeDrawingBrush.width = brushSize;
    } else if (activeTool === "fill") {
      canvas.isDrawingMode = false;
    }
  }, [activeTool, activeColor, brushSize, fabricLoaded, canvasReady]);

  // ------------------------------------------------------------------
  // Fill mode — click handler
  // ------------------------------------------------------------------
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs || activeTool !== "fill") return;

    const handleMouseDown = (opt: any) => {
      const pointer = canvas.getPointer(opt.e);
      const circle = new fabricNs.Circle({
        left: pointer.x - 15,
        top: pointer.y - 15,
        radius: 15,
        fill: activeColor,
        selectable: false,
        evented: false,
      });
      canvas.add(circle);
      canvas.renderAll();
      saveState();
    };

    canvas.on("mouse:down", handleMouseDown);
    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [activeTool, activeColor, saveState, fabricLoaded, canvasReady]);

  // ------------------------------------------------------------------
  // Undo
  // ------------------------------------------------------------------
  const handleUndo = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs) return;

    const history = historyRef.current;
    const idx = historyIndex;
    if (idx <= 0) return;

    const prevIdx = idx - 1;
    const prevState = history[prevIdx];
    if (!prevState) return;

    isRestoringRef.current = true;
    canvas.loadFromJSON(prevState, () => {
      canvas.renderAll();
      setHistoryIndex(prevIdx);
      isRestoringRef.current = false;
    });
  }, [historyIndex]);

  // ------------------------------------------------------------------
  // Keyboard shortcut: Ctrl+Z
  // ------------------------------------------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo]);

  // ------------------------------------------------------------------
  // Reset
  // ------------------------------------------------------------------
  const handleReset = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs) return;

    // Remove all objects but keep background image
    canvas.getObjects().forEach((obj: any) => canvas.remove(obj));
    canvas.renderAll();

    // Reset history
    historyRef.current = [JSON.stringify(canvas.toJSON())];
    setHistoryIndex(0);
  }, []);

  // ------------------------------------------------------------------
  // Export as PNG
  // ------------------------------------------------------------------
  const handleExport = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs) return;

    // Add watermark
    const watermark = new fabricNs.Text("ausmalbilder-gratis.com", {
      fontSize: 14,
      fill: "rgba(29, 20, 72, 0.4)",
      left: CANVAS_WIDTH - 12,
      top: CANVAS_HEIGHT - 26,
      originX: "right",
      selectable: false,
      evented: false,
    });
    canvas.add(watermark);
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    // Remove watermark again so user can keep editing
    canvas.remove(watermark);
    canvas.renderAll();

    // Trigger download
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${imageSlug}-ausmalbild.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageSlug]);

  // ------------------------------------------------------------------
  // Share
  // ------------------------------------------------------------------
  const handleShare = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = (window as any).__fabric;
    if (!canvas || !fabricNs || !onShare) return;

    // Add watermark for the shared image
    const watermark = new fabricNs.Text("ausmalbilder-gratis.com", {
      fontSize: 14,
      fill: "rgba(29, 20, 72, 0.4)",
      left: CANVAS_WIDTH - 12,
      top: CANVAS_HEIGHT - 26,
      originX: "right",
      selectable: false,
      evented: false,
    });
    canvas.add(watermark);
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
      multiplier: 1,
    });

    canvas.remove(watermark);
    canvas.renderAll();

    onShare(dataUrl);
  }, [onShare]);

  // ------------------------------------------------------------------
  // Fill toast
  // ------------------------------------------------------------------
  const selectFillTool = () => {
    setActiveTool("fill");
    setFillToastVisible(true);
    setTimeout(() => setFillToastVisible(false), 3000);
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        {/* Fill */}
        <button
          onClick={selectFillTool}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTool === "fill"
              ? "bg-[#E8490F] text-white"
              : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
          }`}
        >
          Fuellen
        </button>

        {/* Brush */}
        <button
          onClick={() => setActiveTool("brush")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTool === "brush"
              ? "bg-[#E8490F] text-white"
              : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
          }`}
        >
          Pinsel
        </button>

        {/* Brush sizes (visible when brush or eraser active) */}
        {(activeTool === "brush" || activeTool === "eraser") && (
          <div className="flex items-center gap-1">
            {BRUSH_SIZES.map((s) => (
              <button
                key={s.label}
                onClick={() => setBrushSize(s.width)}
                className={`h-8 w-8 rounded-md text-xs font-semibold transition-colors ${
                  brushSize === s.width
                    ? "bg-[#1D1448] text-white"
                    : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#1D1448]/10"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Eraser */}
        <button
          onClick={() => setActiveTool("eraser")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            activeTool === "eraser"
              ? "bg-[#E8490F] text-white"
              : "bg-[#F7F6F2] text-[#1D1448] hover:bg-[#E8490F]/10"
          }`}
        >
          Radierer
        </button>

        <div className="mx-1 h-6 w-px bg-[#1D1448]/10" />

        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={historyIndex <= 0}
          className="rounded-md bg-[#F7F6F2] px-3 py-2 text-sm font-medium text-[#1D1448] transition-colors hover:bg-[#1D1448]/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Rueckgaengig
        </button>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="rounded-md bg-[#F7F6F2] px-3 py-2 text-sm font-medium text-[#1D1448] transition-colors hover:bg-[#1D1448]/10"
        >
          Zuruecksetzen
        </button>

        <div className="mx-1 h-6 w-px bg-[#1D1448]/10" />

        {/* Export */}
        <button
          onClick={handleExport}
          className="rounded-md bg-[#1D1448] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D1448]/90"
        >
          Als PNG speichern
        </button>

        {/* Share */}
        {onShare && (
          <button
            onClick={handleShare}
            className="rounded-md bg-[#E8490F] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#E8490F]/90"
          >
            Teilen
          </button>
        )}
      </div>

      {/* Color palette */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg bg-white p-3 shadow-sm">
        {PALETTE_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => {
              setActiveColor(color);
              if (activeTool === "eraser") setActiveTool("brush");
            }}
            className="relative h-8 w-8 rounded-full border transition-transform hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: color === "#FFFFFF" ? "#D1D5DB" : color,
              outline:
                activeColor === color ? "3px solid #E8490F" : "none",
              outlineOffset: "2px",
            }}
            aria-label={`Farbe ${color}`}
          />
        ))}

        {/* Custom color picker */}
        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-[#1D1448]/30">
          <input
            type="color"
            value={activeColor}
            onChange={(e) => {
              setActiveColor(e.target.value);
              if (activeTool === "eraser") setActiveTool("brush");
            }}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
          <span className="text-xs font-bold text-[#1D1448]/60">+</span>
        </label>

        {/* Active color preview */}
        <div className="ml-2 flex items-center gap-2">
          <div
            className="h-6 w-6 rounded border border-[#1D1448]/20"
            style={{ backgroundColor: activeColor }}
          />
          <span className="text-xs text-[#1D1448]/60">{activeColor}</span>
        </div>
      </div>

      {/* Fill toast */}
      {fillToastVisible && (
        <div className="mb-3 rounded-lg bg-[#FEF0EB] px-4 py-2 text-sm text-[#E8490F]">
          Fuell-Modus aktiv: Klicke auf eine Stelle im Bild, um einen
          Farbpunkt zu setzen.
        </div>
      )}

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-[#1D1448]/10 bg-white shadow-sm"
      >
        {!fabricLoaded && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-sm text-[#1D1448]/60">
              Ausmalen-Tool wird geladen...
            </div>
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>

      {/* Image title below canvas */}
      <p className="mt-2 text-center text-sm text-[#1D1448]/50">
        {imageTitle} &mdash; Online ausmalen auf ausmalbilder-gratis.com
      </p>
    </div>
  );
}
