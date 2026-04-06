"use client";

import { useEffect, useState, useMemo } from "react";

interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  content: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äÄ]/g, "ae")
    .replace(/[öÖ]/g, "oe")
    .replace(/[üÜ]/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseHeadings(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      const text = h2Match[1].replace(/[*_`]/g, "").trim();
      headings.push({ id: slugify(text), text, level: 2 });
      continue;
    }

    const h3Match = line.match(/^### (.+)$/);
    if (h3Match) {
      const text = h3Match[1].replace(/[*_`]/g, "").trim();
      headings.push({ id: slugify(text), text, level: 3 });
    }
  }

  return headings;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: "-80px 0px -60% 0px",
      threshold: 0,
    });

    const elements: Element[] = [];
    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) {
        observer.observe(el);
        elements.push(el);
      }
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Inhaltsverzeichnis"
      className="sticky top-24 hidden lg:block"
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
        Inhaltsverzeichnis
      </p>
      <ul className="space-y-1">
        {headings.map((heading) => {
          const isActive = activeId === heading.id;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(heading.id);
                  if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                    setActiveId(heading.id);
                  }
                }}
                className={`block border-l-2 py-1 text-xs leading-snug transition-colors ${
                  heading.level === 3 ? "pl-5" : "pl-3"
                } ${
                  isActive
                    ? "border-brand-coral font-medium text-brand-coral"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
