"use client";

import React, { useState } from "react";
import ModeToggle, { DemoMode } from "@/components/ModeToggle";
import WebPlatform from "@/components/WebPlatform";
import MobileApp from "@/components/MobileApp";
import WhatsAppChat from "@/components/WhatsAppChat";
import PhoneFrame from "@/components/PhoneFrame";
import {
  Message,
  CartItem,
  ChatResponse,
  Suggestion,
  DemoOrder,
  BillDetails as BillDetailsType,
} from "@/lib/types";
import { useNavigation } from "@/lib/useNavigation";
import { ExternalLink, Sparkles, Building2, Clock, ShieldCheck } from "lucide-react";
import { HomeRunLogo } from "@/components/HomeRunLogo";

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
  const [mode, setMode] = useState<DemoMode>("web");
  const { currentScreen, navigateTo } = useNavigation("home");

  const [messages, setMessages] = useState<Message[]>([getInitialGreeting()]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Platform Cart Enhancements State
  const [unloadingService, setUnloadingService] = useState(false);
  const [gstin, setGstin] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [demoOrder, setDemoOrder] = useState<DemoOrder | null>(null);

  // Calculate Bill Details live
  const calculateBillDetails = (cartItems: CartItem[]): BillDetailsType => {
    const rawSubtotal = cartItems.reduce((sum, item) => sum + item.total, 0);
    const subtotalWithUnloading = unloadingService ? rawSubtotal + 199 : rawSubtotal;
    const deliveryCharge = rawSubtotal === 0 ? 0 : rawSubtotal >= 500 ? 0 : 49;
    return {
      subtotal: subtotalWithUnloading,
      discount: 0,
      walletApplied: 0,
      deliveryCharge,
      handlingCharge: 0,
      total: subtotalWithUnloading + deliveryCharge,
    };
  };

  const currentBill = calculateBillDetails(cart);

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
        project_estimate: data.project_estimate || null,
        suggestions: data.suggestions || [],
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

  // Direct 1-click addition of cross-sell suggestions
  const handleAddSuggestionToCart = (suggestion: Suggestion) => {
    const newItem: CartItem = {
      product_id: suggestion.product_id,
      name: suggestion.name,
      quantity: suggestion.estimated_qty,
      unit: suggestion.unit,
      unit_price: suggestion.unit_price,
      total: suggestion.estimated_qty * suggestion.unit_price,
      reason: suggestion.reason,
    };

    setCart((prevCart) => {
      const updated = [...prevCart];
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
      return updated;
    });
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

  // Place order flow
  const handlePlaceOrder = () => {
    const bill = calculateBillDetails(cart);
    const newOrder: DemoOrder = {
      id: "HR-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      total: bill.total,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      status: "arriving",
    };

    setDemoOrder(newOrder);
    setCart([]);
    setUnloadingService(false);
    navigateTo("orders");
  };

  // Reset conversation
  const handleResetChat = () => {
    setMessages([getInitialGreeting()]);
  };

  // WhatsApp in-chat interactive action handlers
  const handleWhatsAppActionClick = (action: "view-cart" | "checkout" | "add-more") => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (action === "view-cart") {
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content:
            cart.length > 0
              ? `🛒 *Current Site Cart:* (${cart.reduce((s, i) => s + i.quantity, 0)} items)\n\n` +
                cart
                  .map(
                    (item, idx) =>
                      `${idx + 1}. *${item.name}* × ${item.quantity} ${item.unit} — ₹${item.total.toLocaleString(
                        "en-IN"
                      )}`
                  )
                  .join("\n") +
                `\n\n💰 *Total:* ₹${cart
                  .reduce((s, i) => s + i.total, 0)
                  .toLocaleString("en-IN")}\n\nType *'checkout'* to receive an instant payment link or *'remove [item]'* to edit.`
              : "Your cart is currently empty. Ask for cement, tiling adhesive, or a full renovation estimate to begin!",
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
            "Sure! What else do you need for your site today?\n\n• **Tile Spacers (3mm)** — ₹60/pack\n• **Roff Rainbow Grout (1kg)** — ₹160/pack\n• **Birla White Wall Putty (40kg)** — ₹890/bag\n• **Finolex FR 2.5 sqmm Wire** — ₹2,850/roll\n\nJust type the quantity or click a quick prompt below!",
          timestamp: currentTime,
        },
      ]);
    }
  };

  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between bg-slate-100/70 antialiased selection:bg-homerun-yellow/40">
      {/* 1. Unified Single Top Bar (No empty space after name, sleek 44px) */}
      <header className="h-11 shrink-0 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between select-none z-40">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 shrink-0">
          <HomeRunLogo size={22} className="w-[22px] h-[22px] rounded-sm shadow-2xs" />
          <a
            href="https://home-run.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black tracking-tight text-slate-900 hover:text-homerun-green transition-colors flex items-center gap-1 font-display"
          >
            HomeRun <span className="text-homerun-green">AI Assistant</span>
          </a>
        </div>

        {/* 3-Mode Switcher in header bar (Desktop/Tablet one-line layout) */}
        <div className="hidden sm:flex items-center justify-center">
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          />
        </div>

        {/* Creator Link */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium shrink-0">
          <span className="hidden sm:inline">Built by</span>
          <a
            href="https://linkedin.com/in/thalathotysujith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-homerun-green hover:underline inline-flex items-center gap-0.5"
          >
            Sujith Thalathoty <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        </div>
      </header>

      {/* 2. Main Interactive Demo Area (Pushed directly to top, fitting screen correctly) */}
      <section className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-start pt-1 px-1 sm:px-2 pb-0 overflow-hidden min-h-0">
        {mode === "web" && (
          <div className="w-full h-full max-h-full overflow-hidden flex flex-col">
            <WebPlatform
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              messages={messages}
              cart={cart}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onResetChat={handleResetChat}
              onAddSuggestion={handleAddSuggestionToCart}
              unloadingService={unloadingService}
              setUnloadingService={setUnloadingService}
              gstin={gstin}
              setGstin={setGstin}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              demoOrder={demoOrder}
              onPlaceOrder={handlePlaceOrder}
              bill={currentBill}
            />
          </div>
        )}

        {mode === "mobile" && (
          <PhoneFrame statusBarTheme="light">
            <MobileApp
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              messages={messages}
              cart={cart}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              onResetChat={handleResetChat}
              onAddSuggestion={handleAddSuggestionToCart}
              unloadingService={unloadingService}
              setUnloadingService={setUnloadingService}
              gstin={gstin}
              setGstin={setGstin}
              couponCode={couponCode}
              setCouponCode={setCouponCode}
              demoOrder={demoOrder}
              onPlaceOrder={handlePlaceOrder}
              bill={currentBill}
            />
          </PhoneFrame>
        )}

        {mode === "whatsapp" && (
          <PhoneFrame statusBarTheme="light">
            <WhatsAppChat
              messages={messages}
              cart={cart}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onActionClick={handleWhatsAppActionClick}
              onResetChat={handleResetChat}
              onAddSuggestion={handleAddSuggestionToCart}
            />
          </PhoneFrame>
        )}
      </section>

      {/* 3. Mobile-Only Bottom Mode Switcher Dock (Easy thumb access, keeps mobile screen clean) */}
      <div className="sm:hidden w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-center shrink-0 z-40 shadow-xs">
        <ModeToggle
          mode={mode}
          onModeChange={setMode}
          cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        />
      </div>

      {/* 4. Minimal Footer (Single line, 28px tall max, inside page layout) */}
      <footer className="w-full h-7 shrink-0 bg-white border-t border-slate-200 px-4 flex items-center justify-center text-[11px] text-slate-500 select-none">
        <p className="flex items-center justify-center flex-wrap gap-1 font-medium truncate">
          <span>Built by</span>
          <a
            href="https://linkedin.com/in/thalathotysujith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-homerun-green hover:underline inline-flex items-center gap-0.5"
          >
            Sujith Thalathoty <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
          <span>|</span>
          <span className="text-slate-700">AI Product Demo for HomeRun</span>
          <span className="text-slate-400 font-normal hidden md:inline">
            (Bangalore Quick Commerce)
          </span>
        </p>
      </footer>
    </main>
  );
}
