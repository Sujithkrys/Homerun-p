"use client";

import React from "react";
import HomeRunHeader from "../HomeRunHeader";
import CategoryCard from "../CategoryCard";
import { CATEGORIES, CATEGORY_GROUPS } from "@/lib/categories";
import { Search } from "lucide-react";

interface CategoriesScreenProps {
  onBack?: () => void;
  onSelectCategory: (categoryName: string) => void;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function CategoriesScreen({
  onSelectCategory,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: CategoriesScreenProps) {
  const isWeb = variant === "web";

  return (
    <div className="w-full flex flex-col bg-[#fbfbfb] min-h-full select-none">
      {/* Real HomeRun Header */}
      {!isWeb && (
        <HomeRunHeader
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      )}

      {/* Main Body */}
      <div
        className={`flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${
          isWeb ? "p-6 md:p-8 max-w-6xl mx-auto space-y-6 w-full" : "p-3 space-y-4"
        }`}
      >
        {/* Search Bar */}
        <div
          onClick={() => onSelectCategory("Plywood")}
          className="w-full bg-white rounded-xl border border-[#e5e5e5] px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs cursor-pointer hover:border-[#1a7a3a] transition-colors"
        >
          <Search className="w-4 h-4 text-[#777777] shrink-0" />
          <div className="text-xs font-medium text-[#777777] flex items-center gap-1">
            <span>Search for</span>
            <span className="text-[#1a7a3a] font-bold">Plywood</span>
          </div>
        </div>

        {/* Grouped Category Sections */}
        {CATEGORY_GROUPS.map((group) => {
          const groupCategories = CATEGORIES.filter((c) => c.group === group);
          return (
            <div key={group} className="space-y-2">
              <h3 className="font-extrabold text-sm sm:text-base text-[#1a1a1a] px-1 font-display">
                {group}
              </h3>

              {/* 4 columns on mobile, 6 on desktop */}
              <div
                className={`grid gap-2 sm:gap-3 ${
                  isWeb ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6" : "grid-cols-4"
                }`}
              >
                {groupCategories.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onClick={() => onSelectCategory(cat.name)}
                    variant={variant}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
