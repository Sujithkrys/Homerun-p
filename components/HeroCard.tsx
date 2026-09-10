"use client";

import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface HeroCardProps {
  onTryEstimator: (prompt?: string) => void;
  variant?: "mobile" | "web";
}

export default function HeroCard({ onTryEstimator, variant = "mobile" }: HeroCardProps) {
  const isWeb = variant === "web";

  const examplePrompts = [
    "Tile my 2 bathrooms",
    "Full renovation for 2BHK",
    "Painting estimate for 3BHK",
    "10 bags UltraTech",
  ];

  return (
    <div
      onClick={() => onTryEstimator()}
      className={`w-full rounded-2xl bg-linear-to-br from-[#0a3a1b] via-[#105a2b] to-[#1a7a3a] text-white shadow-lg relative overflow-hidden cursor-pointer group transition-all hover:shadow-xl ${
        isWeb ? "p-8 md:p-10" : "p-4 sm:p-5"
      }`}
    >
      {/* Subtle background glow / decorative shape */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-homerun-yellow/10 blur-2xl pointer-events-none" />

      <div className={`relative z-10 flex flex-col ${isWeb ? "items-center text-center max-w-3xl mx-auto" : "items-start text-left"}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/20 text-xs font-semibold text-homerun-yellow mb-3">
          <Sparkles className="w-3.5 h-3.5 text-homerun-yellow" />
          <span>Next-Gen Construction Assistant</span>
        </div>

        {/* Title */}
        <h2
          className={`font-black tracking-tight text-white font-display leading-tight ${
            isWeb ? "text-3xl md:text-4xl" : "text-xl sm:text-2xl"
          }`}
        >
          🤖✨ AI Material Estimator
        </h2>

        {/* Subtitle */}
        <p
          className={`text-emerald-100/90 font-medium leading-relaxed mt-2 ${
            isWeb ? "text-base md:text-lg max-w-2xl" : "text-xs sm:text-sm"
          }`}
        >
          Tell us your project in plain language — get an instant bill of materials with exact quantities, live Bangalore prices, and a downloadable PDF estimate.
        </p>

        {/* Example prompt pills */}
        <div className={`flex flex-wrap gap-2 my-4 ${isWeb ? "justify-center" : "justify-start"}`}>
          {examplePrompts.slice(0, isWeb ? 4 : 2).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTryEstimator(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-medium text-emerald-100 transition-colors backdrop-blur-xs"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTryEstimator();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-homerun-yellow text-slate-950 font-black text-xs sm:text-sm shadow-md hover:bg-amber-400 active:scale-95 transition-all cursor-pointer"
          >
            <span>Try AI Estimator</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
