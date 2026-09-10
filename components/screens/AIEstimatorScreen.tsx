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
    <div className="w-full h-full flex flex-col bg-slate-50 relative overflow-hidden">
      {/* Mobile Header Bar */}
      {!isWeb && (
        <div className="bg-homerun-green text-white px-3.5 pt-11 pb-2.5 flex items-center justify-between shrink-0 shadow-xs select-none">
          <div className="flex items-center gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-tight">HomeRun AI</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[10px] text-emerald-100 font-medium">
                Online • 60-Min Dispatch Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onResetChat && (
              <button
                type="button"
                onClick={onResetChat}
                className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-homerun-yellow text-slate-900 font-black text-[9.5px] flex items-center justify-center">
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
            <div className="w-12 h-12 rounded-2xl bg-homerun-yellow/20 flex items-center justify-center text-homerun-green mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-800">
              HomeRun AI Estimator
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1">
              Ask for single or multi-room project estimations, direct material orders, or contractor discounts.
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
              <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-homerun-green dot-3" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Pills */}
      <div className="shrink-0 bg-white/90 backdrop-blur-xs border-t border-slate-200/80 px-2 py-1.5">
        <QuickActions
          onSelectPrompt={(p) => onSendMessage(p)}
          disabled={isLoading}
        />
      </div>

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200/80 shrink-0">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type e.g. 'Tile my 2 bathrooms' or '10 bags UltraTech'..."
            disabled={isLoading}
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200/80 focus:bg-white focus:outline-hidden focus:border-homerun-green transition-all"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 sm:p-3 rounded-xl bg-homerun-green text-white hover:bg-emerald-800 disabled:opacity-40 active:scale-95 transition-all shadow-xs cursor-pointer disabled:cursor-default"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
