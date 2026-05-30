"use client";

import { useCallback, useEffect, useState } from "react";

interface DotPattern {
  name: string;
  emoji: string;
  reveal: string;        // What the line drawing forms
  dots: { x: number; y: number }[]; // in a 500×500 viewBox
}

/**
 * Hand-crafted dot patterns. Coordinates target a 500×500 SVG viewBox
 * with some padding. Designed so the connected line forms a recognizable
 * silhouette. Always close back to dot 1 implicitly.
 */
const PATTERNS: Record<"leicht" | "mittel" | "schwer", DotPattern> = {
  leicht: {
    name: "Fisch",
    emoji: "🐟",
    reveal: "Ein freundlicher Fisch ist erschienen!",
    dots: [
      { x: 80, y: 250 },   // 1: tail bottom
      { x: 130, y: 200 },  // 2: tail top
      { x: 200, y: 200 },  // 3: body top-back
      { x: 280, y: 170 },  // 4: top fin
      { x: 380, y: 220 },  // 5: head top
      { x: 420, y: 270 },  // 6: nose
      { x: 380, y: 320 },  // 7: head bottom
      { x: 280, y: 350 },  // 8: belly fin
      { x: 200, y: 320 },  // 9: belly
      { x: 130, y: 320 },  // 10: tail bottom-front
    ],
  },
  mittel: {
    name: "Schmetterling",
    emoji: "🦋",
    reveal: "Ein bunter Schmetterling fliegt los!",
    dots: [
      { x: 250, y: 100 },  // 1: top center
      { x: 180, y: 130 },  // 2: left upper
      { x: 100, y: 100 },  // 3: left wing top-out
      { x: 80, y: 200 },   // 4: left wing far
      { x: 130, y: 250 },  // 5: left wing inner
      { x: 100, y: 350 },  // 6: left lower wing far
      { x: 200, y: 380 },  // 7: left lower wing tip
      { x: 250, y: 320 },  // 8: bottom center
      { x: 300, y: 380 },  // 9: right lower wing tip
      { x: 400, y: 350 },  // 10: right lower wing far
      { x: 370, y: 250 },  // 11: right wing inner
      { x: 420, y: 200 },  // 12: right wing far
      { x: 400, y: 100 },  // 13: right wing top-out
      { x: 320, y: 130 },  // 14: right upper
      { x: 250, y: 200 },  // 15: body center
    ],
  },
  schwer: {
    name: "Stern",
    emoji: "⭐",
    reveal: "Ein leuchtender Stern!",
    dots: (() => {
      // 5-pointed star with extra dots on each line — total 20 dots
      const cx = 250, cy = 250, R = 180, r = 80;
      const pts: { x: number; y: number }[] = [];
      // For each of the 10 vertices, place 2 dots — outer then inner
      const angleStep = (Math.PI * 2) / 10;
      for (let i = 0; i < 10; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const radius = i % 2 === 0 ? R : r;
        pts.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        });
      }
      // Add midpoint dots on alternate edges to reach 20 dots
      const extra: { x: number; y: number }[] = [];
      for (let i = 0; i < pts.length; i += 2) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        extra.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      }
      // Interleave so the line draws through midpoints
      const merged: { x: number; y: number }[] = [];
      for (let i = 0; i < pts.length; i++) {
        merged.push(pts[i]);
        if (i % 2 === 0) merged.push(extra[i / 2]);
      }
      return merged;
    })(),
  },
};

type Difficulty = "leicht" | "mittel" | "schwer";

