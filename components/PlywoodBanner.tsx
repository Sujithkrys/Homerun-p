"use client";

import React from "react";
import { Zap, ChevronRight } from "lucide-react";

interface PlywoodBannerProps {
  onClick: () => void;
}

export default function PlywoodBanner({ onClick }: PlywoodBannerProps) {
  return (
    <div
      onClick={onClick}
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
  );
}
