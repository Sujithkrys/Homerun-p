"use client";

import React from "react";
import { AppScreen } from "@/lib/types";
import { Sparkles } from "lucide-react";

interface BottomNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export default function BottomNavBar({ currentScreen, onNavigate }: BottomNavBarProps) {
  return (
    <div className="w-full bg-white border-t border-[#e5e5e5] px-1 py-1.5 flex items-center justify-between shrink-0 relative z-30 select-none">
      {/* 1. Home Tab */}
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill={currentScreen === "home" ? "#f5c518" : "none"}
          stroke={currentScreen === "home" ? "#000000" : "#777777"}
          strokeWidth="1.8"
        >
          {/* House with lightning/arrow inside */}
          <path d="M3 10.5L12 3L21 10.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10.5Z" />
          <path d="M12 9V17M12 9L9.5 12M12 9L14.5 12" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            currentScreen === "home" ? "font-extrabold text-black" : "font-medium text-[#777777]"
          }`}
        >
          Home
        </span>
      </button>

      {/* 2. Categories Tab */}
      <button
        type="button"
        onClick={() => onNavigate("categories")}
        className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill={currentScreen === "categories" ? "#1a7a3a" : "none"}
          stroke={currentScreen === "categories" ? "#1a7a3a" : "#777777"}
          strokeWidth="1.8"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            currentScreen === "categories" ? "font-extrabold text-black" : "font-medium text-[#777777]"
          }`}
        >
          Categories
        </span>
      </button>

      {/* 3. Floating AI Estimator Center Button (Green Circle Hero CTA) */}
      <div className="flex flex-col items-center justify-center flex-1 relative -top-3.5">
        <button
          type="button"
          onClick={() => onNavigate("ai-estimator")}
          className={`w-12 h-12 rounded-full bg-[#1a7a3a] text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer ${
            currentScreen === "ai-estimator" ? "ring-2 ring-[#f5c518] ring-offset-2 scale-105" : ""
          }`}
          aria-label="AI Estimator"
        >
          <Sparkles className="w-6 h-6 text-[#f5c518] animate-pulse" />
        </button>
        <span
          className={`text-[10px] mt-0.5 font-extrabold tracking-tight ${
            currentScreen === "ai-estimator" ? "text-[#1a7a3a]" : "text-[#555555]"
          }`}
        >
          Estimate
        </span>
      </div>

      {/* 4. Orders Tab */}
      <button
        type="button"
        onClick={() => onNavigate("orders")}
        className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill={currentScreen === "orders" ? "#f5c518" : "none"}
          stroke={currentScreen === "orders" ? "#000000" : "#777777"}
          strokeWidth="1.8"
        >
          {/* Hand trolley / receipt icon */}
          <rect x="6" y="4" width="12" height="16" rx="2" fill={currentScreen === "orders" ? "#f5c518" : "none"} />
          <line x1="9" y1="8" x2="15" y2="8" stroke={currentScreen === "orders" ? "#000" : "#777"} strokeWidth="1.5" />
          <line x1="9" y1="12" x2="15" y2="12" stroke={currentScreen === "orders" ? "#000" : "#777"} strokeWidth="1.5" />
          <line x1="9" y1="16" x2="13" y2="16" stroke={currentScreen === "orders" ? "#000" : "#777"} strokeWidth="1.5" />
          <circle cx="4" cy="19" r="1.5" stroke="#777" strokeWidth="1.2" />
        </svg>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            currentScreen === "orders" ? "font-extrabold text-black" : "font-medium text-[#777777]"
          }`}
        >
          Orders
        </span>
      </button>

      {/* 5. Account Tab */}
      <button
        type="button"
        onClick={() => onNavigate("account")}
        className="flex flex-col items-center justify-center flex-1 py-1 cursor-pointer transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5"
          fill={currentScreen === "account" ? "#f5c518" : "none"}
          stroke={currentScreen === "account" ? "#000000" : "#777777"}
          strokeWidth="1.8"
        >
          <circle cx="12" cy="7" r="4" />
          <path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" />
        </svg>
        <span
          className={`text-[10px] mt-0.5 tracking-tight ${
            currentScreen === "account" ? "font-extrabold text-black" : "font-medium text-[#777777]"
          }`}
        >
          Account
        </span>
      </button>
    </div>
  );
}