export default function ConnectDotsGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("leicht");
  const [next, setNext] = useState(1);
  const [connections, setConnections] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);
  const [won, setWon] = useState(false);

  const pattern = PATTERNS[difficulty];
  const totalDots = pattern.dots.length;

  const reset = useCallback((d: Difficulty = difficulty) => {
    setDifficulty(d);
    setNext(1);
    setConnections([]);
    setShake(null);
    setWon(false);
  }, [difficulty]);

  const onDotTap = (dotNumber: number) => {
    if (won) return;
    if (dotNumber === next) {
      setConnections((c) => [...c, dotNumber]);
      setNext((n) => n + 1);
    } else {
      // Wrong dot — shake it gently, no fail
      setShake(dotNumber);
      setTimeout(() => setShake(null), 400);
    }
  };

  // Win detection
  useEffect(() => {
    if (next > totalDots) {
      const t = setTimeout(() => setWon(true), 600);
      return () => clearTimeout(t);
    }
  }, [next, totalDots]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap gap-2">
          {(["leicht", "mittel", "schwer"] as Difficulty[]).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => reset(d)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                difficulty === d
                  ? "bg-brand-coral text-white shadow"
                  : "bg-brand-cream text-brand-indigo hover:bg-brand-cream/80"
              }`}
            >
              {d === "leicht"
                ? "Leicht (10 Punkte)"
                : d === "mittel"
                ? "Mittel (15 Punkte)"
                : "Schwer (20 Punkte)"}
            </button>
          ))}
        </div>
        <div className="text-sm">
          <span className="rounded-full bg-brand-cream px-3 py-1 font-semibold text-brand-indigo">
            {Math.min(next - 1, totalDots)} / {totalDots}
          </span>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600">
        Tippe die Punkte der Reihe nach an: <strong>1, 2, 3 …</strong> Wenn du
        falsch tippst, passiert nichts — versuche es einfach nochmal.
      </p>

      {/* Board */}
      <div className="mx-auto aspect-square max-w-xl rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <svg viewBox="0 0 500 500" className="h-full w-full touch-none">
          {/* Completed lines */}
          {connections.length > 1 && (
            <polyline
              points={connections
                .map((n) => {
                  const d = pattern.dots[n - 1];
                  return `${d.x},${d.y}`;
                })
                .join(" ")}
              fill="none"
              stroke="var(--brand-coral, #E8490F)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Dots */}
          {pattern.dots.map((d, i) => {
            const num = i + 1;
            const connected = connections.includes(num);
            const isNext = num === next;
            const shaking = shake === num;
            return (
              <g
                key={num}
                onClick={() => onDotTap(num)}
                onPointerDown={() => onDotTap(num)}
                style={{
                  cursor: "pointer",
                  transformOrigin: `${d.x}px ${d.y}px`,
                  animation: shaking
                    ? "shake 0.4s ease-in-out"
                    : undefined,
                }}
              >
                {/* Hit area — bigger than visible for kids' fingers */}
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={30}
                  fill="transparent"
                />
                {/* Visible dot */}
                <circle
                  cx={d.x}
                  cy={d.y}
                  r={isNext ? 22 : 18}
                  fill={
                    connected
                      ? "#10B981"  // green — done
                      : isNext
                      ? "#E8490F"  // coral — next
                      : "white"
                  }
                  stroke={
                    connected
                      ? "#10B981"
                      : isNext
                      ? "#E8490F"
                      : "#9CA3AF"
                  }
                  strokeWidth={3}
                />
                {/* Number */}
                <text
                  x={d.x}
                  y={d.y + 6}
                  textAnchor="middle"
                  fontSize="18"
                  fontWeight="700"
                  fill={connected || isNext ? "white" : "#374151"}
                  pointerEvents="none"
                >
                  {num}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Restart bar */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => reset(difficulty)}
          className="rounded-full border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-brand-indigo transition-colors hover:bg-brand-cream"
        >
          Von vorn beginnen
        </button>
      </div>

      {/* Win overlay */}
      {won && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => reset(difficulty)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl">{pattern.emoji}</div>
            <h2 className="mt-4 text-3xl font-bold text-brand-indigo">
              Geschafft!
            </h2>
            <p className="mt-2 text-gray-600">{pattern.reveal}</p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => reset(difficulty)}
                className="flex-1 rounded-full bg-brand-coral px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Nochmal
              </button>
              {difficulty !== "schwer" && (
                <button
                  type="button"
                  onClick={() =>
                    reset(difficulty === "leicht" ? "mittel" : "schwer")
                  }
                  className="flex-1 rounded-full border-2 border-brand-indigo px-5 py-3 text-base font-semibold text-brand-indigo transition-colors hover:bg-brand-indigo hover:text-white"
                >
                  Mehr Punkte
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Local shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
