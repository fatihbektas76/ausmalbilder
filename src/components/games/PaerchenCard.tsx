"use client";

import Image from "next/image";

export type PaerchenCardState = "back" | "revealed" | "matched";

interface Props {
  state: PaerchenCardState;
  imageUrl: string;
  alt: string;
  onFlip: () => void;
  size: "sm" | "md" | "lg";
}

const SIZE_CLASSES: Record<Props["size"], string> = {
  sm: "aspect-[3/4] w-full",
  md: "aspect-[3/4] w-full",
  lg: "aspect-[3/4] w-full",
};

/**
 * Single flip card. Renders a brand-coral back with a logo-mark and a
 * white front with the image. Uses CSS 3D transform for the flip so the
 * GPU handles it smoothly on touchscreens.
 */
export default function PaerchenCard({
  state,
  imageUrl,
  alt,
  onFlip,
  size,
}: Props) {
  const flipped = state !== "back";

  return (
    <button
      type="button"
      onClick={() => state === "back" && onFlip()}
      disabled={state !== "back"}
      aria-label={state === "back" ? "Karte umdrehen" : alt}
      className={`group relative ${SIZE_CLASSES[size]} touch-manipulation rounded-2xl outline-none focus-visible:ring-4 focus-visible:ring-brand-coral/50`}
      style={{ perspective: "1000px" }}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-coral to-orange-400 shadow-md ring-2 ring-white/70 transition-transform group-active:scale-95"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            className="h-1/2 w-1/2 text-white/90"
            fill="currentColor"
          >
            <path d="M12 2C9.79 2 8 3.79 8 6c0 1.86 1.27 3.43 3 3.87V12H8c-1.1 0-2 .9-2 2v3.13C4.27 17.57 3 19.14 3 21v1h18v-1c0-1.86-1.27-3.43-3-3.87V14c0-1.1-.9-2-2-2h-3V9.87c1.73-.44 3-2.01 3-3.87 0-2.21-1.79-4-4-4z" />
          </svg>
        </div>

        {/* Front */}
        <div
          className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-md ring-2 transition-all ${
            state === "matched"
              ? "ring-green-400 ring-offset-2 ring-offset-brand-cream"
              : "ring-gray-200"
          }`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="relative h-full w-full">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 40vw, 200px"
              className="object-contain"
              unoptimized
            />
          </div>
          {state === "matched" && (
            <span
              aria-hidden
              className="absolute right-1 top-1 rounded-full bg-green-100 p-1"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
