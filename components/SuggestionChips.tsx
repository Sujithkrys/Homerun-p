"use client";

import React, { useState } from "react";
import { Suggestion } from "@/lib/types";
import { Plus, Check, Lightbulb } from "lucide-react";

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onAddSuggestion?: (suggestion: Suggestion) => void;
  variant?: "in-app" | "whatsapp";
}

export default function SuggestionChips({
  suggestions,
  onAddSuggestion,
  variant = "in-app",
}: SuggestionChipsProps) {
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  const handleAdd = (suggestion: Suggestion) => {
    if (addedIds[suggestion.product_id]) return;
    setAddedIds((prev) => ({ ...prev, [suggestion.product_id]: true }));
    if (onAddSuggestion) {
      onAddSuggestion(suggestion);
    }
  };

  // WhatsApp Variant
  if (variant === "whatsapp") {
    return (
      <div className="mt-2.5 pt-2 border-t border-slate-200/80 bg-amber-50/50 -mx-1.5 px-2.5 py-2.5 rounded-md font-sans">
        <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-1.5">
          <span>💡</span>
          <span>You might also need:</span>
        </div>

        <div className="space-y-1.5">
          {suggestions.map((item) => {
            const isAdded = !!addedIds[item.product_id];
            const lineTotal = item.estimated_qty * item.unit_price;
            return (
              <div
                key={item.product_id}
                className="bg-white p-2 rounded border border-amber-200/80 flex flex-col gap-1 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-slate-800 text-[11.5px] leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.reason}</p>
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 ml-2">
                    ₹{lineTotal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-500">
                    {item.estimated_qty} {item.unit} × ₹{item.unit_price}
                  </span>
                  <button
                    type="button"
                    disabled={isAdded}
                    onClick={() => handleAdd(item)}
                    className={`py-0.5 px-2 text-[11px] font-semibold rounded transition-all flex items-center gap-1 ${
                      isAdded
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-default"
                        : "bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 active:scale-95 cursor-pointer"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // In-App / Web Platform / Mobile App Variant
  return (
    <div className="mt-3 rounded-xl border border-amber-200/80 bg-linear-to-b from-amber-50/60 to-orange-50/30 p-3 shadow-2xs">
      <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs mb-2">
        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
        <span>You might also need:</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {suggestions.map((item) => {
          const isAdded = !!addedIds[item.product_id];
          const lineTotal = item.estimated_qty * item.unit_price;

          return (
            <div
              key={item.product_id}
              className="bg-white rounded-lg p-2.5 border border-amber-100/90 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <h5 className="font-semibold text-xs text-slate-900 truncate">
                  {item.name}
                </h5>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {item.reason}
                </p>
                <p className="text-[11px] font-medium text-slate-700 mt-1">
                  {item.estimated_qty} {item.unit} × ₹{item.unit_price} ={" "}
                  <strong className="font-bold text-slate-900">
                    ₹{lineTotal.toLocaleString("en-IN")}
                  </strong>
                </p>
              </div>

              <div className="shrink-0">
                <button
                  type="button"
                  disabled={isAdded}
                  onClick={() => handleAdd(item)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 shadow-2xs ${
                    isAdded
                      ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-default"
                      : "bg-white text-emerald-700 border border-emerald-600/70 hover:bg-emerald-50 active:scale-95 cursor-pointer"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
