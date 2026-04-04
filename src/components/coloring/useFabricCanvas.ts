import { useRef, useCallback, useEffect, useState } from "react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  STAR_PATH,
  HEART_PATH,
  STAMPS,
  type ShapeTool,
  type SpecialTool,
} from "./constants";

// ---------------------------------------------------------------------------
// Fabric.js Canvas Hook — Shapes, Text, Stamps (Layer 3)
// ---------------------------------------------------------------------------

interface UseFabricCanvasOptions {
  activeTool: ShapeTool | SpecialTool | null;
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
  const [ready, setReady] = useState(false);

  // Active stamp index (0-3, cycles through STAMPS)
  const stampIndexRef = useRef(0);

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

    // Position the wrapper correctly (Fabric creates a wrapper div)
    if (canvas.wrapperEl) {
      canvas.wrapperEl.style.position = "absolute";
      canvas.wrapperEl.style.top = "0";
      canvas.wrapperEl.style.left = "0";
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

  // --- Shape placement via click -------------------------------------------
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const fabricNs = fabricNsRef.current;
    if (!canvas || !fabricNs || !activeTool) return;

    const isShape = ["circle", "rect", "star", "heart", "flower"].includes(activeTool);
    const isSpecial = ["text", "stamp"].includes(activeTool);
    if (!isShape && !isSpecial) return;

    // Disable selection mode for placement tools
    canvas.isDrawingMode = false;
    canvas.selection = activeTool === "text"; // Allow selection for text editing

    const handleClick = (opt: any) => {
      const pointer = canvas.getPointer(opt.e);
      const x = pointer.x;
      const y = pointer.y;

      let obj: any = null;
      const size = brushSize * 3;

      switch (activeTool) {
        case "circle":
          obj = new fabricNs.Circle({
            left: x - size / 2,
            top: y - size / 2,
            radius: size / 2,
            fill: activeColor,
            stroke: "",
            strokeWidth: 0,
          });
          break;

        case "rect":
          obj = new fabricNs.Rect({
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            fill: activeColor,
            stroke: "",
            strokeWidth: 0,
          });
          break;

        case "star":
          obj = new fabricNs.Path(STAR_PATH, {
            left: x - size / 2,
            top: y - size / 2,
            fill: activeColor,
            stroke: "",
            scaleX: size / 100,
            scaleY: size / 100,
          });
          break;

        case "heart":
          obj = new fabricNs.Path(HEART_PATH, {
            left: x - size / 2,
            top: y - size / 2,
            fill: activeColor,
            stroke: "",
            scaleX: size / 100,
            scaleY: size / 100,
          });
          break;

        case "flower":
          // Simple circle cluster for flower
          obj = new fabricNs.Circle({
            left: x - size / 2,
            top: y - size / 2,
            radius: size / 2,
            fill: activeColor,
            stroke: activeColor,
            strokeWidth: 2,
          });
          break;

        case "text":
          obj = new fabricNs.IText("Text", {
            left: x,
            top: y,
            fontSize: brushSize * 2,
            fill: activeColor,
            fontFamily: "Segoe UI, system-ui, sans-serif",
          });
          break;

        case "stamp": {
          const stamp = STAMPS[stampIndexRef.current % STAMPS.length];
          obj = new fabricNs.Path(stamp.path, {
            left: x - size / 2,
            top: y - size / 2,
            fill: activeColor,
            stroke: "",
            scaleX: (size / 24) * stamp.scale,
            scaleY: (size / 24) * stamp.scale,
            selectable: false,
            evented: false,
          });
          break;
        }
      }

      if (obj) {
        canvas.add(obj);
        if (activeTool === "text") {
          canvas.setActiveObject(obj);
          obj.enterEditing();
        }
        canvas.renderAll();
        onObjectPlaced();
      }
    };

    canvas.on("mouse:down", handleClick);
    return () => {
      canvas.off("mouse:down", handleClick);
    };
  }, [activeTool, activeColor, brushSize, onObjectPlaced, ready]);

  // --- Cycle stamp type ----------------------------------------------------
  const nextStamp = useCallback(() => {
    stampIndexRef.current = (stampIndexRef.current + 1) % STAMPS.length;
  }, []);

  const currentStampIndex = stampIndexRef.current;

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
      canvas.loadFromJSON(json, () => {
        canvas.backgroundColor = "";
        canvas.renderAll();
      });
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
    initFabric,
    ready,
    clearObjects,
    serialize,
    deserialize,
    toCanvasElement,
    nextStamp,
    currentStampIndex,
  };
}
