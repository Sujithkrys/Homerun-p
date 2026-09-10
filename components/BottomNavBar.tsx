"use client";

import React from "react";
import { AppScreen } from "@/lib/types";
import { Home, Grid, ClipboardList, User, Sparkles } from "lucide-react";

interface BottomNavBarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
}

export default function BottomNavBar({ currentScreen, onNavigate }: BottomNavBarProps) {
  return (
    <div className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around shrink-0 relative z-30 select-none shadow-lg">
      {/* 1. Home Tab */}
      <button
        type="button"
        onClick={() => onNavigate("home")}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
          currentScreen === "home" ? "text-homerun-green font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Home className={`w-4 h-4 sm:w-5 sm:h-5 ${currentScreen === "home" ? "stroke-[2.5]" : ""}`} />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2. Categories Tab */}
      <button
        type="button"
        onClick={() => onNavigate("categories")}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
          currentScreen === "categories" ? "text-homerun-green font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Grid className={`w-4 h-4 sm:w-5 sm:h-5 ${currentScreen === "categories" ? "stroke-[2.5]" : ""}`} />
        <span className="text-[10px] mt-0.5">Categories</span>
      </button>

      {/* 3. Floating AI Estimator Center Button (Hero CTA) */}
      <div className="flex flex-col items-center justify-center flex-1 relative -top-3.5">
        <button
          type="button"
          onClick={() => onNavigate("ai-estimator")}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-homerun-green text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer ${
            currentScreen === "ai-estimator" ? "ring-2 ring-homerun-yellow ring-offset-2" : ""
          }`}
          aria-label="AI Estimator"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-homerun-yellow" />
        </button>
        <span
          className={`text-[10px] mt-0.5 font-bold ${
            currentScreen === "ai-estimator" ? "text-homerun-green" : "text-slate-600"
          }`}
        >
          Estimate
        </span>
      </div>

      {/* 4. Orders Tab */}
      <button
        type="button"
        onClick={() => onNavigate("orders")}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
          currentScreen === "orders" ? "text-homerun-green font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <ClipboardList className={`w-4 h-4 sm:w-5 sm:h-5 ${currentScreen === "orders" ? "stroke-[2.5]" : ""}`} />
        <span className="text-[10px] mt-0.5">Orders</span>
      </button>

      {/* 5. Account Tab */}
      <button
        type="button"
        onClick={() => onNavigate("account")}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
          currentScreen === "account" ? "text-homerun-green font-bold" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <User className={`w-4 h-4 sm:w-5 sm:h-5 ${currentScreen === "account" ? "stroke-[2.5]" : ""}`} />
        <span className="text-[10px] mt-0.5">Account</span>
      </button>
    </div>
  );
}
