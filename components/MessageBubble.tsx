"use client";

import React from "react";
import { Message, CartItem, Suggestion } from "@/lib/types";
import { CheckCheck, ShoppingBag, CreditCard, PlusCircle, Calculator } from "lucide-react";
import ProjectEstimateCard from "./ProjectEstimateCard";
import SuggestionChips from "./SuggestionChips";
import DownloadEstimateButton from "./DownloadEstimateButton";

interface MessageBubbleProps {
  message: Message;
  variant: "in-app" | "whatsapp";
  allCartItems?: CartItem[];
  onActionClick?: (action: "view-cart" | "checkout" | "add-more") => void;
  onAddSuggestion?: (suggestion: Suggestion) => void;
}

// Simple markdown formatter helper for bold, bullets, and line breaks
function renderFormattedText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Process markdown bold **text**
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedParts = parts.map((part, pIdx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={pIdx} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
        return (
          <em key={pIdx} className="italic text-slate-800">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });

    // Handle bullet items
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <div key={i} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="text-slate-400 select-none">•</span>
          <span className="flex-1">{formattedParts}</span>
        </div>
      );
    }

    // Numbered lists e.g. "1. "
    const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      return (
        <div key={i} className="flex items-start gap-1.5 ml-1 my-0.5">
          <span className="font-semibold text-slate-500 text-xs min-w-[14px]">
            {numMatch[1]}.
          </span>
          <span className="flex-1">{formattedParts}</span>
        </div>
      );
    }

    // Empty lines
    if (line.trim() === "") {
      return <div key={i} className="h-2" />;
    }

    return (
      <div key={i} className="leading-relaxed">
        {formattedParts}
      </div>
    );
  });
}

