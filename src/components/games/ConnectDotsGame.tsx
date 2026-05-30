"use client";

import { useCallback, useEffect, useState } from "react";

interface DotPattern {
  name: string;
  emoji: string;
  reveal: string;        // What the line drawing forms
  dots: { x: number; y: number }[]; // in a 500×500 viewBox
  /** Optional decorative details rendered AFTER the loop closes (eye, antenna…). */
  decorations?: { type: "circle" | "line"; cx?: number; cy?: number; r?: number; x1?: number; y1?: number; x2?: number; y2?: number }[];
}

/**
 * Hand-crafted dot patterns. The connected line is auto-closed back to dot 1
 * (polygon), so the user draws a recognizable silhouette. Decorations like
 * the eye are revealed only after completion to keep the dot-to-dot puzzle
 * clean. ViewBox is 500×500 with ~50px padding from edges.
 */
const PATTERNS: Record<"leicht" | "mittel" | "schwer", DotPattern> = {
  leicht: {
    name: "Fisch",
    emoji: "🐟",
    reveal: "Ein freundlicher Fisch schwimmt davon!",
    // Right-facing fish — mouth right, tail-V left, eye decorated after win.
    // The tail-V is built by dots 6→7→8: outer-bottom-tip → notch → outer-top-tip.
    dots: [
      { x: 430, y: 250 },  // 1  Mund (Spitze)
      { x: 390, y: 300 },  // 2  Unterlippe
      { x: 290, y: 330 },  // 3  Bauch vorn
      { x: 180, y: 320 },  // 4  Bauch hinten
      { x: 110, y: 290 },  // 5  Schwanz-Übergang unten
      { x: 50,  y: 380 },  // 6  Schwanzflosse unten (Spitze)
      { x: 140, y: 250 },  // 7  Schwanzflosse Einbuchtung (V-Notch)
      { x: 50,  y: 120 },  // 8  Schwanzflosse oben (Spitze)
      { x: 110, y: 210 },  // 9  Schwanz-Übergang oben
      { x: 290, y: 170 },  // 10 Rücken vorn → schließt zurück zum Mund
    ],
    decorations: [
      { type: "circle", cx: 360, cy: 230, r: 8 },   // Auge
    ],
  },
  mittel: {
    name: "Herz",
    emoji: "❤️",
    reveal: "Ein rotes Herz für dich!",
    // Classic heart silhouette — two lobes at top, point at bottom.
    // Traced clockwise starting from the top-center notch between lobes.
    dots: [
      { x: 250, y: 130 },  // 1  Tal-Mitte (Einbuchtung oben)
      { x: 290, y: 100 },  // 2  Rechte Wölbung Anstieg
      { x: 340, y: 80  },  // 3  Rechte Wölbung Spitze
      { x: 400, y: 90  },  // 4  Rechte Wölbung Außenseite oben
      { x: 440, y: 140 },  // 5  Rechte Seite oben
      { x: 440, y: 220 },  // 6  Rechte Seite Mitte
      { x: 400, y: 290 },  // 7  Rechte Flanke unten
      { x: 340, y: 360 },  // 8  Rechte Schräge zur Spitze
      { x: 260, y: 430 },  // 9  Spitze unten
      { x: 160, y: 360 },  // 10 Linke Schräge zur Spitze
      { x: 100, y: 290 },  // 11 Linke Flanke unten
      { x: 60,  y: 220 },  // 12 Linke Seite Mitte
      { x: 60,  y: 140 },  // 13 Linke Seite oben
      { x: 100, y: 90  },  // 14 Linke Wölbung Außenseite oben
      { x: 160, y: 80  },  // 15 Linke Wölbung Spitze
      { x: 210, y: 100 },  // 16 Linke Wölbung Anstieg → schließt zur Mitte
    ],
  },
  schwer: {
    name: "Stern",
    emoji: "⭐",
    reveal: "Ein leuchtender Stern!",
    dots: (() => {
      // 5-pointed star traced as outer-tip → inner-corner → next outer-tip…
      // 10 vertices + midpoints on each edge = 20 dots that draw a clean star.
      const cx = 250, cy = 250, R = 200, r = 80;
      const verts: { x: number; y: number }[] = [];
      const angleStep = Math.PI / 5;
      for (let i = 0; i < 10; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const radius = i % 2 === 0 ? R : r;
        verts.push({
          x: cx + Math.cos(angle) * radius,
          y: cy + Math.sin(angle) * radius,
        });
      }
      // Insert midpoint dot between each pair of vertices.
      const out: { x: number; y: number }[] = [];
      for (let i = 0; i < verts.length; i++) {
        out.push(verts[i]);
        const next = verts[(i + 1) % verts.length];
        out.push({
          x: (verts[i].x + next.x) / 2,
          y: (verts[i].y + next.y) / 2,
        });
      }
      return out;
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

      {/* Pattern hint */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <span>Tippe die Punkte der Reihe nach an. Du zeichnest:</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-cream px-3 py-1 font-semibold text-brand-indigo">
          <span className="text-base" aria-hidden>
            {pattern.emoji}
          </span>
          {pattern.name}
        </span>
      </div>

      {/* Board */}
      <div className="mx-auto aspect-square max-w-xl rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <svg viewBox="0 0 500 500" className="h-full w-full touch-none">
          {/* Completed lines — closed shape if fully connected */}
          {connections.length > 1 &&
            (next > totalDots ? (
              <polygon
                points={connections
                  .map((n) => {
                    const d = pattern.dots[n - 1];
                    return `${d.x},${d.y}`;
                  })
                  .join(" ")}
                fill="rgba(232, 73, 15, 0.08)"
                stroke="var(--brand-coral, #E8490F)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
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
            ))}

          {/* Decorations — eye, antennas etc. — only after the loop closes */}
          {next > totalDots &&
            pattern.decorations?.map((dec, i) =>
              dec.type === "circle" ? (
                <circle
                  key={i}
                  cx={dec.cx}
                  cy={dec.cy}
                  r={dec.r}
                  fill="var(--brand-indigo, #1D1448)"
                />
              ) : (
                <line
                  key={i}
                  x1={dec.x1}
                  y1={dec.y1}
                  x2={dec.x2}
                  y2={dec.y2}
                  stroke="var(--brand-indigo, #1D1448)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              )
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
                data-dot={num}
                onPointerDown={(e) => {
                  e.preventDefault();
                  onDotTap(num);
                }}
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
