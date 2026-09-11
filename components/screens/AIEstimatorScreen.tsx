"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message, CartItem, Suggestion } from "@/lib/types";
import MessageBubble from "../MessageBubble";
import QuickActions from "../QuickActions";
import { ArrowLeft, ShoppingCart, Send, Sparkles, RefreshCw } from "lucide-react";

interface AIEstimatorScreenProps {
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onAddSuggestion: (suggestion: Suggestion) => void;
  onBack?: () => void;
  onOpenCart?: () => void;
  onResetChat?: () => void;
  variant?: "mobile" | "web";
  initialInput?: string;
}

export default function AIEstimatorScreen({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onAddSuggestion,
  onBack,
  onOpenCart,
  onResetChat,
  variant = "mobile",
  initialInput = "",
}: AIEstimatorScreenProps) {
  const [inputText, setInputText] = useState(initialInput);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isWeb = variant === "web";

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (initialInput) {
      setInputText(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#fbfbfb] relative overflow-hidden select-none">
      {/* Real HomeRun Clean White Header on Mobile */}
      {!isWeb && (
        <div className="bg-white px-3.5 pt-9 pb-2.5 border-b border-[#eeeeee] flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-[#1a1a1a] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1a7a3a] animate-pulse" />
                <h3 className="font-extrabold text-sm text-[#1a1a1a] leading-tight font-display">
                  HomeRun AI
                </h3>
              </div>
              <span className="text-[10px] text-[#1a7a3a] font-bold">
                Online • 60-Min Dispatch Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onResetChat && (
              <button
                type="button"
                onClick={onResetChat}
                className="p-1.5 text-[#777777] hover:text-[#1a1a1a] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative w-9 h-9 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-[#111111] transition-colors cursor-pointer"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#4d7c0f] text-white font-black text-[9px] flex items-center justify-center border-2 border-white shadow-2xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f3] flex items-center justify-center text-[#1a7a3a] mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-[#1a1a1a]">
              HomeRun AI Estimator
            </h4>
            <p className="text-xs text-[#777777] max-w-xs mt-1">
              Ask for single or multi-room project estimations, direct material orders, or wholesale contractor discounts.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              variant="in-app"
              allCartItems={cart}
              onAddSuggestion={onAddSuggestion}
            />
          ))
        )}

        {/* AI Typing Indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 my-2 ml-1">
            <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium mr-1">
                Estimating materials
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-3" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <div className="shrink-0 bg-white/95 backdrop-blur-xs border-t border-[#eeeeee] px-2 py-1.5">
        <QuickActions
          onSelectPrompt={(p) => onSendMessage(p)}
          disabled={isLoading}
        />
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-[#eeeeee] shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type e.g. 'Tile my 2 bathrooms' or '10 bags UltraTech'..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[#f5f5f5] border border-[#e5e5e5] focus:bg-white focus:outline-hidden focus:border-[#1a7a3a] transition-all font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 sm:p-3 rounded-xl bg-[#1a7a3a] text-white hover:bg-[#145f2d] disabled:opacity-40 active:scale-95 transition-all shadow-xs cursor-pointer disabled:cursor-default"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
