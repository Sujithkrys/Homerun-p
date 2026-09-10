"use client";

import React from "react";

export type DemoMode = "web" | "mobile" | "whatsapp";

interface ModeToggleProps {
  mode: DemoMode;
  onModeChange: (mode: DemoMode) => void;
  cartItemCount: number;
}

export default function ModeToggle({
  mode,
  onModeChange,
  cartItemCount,
}: ModeToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center pt-3 pb-2 px-4 select-none">
      {/* 3-Way Segmented Control */}
      <div className="inline-flex p-1 bg-white border border-slate-200 shadow-xs rounded-full gap-1">
        {/* 1. Web Platform */}
        <button
          type="button"
          onClick={() => onModeChange("web")}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            mode === "web"
              ? "bg-homerun-green text-white shadow-sm"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to Web Platform Mode"
        >
          <span>🖥</span>
          <span>Web Platform</span>
          {cartItemCount > 0 && mode !== "web" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* 2. Mobile App */}
        <button
          type="button"
          onClick={() => onModeChange("mobile")}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            mode === "mobile"
              ? "bg-homerun-green text-white shadow-sm"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to Mobile App Mode"
        >
          <span>📱</span>
          <span>Mobile App</span>
          {cartItemCount > 0 && mode !== "mobile" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* 3. WhatsApp */}
        <button
          type="button"
          onClick={() => onModeChange("whatsapp")}
          className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
            mode === "whatsapp"
              ? "bg-homerun-green text-white shadow-sm"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to WhatsApp Mode"
        >
          <span>💬</span>
          <span>WhatsApp</span>
          {cartItemCount > 0 && mode !== "whatsapp" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Subtitles as requested */}
      <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide transition-all duration-200 text-center">
        {mode === "web" && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-homerun-green"></span>
            How the AI assistant looks on HomeRun&apos;s website — full platform with AI estimator
          </span>
        )}
        {mode === "mobile" && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-homerun-green"></span>
            How it looks in the HomeRun mobile app — full platform with AI estimator
          </span>
        )}
        {mode === "whatsapp" && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
            How contractors order via WhatsApp — same AI, text interface
          </span>
        )}
      </p>
    </div>
  );
}