export default function MessageBubble({
  message,
  variant,
  allCartItems = [],
  onActionClick,
  onAddSuggestion,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const hasCartItems = message.cart_items && message.cart_items.length > 0;
  const time = message.timestamp || "Just now";

  // Calculate cart total for WhatsApp in-bubble cart card
  const itemsToDisplay = message.cart_items || [];
  const cartTotal = itemsToDisplay.reduce((sum, item) => sum + item.total, 0);

  // ================= WHATSAPP VARIANT =================
  if (variant === "whatsapp") {
    return (
      <div
        className={`flex flex-col w-full my-1.5 ${
          isUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`max-w-[88%] sm:max-w-[80%] px-3.5 py-2.5 rounded-lg text-[13.5px] shadow-xs relative transition-all ${
            isUser
              ? "bg-[#dcf8c6] text-slate-900 rounded-tr-none wa-bubble-right"
              : "bg-white text-slate-800 rounded-tl-none wa-bubble-left border border-slate-100/50"
          }`}
        >
          {/* Main Message Content */}
          <div className="text-[13.5px] leading-relaxed break-words">
            {renderFormattedText(message.content)}
          </div>

          {/* 1. Multi-Room Project Estimate (WhatsApp) */}
          {!isUser && message.project_estimate && (
            <ProjectEstimateCard
              projectEstimate={message.project_estimate}
              variant="whatsapp"
            />
          )}

          {/* 2. Smart Suggestions (WhatsApp) */}
          {!isUser && message.suggestions && message.suggestions.length > 0 && (
            <SuggestionChips
              suggestions={message.suggestions}
              onAddSuggestion={onAddSuggestion}
              variant="whatsapp"
            />
          )}

          {/* In-Bubble WhatsApp Cart Card (When Cart Items are Present) */}
          {!isUser && hasCartItems && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 bg-emerald-50/50 -mx-1.5 px-2 py-2 rounded-md">
              <div className="font-bold text-emerald-900 flex items-center gap-1 text-[13px]">
                <span>🛒</span>
                <span>Your Cart</span>
              </div>
              <div className="mt-1 space-y-1 text-xs text-slate-700 font-mono">
                {itemsToDisplay.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="truncate max-w-[200px]">
                      {idx + 1}. {item.name} × {item.quantity} {item.unit}
                    </span>
                    <span className="font-semibold text-slate-900 ml-2">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-emerald-300 flex justify-between items-center text-xs font-bold text-slate-900">
                <span>💰 Total</span>
                <span className="text-emerald-800">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-700 flex items-center justify-between">
                <span>🚚 Free delivery</span>
                <span>⚡ 60 min Bangalore dispatch</span>
              </div>

              {/* 3. Download Estimate Button (WhatsApp) */}
              <DownloadEstimateButton
                items={itemsToDisplay}
                projectEstimate={message.project_estimate}
                estimationSummary={message.estimation_summary}
                variant="whatsapp"
              />

              {/* WhatsApp Interactive Action Buttons */}
              {onActionClick && (
                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => onActionClick("view-cart")}
                    className="flex-1 min-w-[90px] py-1 px-2 text-[12px] font-medium text-emerald-800 bg-white border border-emerald-300 rounded shadow-2xs hover:bg-emerald-50 active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    View Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => onActionClick("checkout")}
                    className="flex-1 min-w-[90px] py-1 px-2 text-[12px] font-semibold text-white bg-[#075e54] rounded shadow-2xs hover:bg-[#0c6c61] active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CreditCard className="w-3 h-3" />
                    Checkout
                  </button>
                  <button
                    type="button"
                    onClick={() => onActionClick("add-more")}
                    className="flex-1 min-w-[90px] py-1 px-2 text-[12px] font-medium text-slate-700 bg-white border border-slate-300 rounded shadow-2xs hover:bg-slate-50 active:scale-95 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Add More
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Timestamp and Delivery checkmarks */}
          <div className="flex items-center justify-end gap-1 mt-1 text-[10.5px] text-slate-400 select-none">
            <span>{time}</span>
            {isUser && (
              <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb] ml-0.5 inline-block" />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ================= IN-APP / WEB / MOBILE APP VARIANT =================
  return (
    <div
      className={`flex flex-col w-full my-2 ${
        isUser ? "items-end" : "items-start"
      }`}
    >
      <div
        className={`max-w-[88%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-xs transition-all ${
          isUser
            ? "bg-[#d4edbc] text-slate-900 rounded-br-xs font-normal"
            : "bg-white text-slate-800 rounded-bl-xs border border-slate-200/80"
        }`}
      >
        {/* Main Content */}
        <div className="text-[13.5px] leading-relaxed break-words">
          {renderFormattedText(message.content)}
        </div>

        {/* Single Estimation Summary Badge if available & not a multi-room project */}
        {!isUser && message.estimation_summary && !message.project_estimate && (
          <div className="mt-3 p-2.5 bg-homerun-green-light/60 border border-homerun-green/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-homerun-green/10 flex items-center justify-center text-homerun-green">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider font-bold text-homerun-green-dark">
                  {message.estimation_summary.project_type.replace(/_/g, " ")}
                </p>
                {message.estimation_summary.area_sqft && (
                  <p className="text-xs text-slate-600">
                    Area: {message.estimation_summary.area_sqft} sq.ft
                  </p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase">Estimated Total</p>
              <p className="text-sm font-black text-homerun-green-dark">
                ₹{message.estimation_summary.total_cost.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        )}

        {/* 1. Multi-Room Project Estimate Card */}
        {!isUser && message.project_estimate && (
          <ProjectEstimateCard
            projectEstimate={message.project_estimate}
            variant="in-app"
          />
        )}

        {/* 2. Smart Cross-Sell Suggestions */}
        {!isUser && message.suggestions && message.suggestions.length > 0 && (
          <SuggestionChips
            suggestions={message.suggestions}
            onAddSuggestion={onAddSuggestion}
            variant="in-app"
          />
        )}

        {/* 3. Download Estimate Button */}
        {!isUser && (
          <DownloadEstimateButton
            items={itemsToDisplay}
            projectEstimate={message.project_estimate}
            estimationSummary={message.estimation_summary}
            variant="in-app"
          />
        )}

        {/* Timestamp */}
        <div className="flex items-center justify-end mt-1.5 text-[10.5px] text-slate-400">
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
