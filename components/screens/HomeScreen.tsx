"use client";

import React from "react";
import HeroCard from "../HeroCard";
import CategoryGrid from "../CategoryGrid";
import {
  RotateCcw,
  Truck,
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Wallet,
  ShoppingCart,
  Layers,
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
    <div className="w-full flex flex-col bg-slate-50 min-h-full">
      {/* Mobile-only Header Bar */}
      {!isWeb && (
        <div className="bg-homerun-green text-white px-3.5 pt-11 pb-3 shrink-0 shadow-xs select-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-homerun-yellow text-slate-900 flex items-center justify-center font-black text-sm shadow-xs">
                HR
              </div>
              <span className="font-extrabold text-base tracking-tight font-display">
                HomeRun
              </span>
              <span className="text-[10px] font-bold bg-emerald-800/90 text-homerun-yellow px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> 60 Mins
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md text-[11px]">
                <Wallet className="w-3 h-3 text-homerun-yellow" />
                <span>₹0</span>
              </div>
              <button
                type="button"
                onClick={onOpenCart}
                className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Open Cart"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-homerun-yellow text-slate-900 font-black text-[9.5px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Bar */}
          <div
            onClick={() => alert("📍 Delivery location set to Bangalore Hub (105+ pin codes active)")}
            className="mt-2.5 bg-emerald-900/40 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[11px] text-emerald-100 cursor-pointer hover:bg-emerald-900/60 transition-colors"
          >
            <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
            <span className="truncate">📍 Bangalore, Karnataka • Tap to change</span>
          </div>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className={`flex-1 overflow-y-auto ${isWeb ? "p-6 md:p-8 space-y-8 max-w-6xl mx-auto" : "p-3 sm:p-4 space-y-4"}`}>
        {/* 1. Hero Card: AI Material Estimator */}
        <HeroCard onTryEstimator={onNavigateToEstimator} variant={isWeb ? "web" : "mobile"} />

        {/* 2. Trust Badges */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-900 shadow-2xs">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            <span>7 Day Replacement</span>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-900 shadow-2xs">
            <Truck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Free Delivery &gt; ₹500</span>
          </div>
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-900 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Assured Cashback</span>
          </div>
          {isWeb && (
            <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-900 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>10,000+ Contractors Trust Us</span>
            </div>
          )}
        </div>

        {/* 3. Promo Banner(s) */}
        <div className={`grid gap-3 ${isWeb ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Banner 1: Plywood & MDF */}
          <div
            onClick={onNavigateToCategories}
            className="rounded-2xl p-4 bg-linear-to-r from-amber-800 to-amber-950 text-white flex items-center justify-between cursor-pointer hover:shadow-md transition-all group overflow-hidden relative"
          >
            <div className="relative z-10">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-600/80 px-2 py-0.5 rounded text-amber-100">
                Direct Mill Supply
              </span>
              <h4 className="font-extrabold text-sm sm:text-base mt-1">
                🪵 Premium Plywood &amp; MDF
              </h4>
              <p className="text-[11px] text-amber-200/90 mt-0.5">
                Century &amp; Greenply at direct site prices
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-homerun-yellow mt-2 group-hover:translate-x-1 transition-transform">
                <span>Shop Now</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
            <div className="text-4xl sm:text-5xl opacity-80 select-none group-hover:scale-110 transition-transform">
              🪵
            </div>
          </div>

          {/* Banner 2: Wires Price Drop (Visible on web or second banner) */}
          {isWeb && (
            <div
              onClick={() => onNavigateToEstimator("Electrical wiring for 2BHK")}
              className="rounded-2xl p-4 bg-linear-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between cursor-pointer hover:shadow-md transition-all group overflow-hidden relative"
            >
              <div className="relative z-10">
                <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-600/80 px-2 py-0.5 rounded text-blue-100">
                  Price Drop
                </span>
                <h4 className="font-extrabold text-sm sm:text-base mt-1">
                  ⚡ Polycab &amp; Finolex FR Wires
                </h4>
                <p className="text-[11px] text-blue-200/90 mt-0.5">
                  100% genuine flame-retardant wiring coils
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-homerun-yellow mt-2 group-hover:translate-x-1 transition-transform">
                  <span>Calculate Wiring</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="text-4xl sm:text-5xl opacity-80 select-none group-hover:scale-110 transition-transform">
                ⚡
              </div>
            </div>
          )}
        </div>

        {/* 4. Category Grid */}
        <CategoryGrid
          onSelectCategory={onSelectCategory}
          onViewAll={onNavigateToCategories}
          variant={isWeb ? "web" : "mobile"}
        />

        {/* 5. Section: Why HomeRun? */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-6 shadow-2xs">
          <h4 className="font-bold text-slate-900 text-sm sm:text-base font-display mb-3">
            Why 10,000+ Contractors Choose HomeRun
          </h4>

          <div className={`grid gap-3 ${isWeb ? "grid-cols-4" : "grid-cols-2"}`}>
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Clock className="w-5 h-5 text-homerun-green shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-slate-900">60-Min Delivery</h5>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  Across 105+ pin codes in Bangalore
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-5 h-5 text-homerun-green shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-slate-900">7-Day Replacement</h5>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  No questions asked return policy
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-slate-900">Cashback on Every Order</h5>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  1% on ₹100+, 2% on ₹50,000+
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-homerun-green shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-xs text-slate-900">100% Genuine</h5>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  UltraTech, Asian Paints, Roff &amp; more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
