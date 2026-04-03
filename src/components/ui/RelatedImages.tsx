"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface RelatedImage {
  slug: string;
  title: string;
  thumbnailUrl: string;
  altText: string;
  category: string;
  difficulty: string;
}

interface RelatedImagesProps {
  images: RelatedImage[];
  title?: string;
}

function RelatedCard({ image }: { image: RelatedImage }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/${image.category}/${image.slug}`}
      className="group overflow-hidden rounded-xl bg-brand-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[400/566] w-full overflow-hidden bg-gray-100">
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center p-3 text-center text-xs text-gray-400">
            {image.title}
          </div>
        ) : (
          <Image
            src={image.thumbnailUrl}
            alt={image.altText}
            width={400}
            height={566}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium leading-snug text-brand-indigo line-clamp-2">
          {image.title}
        </h3>
      </div>
    </Link>
  );
}

export default function RelatedImages({
  images,
  title = "Verwandte Ausmalbilder",
}: RelatedImagesProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-10">
      <h2 className="mb-6 text-xl font-medium text-brand-indigo sm:text-2xl">
        {title}
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {images.map((image) => (
          <RelatedCard key={image.slug} image={image} />
        ))}
      </div>
    </section>
  );
}
