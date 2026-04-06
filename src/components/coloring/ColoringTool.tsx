"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  TOOL_GROUPS,
  type Tool,
  type DrawingTool,
  type ShapeTool,
} from "./constants";
import { useHistory } from "./useHistory";
import { useDrawingCanvas } from "./useDrawingCanvas";
import { useFabricCanvas } from "./useFabricCanvas";
import Toolbar from "./toolbar/Toolbar";
import ColorPalette from "./toolbar/ColorPalette";
import { addWatermarkToCanvas } from "@/lib/watermark";

// ---------------------------------------------------------------------------
// Props (same interface as v1 — no breaking changes)
// ---------------------------------------------------------------------------
interface ColoringToolProps {
  imageSrc: string;
  imageTitle: string;
  imageSlug: string;
  onShare?: (imageDataUrl: string) => void;
}

export default function ColoringTool({
  imageSrc,
  imageTitle,
  imageSlug,
  onShare,
}: ColoringToolProps) {
  // --- State ---------------------------------------------------------------
  const [activeTool, setActiveTool] = useState<Tool>("brush-round");
  const [activeColor, setActiveColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(10);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [lineartLoaded, setLineartLoaded] = useState(false);
  const [fillToastVisible, setFillToastVisible] = useState(false);

  // --- Refs ----------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const layerContainerRef = useRef<HTMLDivElement>(null);
  const lineartImgRef = useRef<HTMLImageElement | null>(null);
  const isRestoringRef = useRef(false);

  // --- History hook ---------------------------------------------------------
  const history = useHistory();

  // --- Determine active tool group -----------------------------------------
  const toolGroup = TOOL_GROUPS[activeTool];
  const drawingTool: DrawingTool | null =
    toolGroup === "drawing" ? (activeTool as DrawingTool) : null;
  const fabricTool: ShapeTool | null =
    toolGroup === "shapes" ? (activeTool as ShapeTool) : null;

  // --- Save history after a stroke/action ----------------------------------
  const handleStrokeEnd = useCallback(() => {
    if (!isRestoringRef.current) {
      history.saveSnapshot();
    }
  }, [history]);

  // --- Drawing canvas hook (Layer 2) ---------------------------------------
  const drawing = useDrawingCanvas({
    activeTool: drawingTool,
    activeColor,
    brushSize,
    lineartImage: lineartImgRef.current,
    onStrokeEnd: handleStrokeEnd,
  });

  // --- Fabric canvas hook (Layer 3) ----------------------------------------
  const fabric = useFabricCanvas({
    activeTool: fabricTool,
    activeColor,
    brushSize,
    onObjectPlaced: handleStrokeEnd,
  });

  // --- Load lineart image --------------------------------------------------
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      lineartImgRef.current = img;
      setLineartLoaded(true);
    };
    img.src = imageSrc;

    return () => {
      img.onload = null;
    };
  }, [imageSrc]);

  // --- Initialize Fabric.js after component mounts -------------------------
  useEffect(() => {
    if (lineartLoaded) {
      fabric.initFabric();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineartLoaded]);

  // --- Register canvases with history hook ---------------------------------
  useEffect(() => {
    history.setDrawingCanvas(drawing.canvasRef.current);
  }, [history, drawing.canvasRef]);

  useEffect(() => {
    if (fabric.ready) {
      history.setFabricCanvas(fabric.fabricCanvasRef.current);
      // Save initial (empty) state
      history.saveSnapshot();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fabric.ready]);

  // --- Responsive scaling --------------------------------------------------
  useEffect(() => {
    function handleResize() {
      if (!containerRef.current || !layerContainerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      const scale = Math.min(1, containerWidth / CANVAS_WIDTH);
      const lc = layerContainerRef.current;
      lc.style.transform = `scale(${scale})`;
      lc.style.transformOrigin = "top left";
      containerRef.current.style.height = `${CANVAS_HEIGHT * scale}px`;
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [lineartLoaded, fabric.ready]);

  // --- Undo / Redo restoration ---------------------------------------------
  useEffect(() => {
    const entry = history.currentEntry;
    if (!entry || !drawing.canvasRef.current) return;

    const ctx = drawing.canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Only restore if this was triggered by undo/redo (not by initial save)
    // We detect this via the isRestoringRef
  }, [history.currentEntry, drawing.canvasRef]);

  const performRestore = useCallback(() => {
    const entry = history.currentEntry;
    if (!entry || !drawing.canvasRef.current) return;

    isRestoringRef.current = true;

    // Restore Layer 2 (drawing canvas)
    const ctx = drawing.canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.putImageData(entry.layer2, 0, 0);
    }

    // Restore Layer 3 (Fabric objects)
    if (entry.layer3 !== "{}") {
      fabric.deserialize(entry.layer3);
    } else {
      fabric.clearObjects();
    }

    isRestoringRef.current = false;
  }, [history.currentEntry, drawing.canvasRef, fabric]);

  // --- Undo handler --------------------------------------------------------
  const handleUndo = useCallback(() => {
    history.undo();
    // We need to schedule restore after state update
    setTimeout(() => performRestore(), 0);
  }, [history, performRestore]);

  // --- Redo handler --------------------------------------------------------
  const handleRedo = useCallback(() => {
    history.redo();
    setTimeout(() => performRestore(), 0);
  }, [history, performRestore]);

  // --- Reset handler -------------------------------------------------------
  const handleReset = useCallback(() => {
    drawing.clearCanvas();
    fabric.clearObjects();
    history.saveSnapshot();
  }, [drawing, fabric, history]);

  // --- Keyboard shortcuts: Ctrl+Z / Ctrl+Y --------------------------------
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleUndo, handleRedo]);

  // --- Export: merge all layers into a single PNG --------------------------
  const mergeLayersToDataUrl = useCallback((): string | null => {
    const drawCanvas = drawing.canvasRef.current;
    if (!drawCanvas || !lineartImgRef.current) return null;

    const offscreen = document.createElement("canvas");
    offscreen.width = CANVAS_WIDTH;
    offscreen.height = CANVAS_HEIGHT;
    const ctx = offscreen.getContext("2d")!;

    // 1. White background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Drawing layer (Layer 2)
    ctx.drawImage(drawCanvas, 0, 0);

    // 3. Lineart with multiply blend (Layer 1)
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(lineartImgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalCompositeOperation = "source-over";

    // 4. Fabric.js objects (Layer 3)
    const fabricEl = fabric.toCanvasElement();
    if (fabricEl) {
      ctx.drawImage(fabricEl, 0, 0);
    }

    // 5. Watermark
    addWatermarkToCanvas(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    return offscreen.toDataURL("image/png");
  }, [drawing.canvasRef, fabric]);

  const handleExport = useCallback(() => {
    const dataUrl = mergeLayersToDataUrl();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${imageSlug}-ausmalbild.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageSlug, mergeLayersToDataUrl]);

  const handleShare = useCallback(() => {
    if (!onShare) return;
    const dataUrl = mergeLayersToDataUrl();
    if (dataUrl) onShare(dataUrl);
  }, [onShare, mergeLayersToDataUrl]);

  // --- Color change handler (tracks recent colors) -------------------------
  const handleColorChange = useCallback(
    (color: string) => {
      setActiveColor(color);
      if (activeTool === "eraser") setActiveTool("brush-round");
      setRecentColors((prev) => {
        const filtered = prev.filter((c) => c !== color);
        return [color, ...filtered].slice(0, 5);
      });
    },
    [activeTool]
  );

  // --- Tool change handler -------------------------------------------------
  const handleToolChange = useCallback((tool: Tool) => {
    setActiveTool(tool);
    if (tool === "fill") {
      setFillToastVisible(true);
      setTimeout(() => setFillToastVisible(false), 3000);
    }
  }, []);

  // --- Pointer events switching --------------------------------------------
  const drawingPointerEvents = toolGroup === "drawing" ? "auto" : "none";
  const fabricPointerEvents = toolGroup === "shapes" ? "auto" : "none";

  // Fabric v7: pointer-events must be set on the wrapper div, not the inner canvas
  useEffect(() => {
    if (fabric.wrapperRef.current) {
      fabric.wrapperRef.current.style.pointerEvents = fabricPointerEvents;
    }
  }, [fabricPointerEvents, fabric.wrapperRef]);

  // --- Cursor style per tool -----------------------------------------------
  const cursorStyle =
    activeTool === "eraser"
      ? "cell"
      : activeTool === "fill"
        ? "crosshair"
        : "crosshair";

  // --- Render --------------------------------------------------------------
  return (
    <div className="w-full">
      {/* Toolbar */}
      <Toolbar
        activeTool={activeTool}
        onToolChange={handleToolChange}
        brushSize={brushSize}
        onSizeChange={setBrushSize}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        onExport={handleExport}
        onShare={onShare ? handleShare : undefined}
      />

      {/* Color palette */}
      <div className="mb-3">
        <ColorPalette
          activeColor={activeColor}
          recentColors={recentColors}
          onColorChange={handleColorChange}
        />
      </div>

      {/* Fill toast */}
      {fillToastVisible && (
        <div className="mb-3 rounded-lg bg-[#FEF0EB] px-4 py-2 text-sm text-[#E8490F]">
          Füll-Modus aktiv: Klicke auf einen Bereich im Bild, um ihn mit der
          gewählten Farbe zu füllen.
        </div>
      )}

      {/* Canvas container */}
      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-lg border border-[#1D1448]/10 bg-white shadow-sm"
        style={{ cursor: cursorStyle }}
      >
        {!lineartLoaded && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-sm text-[#1D1448]/60">
              Ausmalen-Tool wird geladen...
            </div>
          </div>
        )}

        {/* 3-Layer stack */}
        <div
          ref={layerContainerRef}
          className="relative"
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
          }}
        >
          {/* Layer 2 (bottom): Drawing canvas — native Canvas 2D */}
          <canvas
            ref={drawing.canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="absolute top-0 left-0"
            style={{ pointerEvents: drawingPointerEvents, zIndex: 1 }}
          />

          {/* Layer 1 (middle): Lineart image — multiply blend */}
          {lineartLoaded && (
            <img
              src={imageSrc}
              alt={imageTitle}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="absolute top-0 left-0"
              style={{
                mixBlendMode: "multiply",
                pointerEvents: "none",
                zIndex: 2,
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
              }}
            />
          )}

          {/* Layer 3 (top): Fabric.js canvas — shapes
              Fabric v7 wraps this in a div[data-fabric="wrapper"]
              pointer-events and z-index are set on the wrapper via useEffect */}
          <canvas
            ref={fabric.canvasElRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
          />
        </div>
      </div>

      {/* Image title below canvas */}
      <p className="mt-2 text-center text-sm text-[#1D1448]/50">
        {imageTitle} &mdash; Online ausmalen auf ausmalbilder-gratis.com
      </p>
    </div>
  );
}
