"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ImageCardProps {
  slug: string;
  title: string;
  thumbnailUrl: string;
  altText: string;
  difficulty: "einfach" | "mittel" | "komplex";
  ageMin: number;
  ageMax?: number;
  category: string;
  pdfUrl: string;
}

const difficultyConfig = {
  einfach: {
    label: "Einfach",
    className: "bg-green-100 text-green-800",
  },
  mittel: {
    label: "Mittel",
    className: "bg-amber-100 text-amber-800",
  },
  komplex: {
    label: "Komplex",
    className: "bg-red-100 text-red-800",
  },
} as const;

export default function ImageCard({
  slug,
  title,
  thumbnailUrl,
  altText,
  difficulty,
  ageMin,
  ageMax,
  category,
  pdfUrl,
}: ImageCardProps) {
  const [imageError, setImageError] = useState(false);
  const badge = difficultyConfig[difficulty];
  const ageLabel = ageMax ? `${ageMin}–${ageMax} J.` : `Ab ${ageMin} J.`;

  return (
    <div className="group overflow-hidden rounded-xl bg-brand-white shadow-sm transition-shadow hover:shadow-md">
      {/* Image container */}
      <div className="relative aspect-[400/566] w-full overflow-hidden bg-gray-100">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-gray-400">
            {title}
          </div>
        ) : (
          <Image
            src={thumbnailUrl}
            alt={altText}
            width={400}
            height={566}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}

        {/* Difficulty badge — top right */}
        <span
          className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        {/* Age badge */}
        <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {ageLabel}
        </span>

        {/* Title */}
        <h3 className="mt-2 text-sm font-semibold leading-snug text-brand-indigo line-clamp-2">
          {title}
        </h3>

        {/* Action buttons */}
        <div className="mt-3 flex flex-col gap-2">
          <Link
            href={`/${category}/${slug}?action=download`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand-coral px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            PDF herunterladen
          </Link>
          <Link
            href={`/${category}/${slug}#ausmalen`}
            className="inline-flex w-full items-center justify-center rounded-lg border border-brand-indigo px-4 py-2 text-sm font-semibold text-brand-indigo transition-colors hover:bg-brand-indigo hover:text-white"
          >
            Online ausmalen
          </Link>
        </div>
      </div>
    </div>
  );
}
