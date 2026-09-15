"use client";

import React from "react";
import { Sparkles, Package, Paintbrush, Zap, Layers } from "lucide-react";

export interface QuickPrompt {
  label: string;
  icon: React.ReactNode;
  category: string;
}

// Icons/categories are language-independent; only the label (the actual
// text sent as the chat message) changes per language. Translations are
// Romanized (Latin script), matching the system prompt's rule that Indian
// languages are always replied to in Romanized form, never native script —
// and matching the label to the user's selected language matters beyond
// display, since it's this exact text that gets sent as the chat message
// and the backend detects reply language from that message.
const PROMPT_META = [
  { icon: <Package className="w-3.5 h-3.5 text-amber-600" />, category: "Cement" },
  { icon: <Layers className="w-3.5 h-3.5 text-blue-600" />, category: "Tiling" },
  { icon: <Paintbrush className="w-3.5 h-3.5 text-purple-600" />, category: "Paint" },
  { icon: <Zap className="w-3.5 h-3.5 text-amber-500" />, category: "Electrical" },
  { icon: <Package className="w-3.5 h-3.5 text-emerald-600" />, category: "Adhesive" },
  { icon: <Sparkles className="w-3.5 h-3.5 text-emerald-600" />, category: "Renovation" },
  { icon: <Layers className="w-3.5 h-3.5 text-teal-600" />, category: "Multi-Room" },
  { icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" />, category: "Waterproofing" },
];

const PROMPT_LABELS: Record<string, string[]> = {
  English: [
    "Buy 10 bags UltraTech PPC cement",
    "Estimate tiling for 200 sqft bathroom",
    "Painting estimate for 3BHK",
    "Electrical wiring for 2BHK",
    "5 bags Roff tile adhesive",
    "Estimate full renovation for 2BHK flat",
    "Tile my 2 bathrooms + paint all rooms",
    "Show me waterproofing products",
  ],
  Hindi: [
    "10 bags UltraTech PPC cement chahiye",
    "200 sqft bathroom ke liye tiling ka estimate do",
    "3BHK ke liye painting ka estimate do",
    "2BHK ke liye electrical wiring chahiye",
    "5 bags Roff tile adhesive chahiye",
    "2BHK flat ke liye poora renovation estimate do",
    "Mere 2 bathroom tile karo aur saare rooms paint karo",
    "Mujhe waterproofing products dikhao",
  ],
  Telugu: [
    "10 bags UltraTech PPC cement kavali",
    "200 sqft bathroom ki tiling estimate ivvu",
    "3BHK ki painting estimate ivvu",
    "2BHK ki electrical wiring kavali",
    "5 bags Roff tile adhesive kavali",
    "2BHK flat ki poorthi renovation estimate ivvu",
    "Naa 2 bathrooms tile chesi anni rooms paint cheyandi",
    "Naaku waterproofing products chupinchu",
  ],
  Kannada: [
    "10 bags UltraTech PPC cement beku",
    "200 sqft bathroom ge tiling estimate kodi",
    "3BHK ge painting estimate kodi",
    "2BHK ge electrical wiring beku",
    "5 bags Roff tile adhesive beku",
    "2BHK flat ge purna renovation estimate kodi",
    "Nanna 2 bathrooms tile madi mattu ella rooms paint madi",
    "Nanage waterproofing products torisi",
  ],
  Tamil: [
    "10 bags UltraTech PPC cement venum",
    "200 sqft bathroom-kaana tiling estimate kudunga",
    "3BHK-kaana painting estimate kudunga",
    "2BHK-kaana electrical wiring venum",
    "5 bags Roff tile adhesive venum",
    "2BHK flat-kaana full renovation estimate kudunga",
    "En 2 bathroom tile pannunga, romba rooms paint pannunga",
    "Enakku waterproofing products kaatunga",
  ],
};

// Builds the quick-prompt list in the given language, falling back to
// English for an unselected/unrecognized language.
export function getQuickPrompts(language?: string | null): QuickPrompt[] {
  const labels = (language && PROMPT_LABELS[language]) || PROMPT_LABELS.English;
  return PROMPT_META.map((meta, idx) => ({
    ...meta,
    label: labels[idx] ?? PROMPT_LABELS.English[idx],
  }));
}

// English default, kept for any call site that doesn't need language awareness.
export const QUICK_PROMPTS: QuickPrompt[] = getQuickPrompts("English");

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  variant?: "in-app" | "whatsapp";
  disabled?: boolean;
  language?: string | null;
}

export default function QuickActions({
  onSelectPrompt,
  variant = "in-app",
  disabled = false,
  language = null,
}: QuickActionsProps) {
  const prompts = getQuickPrompts(language);

  if (variant === "whatsapp") {
    return (
      <div className="w-full py-2 px-3 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white/70 backdrop-blur-sm border-t border-slate-200">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#25d366]" /> Suggested:
        </span>
        {prompts.map((item, idx) => (
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
      {prompts.map((item, idx) => (
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
