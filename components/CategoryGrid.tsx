"use client";

import React from "react";
import { CATEGORIES } from "@/lib/categories";
import CategoryCard from "./CategoryCard";
import { ArrowRight } from "lucide-react";

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
  onViewAll: () => void;
  variant?: "mobile" | "web";
}

export default function CategoryGrid({
  onSelectCategory,
  onViewAll,
  variant = "mobile",
}: CategoryGridProps) {
  const isWeb = variant === "web";
  // Show 8 categories in mobile (2 rows of 4), 12 in desktop
  const displayCategories = isWeb ? CATEGORIES.slice(0, 12) : CATEGORIES.slice(0, 8);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
          {isWeb ? "Browse by Category" : "Popular Categories"}
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-homerun-green hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 4-column grid on mobile (matching real screenshot), 6-column on desktop */}
      <div
        className={`grid gap-2 sm:gap-3 ${
          isWeb ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6" : "grid-cols-4"
        }`}
      >
        {displayCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onClick={() => onSelectCategory(cat.name)}
            variant={variant}
          />
        ))}
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-[#eef7f3] hover:bg-[#e2f3ec] border border-[#d8eee3] px-4 py-1.5 rounded-full transition-colors cursor-pointer"
        >
          <span>View All 17 Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
