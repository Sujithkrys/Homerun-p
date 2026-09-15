"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, X, Sparkles, Info } from "lucide-react";

import { HomeRunLogo } from "@/components/HomeRunLogo";

export default function FeatureHighlightPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Automatically show the popup a moment after the page loads
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasMounted(true);
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) return null;

  if (isOpen) {
    return (
      <>
        {/* Backdrop overlay */}
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Modal */}
        <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-2xl shadow-2xl z-[101] overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
          <div className="bg-homerun-green px-5 py-4 flex items-center justify-between relative">
            <div className="flex items-center gap-2 text-white">
              <HomeRunLogo size={22} className="w-[22px] h-[22px] rounded-sm shadow-2xs" />
              <h2 className="font-extrabold text-lg tracking-tight font-display">
                Welcome to HomeRun AI
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-5 sm:p-6 space-y-4">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Explore the key capabilities of this quick-commerce demo:
            </p>
            
            <ul className="space-y-3.5">
              {[
                "Voice agent that speaks English, Hindi, Telugu, Kannada, and Tamil.",
                "Switch languages in the middle of a call — no need to restart.",
                "Add products to your cart directly while talking to the voice agent.",
                "Text chat works in the same languages, across Web, Mobile App, and WhatsApp views.",
                "Get instant material estimates for tiling, painting, or wiring projects.",
                "Orders are confirmed with live pricing pulled from the real product catalog.",
                "Sessions automatically close after 5 minutes of inactivity to save resources."
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-homerun-green shrink-0 mt-0.5" />
                  <span className="text-[13px] sm:text-sm text-slate-700 leading-snug">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 py-2.5 rounded-xl bg-homerun-green hover:bg-emerald-800 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
            >
              Got it
            </button>

            <p className="text-[11px] text-slate-400 text-center mt-3 italic">
              Built solo under a tight timeline — a few edge cases may still be rough. Thanks for trying it out!
            </p>
          </div>
        </div>
      </>
    );
  }

  // Collapsed floating button state
  // Positioned bottom-24 on mobile to clear the bottom nav bar, and bottom-12 on desktop.
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed bottom-[4.5rem] sm:bottom-12 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200/80 flex items-center justify-center text-homerun-green hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all z-[90] cursor-pointer group"
      aria-label="Show features"
    >
      <Info className="w-5 h-5 group-hover:text-emerald-700" />
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
    </button>
  );
}
