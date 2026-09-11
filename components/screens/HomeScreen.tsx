"use client";

import React, { useState, useEffect } from "react";
import HomeRunHeader from "../HomeRunHeader";
import HeroCard from "../HeroCard";
import CategoryGrid from "../CategoryGrid";
import {
  RotateCcw,
  Truck,
  Sparkles,
  Search,
} from "lucide-react";

interface HomeScreenProps {
  onNavigateToEstimator: (prompt?: string) => void;
  onNavigateToCategories: () => void;
  onSelectCategory: (categoryName: string) => void;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

const ROTATING_SEARCH_TERMS = [
  "Plywood",
  "UltraTech Cement",
  "Asian Paints",
  "Wires & Cables",
  "Roff Tile Adhesive",
  "Dr Fixit Waterproofing",
];

export default function HomeScreen({
  onNavigateToEstimator,
  onNavigateToCategories,
  onSelectCategory,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: HomeScreenProps) {
  const isWeb = variant === "web";
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [termIndex, setTermIndex] = useState(0);

  // Rotating placeholder animation (pauses when input is focused or has text)
  useEffect(() => {
    if (isSearchFocused || searchQuery.trim().length > 0) return;
    const timer = setInterval(() => {
      setTermIndex((prev) => (prev + 1) % ROTATING_SEARCH_TERMS.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [isSearchFocused, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim() || ROTATING_SEARCH_TERMS[termIndex];
    onNavigateToEstimator(`Show me ${query} with prices and stock`);
  };

  return (
    <div className="w-full flex flex-col bg-[#fbfbfb] min-h-full select-none">
      {/* Real HomeRun Header on Mobile */}
      {!isWeb && (
        <HomeRunHeader
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      )}

      {/* Main Scrollable Body */}
      <div
        className={`flex-1 overflow-y-auto ${
          isWeb ? "p-6 md:p-8 space-y-5 max-w-6xl mx-auto w-full" : "p-3 space-y-3"
        }`}
      >
        {/* 1. Real HomeRun Search Bar (Fix 7: Normal Text Input, No Redirect on Click) */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full bg-white rounded-xl border border-[#e5e5e5] px-3.5 py-2 flex items-center gap-2.5 shadow-2xs focus-within:border-[#1a7a3a] transition-colors"
        >
          <Search className="w-4 h-4 text-[#777777] shrink-0" />
          <div className="flex-1 flex items-center min-w-0">
            <span className="text-xs font-medium text-[#777777] shrink-0 mr-1.5">
              Search for
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder={ROTATING_SEARCH_TERMS[termIndex]}
              className="w-full text-xs font-semibold text-[#1a7a3a] placeholder:text-[#1a7a3a]/70 placeholder:font-bold focus:outline-hidden bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="text-[11px] font-bold text-[#1a7a3a] px-2 py-0.5 rounded-md hover:bg-[#eef7f3] transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        {/* 2. Real HomeRun Trust Badges Row (Horizontal Strip with lightning dividers) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 text-[10.5px] font-semibold text-[#8b1818] whitespace-nowrap">
          <div className="flex items-center gap-1">
            <RotateCcw className="w-3.5 h-3.5 text-[#8b1818]" />
            <span>7 Day Replacement</span>
          </div>
          <span className="text-[#eab308]">⚡</span>
          <div className="flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-[#8b1818]" />
            <span>Free Delivery</span>
          </div>
          <span className="text-[#eab308]">⚡</span>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#8b1818]" />
            <span>Assured 1% Cashback</span>
          </div>
        </div>

        {/* 3. Notification Strip (Pink Order Processing Banner from Screenshot 1) */}
        <div className="rounded-lg bg-[#ffebee] border border-[#ffcdd2] px-3 py-2 text-[11px] font-medium text-[#c62828] flex items-center gap-2">
          <span>🚚</span>
          <span>Your order will get processed at 8 AM on 11 September 2026</span>
        </div>

        {/* 4. AI Estimator Hero Card + Promo Carousel (Fix 4: Auto-transitioning 3.5s carousel) */}
        <HeroCard
          onTryEstimator={onNavigateToEstimator}
          onNavigateToCategories={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />

        {/* 5. Popular Categories Grid (4 columns with Mint Cards & Product SVGs) */}
        <CategoryGrid
          onSelectCategory={onSelectCategory}
          onViewAll={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />

        {/* Fix 5: Removed "Why 10,000+ Contractors Choose HomeRun" section.
            The Home screen ends after the category grid and View All Categories link. */}
      </div>
    </div>
  );
}
