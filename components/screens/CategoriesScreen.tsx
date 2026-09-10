"use client";

import React from "react";
import { CATEGORIES, CATEGORY_GROUPS } from "@/lib/categories";
import { ArrowLeft, ShoppingCart, Sparkles, ChevronRight } from "lucide-react";

interface CategoriesScreenProps {
  onBack?: () => void;
  onSelectCategory: (categoryName: string) => void;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function CategoriesScreen({
  onBack,
  onSelectCategory,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: CategoriesScreenProps) {
  const isWeb = variant === "web";

  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-full">
      {/* Mobile Header Bar */}
      {!isWeb && (
        <div className="bg-homerun-green text-white px-3.5 pt-11 pb-3 flex items-center justify-between shrink-0 shadow-xs select-none">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="font-extrabold text-base tracking-tight font-display">
              Categories
            </h2>
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
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 overflow-y-auto ${
          isWeb ? "p-6 md:p-8 max-w-6xl mx-auto space-y-6" : "p-3 sm:p-4 space-y-4"
        }`}
      >
        {isWeb && (
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="font-black text-2xl text-slate-900 font-display">
                Browse All Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any category to browse catalog items directly with our AI assistant
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Catalog Browsing</span>
            </div>
          </div>
        )}

        {/* Grouped Category Sections */}
        {CATEGORY_GROUPS.map((group) => {
          const groupCategories = CATEGORIES.filter((c) => c.group === group);
          return (
            <div key={group} className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <h3 className="font-bold text-xs sm:text-sm text-slate-700 uppercase tracking-wider">
                  {group}
                </h3>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {isWeb ? (
                /* Web Grid View */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {groupCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.name)}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-sm hover:bg-emerald-50/20 active:scale-98 transition-all text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl select-none transform group-hover:scale-110 transition-transform">
                          {cat.icon}
                        </span>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-homerun-green truncate">
                            {cat.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {cat.productCount} products
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-homerun-green group-hover:translate-x-0.5 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                /* Mobile Grouped Card List */
                <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden divide-y divide-slate-100 shadow-2xs">
                  {groupCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => onSelectCategory(cat.name)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-emerald-50/30 active:bg-emerald-50/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl select-none">{cat.icon}</span>
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-homerun-green">
                            {cat.name}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <span className="text-[11px] text-slate-500 font-medium">
                          {cat.productCount} products
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-homerun-green" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
