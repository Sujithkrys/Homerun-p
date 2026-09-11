"use client";

import React from "react";
import { ChevronDown, ShoppingCart } from "lucide-react";
import { HomeRunLogo } from "./HomeRunLogo";

interface HomeRunHeaderProps {
  cartCount: number;
  onOpenCart?: () => void;
  onSetLocation?: () => void;
}

export default function HomeRunHeader({
  cartCount,
  onOpenCart,
  onSetLocation,
}: HomeRunHeaderProps) {
  return (
    <div className="w-full bg-white px-4 pt-9 pb-2 border-b border-[#f0f0f0] flex items-start justify-between shrink-0 select-none">
      {/* Left Column: Logo + 60 Mins + Set location */}
      <div>
        {/* Brand text with official Logo */}
        <div className="flex items-center gap-1.5 text-xs tracking-tight font-extrabold font-display">
          <HomeRunLogo className="w-4.5 h-4.5 rounded-sm" />
          <div>
            <span className="text-[#1a1a1a]">Home</span>
            <span className="text-[#eab308]">Run</span>
          </div>
        </div>

        {/* 60 Mins with dropdown arrow */}
        <div className="flex items-center gap-1 mt-0.5 cursor-pointer">
          <span className="text-2xl font-black text-[#1a1a1a] tracking-tight leading-none">
            60 Mins
          </span>
          <ChevronDown className="w-5 h-5 text-[#1a1a1a] stroke-[2.5]" />
        </div>

        {/* Set location link in green */}
        <button
          type="button"
          onClick={onSetLocation || (() => alert("📍 Delivery location set to Bangalore Hub (105+ pin codes active)"))}
          className="text-xs font-semibold text-[#1a7a3a] hover:underline mt-0.5 block text-left cursor-pointer"
        >
          Set location
        </button>
      </div>

      {/* Right Column: Wallet Pill + Cart Icon with Badge */}
      <div className="flex items-center gap-2.5 pt-1">
        {/* Wallet Badge Pill */}
        <div className="flex flex-col items-center cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-[#fbf5e6] flex items-center justify-center shadow-2xs border border-[#faecd2]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1a7a3a]" fill="#1a7a3a">
              <rect x="3" y="6" width="18" height="13" rx="2.5" fill="#1a7a3a" />
              <rect x="13" y="10" width="7" height="5" rx="1.5" fill="#2e7d32" />
              <circle cx="16.5" cy="12.5" r="1" fill="#FFFFFF" />
            </svg>
          </div>
          <span className="mt-[-6px] bg-[#1a1a1a] text-white font-extrabold text-[10px] px-2 py-0.2 rounded-full shadow-xs">
            ₹0
          </span>
        </div>

        {/* Cart Icon with Olive-Green Badge */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative w-10 h-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center shadow-xs hover:bg-[#111111] transition-colors cursor-pointer"
          aria-label="Open Cart"
        >
          <ShoppingCart className="w-4 h-4 text-white" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#4d7c0f] text-white font-black text-[11px] flex items-center justify-center border-2 border-white shadow-xs">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
