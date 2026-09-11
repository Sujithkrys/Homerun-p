"use client";

import React from "react";

export type DemoMode = "web" | "mobile" | "whatsapp";

interface ModeToggleProps {
  mode: DemoMode;
  onModeChange: (mode: DemoMode) => void;
  cartItemCount: number;
  showSubtitle?: boolean;
}

export default function ModeToggle({
  mode,
  onModeChange,
  cartItemCount,
  showSubtitle = false,
}: ModeToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center select-none shrink-0">
      {/* 3-Way Segmented Control */}
      <div className="inline-flex p-0.5 bg-slate-100/90 border border-slate-200/90 shadow-2xs rounded-full gap-0.5">
        {/* 1. Web Platform */}
        <button
          type="button"
          onClick={() => onModeChange("web")}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            mode === "web"
              ? "bg-homerun-green text-white shadow-xs"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to Web Platform Mode"
        >
          <span>🖥</span>
          <span>Web Platform</span>
          {cartItemCount > 0 && mode !== "web" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* 2. Mobile App */}
        <button
          type="button"
          onClick={() => onModeChange("mobile")}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            mode === "mobile"
              ? "bg-homerun-green text-white shadow-xs"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to Mobile App Mode"
        >
          <span>📱</span>
          <span>Mobile App</span>
          {cartItemCount > 0 && mode !== "mobile" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* 3. WhatsApp */}
        <button
          type="button"
          onClick={() => onModeChange("whatsapp")}
          className={`relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
            mode === "whatsapp"
              ? "bg-homerun-green text-white shadow-xs"
              : "bg-white text-homerun-green hover:bg-homerun-green/10"
          }`}
          aria-label="Switch to WhatsApp Mode"
        >
          <span>💬</span>
          <span>WhatsApp</span>
          {cartItemCount > 0 && mode !== "whatsapp" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-black bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Optional Subtitle */}
      {showSubtitle && (
        <p className="text-[12px] text-slate-500 mt-1 font-medium tracking-tight text-center leading-tight">
          {mode === "web" && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-homerun-green"></span>
              How the AI assistant looks on HomeRun&apos;s website — full platform with AI estimator
            </span>
          )}
          {mode === "mobile" && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-homerun-green"></span>
              How it looks in the HomeRun mobile app — full platform with AI estimator
            </span>
          )}
          {mode === "whatsapp" && (
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25d366]"></span>
              How contractors order via WhatsApp — same AI, text interface
            </span>
          )}
        </p>
      )}
    </div>
  );
}
