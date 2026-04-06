import { useRef, useCallback, useEffect, useState } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  STAR_PATH,
  HEART_PATH,
  type ShapeTool,
} from "./constants";

// ---------------------------------------------------------------------------
// Fabric.js Canvas Hook — Shapes with drag-to-draw (Layer 3, v3)
// ---------------------------------------------------------------------------

interface UseFabricCanvasOptions {
  activeTool: ShapeTool | null;
  activeColor: string;
  brushSize: number;
  onObjectPlaced: () => void;
}

export function useFabricCanvas({
  activeTool,
  activeColor,
  brushSize,
  onObjectPlaced,
}: UseFabricCanvasOptions) {
  const canvasElRef = useRef<HTMLCanvasElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricCanvasRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricNsRef = useRef<any>(null);
  const wrapperRef = useRef<HTMLElement | null>(null);
  const [ready, setReady] = useState(false);

  // Drag-to-draw state
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const previewObjRef = useRef<any>(null);

  // --- Initialize Fabric.js ------------------------------------------------
  const initFabric = useCallback(async () => {
    if (!canvasElRef.current || fabricCanvasRef.current) return;

    const fabricModule = await import("fabric");
    const fabricNs = (fabricModule as any).fabric ?? fabricModule;
    if (!fabricNs || !fabricNs.Canvas) return;

    fabricNsRef.current = fabricNs;

    const canvas = new fabricNs.Canvas(canvasElRef.current, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: "",
      selection: true,
    });

    canvas.isDrawingMode = false;
    fabricCanvasRef.current = canvas;

    // Position the wrapper correctly (Fabric v7 creates a div[data-fabric="wrapper"])
    const wrapper =
      canvas.wrapperEl ??
      canvasElRef.current?.closest("[data-fabric=wrapper]") ??
      canvasElRef.current?.parentElement;
    if (wrapper && wrapper !== canvasElRef.current) {
      wrapper.style.position = "absolute";
      wrapper.style.top = "0";
      wrapper.style.left = "0";
      wrapper.style.zIndex = "3";
      wrapperRef.current = wrapper as HTMLElement;
    }

    setReady(true);
  }, []);

  // --- Dispose on unmount --------------------------------------------------
  useEffect(() => {
    return () => {
      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
    };
  }, []);

  // --- Drag-to-draw for shapes ---------------------------------------------
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = fabricNsRef.current;
    if (!canvas || !fabricNs || !activeTool) return;

    const isShape = ["circle", "rect", "star", "heart", "triangle"].includes(activeTool);
    if (!isShape) return;

    // Disable selection and drawing mode for shape placement
    canvas.isDrawingMode = false;
    canvas.selection = false;

    const handleMouseDown = (opt: any) => {
      // Ignore if clicking on an existing object
      if (opt.target) return;

      // Fabric.js v7: use opt.scenePoint (getPointer was removed)
      const pointer = opt.scenePoint ?? canvas.getScenePoint(opt.e);
      drawStartRef.current = { x: pointer.x, y: pointer.y };

      // Create a dashed preview rect to show the bounding area
      const preview = new fabricNs.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: "transparent",
        stroke: "#999",
        strokeWidth: 1,
        strokeDashArray: [4, 4],
        selectable: false,
        evented: false,
      });

      previewObjRef.current = preview;
      canvas.add(preview);
      canvas.renderAll();
    };

    const handleMouseMove = (opt: any) => {
      if (!drawStartRef.current || !previewObjRef.current) return;

      const pointer = opt.scenePoint ?? canvas.getScenePoint(opt.e);
      const start = drawStartRef.current;
      const preview = previewObjRef.current;

      const left = Math.min(start.x, pointer.x);
      const top = Math.min(start.y, pointer.y);
      const width = Math.abs(pointer.x - start.x);
      const height = Math.abs(pointer.y - start.y);

      preview.set({ left, top, width, height });
      canvas.renderAll();
    };

    const handleMouseUp = (opt: any) => {
      if (!drawStartRef.current) return;

      const pointer = opt.scenePoint ?? canvas.getScenePoint(opt.e);
      const start = drawStartRef.current;

      // Remove preview
      if (previewObjRef.current) {
        canvas.remove(previewObjRef.current);
        previewObjRef.current = null;
      }
      drawStartRef.current = null;

      // Calculate final size (use the larger dimension, minimum 20px)
      const dragW = Math.abs(pointer.x - start.x);
      const dragH = Math.abs(pointer.y - start.y);
      const size = Math.max(Math.max(dragW, dragH), 20);

      // Position at the top-left of the drag area
      const left = Math.min(start.x, pointer.x);
      const top = Math.min(start.y, pointer.y);

      let obj: any = null;

      switch (activeTool) {
        case "circle":
          obj = new fabricNs.Circle({
            left,
            top,
            radius: size / 2,
            fill: activeColor,
            stroke: "",
            strokeWidth: 0,
          });
          break;

        case "rect":
          obj = new fabricNs.Rect({
            left,
            top,
            width: size,
            height: size,
            fill: activeColor,
            stroke: "",
            strokeWidth: 0,
          });
          break;

        case "star":
          obj = new fabricNs.Path(STAR_PATH, {
            left,
            top,
            fill: activeColor,
            stroke: "",
            scaleX: size / 100,
            scaleY: size / 100,
          });
          break;

        case "heart":
          obj = new fabricNs.Path(HEART_PATH, {
            left,
            top,
            fill: activeColor,
            stroke: "",
            scaleX: size / 100,
            scaleY: size / 100,
          });
          break;

        case "triangle":
          obj = new fabricNs.Polygon(
            [
              { x: size / 2, y: 0 },
              { x: size, y: size },
              { x: 0, y: size },
            ],
            {
              left,
              top,
              fill: activeColor,
              stroke: "",
              strokeWidth: 0,
            }
          );
          break;
      }

      if (obj) {
        canvas.add(obj);
        canvas.renderAll();
        onObjectPlaced();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);

      // Clean up any lingering preview
      if (previewObjRef.current) {
        canvas.remove(previewObjRef.current);
        previewObjRef.current = null;
      }
      drawStartRef.current = null;
    };
  }, [activeTool, activeColor, brushSize, onObjectPlaced, ready]);

  // --- Clear all objects ---------------------------------------------------
  const clearObjects = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    canvas.clear();
    canvas.backgroundColor = "";
    canvas.renderAll();
  }, []);

  // --- Serialize / deserialize for history ---------------------------------
  const serialize = useCallback((): string => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return "{}";
    try {
      return JSON.stringify(canvas.toJSON());
    } catch {
      return "{}";
    }
  }, []);

  const deserialize = useCallback((json: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    try {
      // Fabric.js v7: loadFromJSON returns a Promise (no callback)
      const result = canvas.loadFromJSON(json);
      if (result && typeof result.then === "function") {
        result.then(() => {
          canvas.backgroundColor = "";
          canvas.renderAll();
        });
      } else {
        canvas.backgroundColor = "";
        canvas.renderAll();
      }
    } catch {
      // ignore invalid JSON
    }
  }, []);

  // --- Get Fabric canvas element for export --------------------------------
  const toCanvasElement = useCallback((): HTMLCanvasElement | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    try {
      return canvas.toCanvasElement();
    } catch {
      return null;
    }
  }, []);

  return {
    canvasElRef,
    fabricCanvasRef,
    wrapperRef,
    initFabric,
    ready,
    clearObjects,
    serialize,
    deserialize,
    toCanvasElement,
  };
}
