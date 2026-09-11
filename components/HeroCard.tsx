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
      className={`w-full rounded-2xl bg-linear-to-br from-[#ffffff] via-[#f7fcf9] to-[#eef7f3] border border-[#cceade] shadow-xs relative overflow-hidden cursor-pointer group transition-all hover:shadow-md ${
        isWeb ? "p-7 md:p-9" : "p-4 sm:p-5"
      }`}
    >
      {/* Subtle decorative mint circles */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#d8f3e5]/50 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-[#d5efe2]/40 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start text-left">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#e8f5e9] border border-[#c8e6c9] text-[11px] font-bold text-[#1a7a3a] mb-2.5">
          <Sparkles className="w-3 h-3 text-[#1a7a3a]" />
          <span>Next-Gen Construction Assistant</span>
        </div>

        {/* Heading */}
        <h2
          className={`font-black tracking-tight text-[#1a1a1a] font-display leading-tight ${
            isWeb ? "text-2xl md:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          🤖 AI Material Estimator
        </h2>

        {/* Subtitle */}
        <p
          className={`text-[#4b5563] font-normal leading-relaxed mt-1.5 ${
            isWeb ? "text-sm md:text-base max-w-2xl" : "text-xs"
          }`}
        >
          Tell us your project in plain language — get an instant bill of materials with exact quantities, live Bangalore prices, and a downloadable PDF estimate.
        </p>

        {/* Example prompt pills */}
        <div className="flex flex-wrap gap-1.5 my-3">
          {examplePrompts.slice(0, isWeb ? 4 : 2).map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTryEstimator(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-white hover:bg-[#eef7f3] border border-[#d8eee3] text-[11px] font-semibold text-[#1a7a3a] shadow-2xs transition-colors"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Yellow CTA Button */}
        <div className="mt-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTryEstimator();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#f5c518] hover:bg-[#ebbb13] active:scale-95 text-[#111827] font-black text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <span>Try AI Estimator</span>
            <ArrowRight className="w-4 h-4 text-[#111827] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
