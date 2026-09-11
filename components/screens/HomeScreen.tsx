"use client";

import React, { useState, useEffect } from "react";
import HomeRunHeader from "../HomeRunHeader";
import HeroCard from "../HeroCard";
import CategoryGrid from "../CategoryGrid";
import {
  RotateCcw,
  Truck,
  Sparkles,
  ShieldCheck,
  Search,
  X,
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
  "Plywood & MDF",
  "UltraTech Cement",
  "Asian Paints",
  "Finolex Wires & MCBs",
  "Roff Tile Adhesive",
  "Dr Fixit Waterproofing",
];

const RELEVANT_SEARCHES = [
  "Plywood",
  "Cement",
  "Asian Paints",
  "Wires & Cables",
  "Tile Adhesive",
  "Dr Fixit",
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

  const handleSelectRelevant = (term: string) => {
    setSearchQuery(term);
    onNavigateToEstimator(`Show me ${term} with prices and stock`);
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0 bg-[#fbfbfb] overflow-hidden">
      {/* Real HomeRun Header on Mobile */}
      {!isWeb && (
        <HomeRunHeader
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      )}

      {/* Main Scrollable Body */}
      <div
        className={`flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar ${
          isWeb ? "p-6 md:p-8 space-y-4 max-w-6xl mx-auto" : "p-3 space-y-2.5"
        }`}
      >
        {/* 1. Real HomeRun Search Bar: Clean input field (empty when writing, relevant searches when empty) */}
        <div className="relative w-full">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full bg-white rounded-xl border border-[#e5e5e5] px-3.5 py-2 flex items-center gap-2.5 shadow-2xs focus-within:border-[#1a7a3a] transition-colors"
          >
            <Search className="w-4 h-4 text-[#777777] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => {
                // Short delay so clicking a suggestion works before blur closes it
                setTimeout(() => setIsSearchFocused(false), 200);
              }}
              placeholder={
                searchQuery.length === 0
                  ? `Search for ${ROTATING_SEARCH_TERMS[termIndex]}...`
                  : ""
              }
              style={{
                border: "none",
                outline: "none",
                boxShadow: "none",
                background: "transparent",
                appearance: "none",
                WebkitAppearance: "none",
              }}
              className="w-full border-none outline-none ring-0 focus:ring-0 focus:outline-none shadow-none text-xs font-semibold text-[#1a1a1a] placeholder:text-[#888888] placeholder:font-normal bg-transparent"
            />
            {searchQuery.length > 0 ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[#999999] hover:text-[#333333] p-0.5 rounded-full cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                className="text-[11px] font-bold text-[#1a7a3a] px-2 py-0.5 rounded-md hover:bg-[#eef7f3] transition-colors cursor-pointer shrink-0"
              >
                Search
              </button>
            )}
          </form>

          {/* Relevant Searches when not writing */}
          {searchQuery.length === 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1.5 px-0.5">
              <span className="text-[10px] font-bold text-[#777777] shrink-0">Popular:</span>
              {RELEVANT_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectRelevant(term)}
                  className="px-2 py-0.5 rounded-full bg-white border border-[#e5e5e5] hover:border-[#1a7a3a] hover:text-[#1a7a3a] text-[10px] font-medium text-[#555555] shrink-0 transition-colors shadow-2xs cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Real HomeRun Trust Badges Row: Continuous Slow Motion Marquee */}
        <div className="w-full overflow-hidden py-0.5 select-none rounded-md">
          <div className="animate-marquee-slow flex items-center gap-3 text-[10.5px] font-semibold text-[#8b1818] whitespace-nowrap">
            {/* Set 1 */}
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
            <span className="text-[#eab308]">⚡</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8b1818]" />
              <span>100% Genuine Brands</span>
            </div>
            <span className="text-[#eab308]">⚡</span>

            {/* Set 2 (for seamless infinite loop) */}
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
            <span className="text-[#eab308]">⚡</span>
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8b1818]" />
              <span>100% Genuine Brands</span>
            </div>
            <span className="text-[#eab308]">⚡</span>
          </div>
        </div>

        {/* 3. Hero Promo Carousel Box comes right up below the trust strip */}
        <HeroCard
          onTryEstimator={onNavigateToEstimator}
          onNavigateToCategories={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />

        {/* 4. Popular Categories Grid (4 columns with Mint Cards & Product SVGs) */}
        <CategoryGrid
          onSelectCategory={onSelectCategory}
          onViewAll={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />
      </div>
    </div>
  );
}
