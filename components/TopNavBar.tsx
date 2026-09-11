"use client";

import React from "react";
import { AppScreen } from "@/lib/types";
import {
  ShoppingCart,
  MapPin,
  Zap,
  Wallet,
  Clock,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { HomeRunThunder } from "./HomeRunLogo";

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
    { screen: "ai-estimator", label: "🎙️ Voice AI Estimator", isSpecial: true },
    { screen: "orders", label: "Orders" },
    { screen: "account", label: "Account" },
  ];

  return (
    <nav className="w-full bg-[#1a7a3a] text-white shadow-md sticky top-0 z-30 select-none">
      {/* Row 1: Brand & Trust Badges */}
      <div className="border-b border-emerald-800/80">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
          {/* Brand Info */}
          <div
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight leading-none text-white font-display">
                  Home<span className="text-[#f5c518]">Run</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-950/40 text-[#f5c518] px-1.5 py-0.2 rounded">
                  Quick Commerce
                </span>
              </div>
              <p className="text-[10px] text-emerald-100/80 font-medium">
                Bangalore Construction Materials
              </p>
            </div>
          </div>

          {/* Row 1 Trust Badges */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-emerald-100">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-300" />
              <span>⏱ 60-Min Delivery</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>✅ 100% Genuine</span>
            </span>
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-300" />
              <span>📍 Bangalore Hubs</span>
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Navigation Links & Cart */}
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Nav Links */}
        <div className="flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.screen;
            if (item.isSpecial) {
              return (
                <button
                  key={item.screen}
                  type="button"
                  onClick={() => onNavigate(item.screen)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-[#f5c518] text-[#1a1a1a]"
                      : "bg-emerald-900/60 hover:bg-emerald-800 text-[#f5c518] border border-[#f5c518]/50"
                  }`}
                >
                  <HomeRunThunder className="w-3.5 h-3.5" />
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
                    ? "bg-white text-[#1a7a3a] shadow-2xs font-bold"
                    : "text-emerald-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right Info & Cart */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2.5 text-[11.5px] font-semibold text-emerald-100">
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.8 rounded-md">
              <Zap className="w-3 h-3 text-[#f5c518]" />
              <span>60 Mins Dispatch</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>Bangalore</span>
            </span>
            <span className="flex items-center gap-1 bg-white/10 px-2 py-0.8 rounded-md">
              <Wallet className="w-3 h-3 text-[#f5c518]" />
              <span>₹0</span>
            </span>
          </div>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={onOpenCart}
            className="px-3.5 py-1.5 bg-white text-[#1a7a3a] hover:bg-emerald-50 rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-[#1a7a3a]" />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#f5c518] text-[#1a1a1a] font-black text-[10px]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
