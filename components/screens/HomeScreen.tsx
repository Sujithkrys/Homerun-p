"use client";

import React from "react";
import HomeRunHeader from "../HomeRunHeader";
import HeroCard from "../HeroCard";
import PlywoodBanner from "../PlywoodBanner";
import CategoryGrid from "../CategoryGrid";
import {
  RotateCcw,
  Truck,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
  Search,
  Zap,
} from "lucide-react";

interface HomeScreenProps {
  onNavigateToEstimator: (prompt?: string) => void;
  onNavigateToCategories: () => void;
  onSelectCategory: (categoryName: string) => void;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function HomeScreen({
  onNavigateToEstimator,
  onNavigateToCategories,
  onSelectCategory,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: HomeScreenProps) {
  const isWeb = variant === "web";

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
          isWeb ? "p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full" : "p-3 space-y-3.5"
        }`}
      >
        {/* 1. Real HomeRun Search Bar */}
        <div
          onClick={() => onNavigateToEstimator("Search for Plywood")}
          className="w-full bg-white rounded-xl border border-[#e5e5e5] px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs cursor-pointer hover:border-[#1a7a3a] transition-colors"
        >
          <Search className="w-4 h-4 text-[#777777] shrink-0" />
          <div className="text-xs font-medium text-[#777777] flex items-center gap-1">
            <span>Search for</span>
            <span className="text-[#1a7a3a] font-bold">Plywood</span>
          </div>
        </div>

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

        {/* 4. AI Estimator Hero Card (Clean White-to-Mint) */}
        <HeroCard onTryEstimator={onNavigateToEstimator} variant={isWeb ? "web" : "mobile"} />

        {/* 5. Real HomeRun Promotional Banner (Original Plywood & MDF) */}
        <PlywoodBanner onClick={onNavigateToCategories} />

        {/* 6. Popular Categories Grid (4 columns with Mint Cards & Product SVGs) */}
        <CategoryGrid
          onSelectCategory={onSelectCategory}
          onViewAll={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />

        {/* 7. Why HomeRun Section */}
        <div className="rounded-2xl bg-white border border-[#e5e5e5] p-3.5 sm:p-5 shadow-2xs space-y-2.5">
          <h4 className="font-extrabold text-xs sm:text-sm text-[#1a1a1a] tracking-tight">
            Why 10,000+ Contractors Choose HomeRun
          </h4>

          <div className={`grid gap-2.5 ${isWeb ? "grid-cols-4" : "grid-cols-2"}`}>
            <div className="flex items-start gap-2 p-2 rounded-xl bg-[#f8fafc] border border-slate-100">
              <Clock className="w-4 h-4 text-[#1a7a3a] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[11px] text-[#1a1a1a]">60-Min Delivery</h5>
                <p className="text-[10px] text-slate-500">Across 105+ pin codes in Bangalore</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-[#f8fafc] border border-slate-100">
              <RotateCcw className="w-4 h-4 text-[#1a7a3a] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[11px] text-[#1a1a1a]">7-Day Replacement</h5>
                <p className="text-[10px] text-slate-500">No questions asked guarantee</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-[#f8fafc] border border-slate-100">
              <Sparkles className="w-4 h-4 text-[#eab308] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[11px] text-[#1a1a1a]">Cashback Every Order</h5>
                <p className="text-[10px] text-slate-500">1% on ₹100+, 2% on ₹50,000+</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 rounded-xl bg-[#f8fafc] border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-[#1a7a3a] shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-[11px] text-[#1a1a1a]">100% Genuine</h5>
                <p className="text-[10px] text-slate-500">UltraTech, Asian Paints, Roff</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
