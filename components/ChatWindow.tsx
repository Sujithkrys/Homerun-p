"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Message, CartItem, Suggestion } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import CartSidebar from "./CartSidebar";
import QuickActions from "./QuickActions";
import { Send, ShoppingCart, RefreshCw } from "lucide-react";
import { HomeRunLogo, HomeRunThunder } from "./HomeRunLogo";

interface ChatWindowProps {
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

export default function ChatWindow({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onResetChat,
  onAddSuggestion,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState("");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Auto-scroll to bottom of messages
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
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col h-[760px] max-h-[88vh] relative">
      {/* App Header */}
      <div className="bg-homerun-green text-white px-5 py-3.5 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          {/* Official HomeRun Logo Square */}
          <HomeRunLogo className="w-10 h-10 rounded-xl shadow-xs shrink-0 select-none" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base tracking-tight leading-none">HomeRun</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-800/80 text-homerun-yellow px-1.5 py-0.5 rounded">
                AI Assistant
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              Bangalore site delivery in 60 minutes
            </p>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2">
          {/* Reset Chat Button */}
          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              className="px-2.5 py-1.5 text-xs text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1.5"
              title="Reset conversation"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          {/* Cart Counter Button (Mobile Drawer Trigger) */}
          <button
            type="button"
            onClick={() => setIsMobileCartOpen(!isMobileCartOpen)}
            className="md:hidden relative p-2 text-white bg-homerun-green-dark hover:bg-homerun-green-dark/80 rounded-xl transition-all shadow-xs"
            aria-label="Toggle cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-homerun-yellow text-slate-900 font-black text-xs flex items-center justify-center shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Body: 2-Panel Split (~60% Chat, ~40% Cart) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Chat Container */}
        <div className="flex-1 flex flex-col h-full bg-slate-50/70 overflow-hidden">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3">
                  <HomeRunThunder className="w-7 h-7 text-homerun-green" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  Welcome to HomeRun Material Assistant
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md">
                  Order construction materials, ask for project estimates (tiling, painting, electricals), or inquire about bulk contractor rates for delivery in 60 minutes.
                </p>
                <div className="mt-6 w-full max-w-lg">
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
                  <div className="flex items-center gap-2 my-2 ml-1">
                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-1.5 shadow-2xs">
                      <span className="text-xs text-slate-400 font-medium mr-1">
                        HomeRun AI is estimating
                      </span>
                      <span className="w-2 h-2 rounded-full bg-homerun-green dot-1"></span>
                      <span className="w-2 h-2 rounded-full bg-homerun-green dot-2"></span>
                      <span className="w-2 h-2 rounded-full bg-homerun-green dot-3"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Quick Prompts Bar (When chat is active) */}
          {messages.length > 0 && (
            <div className="px-4 py-1.5 border-t border-slate-200/50 bg-white/60 backdrop-blur-xs">
              <QuickActions
                onSelectPrompt={(p) => onSendMessage(p)}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="E.g. 10 bags cement, estimate tiling for 200 sqft..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-slate-100/90 rounded-xl text-sm text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-homerun-green/20 focus:border-homerun-green transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 bg-homerun-green hover:bg-homerun-green-hover text-white rounded-xl disabled:opacity-40 transition-all active:scale-95 shadow-xs flex items-center justify-center"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Right: Cart Sidebar (Desktop 40%) */}
        <div className="hidden md:block md:w-[380px] lg:w-[420px] shrink-0 h-full">
          <CartSidebar
            cart={cart}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
            onClearCart={onClearCart}
          />
        </div>

        {/* Mobile Cart Drawer Overlay */}
        {isMobileCartOpen && (
          <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-xs flex justify-end">
            <div className="w-full max-w-sm h-full bg-white animate-in slide-in-from-right duration-200 shadow-2xl">
              <CartSidebar
                cart={cart}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                onClearCart={onClearCart}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileCartOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
