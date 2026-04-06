"use client";

interface BlogFilterTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts: Record<string, number>;
}

const TABS = [
  { key: "", label: "Alle" },
  { key: "stressabbau", label: "Stressabbau" },
  { key: "kinder-entwicklung", label: "Kinder" },
  { key: "kreativitaet", label: "Kreativität" },
  { key: "ratgeber", label: "Ratgeber" },
  { key: "saisonal", label: "Saisonal" },
] as const;

export default function BlogFilterTabs({
  activeCategory,
  onCategoryChange,
  counts,
}: BlogFilterTabsProps) {
  const totalCount = Object.values(counts).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <nav
      aria-label="Blog-Kategorien"
      className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0"
    >
      {TABS.map((tab) => {
        const isActive = activeCategory === tab.key;
        const count = tab.key === "" ? totalCount : (counts[tab.key] ?? 0);

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onCategoryChange(tab.key)}
            aria-pressed={isActive}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-brand-coral text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.label}
            <span
              className={`inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-xs ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
