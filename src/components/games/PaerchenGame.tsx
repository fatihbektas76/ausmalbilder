"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PaerchenCard, { type PaerchenCardState } from "./PaerchenCard";
import type { SearchRecord } from "@/app/api/search-data/route";

type Difficulty = "leicht" | "mittel" | "schwer";

const DIFFICULTY: Record<
  Difficulty,
  { pairs: number; cols: string; size: "sm" | "md" | "lg"; label: string }
> = {
  leicht: {
    pairs: 4,
    cols: "grid-cols-4 sm:grid-cols-4",
    size: "lg",
    label: "Leicht (4 Paare)",
  },
  mittel: {
    pairs: 6,
    cols: "grid-cols-3 sm:grid-cols-4",
    size: "md",
    label: "Mittel (6 Paare)",
  },
  schwer: {
    pairs: 8,
    cols: "grid-cols-4 sm:grid-cols-4",
    size: "sm",
    label: "Schwer (8 Paare)",
  },
};

interface CardInstance {
  id: number;          // unique within a game
  recordId: string;    // SearchRecord.id  (used to detect matches)
  imageUrl: string;
  alt: string;
  state: PaerchenCardState;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildDeck(pool: SearchRecord[], pairs: number): CardInstance[] {
  const picks = shuffle(pool).slice(0, pairs);
  const doubled: CardInstance[] = [];
  picks.forEach((p, i) => {
    doubled.push({
      id: i * 2,
      recordId: p.id,
      imageUrl: p.thumbnailUrl,
      alt: p.title,
      state: "back",
    });
    doubled.push({
      id: i * 2 + 1,
      recordId: p.id,
      imageUrl: p.thumbnailUrl,
      alt: p.title,
      state: "back",
    });
  });
  return shuffle(doubled);
}

export default function PaerchenGame() {
  const [pool, setPool] = useState<SearchRecord[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("leicht");
  const [deck, setDeck] = useState<CardInstance[]>([]);
  const [turns, setTurns] = useState(0);
  const [locked, setLocked] = useState(false);
  const [revealed, setRevealed] = useState<number[]>([]); // card ids
  const [won, setWon] = useState(false);

  // Fetch the search-data once, use it as image pool
  useEffect(() => {
    fetch("/api/search-data")
      .then((r) => r.json())
      .then((data: { records: SearchRecord[] }) => {
        setPool(data.records || []);
      })
      .catch((err) => setLoadError(String(err)));
  }, []);

  const config = DIFFICULTY[difficulty];

  const startNew = useCallback(
    (d: Difficulty = difficulty) => {
      const cfg = DIFFICULTY[d];
      if (pool.length < cfg.pairs) {
        // Not enough images for this difficulty
        return;
      }
      setDeck(buildDeck(pool, cfg.pairs));
      setTurns(0);
      setRevealed([]);
      setLocked(false);
      setWon(false);
      setDifficulty(d);
    },
    [pool, difficulty]
  );

  // Auto-start once pool is ready
  useEffect(() => {
    if (pool.length > 0 && deck.length === 0 && !loadError) {
      startNew(difficulty);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool.length]);

  const onFlip = useCallback(
    (cardId: number) => {
      if (locked) return;
      setDeck((d) =>
        d.map((c) => (c.id === cardId ? { ...c, state: "revealed" } : c))
      );
      setRevealed((r) => [...r, cardId]);
    },
    [locked]
  );

  // Match check
  useEffect(() => {
    if (revealed.length !== 2) return;
    setTurns((t) => t + 1);
    const [a, b] = revealed;
    const cardA = deck.find((c) => c.id === a);
    const cardB = deck.find((c) => c.id === b);
    if (!cardA || !cardB) return;

    if (cardA.recordId === cardB.recordId) {
      // Match — keep revealed, mark matched
      setDeck((d) =>
        d.map((c) =>
          c.id === a || c.id === b ? { ...c, state: "matched" } : c
        )
      );
      setRevealed([]);
    } else {
      // No match — lock briefly, flip back
      setLocked(true);
      const t = setTimeout(() => {
        setDeck((d) =>
          d.map((c) =>
            c.id === a || c.id === b ? { ...c, state: "back" } : c
          )
        );
        setRevealed([]);
        setLocked(false);
      }, 900);
      return () => clearTimeout(t);
    }
  }, [revealed, deck]);

  // Win detection
  useEffect(() => {
    if (deck.length > 0 && deck.every((c) => c.state === "matched")) {
      const t = setTimeout(() => setWon(true), 400);
      return () => clearTimeout(t);
    }
  }, [deck]);

  const matchedPairs = useMemo(
    () => deck.filter((c) => c.state === "matched").length / 2,
    [deck]
  );

  if (loadError) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-600">Spiel konnte nicht geladen werden.</p>
      </div>
    );
  }

  if (pool.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-500">Spiel wird vorbereitet…</p>
      </div>
    );
  }

  if (pool.length < DIFFICULTY[difficulty].pairs) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <p className="text-gray-600">
          Es sind noch zu wenige Bilder für diese Schwierigkeit veröffentlicht.
          Bitte versuche eine leichtere Stufe.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top bar: difficulty + stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="flex flex-wrap gap-2">
          {(["leicht", "mittel", "schwer"] as Difficulty[]).map((d) => {
            const cfg = DIFFICULTY[d];
            const disabled = pool.length < cfg.pairs;
            return (
              <button
                key={d}
                type="button"
                disabled={disabled}
                onClick={() => startNew(d)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  difficulty === d
                    ? "bg-brand-coral text-white shadow"
                    : disabled
                    ? "cursor-not-allowed bg-gray-100 text-gray-400"
                    : "bg-brand-cream text-brand-indigo hover:bg-brand-cream/80"
                }`}
              >
                {cfg.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="rounded-full bg-brand-cream px-3 py-1 font-semibold text-brand-indigo">
            {matchedPairs} / {config.pairs} Paare
          </span>
          <span className="text-gray-500">Versuche: {turns}</span>
        </div>
      </div>

      {/* Board */}
      <div
        className={`grid gap-3 sm:gap-4 ${config.cols}`}
        aria-live="polite"
      >
        {deck.map((card) => (
          <PaerchenCard
            key={card.id}
            state={card.state}
            imageUrl={card.imageUrl}
            alt={card.alt}
            onFlip={() => onFlip(card.id)}
            size={config.size}
          />
        ))}
      </div>

      {/* Win overlay */}
      {won && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => startNew(difficulty)}
        >
          <div
            className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl">🎉</div>
            <h2 className="mt-4 text-3xl font-bold text-brand-indigo">
              Geschafft!
            </h2>
            <p className="mt-2 text-gray-600">
              Alle {config.pairs} Paare gefunden in{" "}
              <strong>{turns} Versuchen</strong>.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => startNew(difficulty)}
                className="flex-1 rounded-full bg-brand-coral px-5 py-3 text-base font-semibold text-white transition-opacity hover:opacity-90"
              >
                Nochmal spielen
              </button>
              {difficulty !== "schwer" && pool.length >= 8 && (
                <button
                  type="button"
                  onClick={() =>
                    startNew(difficulty === "leicht" ? "mittel" : "schwer")
                  }
                  className="flex-1 rounded-full border-2 border-brand-indigo px-5 py-3 text-base font-semibold text-brand-indigo transition-colors hover:bg-brand-indigo hover:text-white"
                >
                  Schwerer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
