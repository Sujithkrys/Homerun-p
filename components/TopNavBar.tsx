"use client";

import React from "react";
import { AppScreen } from "@/lib/types";
import {
  Sparkles,
  ShoppingCart,
  MapPin,
  Zap,
  Wallet,
  Building2,
} from "lucide-react";

interface TopNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export default function TopNavBar({
  currentScreen,
  onNavigate,
  cartCount,
  onOpenCart,
}: TopNavBarProps) {
  const navItems: { screen: AppScreen; label: string; isSpecial?: boolean }[] = [
    { screen: "home", label: "Home" },
    { screen: "categories", label: "Categories" },
    { screen: "ai-estimator", label: "AI Estimator", isSpecial: true },
    { screen: "orders", label: "Orders" },
    { screen: "account", label: "Account" },
  ];

  return (
    <nav className="w-full bg-[#1a7a3a] text-white shadow-md sticky top-0 z-30 select-none">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-homerun-yellow text-slate-900 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
            HR
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight leading-none text-white font-display">
                HomeRun
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-950/40 text-homerun-yellow px-1.5 py-0.5 rounded">
                Direct Site Delivery
              </span>
            </div>
            <p className="text-[10.5px] text-emerald-100/80 font-medium mt-0.5">
              Bangalore Quick Commerce
            </p>
          </div>
        </div>

        {/* Center: Nav links */}
        <div className="hidden md:flex items-center gap-1 bg-emerald-900/40 p-1 rounded-xl border border-emerald-700/50">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            if (item.isSpecial) {
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-homerun-yellow text-slate-950 shadow-xs"
                      : "bg-emerald-800/80 hover:bg-emerald-700 text-homerun-yellow border border-homerun-yellow/30"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-homerun-yellow group-hover:rotate-12 transition-transform" />
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <button
                key={item.screen}
                type="button"
                onClick={() => onNavigate(item.screen)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-white text-emerald-950 shadow-xs"
                    : "text-emerald-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right: Meta & Cart */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-semibold text-emerald-100">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
              <Zap className="w-3 h-3 text-homerun-yellow" />
              <span>60 Mins Dispatch</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>Bangalore</span>
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-md">
              <Wallet className="w-3 h-3 text-homerun-yellow" />
              <span>₹0</span>
            </span>
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl transition-all font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            aria-label="Open Cart"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-800" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-homerun-yellow text-slate-950 font-black text-[10px] min-w-[18px] text-center shadow-2xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
