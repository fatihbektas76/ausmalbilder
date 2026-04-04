import { useRef, useCallback, useEffect } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  FILL_TOLERANCE,
  type DrawingTool,
} from "./constants";

// ---------------------------------------------------------------------------
// Flood Fill helpers (scanline, stack-based)
// ---------------------------------------------------------------------------
type RGBA = [number, number, number, number];

function hexToRgba(hex: string): RGBA {
  const c = hex.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16),
    parseInt(c.substring(2, 4), 16),
    parseInt(c.substring(4, 6), 16),
    255,
  ];
}

function getPixelIndex(x: number, y: number, w: number) {
  return (y * w + x) * 4;
}

function getPixelColor(d: Uint8ClampedArray, x: number, y: number, w: number): RGBA {
  const i = getPixelIndex(x, y, w);
  return [d[i], d[i + 1], d[i + 2], d[i + 3]];
}

function colorsMatch(a: RGBA, b: RGBA, tol: number) {
  return (
    Math.abs(a[0] - b[0]) <= tol &&
    Math.abs(a[1] - b[1]) <= tol &&
    Math.abs(a[2] - b[2]) <= tol &&
    Math.abs(a[3] - b[3]) <= tol
  );
}

/**
 * Scanline flood fill.
 * `composite` = the composite ImageData (drawing + lineart) used for boundary detection.
 * `target` = the drawing canvas ImageData where fill color is actually written.
 */
