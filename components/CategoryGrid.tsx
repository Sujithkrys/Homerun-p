"use client";

import React from "react";
import { CATEGORIES } from "@/lib/categories";
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
  const displayCategories = isWeb ? CATEGORIES.slice(0, 12) : CATEGORIES.slice(0, 8);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
          {isWeb ? "Browse by Category" : "Popular Categories"}
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-bold text-homerun-green hover:underline flex items-center gap-1"
        >
          <span>View All</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div
        className={`grid gap-2 sm:gap-2.5 ${
          isWeb ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6" : "grid-cols-4"
        }`}
      >
        {displayCategories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.name)}
            className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-400 hover:shadow-xs hover:bg-emerald-50/20 active:scale-95 transition-all text-center group cursor-pointer"
          >
            <span className="text-2xl sm:text-3xl mb-1 select-none transform group-hover:scale-110 transition-transform">
              {cat.icon}
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-800 line-clamp-1 group-hover:text-homerun-green">
              {cat.name}
            </span>
            <span className="text-[9.5px] sm:text-[10px] text-slate-400 font-medium mt-0.5">
              {cat.productCount} items
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3.5 py-1.5 rounded-full transition-colors"
        >
          <span>View All 17 Categories</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
