"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Message, CartItem, Suggestion, SUPPORTED_LANGUAGES } from "@/lib/types";
import MessageBubble from "../MessageBubble";
import QuickActions from "../QuickActions";
import { VoiceButton } from "../VoiceButton";
import { useSarvamVoice } from "@/hooks/useSarvamVoice";
import {
  ArrowLeft,
  ShoppingCart,
  Send,
  Sparkles,
  RefreshCw,
  ChevronDown,
  ChevronUp,
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
  onBack?: () => void;
  onOpenCart?: () => void;
  onResetChat?: () => void;
  variant?: "mobile" | "web";
  initialInput?: string;
  selectedLanguage?: string | null;
  onSelectLanguage?: (language: string | null) => void;
  awaitingLanguageConfirm?: boolean;
}

export default function AIEstimatorScreen({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onAddSuggestion,
  onAddToCart,
  onAddAllToCart,
  onBack,
  onOpenCart,
  onResetChat,
  variant = "mobile",
  initialInput = "",
  selectedLanguage = null,
  onSelectLanguage,
  awaitingLanguageConfirm = false,
}: AIEstimatorScreenProps) {
  const [inputText, setInputText] = useState(initialInput);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isWeb = variant === "web";
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const { callState, start, stop, transcript } = useSarvamVoice(variant, selectedLanguage);

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
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, transcript, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleSelectQuickPrompt = (prompt: string) => {
    onSendMessage(prompt);
    setIsQuickActionsOpen(false);
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

      {/* Fix 8: Collapsible "Try asking..." Bar at top of chat area */}
      <div className="shrink-0 bg-white border-b border-[#eeeeee] z-10 select-none shadow-2xs">
        <button
          type="button"
          onClick={() => setIsQuickActionsOpen((prev) => !prev)}
          className="w-full h-10 px-3 flex items-center justify-between text-xs font-semibold text-[#333333] hover:bg-[#fafafa] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm shrink-0">💡</span>
            <span className="text-[#1a1a1a] font-bold truncate">Try asking...</span>
            <span className="text-[10.5px] text-[#777777] font-normal hidden sm:inline truncate">
              — Quick estimates for tiling, painting, wiring
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#666666] shrink-0">
            <span className="text-[10px] font-medium">
              {isQuickActionsOpen ? "Hide" : "Show"}
            </span>
            {isQuickActionsOpen ? (
              <ChevronUp className="w-4 h-4 text-[#1a7a3a]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#777777]" />
            )}
          </div>
        </button>

        {/* Collapsible Quick Action Pills Container */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            isQuickActionsOpen ? "max-h-28 opacity-100 py-1.5 px-2 bg-[#f8faf9] border-t border-[#f0f0f0]" : "max-h-0 opacity-0 py-0"
          }`}
        >
          <QuickActions
            onSelectPrompt={handleSelectQuickPrompt}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Language Picker Bar */}
      <div className="relative shrink-0 bg-white border-b border-[#eeeeee] z-10 select-none">
        <button
          type="button"
          onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
          className={`w-full h-8 px-3 flex items-center justify-between text-[11px] font-semibold transition-colors cursor-pointer ${
            awaitingLanguageConfirm ? "text-amber-700 bg-amber-50" : "text-[#555555] hover:bg-[#fafafa]"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5" />
            <span>{selectedLanguage ? `Language: ${selectedLanguage}` : "Change Language"}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`} />
        </button>

        {isLanguageMenuOpen && (
          <div className="absolute left-0 right-0 top-full bg-white border border-t-0 border-[#eeeeee] shadow-md z-20 py-1">
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
            {messages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <MessageBubble
                  message={msg}
                  variant="in-app"
                  allCartItems={cart}
                  onAddSuggestion={onAddSuggestion}
                  onAddToCart={onAddToCart}
                  onAddAllToCart={onAddAllToCart}
                />
                {/* Nudge to pick a language, shown right under the welcome message */}
                {index === 0 && messages.length === 1 && msg.role === "assistant" && !selectedLanguage && (
                  <button
                    type="button"
                    onClick={() => setIsLanguageMenuOpen(true)}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#1a7a3a] bg-[#eef7f3] hover:bg-[#e0f0e8] border border-[#1a7a3a]/20 rounded-full px-3 py-1.5 ml-1 w-fit transition-colors cursor-pointer animate-fadeIn"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>Change Language</span>
                  </button>
                )}
              </React.Fragment>
            ))}
            {transcript.map((entry) => (
              <MessageBubble
                key={`transcript-${entry.timestamp}`}
                message={{
                  id: `transcript-${entry.timestamp}`,
                  role: entry.role === "bot" ? "assistant" : "user",
                  content: entry.content,
                }}
                variant="in-app"
                allCartItems={cart}
                onAddSuggestion={onAddSuggestion}
                onAddToCart={onAddToCart}
                onAddAllToCart={onAddAllToCart}
              />
            ))}
          </>
        )}

        {/* AI Typing Indicator */}
        {isLoading && (
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

      {/* Chat Input Bar */}
      <div className="p-2.5 sm:p-3 bg-white shrink-0">
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
      </div>
    </div>
  );
}
