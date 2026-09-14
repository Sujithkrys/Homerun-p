"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message, CartItem, Suggestion, SUPPORTED_LANGUAGES } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import {
  ArrowLeft,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  RefreshCw,
  Languages,
  Check,
} from "lucide-react";
import { HomeRunLogo } from "./HomeRunLogo";

interface WhatsAppChatProps {
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onActionClick: (action: "view-cart" | "checkout" | "add-more") => void;
  onResetChat?: () => void;
  onAddSuggestion?: (suggestion: Suggestion) => void;
  onAddToCart?: (item: CartItem) => void;
  onAddAllToCart?: (items: CartItem[]) => void;
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
  selectedLanguage?: string | null;
  onSelectLanguage?: (language: string | null) => void;
  awaitingLanguageConfirm?: boolean;
}

export default function WhatsAppChat({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onActionClick,
  onResetChat,
  onAddSuggestion,
  onAddToCart,
  onAddAllToCart,
  setMessages,
  selectedLanguage = null,
  onSelectLanguage,
  awaitingLanguageConfirm = false,
}: WhatsAppChatProps) {
  const [inputText, setInputText] = useState("");
  const [activeSelectionItems, setActiveSelectionItems] = useState<CartItem[] | null>(null);
  const [lastSelectedItems, setLastSelectedItems] = useState<CartItem[] | null>(null);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handlePickLanguage = (language: string | null) => {
    onSelectLanguage?.(language);
    setShowLanguageMenu(false);
  };

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, activeSelectionItems, lastSelectedItems]);

  const getTimeString = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  // Check if the latest message is a recommendation from bot
  const latestMessage = messages[messages.length - 1];
  const isLatestRecommendation =
    latestMessage &&
    latestMessage.role === "assistant" &&
    latestMessage.recommended_products &&
    latestMessage.recommended_products.length > 0;

  // Check if current view is initial greeting only
  const isInitialGreetingOnly =
    messages.length === 1 && messages[0].role === "assistant";

  // Flow Handler 1: User taps "Select Products"
  const handleSelectProducts = (prods: CartItem[]) => {
    setActiveSelectionItems(prods);
    if (!setMessages) return;

    const botPrompt: Message = {
      id: `asst-${Date.now()}`,
      role: "assistant",
      content:
        "Reply with the numbers of products you want to order.\n\nFor example: *1, 3, 4* to select specific items.\n\nOr type *all* to select everything.",
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, botPrompt]);
  };

  // Flow Handler 2: User taps "Download List"
  const handleDownloadList = (prods: CartItem[]) => {
    if (!setMessages) return;
    const total = prods.reduce((sum, p) => sum + p.total, 0);
    const dateStr = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const lines = prods
      .map(
        (p, i) =>
          `${i + 1}. ${p.name}\n   Qty: ${p.quantity} ${p.unit} | ₹${p.unit_price}/${p.unit} | ₹${p.total.toLocaleString("en-IN")}`
      )
      .join("\n\n");

    const content = `📋 *HomeRun Material List*
Project: Materials Estimate
Date: ${dateStr}

━━━━━━━━━━━━━━━━━━━━
${lines}
━━━━━━━━━━━━━━━━━━━━
Subtotal: ₹${total.toLocaleString("en-IN")}
Delivery: FREE
*Total: ₹${total.toLocaleString("en-IN")}*

HomeRun — Delivered in 60 mins ⚡`;

    const downloadMsg: Message = {
      id: `asst-${Date.now()}`,
      role: "assistant",
      content,
      timestamp: getTimeString(),
    };
    setMessages((prev) => [...prev, downloadMsg]);
  };

  // Flow Handler 3: User taps "Add All & Pay"
  const handleAddAllAndPay = (prods: CartItem[]) => {
    if (onAddAllToCart) {
      onAddAllToCart(prods);
    }
    if (!setMessages) return;

    const total = prods.reduce((sum, p) => sum + p.total, 0);
    const summary = prods
      .map(
        (p, i) =>
          `${i + 1}. ${p.name} × ${p.quantity} ${p.unit} — ₹${p.total.toLocaleString("en-IN")}`
      )
      .join("\n");

    const payMessage: Message = {
      id: `asst-${Date.now()}`,
      role: "assistant",
      content: `🧾 *Order Summary*

${summary}

💰 *Total: ₹${total.toLocaleString("en-IN")}*
🚚 Free delivery to your site

Pay securely here:
https://rzp.io/l/homerun-order

⚡ Your order will be delivered in 60 minutes after payment!`,
      timestamp: getTimeString(),
    };

    setMessages((prev) => [...prev, payMessage]);
    setActiveSelectionItems(null);
    setLastSelectedItems(null);
  };

  // Flow Handler 4: User taps "Proceed to Pay" from selected items confirmation
  const handleProceedToPay = () => {
    const itemsToPay = lastSelectedItems && lastSelectedItems.length > 0 ? lastSelectedItems : cart;
    if (itemsToPay.length === 0) {
      if (!setMessages) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: "Your cart is currently empty. Please select products first!",
          timestamp: getTimeString(),
        },
      ]);
      return;
    }

    const total = itemsToPay.reduce((sum, p) => sum + p.total, 0);
    const summary = itemsToPay
      .map(
        (p, i) =>
          `${i + 1}. ${p.name} × ${p.quantity} ${p.unit} — ₹${p.total.toLocaleString("en-IN")}`
      )
      .join("\n");

    if (!setMessages) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: `🧾 *Order Summary*

${summary}

💰 *Total: ₹${total.toLocaleString("en-IN")}*
🚚 Free delivery to your site

Pay securely here:
https://rzp.io/l/homerun-order

⚡ Your order will be delivered in 60 minutes after payment!`,
        timestamp: getTimeString(),
      },
    ]);
    setActiveSelectionItems(null);
    setLastSelectedItems(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText("");

    const lower = text.toLowerCase();

    // 1. Human Escalation Keyword
    if (lower === "agent" || lower === "human" || lower.includes("talk to human") || lower.includes("customer care")) {
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text,
        timestamp: getTimeString(),
      };
      const escalationMsg: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: `I want to make sure you get the right help! Let me connect you with our team.\n\n📞 Call: 080-45678900\n📧 Email: support@home-run.co\n\nOr type *agent* anytime to reach a human.`,
        timestamp: getTimeString(),
      };
      if (setMessages) {
        setMessages((prev) => [...prev, userMsg, escalationMsg]);
      }
      return;
    }

    // 2. Check if user is replying with product numbers while selection is active
    // Or if recent messages contain recommended products
    const recentRecMsg = [...messages].reverse().find(
      (m) => m.role === "assistant" && m.recommended_products && m.recommended_products.length > 0
    );

    const targetProds = activeSelectionItems || recentRecMsg?.recommended_products;

    if (targetProds && targetProds.length > 0) {
      if (lower === "all" || lower === "everything" || lower === "add all") {
        handleAddAllAndPay(targetProds);
        return;
      }

      // Check if input consists of numbers like "1, 3" or "1 2" or "1,2,4"
      const numberMatches = text.match(/\b\d+\b/g);
      if (numberMatches && numberMatches.length > 0 && text.replace(/[\d,\s]/g, "").length === 0) {
        const selectedIndices = Array.from(
          new Set(numberMatches.map((n) => parseInt(n, 10) - 1))
        ).filter((idx) => idx >= 0 && idx < targetProds.length);

        if (selectedIndices.length > 0) {
          const selected = selectedIndices.map((idx) => targetProds[idx]);
          selected.forEach((item) => onAddToCart?.(item));
          setLastSelectedItems(selected);

          const subtotal = selected.reduce((sum, p) => sum + p.total, 0);
          const listText = selected
            .map((p, i) => `${i + 1}. ${p.name} × ${p.quantity} ${p.unit} — ₹${p.total.toLocaleString("en-IN")}`)
            .join("\n");

          const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: getTimeString(),
          };

          const confirmMsg: Message = {
            id: `asst-${Date.now()}`,
            role: "assistant",
            content: `✅ *Selected items:*\n\n${listText}\n\n💰 *Subtotal: ₹${subtotal.toLocaleString(
              "en-IN"
            )}*\n🚚 Free delivery`,
            timestamp: getTimeString(),
          };

          if (setMessages) {
            setMessages((prev) => [...prev, userMsg, confirmMsg]);
          }
          setActiveSelectionItems(null);
          return;
        }
      }
    }

    // Default: forward to standard chat handler
    onSendMessage(text);
  };

  return (
    <div className="w-full h-full bg-white overflow-hidden flex flex-col relative">
      {/* WhatsApp Header (#075e54) - pt-10 for status bar clearance */}
      <div className="bg-[#075e54] text-white px-3 pt-10 pb-2 flex items-center justify-between shrink-0 shadow-xs select-none">
        <div className="flex items-center gap-2 min-w-0">
          {/* Back arrow */}
          <button
            type="button"
            className="p-1 -ml-1 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* HomeRun WhatsApp Official Profile Picture */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#EFC41A] flex items-center justify-center shadow-xs border border-white/20 select-none">
              <HomeRunLogo size={32} className="w-8 h-8 rounded-none" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25d366] border-2 border-[#075e54]"></span>
          </div>

          {/* Title and online status on single row */}
          <div className="flex items-baseline gap-2 min-w-0 truncate">
            <h2 className="text-[15px] font-bold tracking-tight text-white truncate">
              HomeRun
            </h2>
            <span className="text-[11.5px] text-[#25d366] font-medium shrink-0">
              {isLoading ? "typing..." : "online"}
            </span>
          </div>
        </div>

        {/* WhatsApp Right Menu */}
        <div className="flex items-center gap-1 text-white/90 shrink-0">
          <button
            type="button"
            onClick={() => setShowLanguageMenu((prev) => !prev)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              awaitingLanguageConfirm ? "bg-amber-400/90 text-[#075e54]" : "hover:bg-white/10"
            }`}
            title="Change Language"
          >
            <Languages className="w-4 h-4" />
          </button>
          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Language Picker Dropdown */}
      {showLanguageMenu && (
        <div className="absolute right-2 top-[68px] z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 w-44 animate-fadeIn">
          <button
            type="button"
            onClick={() => handlePickLanguage(null)}
            className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer"
          >
            <span className="text-[#333333]">Auto-detect (default)</span>
            {!selectedLanguage && <Check className="w-3.5 h-3.5 text-[#075e54]" />}
          </button>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <button
              type="button"
              key={lang}
              onClick={() => handlePickLanguage(lang)}
              className="w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer"
            >
              <span className="text-[#333333]">{lang}</span>
              {selectedLanguage === lang && <Check className="w-3.5 h-3.5 text-[#075e54]" />}
            </button>
          ))}
        </div>
      )}

      {/* WhatsApp Chat Area (#ece5dd with doodle background) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1 whatsapp-bg">
        {/* WhatsApp Encryption Notice Banner */}
        <div className="my-2 flex justify-center">
          <div className="bg-[#ffeecd] border border-[#ffd899] text-[#54432d] text-[10.5px] px-3 py-1.5 rounded-lg shadow-2xs text-center max-w-[90%] leading-snug">
            🔒 Messages with HomeRun AI are encrypted. Quick delivery in Bangalore within 60 minutes.
          </div>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg, index) => {
          const isLatest = index === messages.length - 1;
          const hasRecs =
            msg.role === "assistant" &&
            msg.recommended_products &&
            msg.recommended_products.length > 0;

          return (
            <div key={msg.id} className="flex flex-col">
              <MessageBubble
                message={msg}
                variant="whatsapp"
                allCartItems={cart}
                onActionClick={onActionClick}
                onAddSuggestion={onAddSuggestion}
              />

              {/* 3a. Welcome Message 3 Stacked Buttons */}
              {isInitialGreetingOnly && index === 0 && (
                <div className="flex flex-col gap-1.5 w-full max-w-[85%] sm:max-w-[78%] -mt-0.5 mb-2 ml-0.5 select-none animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => onSendMessage("I need a material estimate")}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>📐</span>
                    <span>Get Material Estimate</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendMessage("I want to order products")}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>🛒</span>
                    <span>Order Products</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendMessage("I have a question")}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>❓</span>
                    <span>Ask a Question</span>
                  </button>
                </div>
              )}

              {/* 3b. Product Recommendations Buttons (Select Products | Download List | Add All & Pay) */}
              {hasRecs && isLatest && (
                <div className="flex flex-col gap-1.5 w-full max-w-[88%] sm:max-w-[80%] -mt-0.5 mb-2 ml-0.5 select-none animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => handleSelectProducts(msg.recommended_products!)}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>✅</span>
                    <span>Select Products</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDownloadList(msg.recommended_products!)}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>📥</span>
                    <span>Download List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddAllAndPay(msg.recommended_products!)}
                    className="w-full bg-[#075e54] hover:bg-[#0c6c61] text-white rounded-lg py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>💳</span>
                    <span>Add All & Pay</span>
                  </button>
                </div>
              )}

              {/* 3c. Post-Selection Buttons (Proceed to Pay | Add More Items | Change Selection) */}
              {lastSelectedItems && isLatest && msg.content.includes("✅ *Selected items:*") && (
                <div className="flex flex-col gap-1.5 w-full max-w-[88%] sm:max-w-[80%] -mt-0.5 mb-2 ml-0.5 select-none animate-fadeIn">
                  <button
                    type="button"
                    onClick={handleProceedToPay}
                    className="w-full bg-[#075e54] hover:bg-[#0c6c61] text-white rounded-lg py-2 px-3 text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>💳</span>
                    <span>Proceed to Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendMessage("What else do you recommend for this project?")}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#075e54] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>➕</span>
                    <span>Add More Items</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const recMsg = [...messages].reverse().find(
                        (m) => m.role === "assistant" && m.recommended_products && m.recommended_products.length > 0
                      );
                      if (recMsg?.recommended_products) {
                        handleSelectProducts(recMsg.recommended_products);
                      }
                    }}
                    className="w-full bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg py-2 px-3 text-xs font-bold text-[#555555] flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-all active:scale-98"
                  >
                    <span>🔄</span>
                    <span>Change Selection</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isLoading && (
          <div className="flex justify-start my-1.5">
            <div className="bg-white rounded-lg px-3 py-2 wa-bubble-left shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#128c7e] dot-1"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#128c7e] dot-2"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#128c7e] dot-3"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Replies Bar (WhatsApp Horizontal Chips) */}
      <QuickActions
        onSelectPrompt={(p) => onSendMessage(p)}
        variant="whatsapp"
        disabled={isLoading}
      />

      {/* WhatsApp Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-2 pb-6 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-1.5 shrink-0"
      >
        <div className="flex items-center gap-1 text-[#54656f] px-1">
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
            title="Emoji"
          >
            <Smile className="w-5 h-5 text-slate-500" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message"
          disabled={isLoading}
          className="flex-1 px-3.5 py-2 bg-white rounded-2xl text-[13.5px] text-slate-800 placeholder-slate-400 focus:outline-none shadow-2xs border border-transparent focus:border-slate-300"
        />

        {inputText.trim() ? (
          <button
            type="submit"
            disabled={isLoading}
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075e54] text-white flex items-center justify-center transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075e54] text-white flex items-center justify-center transition-all shadow-md active:scale-98 shrink-0 cursor-pointer"
            title="Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}
