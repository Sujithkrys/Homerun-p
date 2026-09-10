"use client";

import React from "react";
import { Smartphone, MessageSquare } from "lucide-react";

export type DemoMode = "in-app" | "whatsapp";

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
      {/* Segmented Control Pill */}
      <div className="inline-flex p-1 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-full relative">
        <button
          type="button"
          onClick={() => onModeChange("in-app")}
          className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            mode === "in-app"
              ? "bg-homerun-green text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
          aria-label="Switch to In-App Mode"
        >
          <Smartphone className="w-4 h-4" />
          <span>In-App Mode</span>
          {cartItemCount > 0 && mode !== "in-app" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onModeChange("whatsapp")}
          className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            mode === "whatsapp"
              ? "bg-[#075e54] text-white shadow-md"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
          aria-label="Switch to WhatsApp Mode"
        >
          <MessageSquare className="w-4 h-4 text-[#25d366]" />
          <span>WhatsApp Mode</span>
          {cartItemCount > 0 && mode !== "whatsapp" && (
            <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-homerun-yellow text-slate-900 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      {/* Mode Description Subtitle */}
      <p className="text-xs text-slate-500 mt-2 font-medium tracking-wide transition-all duration-200 text-center">
        {mode === "in-app" ? (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-homerun-green"></span>
            How the assistant looks embedded in the <strong className="text-slate-700">HomeRun app</strong> (with live cart sidebar & estimation panel)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#25d366]"></span>
            How contractors order via <strong className="text-slate-700">WhatsApp</strong> — same AI brain, interactive text bubbles & payment links
          </span>
        )}
      </p>
    </div>
  );
}
