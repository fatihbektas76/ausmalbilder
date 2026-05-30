"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchRecord } from "@/app/api/search-data/route";

type Difficulty = "leicht" | "mittel" | "schwer";

const DIFFICULTY: Record<
  Difficulty,
  { grid: number; trayCols: number; label: string }
> = {
  leicht: { grid: 2, trayCols: 4, label: "Leicht (4 Teile)" },   // 2×2 board, 1 row tray
  mittel: { grid: 3, trayCols: 5, label: "Mittel (9 Teile)" },   // 3×3 board, 2 rows
  schwer: { grid: 4, trayCols: 8, label: "Schwer (16 Teile)" },  // 4×4 board, 2 rows
};

// Generous snap distance — small fingers, kids 3-6
const SNAP_DISTANCE = 50;

interface Piece {
  id: number;
  row: number;
  col: number;
  // Current position (during drag / tray)
  x: number;
  y: number;
  // Tray home position — piece returns here on missed drop
  homeX: number;
  homeY: number;
  isPlaced: boolean;
  isDragging: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function PuzzleGame() {
  const [pool, setPool] = useState<SearchRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("leicht");
  const [image, setImage] = useState<SearchRecord | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [boardSize, setBoardSize] = useState(320); // px (board is square)
  const [won, setWon] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef<{ x: number; y: number } | null>(null);

  // Load image pool
  useEffect(() => {
    fetch("/api/search-data")
      .then((r) => r.json())
      .then((data: { records: SearchRecord[] }) => setPool(data.records || []))
      .catch((err) => setLoadError(String(err)));
  }, []);

  // Responsive board size
  useEffect(() => {
    const compute = () => {
      // Smaller on mobile, larger on desktop
      const w = window.innerWidth;
      const size = w < 480 ? Math.min(300, w - 32) : w < 768 ? 360 : 440;
      setBoardSize(size);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const config = DIFFICULTY[difficulty];
  const pieceSize = boardSize / config.grid;
  const trayPieceSize = boardSize / config.trayCols;

  const startNew = useCallback(
    (d: Difficulty = difficulty, img: SearchRecord | null = image) => {
      const cfg = DIFFICULTY[d];
      const newImg = img || (pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null);
      if (!newImg) return;

      const grid = cfg.grid;
      const initial: Piece[] = [];
      for (let row = 0; row < grid; row++) {
        for (let col = 0; col < grid; col++) {
          initial.push({
            id: row * grid + col,
            row,
            col,
            x: 0,
            y: 0,
            isPlaced: false,
            isDragging: false,
          });
        }
      }
      // Shuffle order — pack into a compact tray below the board
      const trayCols = cfg.trayCols;
      const trayPieceSize = boardSize / trayCols;
      const shuffled = shuffle(initial).map((p, i) => {
        const hx = (i % trayCols) * trayPieceSize;
        const hy = boardSize + 20 + Math.floor(i / trayCols) * (trayPieceSize + 4);
        return { ...p, x: hx, y: hy, homeX: hx, homeY: hy };
      });

      setDifficulty(d);
      setImage(newImg);
      setPieces(shuffled);
      setWon(false);
    },
    [pool, image, boardSize, difficulty]
  );

  // Auto-start once pool ready
  useEffect(() => {
    if (pool.length > 0 && pieces.length === 0 && !loadError) {
      startNew(difficulty, null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.length, boardSize]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>, id: number) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece || piece.isPlaced || !boardRef.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // When grabbed from tray, piece grows to full size centered on the finger
    // so the user can immediately see the whole piece they're holding.
    dragOffset.current = {
      x: pieceSize / 2,
      y: pieceSize / 2,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    setPieces((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              isDragging: true,
              x: pointerX - pieceSize / 2,
              y: pointerY - pieceSize / 2,
            }
          : p
      )
    );
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>, id: number) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece?.isDragging || !boardRef.current || !dragOffset.current) return;

    const rect = boardRef.current.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    setPieces((ps) =>
      ps.map((p) =>
        p.id === id
          ? {
              ...p,
              x: pointerX - dragOffset.current!.x,
              y: pointerY - dragOffset.current!.y,
            }
          : p
      )
    );
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>, id: number) => {
    const piece = pieces.find((p) => p.id === id);
    if (!piece || !piece.isDragging) return;

    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    dragOffset.current = null;

    // Snap check — target position is piece.col * pieceSize, piece.row * pieceSize
    const targetX = piece.col * pieceSize;
    const targetY = piece.row * pieceSize;
    const dx = piece.x - targetX;
    const dy = piece.y - targetY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    setPieces((ps) =>
      ps.map((p) =>
        p.id === id
          ? dist <= SNAP_DISTANCE
            ? { ...p, x: targetX, y: targetY, isPlaced: true, isDragging: false }
            : { ...p, x: p.homeX, y: p.homeY, isDragging: false }
          : p
      )
    );
  };

  // Win detection
  useEffect(() => {
    if (pieces.length > 0 && pieces.every((p) => p.isPlaced)) {
      const t = setTimeout(() => setWon(true), 400);
      return () => clearTimeout(t);
    }
  }, [pieces]);

  // Layout helpers
  const trayHeight = useMemo(() => {
    const rows = Math.ceil(pieces.length / config.trayCols);
    return rows * (trayPieceSize + 4);
  }, [pieces.length, trayPieceSize, config.trayCols]);

  if (loadError) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-600">Spiel konnte nicht geladen werden.</p>
      </div>
    );
  }

  if (pool.length === 0 || !image) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-500">Spiel wird vorbereitet…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap gap-2">
          {(["leicht", "mittel", "schwer"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => startNew(d, image)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                difficulty === d
                  ? "bg-brand-coral text-white shadow"
                  : "bg-brand-cream text-brand-indigo hover:bg-brand-cream/80"
              }`}
            >
              {DIFFICULTY[d].label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => startNew(difficulty, null)}
          className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-cream"
        >
          Anderes Motiv
        </button>
      </div>

      {/* Title hint */}
      <p className="text-center text-sm text-gray-600">
        Ziehe die Teile auf das umrandete Feld. Sie rasten ein, wenn sie an
        der richtigen Stelle sind.
      </p>

      {/* Play area */}
      <div className="flex justify-center">
        <div
          ref={boardRef}
          className="relative touch-none select-none"
          style={{
            width: boardSize,
            height: boardSize + trayHeight + 24,
          }}
        >
          {/* Board — ghost target */}
          <div
            className="absolute left-0 top-0 overflow-hidden rounded-2xl bg-white shadow-inner ring-2 ring-dashed ring-brand-indigo/30"
            style={{
              width: boardSize,
              height: boardSize,
              backgroundImage: `url(${image.thumbnailUrl})`,
              backgroundSize: `${boardSize}px ${boardSize}px`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              opacity: 0.15,
            }}
          />
          {/* Grid lines on the board */}
          <div
            className="pointer-events-none absolute left-0 top-0 grid"
            style={{
              width: boardSize,
              height: boardSize,
              gridTemplateColumns: `repeat(${config.grid}, 1fr)`,
              gridTemplateRows: `repeat(${config.grid}, 1fr)`,
            }}
          >
            {Array.from({ length: config.grid * config.grid }).map((_, i) => (
              <div key={i} className="border border-brand-indigo/10" />
            ))}
          </div>

          {/* Pieces */}
          {pieces.map((p) => {
            // In tray: small. Dragging / placed: full size.
            const inTray = !p.isPlaced && !p.isDragging;
            const size = inTray ? trayPieceSize : pieceSize;
            const bgSize = inTray ? boardSize * (trayPieceSize / pieceSize) : boardSize;
            const bgScale = inTray ? trayPieceSize / pieceSize : 1;
            return (
              <div
                key={p.id}
                onPointerDown={(e) => onPointerDown(e, p.id)}
                onPointerMove={(e) => onPointerMove(e, p.id)}
                onPointerUp={(e) => onPointerUp(e, p.id)}
                onPointerCancel={(e) => onPointerUp(e, p.id)}
                className={`absolute touch-none select-none rounded-md ${
                  p.isDragging
                    ? "z-30 shadow-2xl ring-2 ring-brand-coral"
                    : p.isPlaced
                    ? "z-10 shadow-sm"
                    : "z-20 cursor-grab shadow-md active:cursor-grabbing"
                }`}
                style={{
                  left: p.x,
                  top: p.y,
                  width: size,
                  height: size,
                  backgroundImage: `url(${image.thumbnailUrl})`,
                  backgroundSize: `${bgSize}px ${bgSize}px`,
                  backgroundPosition: `-${p.col * pieceSize * bgScale}px -${p.row * pieceSize * bgScale}px`,
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "white",
                  transition: p.isDragging ? "none" : "width 0.15s ease, height 0.15s ease",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Win overlay */}
      {won && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => startNew(difficulty, null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl">🧩</div>
            <h2 className="mt-4 text-3xl font-bold text-brand-indigo">Fertig!</h2>
            <p className="mt-2 text-gray-600">
              Du hast das {image.title}-Puzzle geschafft.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => startNew(difficulty, null)}
                className="flex-1 rounded-full bg-brand-coral px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Neues Motiv
              </button>
              {difficulty !== "schwer" && (
                <button
                  type="button"
                  onClick={() =>
                    startNew(
                      difficulty === "leicht" ? "mittel" : "schwer",
                      image
                    )
                  }
                  className="flex-1 rounded-full border-2 border-brand-indigo px-5 py-3 text-base font-semibold text-brand-indigo transition-colors hover:bg-brand-indigo hover:text-white"
                >
                  Mehr Teile
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
