"use client";

import React from "react";
import { Sparkles, Package, Paintbrush, Zap, Layers } from "lucide-react";

export interface QuickPrompt {
  label: string;
  icon: React.ReactNode;
  category: string;
}

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    label: "Buy 10 bags UltraTech PPC cement",
    icon: <Package className="w-3.5 h-3.5 text-amber-600" />,
    category: "Cement",
  },
  {
    label: "Estimate tiling for 200 sqft bathroom",
    icon: <Layers className="w-3.5 h-3.5 text-blue-600" />,
    category: "Tiling",
  },
  {
    label: "Painting estimate for 3BHK",
    icon: <Paintbrush className="w-3.5 h-3.5 text-purple-600" />,
    category: "Paint",
  },
  {
    label: "Electrical wiring for 2BHK",
    icon: <Zap className="w-3.5 h-3.5 text-amber-500" />,
    category: "Electrical",
  },
  {
    label: "5 bags Roff tile adhesive",
    icon: <Package className="w-3.5 h-3.5 text-emerald-600" />,
    category: "Adhesive",
  },
  {
    label: "Estimate full renovation for 2BHK flat",
    icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />,
    category: "Renovation",
  },
  {
    label: "Tile my 2 bathrooms + paint all rooms",
    icon: <Layers className="w-3.5 h-3.5 text-teal-600" />,
    category: "Multi-Room",
  },
  {
    label: "Show me waterproofing products",
    icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" />,
    category: "Waterproofing",
  },
];

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  variant?: "in-app" | "whatsapp";
  disabled?: boolean;
}

export default function QuickActions({
  onSelectPrompt,
  variant = "in-app",
  disabled = false,
}: QuickActionsProps) {
  if (variant === "whatsapp") {
    return (
      <div className="w-full py-2 px-3 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white/70 backdrop-blur-sm border-t border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#25d366]" /> Suggested:
        </span>
        {QUICK_PROMPTS.map((item, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.label)}
            className="shrink-0 px-3 py-1 text-xs font-medium bg-white text-slate-700 rounded-full border border-slate-300 hover:border-[#128c7e] hover:bg-[#e8f5ec] transition-colors shadow-2xs active:scale-95 disabled:opacity-50"
          >
            {item.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap items-center gap-2 pt-1 pb-2">
      <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
        <Sparkles className="w-3.5 h-3.5 text-homerun-green" /> Try asking:
      </span>
      {QUICK_PROMPTS.map((item, idx) => (
        <button
          key={idx}
          type="button"
          disabled={disabled}
          onClick={() => onSelectPrompt(item.label)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white text-slate-700 rounded-lg border border-slate-200 hover:border-homerun-green hover:bg-homerun-green-light/40 hover:text-homerun-green-dark transition-all duration-150 shadow-xs active:scale-95 disabled:opacity-50"
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}
