"use client";

import React, { useState, useRef, useEffect } from "react";
import { Message, CartItem } from "@/lib/types";
import MessageBubble from "./MessageBubble";
import QuickActions from "./QuickActions";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  RefreshCw,
} from "lucide-react";

interface WhatsAppChatProps {
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onActionClick: (action: "view-cart" | "checkout" | "add-more") => void;
  onResetChat?: () => void;
}

export default function WhatsAppChat({
  messages,
  cart,
  isLoading,
  onSendMessage,
  onActionClick,
  onResetChat,
}: WhatsAppChatProps) {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="w-full max-w-[460px] mx-auto bg-white rounded-3xl shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col h-[780px] max-h-[90vh]">
      {/* WhatsApp Header (#075e54) */}
      <div className="bg-[#075e54] text-white px-3.5 py-2.5 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-2">
          {/* Back arrow */}
          <button
            type="button"
            className="p-1 -ml-1 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Yellow HR Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-homerun-yellow flex items-center justify-center text-homerun-green font-black text-sm shadow-xs border border-white/20 select-none">
              HR
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#075e54]"></span>
          </div>

          {/* Title and online status */}
          <div className="leading-tight">
            <h2 className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>HomeRun Assistant</span>
              <span className="text-[10px] bg-emerald-700/80 text-emerald-100 px-1.5 py-0.2 rounded font-normal">
                Verified
              </span>
            </h2>
            <p className="text-[11px] text-emerald-200/90 font-normal">
              {isLoading ? "typing..." : "online"}
            </p>
          </div>
        </div>

        {/* WhatsApp Call / Action Icons */}
        <div className="flex items-center gap-2 text-white/90">
          <button
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="Video call"
          >
            <Video className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="Voice call"
          >
            <Phone className="w-4 h-4" />
          </button>
          {onResetChat && (
            <button
              type="button"
              onClick={onResetChat}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="Reset chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
            title="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WhatsApp Chat Area (#ece5dd with doodle background) */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-1 whatsapp-bg">
        {/* WhatsApp Encryption Notice Banner */}
        <div className="my-2 flex justify-center">
          <div className="bg-[#ffeecd] border border-[#ffd899] text-[#54432d] text-[10.5px] px-3 py-1.5 rounded-lg shadow-2xs text-center max-w-[90%] leading-snug">
            🔒 Messages with HomeRun AI are encrypted. Quick delivery in Bangalore within 60 minutes.
          </div>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            variant="whatsapp"
            allCartItems={cart}
            onActionClick={onActionClick}
          />
        ))}

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
        className="p-2 bg-[#f0f2f5] border-t border-slate-200 flex items-center gap-1.5 shrink-0"
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
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075e54] text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        ) : (
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-[#00a884] hover:bg-[#075e54] text-white flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0"
            title="Voice Note"
          >
            <Mic className="w-5 h-5" />
          </button>
        )}
      </form>
    </div>
  );
}
