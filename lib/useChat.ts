"use client";

import { useState } from "react";
import {
  Message,
  CartItem,
  Suggestion,
  DemoOrder,
  BillDetails as BillDetailsType,
} from "./types";

export function mergeItemIntoCart(cart: CartItem[], newItem: CartItem): CartItem[] {
  const updated = [...cart];
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
}

export function suggestionToCartItem(suggestion: Suggestion): CartItem {
  return {
    product_id: suggestion.product_id,
    name: suggestion.name,
    quantity: suggestion.estimated_qty,
    unit: suggestion.unit,
    unit_price: suggestion.unit_price,
    total: suggestion.estimated_qty * suggestion.unit_price,
    reason: suggestion.reason,
  };
}

export function getInitialGreeting(mode: "web" | "mobile" | "whatsapp" = "web"): Message {
  const isWhatsApp = mode === "whatsapp";
  return {
    id: `init-${mode}-${Date.now()}`,
    role: "assistant",
    content: isWhatsApp
      ? "👋 Welcome to HomeRun!\nBangalore's fastest construction material delivery — 60 mins to your site.\n\nHow can I help you today?"
      : "Hello! I am your **HomeRun Construction Assistant**.\n\nNeed cement, adhesives, paints, or electrical wiring delivered directly to your site in Bangalore? I can calculate estimations or dispatch materials to your doorstep in **60 minutes**.\n\nWhat can I get for you today?",
    timestamp: "10:30 AM",
  };
}

export function useChat(mode: "web" | "mobile" | "whatsapp" = "web") {
  const [messages, setMessages] = useState<Message[]>([getInitialGreeting(mode)]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Platform Cart Enhancements State
  const [unloadingService, setUnloadingService] = useState(false);
  const [gstin, setGstin] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [demoOrder, setDemoOrder] = useState<DemoOrder | null>(null);

  // Calculate live bill details
  const rawSubtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const subtotalWithUnloading = unloadingService ? rawSubtotal + 199 : rawSubtotal;
  const deliveryCharge = rawSubtotal === 0 ? 0 : rawSubtotal >= 500 ? 0 : 49;
  const bill: BillDetailsType = {
    subtotal: subtotalWithUnloading,
    discount: 0,
    walletApplied: 0,
    deliveryCharge,
    handlingCharge: 0,
    total: subtotalWithUnloading + deliveryCharge,
  };

  // Send message and trigger API
  const handleSendMessage = async (userText: string): Promise<Message | null> => {
    if (!userText.trim() || isLoading) return null;

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

    // Check if user typed "remove [item]" or "delete [item]"
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
        const removeReply: Message = {
          id: `asst-${Date.now()}`,
          role: "assistant",
          content:
            mode === "whatsapp"
              ? `Removed *${existingItem.name}* from your cart.`
              : `Removed **${existingItem.name}** from your cart.`,
          timestamp: currentTime,
        };
        setMessages((prev) => [...prev, userMessage, removeReply]);
        return removeReply;
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

      let data: any = {};
      try {
        data = await response.json();
      } catch (jsonErr) {
        console.error("Failed to parse JSON response:", jsonErr);
      }

      // Add to Cart State: Merge new items
      if (data.cart_items && data.cart_items.length > 0) {
        setCart((prevCart) => {
          let updated = [...prevCart];
          data.cart_items.forEach((newItem: CartItem) => {
            updated = mergeItemIntoCart(updated, newItem);
          });
          return updated;
        });
      }

      // Append assistant response
      const assistantMessage: Message = {
        id: `asst-${Date.now()}`,
        role: "assistant",
        content: data.message || "Sorry, I couldn't process that. Please try again.",
        recommended_products: data.recommended_products || [],
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
      return assistantMessage;
    } catch (err) {
      console.error("Chat fetch error:", err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content:
          "⚠️ Could not connect to the server. Check that the dev server is running (npm run dev) or that the Vercel deployment is active.",
        timestamp: currentTime,
      };
      setMessages((prev) => [...prev, errorMessage]);
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // Add cross-sell suggestion directly to cart
  const handleAddSuggestionToCart = (suggestion: Suggestion) => {
    const newItem = suggestionToCartItem(suggestion);
    setCart((prevCart) => mergeItemIntoCart(prevCart, newItem));
  };

  // Update item quantity
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

  // Reset conversation to mode's clean greeting
  const handleResetChat = () => {
    setMessages([getInitialGreeting(mode)]);
  };

  // Place order
  const handlePlaceOrder = (onSuccess?: () => void) => {
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
    if (onSuccess) onSuccess();
  };

  // Add single product directly to cart
  const addToCart = (product: CartItem) => {
    setCart((prevCart) => mergeItemIntoCart(prevCart, product));
  };

  // Add multiple products directly to cart
  const addAllToCart = (products: CartItem[]) => {
    setCart((prevCart) => {
      let updated = [...prevCart];
      products.forEach((p) => {
        updated = mergeItemIntoCart(updated, p);
      });
      return updated;
    });
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
            "Sure! What else do you need for your site today?\n\n• *Tile Spacers (3mm)* — ₹60/pack\n• *Roff Rainbow Grout (1kg)* — ₹160/pack\n• *Birla White Wall Putty (40kg)* — ₹890/bag\n• *Finolex FR 2.5 sqmm Wire* — ₹2,850/roll\n\nJust type the quantity or click a quick prompt below!",
          timestamp: currentTime,
        },
      ]);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    messages,
    setMessages,
    cart,
    setCart,
    cartItems: cart, // alias
    setCartItems: setCart, // alias
    isLoading,
    setIsLoading,
    unloadingService,
    setUnloadingService,
    gstin,
    setGstin,
    couponCode,
    setCouponCode,
    demoOrder,
    setDemoOrder,
    bill,
    totalCartCount,
    handleSendMessage,
    sendMessage: handleSendMessage, // alias
    handleAddSuggestionToCart,
    addSuggestion: handleAddSuggestionToCart, // alias
    handleUpdateQuantity,
    updateQuantity: handleUpdateQuantity, // alias
    handleRemoveItem,
    removeItem: handleRemoveItem, // alias
    handleClearCart,
    clearCart: handleClearCart, // alias
    handleResetChat,
    resetChat: handleResetChat, // alias
    handlePlaceOrder,
    placeOrder: handlePlaceOrder, // alias
    handleWhatsAppActionClick,
    addToCart,
    addAllToCart,
  };
}
