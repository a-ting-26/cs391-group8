"use client";
import React from "react";

interface FilterChipsProps {
  filters: string[];
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
}

export default function FilterChips({
  filters,
  activeFilters,
  onFilterToggle,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <button
            key={filter}
            onClick={() => onFilterToggle(filter)}
            className={`rounded-full border-[3px] border-emerald-900 px-6 py-2 text-sm font-black uppercase tracking-wider transition-all ${
              isActive
                ? "bg-[#FDE68A] text-emerald-900 shadow-[0_5px_0_0_rgba(16,78,61,0.5)]"
                : "bg-white text-emerald-900 shadow-[0_3px_0_0_rgba(16,78,61,0.3)] hover:bg-emerald-50 hover:shadow-[0_4px_0_0_rgba(16,78,61,0.4)]"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}

