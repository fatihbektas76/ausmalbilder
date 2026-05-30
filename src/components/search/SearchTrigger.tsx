"use client";

import { useEffect, useState } from "react";
import SearchModal from "./SearchModal";

interface Props {
  variant?: "icon" | "input";
}

/**
 * Header trigger for the search modal.
 * - `icon`  → compact icon-only button (mobile / dense layouts)
 * - `input` → search-box pseudo-input with placeholder + ⌘K hint (desktop)
 * Cmd+K / Ctrl+K opens the modal from anywhere.
 */
export default function SearchTrigger({ variant = "input" }: Props) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform));
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shortcut = isMac ? "⌘K" : "Ctrl+K";

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Suche öffnen"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-brand-indigo transition-colors hover:bg-brand-cream"
        >
          <svg
            aria-hidden
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Suche öffnen"
          className="group inline-flex w-44 items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-3 py-2 text-sm text-gray-500 transition-colors hover:border-brand-coral/40 hover:bg-white xl:w-64 xl:gap-2.5 xl:px-4"
        >
          <svg
            aria-hidden
            className="h-4 w-4 shrink-0 text-gray-400 transition-colors group-hover:text-brand-coral"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="flex-1 truncate text-left">
            <span className="xl:hidden">Suchen…</span>
            <span className="hidden xl:inline">Ausmalbilder suchen…</span>
          </span>
          <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
            {shortcut}
          </kbd>
        </button>
      )}

      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
