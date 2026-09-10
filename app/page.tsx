"use client";

import React, { useState } from "react";
import ModeToggle, { DemoMode } from "@/components/ModeToggle";
import ChatWindow from "@/components/ChatWindow";
import WhatsAppChat from "@/components/WhatsAppChat";
import { Message, CartItem, ChatResponse } from "@/lib/types";
import { ExternalLink, Sparkles, Building2, Clock, ShieldCheck } from "lucide-react";

function getInitialGreeting(): Message {
  return {
    id: "init-welcome",
    role: "assistant",
    content:
      "Hello! I am your **HomeRun Construction Assistant**.\n\nNeed cement, adhesives, paints, or electrical wiring delivered directly to your site in Bangalore? I can calculate estimations or dispatch materials to your doorstep in **60 minutes**.\n\nWhat can I get for you today?",
    timestamp: "10:30 AM",
  };
}

export default function HomePage() {
  const [mode, setMode] = useState<DemoMode>("in-app");
  const [messages, setMessages] = useState<Message[]>([getInitialGreeting()]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Send a user message and trigger API
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userText,
      timestamp: currentTime,
    };

    // Check if user typed "remove [item]" in WhatsApp mode
    const lower = userText.toLowerCase();
    if (lower.startsWith("remove ") || lower.startsWith("delete ")) {
      const target = lower.replace(/^(remove|delete)\s+/, "").trim();
      const existingItem = cart.find(
        (it) =>
          it.name.toLowerCase().includes(target) ||
          it.product_id.toLowerCase().includes(target)
      );

      if (existingItem) {
        setCart((prev) => prev.filter((it) => it.product_id !== existingItem.product_id));
        setMessages((prev) => [
          ...prev,
          userMessage,
          {
            id: `asst-${Date.now()}`,
            role: "assistant",
            content: `Removed **${existingItem.name}** from your cart.`,
            timestamp: currentTime,
          },
        ]);
        return;
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: [...messages, userMessage],
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: ChatResponse = await response.json();

      // Add to Cart State: If the same product_id already exists, update quantity
      if (data.cart_items && data.cart_items.length > 0) {
        setCart((prevCart) => {
          const updated = [...prevCart];
          data.cart_items.forEach((newItem) => {
            const existingIndex = updated.findIndex(
              (item) => item.product_id === newItem.product_id
            );
            if (existingIndex > -1) {
              const current = updated[existingIndex];
              const combinedQty = current.quantity + newItem.quantity;
              updated[existingIndex] = {
                ...current,
                quantity: combinedQty,
                total: combinedQty * current.unit_price,
              };
            } else {
              updated.push(newItem);
            }
          });
          return updated;
        });
      }

      // Append assistant message
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.message || "I have received your request.",
        cart_items: data.cart_items || [],
        estimation_summary: data.estimation_summary || null,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Oops, our AI is taking a break. Try again in a moment.",
        timestamp: currentTime,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart quantity updates
  const handleUpdateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? {
              ...item,
              quantity: newQty,
              total: newQty * item.unit_price,
            }
          : item
      )
    );
  };

  // Remove single item
  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
  };

  // Clear all items
  const handleClearCart = () => {
    setCart([]);
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([getInitialGreeting()]);
    setCart([]);
  };

  // WhatsApp Interactive Action Button Handlers
  const handleWhatsAppActionClick = (
    action: "view-cart" | "checkout" | "add-more"
  ) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (action === "view-cart") {
      if (cart.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            role: "assistant",
            content:
              "🛒 *Your Cart is Empty*\n\nTell me what materials you need (e.g., UltraTech cement, Roff tile adhesive, Asian Paints) to add them.",
            timestamp: currentTime,
          },
        ]);
        return;
      }

      const total = cart.reduce((sum, item) => sum + item.total, 0);
      const itemsText = cart
        .map(
          (item, idx) =>
            `${idx + 1}. ${item.name} × ${item.quantity} ${item.unit} — ₹${item.total.toLocaleString("en-IN")}`
        )
        .join("\n");

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: `🛒 *Your Cart Summary*\n${itemsText}\n\n💰 *Total:* ₹${total.toLocaleString(
            "en-IN"
          )}\n🚚 Free Delivery in Bangalore | ⚡ 60 min`,
          cart_items: cart,
          timestamp: currentTime,
        },
      ]);
    } else if (action === "checkout") {
      const total = cart.reduce((sum, item) => sum + item.total, 0);
      const randomOrderId = Math.floor(1000 + Math.random() * 9000);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content: `💳 *Razorpay Payment Link:*\nhttps://rzp.io/i/hr-pay-${randomOrderId}\n\n💰 *Payable:* ₹${total.toLocaleString(
            "en-IN"
          )}\n📍 *Delivery Site:* Bangalore Registered Project\n⚡ *ETA:* HomeRun logistics partner will dispatch within 60 minutes of payment confirmation.`,
          timestamp: currentTime,
        },
      ]);
    } else if (action === "add-more") {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content:
            "Sure! What else do you need for your site today?\n\n• **Tile Spacers (3mm)** — ₹90/pack\n• **Roff Rainbow Grout (1kg)** — ₹85/pack\n• **Birla White Wall Putty (40kg)** — ₹940/bag\n• **Finolex FR 2.5 sqmm Wire** — ₹2,850/roll\n\nJust type the quantity or click a quick prompt below!",
          timestamp: currentTime,
        },
      ]);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-100/70 antialiased selection:bg-homerun-yellow/40">
      {/* Top Navigation & Mode Switcher */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-2 flex flex-col items-center">
          <div className="w-full flex items-center justify-between">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-homerun-yellow flex items-center justify-center text-homerun-green font-black text-sm shadow-xs select-none">
                HR
              </div>
              <div>
                <a
                  href="https://home-run.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-black tracking-tight text-slate-900 hover:text-homerun-green transition-colors flex items-center gap-1 font-display"
                >
                  HomeRun <span className="text-homerun-green">Quick Commerce</span>
                </a>
                <p className="text-[10px] text-slate-500 font-medium">
                  Bangalore • 60-Minute Construction Materials
                </p>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-homerun-green" /> 60-Min Delivery
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-homerun-green" /> 100% Genuine
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-homerun-green" /> Bangalore Hubs
              </span>
            </div>
          </div>

          {/* Mode Switcher Pill */}
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        </div>
      </header>

      {/* Main Interactive Demo Container */}
      <section className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col items-center justify-center">
        {mode === "in-app" ? (
          <ChatWindow
            messages={messages}
            cart={cart}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onResetChat={handleResetChat}
          />
        ) : (
          <WhatsAppChat
            messages={messages}
            cart={cart}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onActionClick={handleWhatsAppActionClick}
            onResetChat={handleResetChat}
          />
        )}
      </section>

      {/* Footer as requested in the prompt */}
      <footer className="w-full bg-white border-t border-slate-200 py-3.5 px-4 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center flex-wrap gap-1.5 font-medium">
          <span>Built by</span>
          <a
            href="https://linkedin.com/in/thalathotysujith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-homerun-green hover:text-homerun-green-hover hover:underline inline-flex items-center gap-0.5"
          >
            Sujith Thalathoty <ExternalLink className="w-3 h-3 inline" />
          </a>
          <span>|</span>
          <span className="text-slate-700">AI Product Demo for HomeRun</span>
          <span className="text-slate-400 font-normal">
            (Quick Commerce Construction Materials • Bangalore)
          </span>
        </p>
      </footer>
    </main>
  );
}