function floodFillComposite(
  composite: ImageData,
  target: ImageData,
  startX: number,
  startY: number,
  fillColorHex: string
) {
  const w = composite.width;
  const h = composite.height;
  const cd = composite.data;
  const td = target.data;

  const sx = Math.round(startX);
  const sy = Math.round(startY);
  if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;

  const targetColor = getPixelColor(cd, sx, sy, w);
  const fillColor = hexToRgba(fillColorHex);

  if (colorsMatch(targetColor, fillColor, FILL_TOLERANCE)) return;

  const visited = new Uint8Array(w * h);
  const stack: [number, number][] = [[sx, sy]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    if (x < 0 || x >= w || y < 0 || y >= h) continue;

    const vi = y * w + x;
    if (visited[vi]) continue;

    const current = getPixelColor(cd, x, y, w);
    if (!colorsMatch(current, targetColor, FILL_TOLERANCE)) continue;

    // Scanline expand left
    let left = x;
    while (left > 0) {
      const lv = y * w + (left - 1);
      if (visited[lv]) break;
      if (!colorsMatch(getPixelColor(cd, left - 1, y, w), targetColor, FILL_TOLERANCE)) break;
      left--;
    }

    // Scanline expand right
    let right = x;
    while (right < w - 1) {
      const rv = y * w + (right + 1);
      if (visited[rv]) break;
      if (!colorsMatch(getPixelColor(cd, right + 1, y, w), targetColor, FILL_TOLERANCE)) break;
      right++;
    }

    // Fill the span on BOTH composite (for future boundary checks) and target
    for (let i = left; i <= right; i++) {
      const idx = getPixelIndex(i, y, w);
      // Write to composite so subsequent boundary checks see the fill
      cd[idx] = fillColor[0];
      cd[idx + 1] = fillColor[1];
      cd[idx + 2] = fillColor[2];
      cd[idx + 3] = fillColor[3];
      // Write to target (drawing canvas)
      td[idx] = fillColor[0];
      td[idx + 1] = fillColor[1];
      td[idx + 2] = fillColor[2];
      td[idx + 3] = fillColor[3];

      visited[y * w + i] = 1;

      if (y > 0 && !visited[(y - 1) * w + i]) stack.push([i, y - 1]);
      if (y < h - 1 && !visited[(y + 1) * w + i]) stack.push([i, y + 1]);
    }
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseDrawingCanvasOptions {
  activeTool: DrawingTool | null;
  activeColor: string;
  brushSize: number;
  lineartImage: HTMLImageElement | null;
  onStrokeEnd: () => void;
}

export function useDrawingCanvas({
  activeTool,
  activeColor,
  brushSize,
  lineartImage,
  onStrokeEnd,
}: UseDrawingCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // --- Coordinate translation (handles CSS scale) --------------------------
  const getCoords = useCallback(
    (e: MouseEvent | Touch): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const scaleX = CANVAS_WIDTH / rect.width;
      const scaleY = CANVAS_HEIGHT / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    []
  );

  // --- Build composite ImageData for flood fill boundary detection ---------
  const buildComposite = useCallback((): ImageData | null => {
    const canvas = canvasRef.current;
    if (!canvas || !lineartImage) return null;
    const tmp = document.createElement("canvas");
    tmp.width = CANVAS_WIDTH;
    tmp.height = CANVAS_HEIGHT;
    const ctx = tmp.getContext("2d")!;

    // Draw white bg
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw current drawing layer
    ctx.drawImage(canvas, 0, 0);

    // Draw lineart with multiply blend
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(lineartImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.globalCompositeOperation = "source-over";

    return ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, [lineartImage]);

  // --- Stroke style setup --------------------------------------------------
  const applyBrushStyle = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      switch (activeTool) {
        case "brush-round":
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = brushSize;
          ctx.strokeStyle = activeColor;
          break;
        case "brush-flat":
          ctx.lineCap = "square";
          ctx.lineJoin = "miter";
          ctx.lineWidth = brushSize;
          ctx.strokeStyle = activeColor;
          break;
        case "pencil":
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = Math.max(1, brushSize * 0.4);
          ctx.strokeStyle = activeColor;
          ctx.globalAlpha = 0.85;
          break;
        case "marker":
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = brushSize * 1.5;
          ctx.strokeStyle = activeColor;
          ctx.globalAlpha = 0.7;
          break;
        case "eraser":
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = brushSize;
          ctx.globalCompositeOperation = "destination-out";
          ctx.strokeStyle = "rgba(0,0,0,1)";
          break;
        default:
          break;
      }
    },
    [activeTool, activeColor, brushSize]
  );

  // --- Handle flood fill ---------------------------------------------------
  const handleFill = useCallback(
    (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const compositeData = buildComposite();
      if (!compositeData) return;

      const drawingData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      floodFillComposite(compositeData, drawingData, x, y, activeColor);

      ctx.putImageData(drawingData, 0, 0);
      onStrokeEnd();
    },
    [activeColor, buildComposite, onStrokeEnd]
  );

  // --- Mouse / touch event handlers ----------------------------------------
  const handlePointerDown = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!activeTool) return;
      const touch = "touches" in e ? e.touches[0] : (e as MouseEvent);
      const pos = getCoords(touch);
      if (!pos) return;

      if (activeTool === "fill") {
        handleFill(pos.x, pos.y);
        return;
      }

      // Start drawing stroke
      isDrawing.current = true;
      lastPos.current = pos;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      applyBrushStyle(ctx);
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);

      // Draw a dot for single clicks
      ctx.lineTo(pos.x + 0.1, pos.y + 0.1);
      ctx.stroke();
    },
    [activeTool, getCoords, handleFill, applyBrushStyle]
  );

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing.current || !activeTool || activeTool === "fill") return;
      const touch = "touches" in e ? e.touches[0] : (e as MouseEvent);
      const pos = getCoords(touch);
      if (!pos) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      applyBrushStyle(ctx);
      ctx.beginPath();
      if (lastPos.current) {
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
      }
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();

      lastPos.current = pos;
    },
    [activeTool, getCoords, applyBrushStyle]
  );

  const handlePointerUp = useCallback(() => {
    if (isDrawing.current) {
      isDrawing.current = false;
      lastPos.current = null;
      onStrokeEnd();
    }
  }, [onStrokeEnd]);

  // --- Attach event listeners to canvas ------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeTool) return;

    // Only handle events when a drawing tool is active
    const isDrawingTool = [
      "fill",
      "brush-round",
      "brush-flat",
      "pencil",
      "marker",
      "eraser",
    ].includes(activeTool);
    if (!isDrawingTool) return;

    const onMouseDown = (e: MouseEvent) => handlePointerDown(e);
    const onMouseMove = (e: MouseEvent) => handlePointerMove(e);
    const onMouseUp = () => handlePointerUp();
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerDown(e);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerMove(e);
    };
    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      handlePointerUp();
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [activeTool, handlePointerDown, handlePointerMove, handlePointerUp]);

  // --- Clear the entire drawing canvas -------------------------------------
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }, []);

  return {
    canvasRef,
    clearCanvas,
  };
}
