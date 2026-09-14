"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Message, CartItem, Suggestion, SUPPORTED_LANGUAGES } from "@/lib/types";
import MessageBubble from "../MessageBubble";
import { QUICK_PROMPTS } from "../QuickActions";
import { VoiceButton } from "../VoiceButton";
import { useSarvamVoice } from "@/hooks/useSarvamVoice";
import {
  ArrowLeft,
  ShoppingCart,
  Send,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Languages,
  Check,
} from "lucide-react";
import { HomeRunThunder } from "../HomeRunLogo";

interface AIEstimatorScreenProps {
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => Promise<Message | null> | void;
  onAddSuggestion: (suggestion: Suggestion) => void;
  onAddToCart?: (item: CartItem) => void;
  onAddAllToCart?: (items: CartItem[]) => void;
  onUpdateQuantity?: (productId: string, qty: number) => void;
  onBack?: () => void;
  onOpenCart?: () => void;
  onResetChat?: () => void;
  variant?: "mobile" | "web";
  initialInput?: string;
  selectedLanguage?: string | null;
  onSelectLanguage?: (language: string | null) => void;
  awaitingLanguageConfirm?: boolean;
  sessionEnded?: boolean;
}

export default function AIEstimatorScreen({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onAddSuggestion,
  onAddToCart,
  onAddAllToCart,
  onUpdateQuantity,
  onBack,
  onOpenCart,
  onResetChat,
  variant = "mobile",
  initialInput = "",
  selectedLanguage = null,
  onSelectLanguage,
  awaitingLanguageConfirm = false,
  sessionEnded = false,
}: AIEstimatorScreenProps) {
  const [inputText, setInputText] = useState(initialInput);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isWeb = variant === "web";
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { callState, start, stop, transcript, setTranscript } = useSarvamVoice(variant, selectedLanguage);

  const handlePickLanguage = (language: string | null) => {
    onSelectLanguage?.(language);
    setIsLanguageMenuOpen(false);
  };

  useEffect(() => {
    if (initialInput) {
      setInputText(initialInput);
    }
  }, [initialInput]);

  useEffect(() => {
    // block: "nearest" keeps this scroll confined to the messages list itself.
    // Without it, the off-screen (translateY(100%)) bottom sheet still counts
    // toward this component's scrollable area, and a bare scrollIntoView()
    // would walk up and scroll the whole screen to "reveal" that phantom
    // space instead of just the chat log.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, transcript, isLoading]);

  const previousCartRef = useRef<CartItem[]>(cart);

  useEffect(() => {
    const prevCart = previousCartRef.current;
    
    // Only detect additions during an active call (or right after)
    if (callState !== "idle") {
      // Find items where the quantity increased or new items were added
      const addedItems = cart.filter(newItem => {
        const prevItem = prevCart.find(p => p.product_id === newItem.product_id);
        if (!prevItem) return true; // Brand new item
        return newItem.quantity > prevItem.quantity; // Quantity increased
      });

      if (addedItems.length > 0 && transcript.length > 0) {
        // Find the index of the latest bot message
        const lastBotIdx = [...transcript].reverse().findIndex(entry => entry.role === "bot");
        
        if (lastBotIdx !== -1) {
          const actualIdx = transcript.length - 1 - lastBotIdx;
          setTranscript(prev => {
            const next = [...prev];
            const currentCartItems = next[actualIdx].cart_items || [];
            
            // Merge added items into the transcript's cart_items
            const newCartItems = [...currentCartItems];
            addedItems.forEach(addedItem => {
              const existingIdx = newCartItems.findIndex(ci => ci.product_id === addedItem.product_id);
              if (existingIdx !== -1) {
                newCartItems[existingIdx] = addedItem;
              } else {
                newCartItems.push(addedItem);
              }
            });
            
            next[actualIdx] = { ...next[actualIdx], cart_items: newCartItems };
            return next;
          });
        }
      }
    }
    
    previousCartRef.current = cart;
  }, [cart, callState, transcript, setTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || sessionEnded) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0 bg-[#fbfbfb] relative overflow-hidden">
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

      {/* Language Picker Bar */}
      <div className="relative shrink-0 bg-[#f7faf8] border-b border-[#eaf2ec] z-20 select-none">
        <button
          type="button"
          onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
          className={`w-full h-9 px-3 flex items-center justify-center gap-1.5 text-[11.5px] font-bold transition-colors cursor-pointer ${
            awaitingLanguageConfirm ? "text-amber-700 bg-amber-50" : "text-[#1a7a3a] hover:bg-[#eef7f3]"
          }`}
        >
          <Languages className="w-3.5 h-3.5" />
          <span>{selectedLanguage ? `Language: ${selectedLanguage}` : "Change Language"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {isLanguageMenuOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-48 bg-white border border-[#eeeeee] rounded-xl shadow-lg z-20 py-1 overflow-hidden">
            <button
              type="button"
              onClick={() => handlePickLanguage(null)}
              className="w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer"
            >
              <span className="text-[#333333]">Auto-detect (default)</span>
              {!selectedLanguage && <Check className="w-3.5 h-3.5 text-[#1a7a3a]" />}
            </button>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                type="button"
                key={lang}
                onClick={() => handlePickLanguage(lang)}
                className="w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer"
              >
                <span className="text-[#333333]">{lang}</span>
                {selectedLanguage === lang && <Check className="w-3.5 h-3.5 text-[#1a7a3a]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Messages Stream (Maximizes available height) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-3 sm:p-4 space-y-2">
        {messages.length === 0 && transcript.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-12 h-12 rounded-2xl bg-[#eef7f3] flex items-center justify-center text-[#1a7a3a] mb-3">
              <HomeRunThunder className="w-6 h-6 text-[#1a7a3a]" />
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-[#1a1a1a]">
              HomeRun AI Estimator
            </h4>
            <p className="text-xs text-[#777777] max-w-xs mt-1">
              Ask for single or multi-room project estimations, direct material orders, or wholesale contractor discounts.
            </p>
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
                onAddToCart={onAddToCart}
                onAddAllToCart={onAddAllToCart}
              />
            ))}
            {transcript.map((entry) => (
              <MessageBubble
                key={`transcript-${entry.timestamp}`}
                message={{
                  id: `transcript-${entry.timestamp}`,
                  role: entry.role === "bot" ? "assistant" : "user",
                  content: entry.content,
                  cart_items: entry.cart_items,
                }}
                variant="in-app"
                allCartItems={cart}
                onAddSuggestion={onAddSuggestion}
                onAddToCart={onAddToCart}
                onAddAllToCart={onAddAllToCart}
                source="voice"
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </>
        )}

        {/* AI Typing Indicator — once the reply starts streaming into its own
            bubble above, that growing text is already the activity signal;
            leaving this dot bubble up as well made it look like a second,
            stray "still typing" indicator floating below a finished reply
            and its timestamp. Only show it before any reply text exists. */}
        {isLoading && (messages[messages.length - 1]?.role === "user" || !messages[messages.length - 1]?.content?.trim()) && (
          <div className="flex items-center gap-2 my-2 ml-1">
            <div className="bg-white border border-slate-200 rounded-2xl px-3.5 py-2 flex items-center gap-1.5 shadow-2xs">
              <span className="text-xs text-slate-500 font-medium mr-1">
                Typing...
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a3a] dot-3" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Try Asking — single horizontally-scrollable line, kept compact so
          the message stream above gets as much height as possible */}
      {!sessionEnded && (
        <div className="bg-white border-t border-[#f0f0f0] shrink-0 py-1">
          <div className="flex items-center gap-1.5 px-3 sm:px-4 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1 shrink-0 text-[10px] font-bold text-[#777777]">
              <Sparkles className="w-3 h-3 text-homerun-green" />
              Try asking
            </span>
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isLoading}
                onClick={() => handleSelectQuickPrompt(item.label)}
                className="shrink-0 inline-flex items-center gap-1 px-2 py-1 text-[10.5px] font-medium bg-[#f8faf9] text-slate-700 rounded-md border border-slate-200 hover:border-homerun-green hover:bg-homerun-green-light/40 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 bg-white shrink-0">
        {sessionEnded ? (
          <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800">Chat session ended</p>
              <p className="text-[11px] text-slate-500 truncate">
                Start a new chat anytime you need materials.
              </p>
            </div>
            {onResetChat && (
              <button
                type="button"
                onClick={onResetChat}
                className="shrink-0 px-3.5 py-2 rounded-full bg-[#1a7a3a] text-white text-xs font-bold shadow-sm hover:bg-[#145f2d] active:scale-95 transition-all cursor-pointer"
              >
                Start New Chat
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {/* Voice Mic Button */}
            <VoiceButton callState={callState} onStart={start} onStop={stop} />

            <form
              onSubmit={handleSubmit}
              className="flex-1 flex items-center gap-2 p-[6px] rounded-[24px] border border-slate-200 bg-white shadow-none"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || callState !== "idle"}
                className="flex-1 text-xs sm:text-sm px-2 py-2 bg-transparent focus:outline-none border-none focus:ring-0 font-sans"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading || callState !== "idle"}
                className={`flex items-center justify-center shrink-0 h-10 w-10 rounded-full transition-all duration-200 ${
                  !inputText.trim() || isLoading || callState !== "idle"
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#1a7a3a] text-white shadow-sm hover:bg-[#145f2d] active:scale-95 cursor-pointer"
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}
