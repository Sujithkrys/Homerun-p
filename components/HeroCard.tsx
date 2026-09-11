"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, Zap } from "lucide-react";

interface HeroCardProps {
  onTryEstimator: (prompt?: string) => void;
  onNavigateToCategories?: () => void;
  variant?: "mobile" | "web";
}

export default function HeroCard({
  onTryEstimator,
  onNavigateToCategories,
  variant = "mobile",
}: HeroCardProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = 3;

  // Auto-transition every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 3500);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      // Swipe left -> next
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    } else if (diff < -40) {
      // Swipe right -> prev
      setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Carousel Track Container */}
      <div
        className="w-full overflow-hidden rounded-2xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {/* SLIDE 1: AI Estimator Hero Card (Matching Promo Banner Design) */}
          <div className="w-full shrink-0">
            <div
              onClick={() => onTryEstimator()}
              className="w-full rounded-2xl bg-linear-to-r from-[#ffffff] via-[#f4faf7] to-[#eef7f3] border border-[#d3ece0] p-3.5 shadow-2xs cursor-pointer hover:shadow-xs transition-shadow relative overflow-hidden flex items-center justify-between"
            >
              {/* Decorative green curve in background */}
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1a7a3a]/10 pointer-events-none" />

              {/* Left Content */}
              <div className="relative z-10 flex flex-col items-start pr-2">
                <h3 className="font-black text-base sm:text-lg text-[#1a1a1a] tracking-tight leading-tight font-display">
                  AI Material<br />Estimator.
                </h3>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eab308] text-[#1a1a1a] text-[10px] font-black mt-1.5 shadow-2xs">
                  <span>Exact Quantities &amp; Live Prices</span>
                </div>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#1a7a3a] text-white text-[10.5px] font-black flex items-center gap-0.5 shadow-2xs hover:bg-[#145a2b]">
                    TRY AI ESTIMATOR <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="text-[9.5px] font-bold text-[#1a7a3a] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-[#eab308]" /> 60 MINUTE DELIVERY
                  </span>
                </div>
              </div>

              {/* Right Content: Robot/Blueprint/Calculator Product-Style SVG Illustration */}
              <div className="relative shrink-0 w-32 sm:w-36 h-24 flex items-center justify-end">
                <svg viewBox="0 0 100 80" className="w-28 h-22 drop-shadow-sm">
                  {/* Clipboard/Blueprint base */}
                  <rect x="18" y="10" width="64" height="64" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
                  <rect x="36" y="6" width="28" height="8" rx="2" fill="#0369a1" />
                  <circle cx="50" cy="10" r="2" fill="#ffffff" />
                  {/* Blueprint lines */}
                  <line x1="26" y1="24" x2="60" y2="24" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                  <line x1="26" y1="32" x2="74" y2="32" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  <line x1="26" y1="40" x2="52" y2="40" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  {/* Smart Calculator / AI device floating in front */}
                  <rect x="42" y="30" width="46" height="42" rx="5" fill="#1a7a3a" stroke="#ffffff" strokeWidth="1.5" />
                  {/* Screen */}
                  <rect x="47" y="35" width="36" height="11" rx="2" fill="#0d3d1c" />
                  <text x="50" y="43" fill="#f5c518" fontSize="7" fontWeight="bold" fontFamily="monospace">₹ 48,250</text>
                  {/* Buttons */}
                  <rect x="48" y="49" width="7" height="6" rx="1.5" fill="#2e7d32" />
                  <rect x="58" y="49" width="7" height="6" rx="1.5" fill="#2e7d32" />
                  <rect x="68" y="49" width="7" height="6" rx="1.5" fill="#f5c518" />
                  <rect x="48" y="58" width="7" height="6" rx="1.5" fill="#2e7d32" />
                  <rect x="58" y="58" width="7" height="6" rx="1.5" fill="#2e7d32" />
                  <rect x="68" y="58" width="7" height="6" rx="1.5" fill="#ffffff" />
                  {/* Sparkles */}
                  <path d="M14 26L16 20L18 26L24 28L18 30L16 36L14 30L8 28Z" fill="#f5c518" />
                  <path d="M78 12L79.5 8L81 12L85 13.5L81 15L79.5 19L78 15L74 13.5Z" fill="#1a7a3a" />
                </svg>
              </div>
            </div>
          </div>

          {/* SLIDE 2: Original Plywood & MDF Promo Card */}
          <div className="w-full shrink-0">
            <div
              onClick={() => (onNavigateToCategories ? onNavigateToCategories() : onTryEstimator("Plywood and MDF"))}
              className="w-full rounded-2xl bg-white border border-[#e5e5e5] p-3.5 shadow-2xs cursor-pointer hover:shadow-xs transition-shadow relative overflow-hidden flex items-center justify-between"
            >
              {/* Decorative green curve in background */}
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1b5e20]/10 pointer-events-none" />

              {/* Left Content */}
              <div className="relative z-10 flex flex-col items-start pr-2">
                <h3 className="font-black text-base sm:text-lg text-[#1a1a1a] tracking-tight leading-tight font-display">
                  Original<br />Plywood &amp; MDF.
                </h3>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#eab308] text-[#1a1a1a] text-[10px] font-black mt-1.5 shadow-2xs">
                  <span>Wholesale Prices.</span>
                </div>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#1a7a3a] text-white text-[10.5px] font-black flex items-center gap-0.5 shadow-2xs hover:bg-[#145a2b]">
                    ORDER NOW <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="text-[9.5px] font-bold text-[#1a7a3a] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-[#eab308]" /> 60 MINUTE DELIVERY
                  </span>
                </div>
              </div>

              {/* Right Content: Realistic Boards + Warranty Stamps */}
              <div className="relative shrink-0 w-32 sm:w-36 h-24 flex items-center justify-end">
                {/* Plywood Board (Wood Grain) */}
                <div className="w-24 h-22 rounded-sm bg-[#d7a15c] border border-[#a87434] shadow-xs relative overflow-hidden flex flex-col justify-between p-1.5 transform rotate-2">
                  <div className="w-5 h-5 rounded-full border border-dashed border-[#5d3b14] text-[6px] font-extrabold text-[#5d3b14] flex items-center justify-center text-center leading-none">
                    30 YR
                  </div>
                  <div className="text-[7px] font-bold text-[#5d3b14] text-right font-mono">
                    PLYWOOD
                  </div>
                </div>

                {/* Charcoal HDHMR Board in Foreground */}
                <div className="w-22 h-14 rounded-sm bg-[#52595d] border border-[#3b4144] shadow-md absolute bottom-1 right-2 p-1 flex flex-col justify-between transform -rotate-1">
                  <div className="flex justify-between items-start">
                    <span className="text-[7px] font-black text-[#e5e5e5] font-sans">
                      TESA HDHMR
                    </span>
                    <span className="text-[6px] text-amber-300 font-bold">15 YR</span>
                  </div>
                  <span className="text-[6px] font-bold text-slate-300">18MM MOISTURE PROOF</span>
                </div>
              </div>
            </div>
          </div>

          {/* SLIDE 3: Wires & Cables Price Drop Card */}
          <div className="w-full shrink-0">
            <div
              onClick={() => onTryEstimator("Electrical wiring estimate for 2BHK")}
              className="w-full rounded-2xl bg-linear-to-r from-[#ffffff] via-[#f0f6ff] to-[#e6efff] border border-[#bfdbfe] p-3.5 shadow-2xs cursor-pointer hover:shadow-xs transition-shadow relative overflow-hidden flex items-center justify-between"
            >
              {/* Decorative blue curve in background */}
              <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#0047cc]/10 pointer-events-none" />

              {/* Left Content */}
              <div className="relative z-10 flex flex-col items-start pr-2">
                <h3 className="font-black text-base sm:text-lg text-[#1a1a1a] tracking-tight leading-tight font-display">
                  Wires &amp; Cables.<br />Price Drop.
                </h3>

                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0047cc] text-white text-[10px] font-black mt-1.5 shadow-2xs">
                  <span>100% Genuine FR Coils</span>
                </div>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="px-2.5 py-1 rounded-md bg-[#0047cc] text-white text-[10.5px] font-black flex items-center gap-0.5 shadow-2xs hover:bg-[#0039a6]">
                    CALCULATE WIRING <ChevronRight className="w-3 h-3" />
                  </span>
                  <span className="text-[9.5px] font-bold text-[#0047cc] flex items-center gap-0.5">
                    <Zap className="w-2.5 h-2.5 text-[#eab308]" /> DIRECT MILL SUPPLY
                  </span>
                </div>
              </div>

              {/* Right Content: Wire Coils Illustration */}
              <div className="relative shrink-0 w-32 sm:w-36 h-24 flex items-center justify-end">
                <svg viewBox="0 0 100 80" className="w-28 h-22 drop-shadow-sm">
                  {/* Coiled Wire Red */}
                  <ellipse cx="44" cy="46" rx="28" ry="18" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
                  <ellipse cx="44" cy="43" rx="28" ry="18" fill="#ef4444" />
                  <ellipse cx="44" cy="43" rx="14" ry="9" fill="#f0f6ff" stroke="#991b1b" strokeWidth="1.5" />
                  {/* Brand band */}
                  <rect x="36" y="32" width="16" height="22" rx="2" fill="#ffffff" stroke="#991b1b" strokeWidth="1" />
                  <text x="39" y="44" fill="#991b1b" fontSize="5" fontWeight="bold">FINOLEX</text>
                  <text x="39" y="50" fill="#111111" fontSize="4">2.5 SQMM</text>

                  {/* Coiled Wire Green In Front */}
                  <ellipse cx="66" cy="52" rx="22" ry="14" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
                  <ellipse cx="66" cy="50" rx="22" ry="14" fill="#22c55e" />
                  <ellipse cx="66" cy="50" rx="11" ry="7" fill="#f0f6ff" stroke="#166534" strokeWidth="1" />
                  <rect x="60" y="42" width="12" height="16" rx="1.5" fill="#ffffff" stroke="#166534" strokeWidth="0.8" />
                  <text x="62" y="52" fill="#166534" fontSize="4" fontWeight="bold">POLYCAB</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center gap-1.5 mt-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`transition-all rounded-full cursor-pointer ${
              activeIndex === idx
                ? "w-4 h-1.5 bg-[#1a7a3a]"
                : "w-1.5 h-1.5 bg-[#d1d5db] hover:bg-[#9ca3af]"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
