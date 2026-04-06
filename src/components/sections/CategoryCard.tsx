"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const INTERVAL_MS = 4000;
const FADE_MS = 700;

interface CategoryCardProps {
  name: string;
  href: string;
  count: string;
  badge?: string;
  thumbnails: string[];
  bgGradient?: string;
}

export default function CategoryCard({
  name,
  href,
  count,
  badge,
  thumbnails,
  bgGradient,
}: CategoryCardProps) {
  const len = thumbnails.length;

  // Start at index 0 to avoid hydration mismatch (server vs client)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // Refs for stable interval logic
  const isHoveredRef = useRef(false);
  const nextIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const offsetRef = useRef(0);

  // Keep nextIndexRef in sync
  useEffect(() => {
    nextIndexRef.current = currentIndex;
  }, [currentIndex]);

  // Set random offset after mount (client-only)
  useEffect(() => {
    offsetRef.current = Math.random() * 3000;
  }, []);

  // Preload all thumbnails
  useEffect(() => {
    thumbnails.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, [thumbnails]);

  // Interval with random offset
  useEffect(() => {
    if (len <= 1) return;

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (isHoveredRef.current) return;

        const next = (nextIndexRef.current + 1) % len;
        nextIndexRef.current = next;
        setIsFading(true);

        setTimeout(() => {
          setCurrentIndex(next);
          setIsFading(false);
        }, FADE_MS);
      }, INTERVAL_MS);
    };

    const offsetTimer = setTimeout(startInterval, offsetRef.current);

    return () => {
      clearTimeout(offsetTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [len]);

  // No thumbnails → fallback card
  if (len === 0) {
    return (
      <Link
        href={href}
        className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
      >
        <div className="flex h-36 items-center justify-center bg-gray-50">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z"
            />
          </svg>
        </div>
        <div className="flex flex-1 items-center justify-between p-4">
          <div>
            <h3 className="font-semibold text-brand-indigo group-hover:text-brand-coral transition-colors">
              {name}
            </h3>
            <span className="text-sm text-gray-400">{count}</span>
          </div>
          {badge && (
            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
              {badge}
            </span>
          )}
        </div>
      </Link>
    );
  }

  const nextIndex = (currentIndex + 1) % len;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {/* Carousel thumbnail area */}
      <div
        className={`relative h-36 overflow-hidden ${
          bgGradient ? `bg-gradient-to-br ${bgGradient}` : "bg-gray-50"
        }`}
      >
        {/* Back layer: next image (always visible) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnails[nextIndex]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-contain"
        />

        {/* Front layer: current image (fades out during transition) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnails[currentIndex]}
          alt={`${name} Ausmalbild Vorschau`}
          className="absolute inset-0 h-full w-full object-contain"
          style={{
            opacity: isFading ? 0 : 1,
            transition: `opacity ${FADE_MS}ms ease-in-out`,
          }}
        />

        {/* Dot indicators */}
        {len > 1 && (
          <div
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5"
            aria-hidden="true"
          >
            {thumbnails.map((_, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info row */}
      <div className="flex flex-1 items-center justify-between p-4">
        <div>
          <h3 className="font-semibold text-brand-indigo group-hover:text-brand-coral transition-colors">
            {name}
          </h3>
          <span className="text-sm text-gray-400">{count}</span>
        </div>
        {badge && (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}
