"use client";

import { useEffect, useState } from "react";
import SearchModal from "./SearchModal";

/**
 * Header trigger for the search modal.
 * Always renders a compact icon-button. Cmd+K / Ctrl+K opens the modal
 * from anywhere on the page; the keyboard shortcut hint is shown as a
 * native tooltip and visible kbd badge on lg+.
 */
export default function SearchTrigger() {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Suche öffnen"
        title={`Suche öffnen (${shortcut})`}
        className="group inline-flex items-center gap-2 rounded-full border border-transparent px-2 py-2 text-gray-600 transition-colors hover:border-gray-200 hover:bg-white hover:text-brand-indigo lg:px-3"
      >
        <svg
          aria-hidden
          className="h-5 w-5 shrink-0"
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
        <kbd className="hidden rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500 lg:inline-block">
          {shortcut}
        </kbd>
      </button>

      <SearchModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
