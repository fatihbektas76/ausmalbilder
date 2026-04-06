import Link from "next/link";
import Image from "next/image";

const CATEGORY_LABELS: Record<string, { label: string; className: string }> = {
  stressabbau: {
    label: "Stressabbau",
    className: "bg-purple-100 text-purple-700",
  },
  "kinder-entwicklung": {
    label: "Kinder & Entwicklung",
    className: "bg-blue-100 text-blue-700",
  },
  kreativitaet: {
    label: "Kreativität",
    className: "bg-pink-100 text-pink-700",
  },
  ratgeber: {
    label: "Ratgeber",
    className: "bg-amber-100 text-amber-700",
  },
  saisonal: {
    label: "Saisonal",
    className: "bg-green-100 text-green-700",
  },
};

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  readingTime: number;
  featuredImage: string;
  featuredImageAlt: string;
  featured?: boolean;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  category,
  publishedAt,
  readingTime,
  featuredImage,
  featuredImageAlt,
  featured = false,
}: ArticleCardProps) {
  const categoryInfo = CATEGORY_LABELS[category] ?? {
    label: category,
    className: "bg-gray-100 text-gray-700",
  };

  if (featured) {
    return (
      <Link
        href={`/blog/${slug}`}
        className="group block overflow-hidden rounded-2xl bg-brand-white shadow-sm transition-shadow hover:shadow-lg"
      >
        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 md:aspect-auto md:min-h-[320px]">
            {featuredImage ? (
              <Image
                src={featuredImage}
                alt={featuredImageAlt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium ${categoryInfo.className}`}
                >
                  {categoryInfo.label}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <span
              className={`mb-3 inline-block w-fit rounded-full px-3 py-1 text-xs font-medium ${categoryInfo.className}`}
            >
              {categoryInfo.label}
            </span>
            <h2 className="text-xl font-bold leading-tight text-brand-indigo transition-colors group-hover:text-brand-coral md:text-2xl">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-3 md:text-base">
              {excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
              <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{readingTime} Min. Lesezeit</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-brand-white shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
        {featuredImage ? (
          <Image
            src={featuredImage}
            alt={featuredImageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${categoryInfo.className}`}
            >
              {categoryInfo.label}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <span
          className={`mb-2 inline-block w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryInfo.className}`}
        >
          {categoryInfo.label}
        </span>
        <h3 className="text-base font-semibold leading-snug text-brand-indigo transition-colors group-hover:text-brand-coral line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {excerpt}
        </p>
        <div className="mt-auto flex items-center gap-3 pt-4 text-xs text-gray-400">
          <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{readingTime} Min. Lesezeit</span>
        </div>
      </div>
    </Link>
  );
}
