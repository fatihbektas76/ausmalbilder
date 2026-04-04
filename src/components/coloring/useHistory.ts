import { useRef, useCallback, useState } from "react";
import { MAX_HISTORY } from "./constants";

// ---------------------------------------------------------------------------
// History Hook — ImageData snapshots for fast undo/redo
// ---------------------------------------------------------------------------

interface HistoryEntry {
  /** Raw pixel data from the drawing canvas (Layer 2) */
  layer2: ImageData;
  /** Fabric.js JSON string for shapes layer (Layer 3) */
  layer3: string;
}

interface UseHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  resetHistory: (initial: HistoryEntry) => void;
  /** Current entry for restoring after undo/redo */
  currentEntry: HistoryEntry | null;
  /** Register the Fabric canvas for snapshot serialisation */
  setFabricCanvas: (canvas: any) => void;
  /** Register the drawing canvas element for snapshots */
  setDrawingCanvas: (canvas: HTMLCanvasElement | null) => void;
}

export function useHistory(): UseHistoryReturn {
  const historyRef = useRef<HistoryEntry[]>([]);
  const indexRef = useRef(-1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fabricRef = useRef<any>(null);
  const drawingRef = useRef<HTMLCanvasElement | null>(null);

  // Force re-render when history changes (for canUndo/canRedo)
  const [, setTick] = useState(0);
  const tick = useCallback(() => setTick((t) => t + 1), []);

  const setFabricCanvas = useCallback((canvas: any) => {
    fabricRef.current = canvas;
  }, []);

  const setDrawingCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    drawingRef.current = canvas;
  }, []);

  const saveSnapshot = useCallback(() => {
    const drawCanvas = drawingRef.current;
    if (!drawCanvas) return;

    const ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    const layer2 = ctx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);

    let layer3 = "{}";
    if (fabricRef.current) {
      try {
        layer3 = JSON.stringify(fabricRef.current.toJSON());
      } catch {
        layer3 = "{}";
      }
    }

    const entry: HistoryEntry = { layer2, layer3 };

    // Discard future entries if we drew after an undo
    const history = historyRef.current;
    if (indexRef.current < history.length - 1) {
      historyRef.current = history.slice(0, indexRef.current + 1);
    }

    historyRef.current.push(entry);

    // Trim to max
    if (historyRef.current.length > MAX_HISTORY) {
      historyRef.current = historyRef.current.slice(
        historyRef.current.length - MAX_HISTORY
      );
    }

    indexRef.current = historyRef.current.length - 1;
    tick();
  }, [tick]);

  const undo = useCallback(() => {
    if (indexRef.current <= 0) return;
    indexRef.current--;
    tick();
  }, [tick]);

  const redo = useCallback(() => {
    if (indexRef.current >= historyRef.current.length - 1) return;
    indexRef.current++;
    tick();
  }, [tick]);

  const resetHistory = useCallback(
    (initial: HistoryEntry) => {
      historyRef.current = [initial];
      indexRef.current = 0;
      tick();
    },
    [tick]
  );

  const currentEntry =
    indexRef.current >= 0 && indexRef.current < historyRef.current.length
      ? historyRef.current[indexRef.current]
      : null;

  return {
    canUndo: indexRef.current > 0,
    canRedo: indexRef.current < historyRef.current.length - 1,
    saveSnapshot,
    undo,
    redo,
    resetHistory,
    currentEntry,
    setFabricCanvas,
    setDrawingCanvas,
  };
}
