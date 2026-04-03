"use client";

import { useState, useCallback } from "react";

interface Filters {
  difficulty: string;
  age: string;
  style: string;
}

interface FilterBarProps {
  onFilterChange: (filters: Filters) => void;
}

const difficultyOptions = ["Alle", "Einfach", "Mittel", "Komplex"];
const ageOptions = ["Alle", "3-5 J.", "6-8 J.", "9-12 J.", "Erwachsene"];
const styleOptions = ["Alle", "Cartoon", "Realistisch", "Mandala"];

function FilterPill({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        isActive
          ? "bg-brand-coral text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState<Filters>({
    difficulty: "Alle",
    age: "Alle",
    style: "Alle",
  });

  const updateFilter = useCallback(
    (key: keyof Filters, value: string) => {
      const updated = { ...filters, [key]: value };
      setFilters(updated);
      onFilterChange(updated);
    },
    [filters, onFilterChange]
  );

  return (
    <div className="flex flex-wrap items-start gap-6 rounded-xl bg-brand-white p-4 shadow-sm sm:p-6">
      {/* Schwierigkeit */}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Schwierigkeit
        </span>
        <div className="flex flex-wrap gap-2">
          {difficultyOptions.map((option) => (
            <FilterPill
              key={option}
              label={option}
              isActive={filters.difficulty === option}
              onClick={() => updateFilter("difficulty", option)}
            />
          ))}
        </div>
      </div>

      {/* Alter */}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Alter
        </span>
        <div className="flex flex-wrap gap-2">
          {ageOptions.map((option) => (
            <FilterPill
              key={option}
              label={option}
              isActive={filters.age === option}
              onClick={() => updateFilter("age", option)}
            />
          ))}
        </div>
      </div>

      {/* Stil */}
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-gray-500">
          Stil
        </span>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((option) => (
            <FilterPill
              key={option}
              label={option}
              isActive={filters.style === option}
              onClick={() => updateFilter("style", option)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
