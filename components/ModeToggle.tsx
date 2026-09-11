"use client";

import React from "react";
import { Monitor, Smartphone } from "lucide-react";

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
          className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11.5px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
            mode === "web"
              ? "bg-homerun-green text-white shadow-xs"
              : "text-slate-600 hover:text-homerun-green hover:bg-white/80"
          }`}
          aria-label="Switch to Web Platform Mode"
        >
          <Monitor className="w-3.5 h-3.5 shrink-0" />
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
          className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11.5px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
            mode === "mobile"
              ? "bg-homerun-green text-white shadow-xs"
              : "text-slate-600 hover:text-homerun-green hover:bg-white/80"
          }`}
          aria-label="Switch to Mobile App Mode"
        >
          <Smartphone className="w-3.5 h-3.5 shrink-0" />
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
          className={`relative flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11.5px] sm:text-xs font-bold transition-all duration-200 cursor-pointer shrink-0 ${
            mode === "whatsapp"
              ? "bg-homerun-green text-white shadow-xs"
              : "text-slate-600 hover:text-homerun-green hover:bg-white/80"
          }`}
          aria-label="Switch to WhatsApp Mode"
        >
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0 fill-current" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm0 18.15c-1.49 0-2.95-.4-4.23-1.16l-.3-.18-3.14.82.84-3.06-.2-.31a8.19 8.19 0 01-1.26-4.35c0-4.54 3.69-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 012.41 5.83c.01 4.54-3.69 8.23-8.23 8.23z"/>
            <path d="M16.5 13.7c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12s-.63.79-.77.95c-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42s-.54-1.3-.74-1.78c-.2-.47-.4-.41-.54-.42l-.46-.01c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.6 4.12 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28z" />
          </svg>
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
