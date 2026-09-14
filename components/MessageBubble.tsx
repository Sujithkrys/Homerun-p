"use client";

import React, { useState, useEffect, useRef } from "react";
import { Message, CartItem, Suggestion } from "@/lib/types";
import { CheckCheck, ShoppingBag, CreditCard, PlusCircle, Calculator, Minus, Plus } from "lucide-react";
import ProjectEstimateCard from "./ProjectEstimateCard";
import SuggestionChips from "./SuggestionChips";
import DownloadEstimateButton from "./DownloadEstimateButton";
import WhatsAppText from "@/lib/formatWhatsApp";
import ProductRecommendation from "./ProductRecommendation";

function EditableCartItem({
  item,
  onUpdateQuantity
}: {
  item: CartItem;
  onUpdateQuantity?: (productId: string, qty: number) => Promise<boolean> | void;
}) {
  const [localQty, setLocalQty] = useState(item.quantity);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);
  const originalQtyRef = useRef(item.quantity);

  // Update local if parent changes
  useEffect(() => {
    if (!isUpdatingRef.current) {
      setLocalQty(item.quantity);
      originalQtyRef.current = item.quantity;
    }
  }, [item.quantity]);

  const handleChange = (newQty: number) => {
    setLocalQty(newQty);
    setErrorText(null);
    isUpdatingRef.current = true;
    
    if (newQty === 0) {
      setShowUndo(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        setShowUndo(false);
        try {
          if (onUpdateQuantity) {
             await onUpdateQuantity(item.product_id, 0);
          }
        } catch {
          setLocalQty(originalQtyRef.current);
          setErrorText("Couldn't update — try again");
          isUpdatingRef.current = false;
        }
      }, 3000);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      try {
        if (onUpdateQuantity) {
          const success = await onUpdateQuantity(item.product_id, newQty);
          if (success === false) throw new Error("Sync failed");
        }
        originalQtyRef.current = newQty;
      } catch (err) {
        setLocalQty(originalQtyRef.current);
        setErrorText("Couldn't update — try again");
      } finally {
        isUpdatingRef.current = false;
      }
    }, 500);
  };

  const handleUndo = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setShowUndo(false);
    setLocalQty(originalQtyRef.current);
    isUpdatingRef.current = false;
  };

  if (localQty === 0 && !showUndo) {
    return null;
  }

  if (showUndo) {
    return (
      <div className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs mt-1">
        <span className="text-slate-500 italic">Removed {item.name}</span>
        <button type="button" onClick={handleUndo} className="font-bold text-[#1a7a3a] hover:text-[#155d2c] active:scale-95 transition-all">
          Undo
        </button>
      </div>
    );
  }

  const localTotal = localQty * item.unit_price;

  return (
    <div className="flex flex-col gap-1 text-xs bg-white px-2.5 py-2 rounded-lg border border-emerald-100 shadow-2xs">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-1.5 min-w-0 mr-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] shrink-0 mt-1" />
          <div className="flex flex-col">
            <span className="font-semibold leading-tight text-slate-800">{item.name}</span>
            <span className="text-[10px] text-slate-500">₹{item.unit_price} / {item.unit}</span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="font-bold text-[#1a1a1a]">₹{localTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-1">
        {errorText ? (
          <span className="text-[10px] text-red-500 font-medium">{errorText}</span>
        ) : (
          <span className="text-[10px] text-emerald-700/0 select-none">Editable</span> // invisible spacer
        )}
        
        <div
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0"
        >
          <button
            type="button"
            onClick={() => handleChange(localQty - 1)}
            className="p-1 px-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="px-2 font-bold text-xs font-mono min-w-[24px] text-center">
            {localQty}
          </span>
          <button
            type="button"
            onClick={() => handleChange(localQty + 1)}
            className="p-1 px-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  variant: "in-app" | "whatsapp";
  allCartItems?: CartItem[];
  onActionClick?: (action: "view-cart" | "checkout" | "add-more") => void;
  onAddSuggestion?: (suggestion: Suggestion) => void;
  onAddToCart?: (product: CartItem) => void;
  onAddAllToCart?: (products: CartItem[]) => void;
  source?: "voice" | "text";
  onUpdateQuantity?: (productId: string, qty: number) => void;
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
          <span className="font-semibold text-slate-500 min-w-[14px]">
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
  onAddToCart,
  onAddAllToCart,
  source = "text",
  onUpdateQuantity,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const hasCartItems = message.cart_items && message.cart_items.length > 0;
  const time = message.timestamp || "Just now";

  // Calculate cart total for WhatsApp in-bubble cart card
  const itemsToDisplay = (message.cart_items && message.cart_items.length > 0)
    ? message.cart_items
    : (message.recommended_products || []);
  const cartTotal = itemsToDisplay.reduce((sum, item) => sum + item.total, 0);

  // A product can show up in BOTH recommended_products and cart_items on the
  // same reply — e.g. "buy 10 bags cement" gets added directly (cart_items,
  // real quantity 10) while the model also lists it under recommended_products
  // (which defaults new suggestions to quantity 1). Rendering both left a
  // "Suggested option" card showing qty 1 for something already added as 10.
  // Since it's already in the cart, it isn't actually still "recommended" —
  // drop it from the recommendation list and let the real cart-items card
  // (with the correct quantity) be the only thing shown for it.
  const addedProductIds = new Set((message.cart_items || []).map((i) => i.product_id));
  const pendingRecommended = (message.recommended_products || []).filter(
    (p) => !addedProductIds.has(p.product_id)
  );

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
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <WhatsAppText text={message.content} />
            )}
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

          {/* WhatsApp Formatted Recommended Products List */}
          {!isUser && pendingRecommended.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 font-sans text-xs space-y-2">
              <div className="font-bold text-slate-900 text-[13px] flex items-center gap-1.5">
                <span>📋</span>
                <strong>Recommended Materials</strong>
              </div>
              <div className="space-y-1.5">
                {pendingRecommended.map((item, idx) => {
                  const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
                  return (
                    <div key={idx} className="bg-slate-50/90 p-2 rounded-md border border-slate-200/60">
                      <div className="font-bold text-slate-900 flex items-start justify-between gap-1">
                        <span>
                          {numberEmojis[idx] || `${idx + 1}.`} <strong>{item.name}</strong> × {item.quantity} {item.unit}
                        </span>
                        <span className="shrink-0 font-bold text-slate-900">
                          — ₹{item.total.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {item.reason && (
                        <p className="text-[11px] text-slate-500 mt-0.5 ml-5 italic">
                          {item.reason}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-1.5 border-t border-dashed border-slate-300 flex justify-between items-center text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1">
                  <span>💰</span>
                  <strong>Estimated Total:</strong>
                </span>
                <strong className="text-[#075e54] font-extrabold text-[13px]">
                  ₹{pendingRecommended.reduce((s, i) => s + i.total, 0).toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="text-[11px] text-slate-600 flex items-center justify-between font-medium">
                <span>🚚 Free delivery</span>
                <span>|</span>
                <span>⚡ 60 min</span>
              </div>
            </div>
          )}

          {/* In-Bubble WhatsApp Cart Card (When Cart Items are Present) */}
          {!isUser && hasCartItems && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 bg-emerald-50/60 -mx-1.5 px-2.5 py-2 rounded-md font-sans text-xs space-y-1.5">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5 text-[13px]">
                <span>🛒</span>
                <strong>Your Cart</strong>
              </div>
              <div className="mt-1 space-y-1 text-xs text-slate-800">
                {itemsToDisplay.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-1">
                    <span className="flex-1">
                      {idx + 1}. {item.name} × {item.quantity} {item.unit}
                    </span>
                    <span className="font-semibold text-slate-900 shrink-0">
                      — ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-1.5 border-t border-dashed border-emerald-300/80 flex justify-between items-center text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1">
                  <span>💰</span>
                  <strong>Total:</strong>
                </span>
                <strong className="text-emerald-800 text-[13px]">
                  ₹{cartTotal.toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="mt-1 text-[11px] text-emerald-700 flex items-center justify-between font-medium">
                <span>🚚 Free delivery</span>
                <span>|</span>
                <span>⚡ 60 min</span>
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

        {/* Recommended Products with Selectable Checkboxes (Web & Mobile) */}
        {!isUser && pendingRecommended.length > 0 && (
          <ProductRecommendation
            products={pendingRecommended}
            onAddAllToCart={onAddAllToCart || ((items) => items.forEach(p => (onAddToCart ? onAddToCart(p) : onAddSuggestion?.({
              product_id: p.product_id,
              name: p.name,
              reason: p.reason || "",
              estimated_qty: p.quantity,
              unit: p.unit,
              unit_price: p.unit_price,
            }))))}
          />
        )}

        {/* Added to Cart Items List (Web & Mobile) */}
        {!isUser && message.cart_items && message.cart_items.length > 0 && (
          <div className="mt-2.5 p-2.5 sm:p-3 bg-emerald-50/90 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between border-b border-emerald-200/60 pb-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <span>🛒</span>
                <span>Items Added to Order</span>
              </div>
              <span className="text-[11px] font-extrabold text-[#1a7a3a]">
                ₹{message.cart_items.reduce((sum, it) => sum + it.total, 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="space-y-1.5">
              {message.cart_items.map((item, idx) => {
                if (source === "voice") {
                  return (
                    <EditableCartItem
                      key={item.product_id || idx}
                      item={item}
                      onUpdateQuantity={onUpdateQuantity}
                    />
                  );
                }
                
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs text-slate-800 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5 truncate mr-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] shrink-0" />
                      <span className="font-semibold truncate">{item.name}</span>
                      <span className="text-[11px] text-slate-500 shrink-0">
                        × {item.quantity} {item.unit}
                      </span>
                    </div>
                    <span className="font-bold text-[#1a1a1a] shrink-0">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
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
      </div>

      {/* Timestamp */}
      <div className={`mt-1 text-[10px] text-slate-400 font-medium tracking-wide px-1 ${isUser ? "text-right" : "text-left"}`}>
        {time}
      </div>
    </div>
  );
}
