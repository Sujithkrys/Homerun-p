"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message, CartItem, Suggestion } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import {
  Send,
  ShoppingCart,
  Sparkles,
  Trash2,
  Plus,
  Minus,
  Zap,
  CheckCircle2,
  X,
  RefreshCw,
  Gift,
  ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { HomeRunLogo, HomeRunThunder } from "./HomeRunLogo";

interface MobileAppChatProps {
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onResetChat?: () => void;
  onAddSuggestion?: (suggestion: Suggestion) => void;
}

export default function MobileAppChat({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onResetChat,
  onAddSuggestion,
}: MobileAppChatProps) {
  const [inputText, setInputText] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;
  const qualifiesForCashback = subtotal >= 50000;
  const cashbackAmount = qualifiesForCashback ? Math.round(subtotal * 0.05) : 0;

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsOrderPlaced(true);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#1a7a3a", "#f5c518", "#0d4a22"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsOrderPlaced(false);
      setIsBottomSheetOpen(false);
    }, 3500);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* App Header (padded top for status bar) */}
      <div className="bg-homerun-green text-white pt-11 pb-3 px-4 flex items-center justify-between shadow-xs shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          {/* Official HomeRun Logo */}
          <HomeRunLogo size={32} className="w-8 h-8 rounded-lg shadow-xs" />
          <div className="leading-tight">
            <h2 className="text-sm font-bold tracking-tight text-white font-display flex items-center gap-1.5">
              <span>HomeRun Assistant</span>
            </h2>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 online-pulse"></span>
              <span className="text-[10.5px] text-emerald-100 font-medium">
                Online • 60m Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Right Header: Reset & Cart Button */}
        <div className="flex items-center gap-1.5">
          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              className="p-1.5 text-emerald-100 hover:text-white rounded-lg transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Cart Icon Toggle */}
          <button
            type="button"
            onClick={() => setIsBottomSheetOpen(true)}
            className="relative p-2 text-white bg-homerun-green-dark hover:bg-homerun-green-dark/80 rounded-xl transition-all shadow-xs flex items-center"
            aria-label="Open Cart Bottom Sheet"
          >
            <ShoppingCart className="w-4 h-4" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-homerun-yellow text-slate-900 font-black text-[10px] flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-3 py-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
              <HomeRunThunder className="w-6 h-6 text-homerun-green" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              HomeRun Mobile Assistant
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[240px]">
              Order materials or ask for estimates with guaranteed 60-minute site delivery in Bangalore.
            </p>
            <div className="mt-4 w-full">
              <QuickActions
                onSelectPrompt={(p) => onSendMessage(p)}
                disabled={isLoading}
              />
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                variant="in-app"
                allCartItems={cart}
                onAddSuggestion={onAddSuggestion}
              />
            ))}

            {/* AI Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 my-1.5 ml-1">
                <div className="bg-white border border-slate-200 rounded-2xl px-3 py-2 flex items-center gap-1 shadow-2xs">
                  <span className="text-[11px] text-slate-400 font-medium mr-1">
                    Typing...
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-1"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-2"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-3"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Suggested Quick Prompts Bar */}
      {messages.length > 0 && (
        <div className="px-3 py-1 bg-white/70 border-t border-slate-200/60 overflow-x-auto no-scrollbar">
          <QuickActions
            onSelectPrompt={(p) => onSendMessage(p)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Bottom Message Input Bar */}
      <div className="p-2.5 pb-6 bg-white shrink-0">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 p-[6px] rounded-[24px] border border-slate-200 bg-white shadow-none"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type material or project estimate..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-2 py-2 bg-transparent focus:outline-none border-none focus:ring-0 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`flex items-center justify-center shrink-0 h-10 w-10 rounded-full transition-all duration-200 ${
              !inputText.trim() || isLoading
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-homerun-green text-white shadow-sm hover:bg-homerun-green-hover active:scale-95 cursor-pointer"
            }`}
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* ================= BOTTOM SHEET CART OVERLAY (~70% HEIGHT) ================= */}
      {isBottomSheetOpen && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Semi-transparent dark backdrop */}
          <div
            onClick={() => setIsBottomSheetOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Bottom Sheet Modal (70% Height) */}
          <div className="relative w-full h-[72%] bg-white rounded-t-[32px] shadow-2xl flex flex-col z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden border-t border-slate-200">
            {/* Drag Handle Bar */}
            <div
              onClick={() => setIsBottomSheetOpen(false)}
              className="w-full pt-2.5 pb-1 flex justify-center cursor-pointer hover:opacity-75 select-none"
            >
              <div className="w-12 h-1.5 bg-slate-300 rounded-full"></div>
            </div>

            {/* Bottom Sheet Header */}
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-homerun-green/10 flex items-center justify-center text-homerun-green">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    Your Cart
                    {totalCartCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-homerun-yellow text-slate-900 rounded-full">
                        {totalCartCount}
                      </span>
                    )}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-slate-400 hover:text-red-500 font-medium"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsBottomSheetOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close cart sheet"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cart Items Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
                  <ShoppingCart className="w-10 h-10 text-slate-300 stroke-1 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Your cart is empty</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ask for cement, tile adhesives, or paints to add items.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col gap-1.5"
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 leading-tight truncate">
                          {item.name}
                        </h4>
                        <p className="text-[10.5px] text-slate-500">
                          ₹{item.unit_price} / {item.unit}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product_id)}
                        className="text-slate-300 hover:text-red-500 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-md p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product_id, item.quantity - 1)
                          }
                          className="w-4 h-4 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[11px] font-bold text-slate-800 min-w-[16px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(item.product_id, item.quantity + 1)
                          }
                          className="w-4 h-4 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        ₹{item.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary & Order Button */}
            {cart.length > 0 && (
              <div className="p-3 bg-white border-t border-slate-200 space-y-2 pb-6">
                {qualifiesForCashback && (
                  <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10.5px] text-amber-900 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>5% Cashback (₹{cashbackAmount.toLocaleString("en-IN")}) applied!</span>
                  </div>
                )}

                <div className="space-y-1 text-[11.5px] text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery (60-min express)</span>
                    <span className="font-semibold text-emerald-700">
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="pt-1 border-t border-slate-200 flex justify-between text-xs font-bold text-slate-900">
                    <span>Grand Total</span>
                    <span className="text-sm font-black text-homerun-green-dark">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 py-1 text-[10.5px] text-emerald-800 font-medium">
                  <Zap className="w-3.5 h-3.5 text-homerun-yellow fill-homerun-yellow shrink-0" />
                  <span>⚡ 60-Minute Site Delivery in Bangalore</span>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="w-full py-2.5 rounded-xl bg-homerun-green hover:bg-homerun-green-hover text-white font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                >
                  <span>Place Order</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {isOrderPlaced && (
                  <div className="p-2 bg-emerald-900 text-white rounded-lg text-[11px] flex items-center gap-1.5 animate-in fade-in duration-200">
                    <CheckCircle2 className="w-4 h-4 text-homerun-yellow shrink-0" />
                    <span>Order received! HomeRun fleet dispatched (Mock).</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
