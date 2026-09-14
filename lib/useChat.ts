"use client";

import { useState, useEffect, useRef } from "react";
import {
  Message,
  CartItem,
  Suggestion,
  DemoOrder,
  BillDetails as BillDetailsType,
} from "./types";
import { getOrCreateSessionId } from "@/hooks/useSarvamVoice";

export function mergeItemIntoCart(cart: CartItem[], newItem: CartItem): CartItem[] {
  const updated = [...cart];
  const existingIndex = updated.findIndex(
    (item) => item.product_id === newItem.product_id || item.name === newItem.name
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
    updated.push({
      ...newItem,
      product_id: newItem.product_id || `voice-${Date.now()}-${Math.random()}`
    });
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
    // Left blank on purpose: computing the live time here would run once during
    // server rendering and again during client hydration, producing two
    // different strings and a React hydration mismatch. MessageBubble falls
    // back to "Just now" until useChat's mount effect fills in the real time.
    timestamp: "",
  };
}

export function useChat(mode: "web" | "mobile" | "whatsapp" = "web") {
  const [messages, setMessages] = useState<Message[]>([getInitialGreeting(mode)]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const lastVoiceCartCountRef = useRef(0);

  // Language lock: null = auto-detect per message (default, unchanged
  // behavior). Set by the language picker button; also drives the voice
  // agent's spoken language.
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  // True right after the backend asks the user to confirm which language to
  // continue in (their message didn't match the locked language).
  const [awaitingLanguageConfirm, setAwaitingLanguageConfirm] = useState(false);

  // Chat session lifecycle: the assistant should stay interactive (asking
  // "anything else?") after items are added, but the session naturally ends
  // once the user checks out or goes quiet. `sessionEnded` drives the
  // "Start New Chat" UI state in AIEstimatorScreen.
  const [sessionEnded, setSessionEnded] = useState(false);
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SESSION_INACTIVITY_MS = 5 * 60 * 1000;

  const clearInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  };

  // Called whenever the assistant is now waiting on the user (after a reply
  // or a cart addition) — if they go quiet for 5 minutes, close the session.
  const scheduleInactivityClose = () => {
    clearInactivityTimer();
    inactivityTimerRef.current = setTimeout(() => {
      setSessionEnded(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-session-end-${Date.now()}`,
          role: "assistant",
          content:
            "It looks like you've stepped away, so I've closed this chat session. No worries — tap **Start New Chat** anytime you need materials delivered in 60 minutes!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, SESSION_INACTIVITY_MS);
  };

  // Any fresh activity from the user resumes a session that had ended.
  const resumeSession = () => {
    clearInactivityTimer();
    setSessionEnded(false);
  };

  useEffect(() => {
    return () => clearInactivityTimer();
  }, []);

  // Fill in the greeting's live timestamp only after mount (client-side), so
  // the server-rendered and hydrated HTML match on first paint.
  useEffect(() => {
    const liveTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages((prev) =>
      prev.length === 1 && prev[0].id.startsWith(`init-${mode}`) && !prev[0].timestamp
        ? [{ ...prev[0], timestamp: liveTime }]
        : prev
    );
  }, [mode]);

  // Sync cart from Vercel KV
  const syncCart = async () => {
    try {
      const sessionId = getOrCreateSessionId(mode);
      if (sessionId) {
        const res = await fetch("/api/cart/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.cart) {
            setCart(data.cart);
          }
        }
      }
    } catch (err) {
      console.error("Failed to sync cart:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      await syncCart();
      if (isMounted) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    poll();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

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

    // The user is engaging again — cancel any pending auto-close and reopen
    // a session that may have ended while they were away.
    resumeSession();

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
        scheduleInactivityClose();
        return removeReply;
      }
    }

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // While waiting on the user to confirm a language switch, send this one
    // message unlocked so the backend can freely detect whatever language
    // they actually replied in.
    const wasAwaitingConfirm = awaitingLanguageConfirm;
    const lockedLanguageToSend = wasAwaitingConfirm ? null : selectedLanguage;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: [...messages, userMessage],
          locked_language: lockedLanguageToSend,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // The model occasionally skips its trailing ---JSON_START--- metadata
      // block on short replies, which would otherwise silently drop
      // detected_language along with everything else in it. The server
      // already knows the language it used for this turn regardless, so it
      // echoes it here — trust this over the (possibly-missing) JSON field.
      const headerDetectedLanguage = response.headers.get("X-Detected-Language");

      if (!response.body) throw new Error("No readable stream");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let textBuffer = "";
      let isJsonMode = false;
      let jsonBuffer = "";
      let currentText = "";

      const assistantMessageId = `asst-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: "assistant",
          content: "",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
      ]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          
          if (!isJsonMode) {
            textBuffer += chunk;
            const splitIdx = textBuffer.indexOf("---JSON_START---");
            if (splitIdx !== -1) {
              isJsonMode = true;
              currentText += textBuffer.slice(0, splitIdx);
              jsonBuffer = textBuffer.slice(splitIdx + "---JSON_START---".length);
              
              setMessages((prev) => prev.map((msg) => 
                msg.id === assistantMessageId ? { ...msg, content: currentText } : msg
              ));
            } else {
              // Safe append: hold back 16 chars in case they are part of "---JSON_START---"
              if (textBuffer.length > 16) {
                const safeText = textBuffer.slice(0, textBuffer.length - 16);
                currentText += safeText;
                textBuffer = textBuffer.slice(textBuffer.length - 16);
                
                setMessages((prev) => prev.map((msg) => 
                  msg.id === assistantMessageId ? { ...msg, content: currentText } : msg
                ));
              }
            }
          } else {
            jsonBuffer += chunk;
          }
        }
      }

      if (!isJsonMode && textBuffer.length > 0) {
        currentText += textBuffer;
        setMessages((prev) => prev.map((msg) => 
          msg.id === assistantMessageId ? { ...msg, content: currentText } : msg
        ));
      }

      let data: any = {};
      if (isJsonMode && jsonBuffer.trim().length > 0) {
        try {
          data = JSON.parse(jsonBuffer);
        } catch (jsonErr) {
          console.error("Failed to parse final JSON block:", jsonErr);
        }
      }

      if (data.language_mismatch) {
        setAwaitingLanguageConfirm(true);
      } else if (wasAwaitingConfirm) {
        setSelectedLanguage(headerDetectedLanguage || data.detected_language || null);
        setAwaitingLanguageConfirm(false);
      }

      if (data.cart_items && data.cart_items.length > 0) {
        setCart((prevCart) => {
          let updated = [...prevCart];
          data.cart_items.forEach((newItem: CartItem) => {
            updated = mergeItemIntoCart(updated, newItem);
          });
          return updated;
        });
        // Without this, the item only ever existed in local React state —
        // the next background cart sync (every 3s) would silently wipe it
        // back out, leaving the cart empty even though the AI's message
        // said it was added.
        persistCartItems(data.cart_items);
      }

      // Update the final assistant message with all metadata
      setMessages((prev) => prev.map((msg) => {
        if (msg.id === assistantMessageId) {
          return {
            ...msg,
            recommended_products: data.recommended_products || [],
            cart_items: data.cart_items || [],
            estimation_summary: data.estimation_summary || null,
            project_estimate: data.project_estimate || null,
            suggestions: data.suggestions || [],
            language_mismatch: data.language_mismatch || false,
          };
        }
        return msg;
      }));

      // A distinct, guaranteed "anything else?" follow-up — separate from
      // whatever the AI itself phrased inline — right when items land in
      // the cart, so the conversation visibly stays open.
      if (data.cart_items && data.cart_items.length > 0) {
        pushAddedToCartMessage(data.cart_items);
      } else {
        scheduleInactivityClose();
      }
      // Since it's async and state updates might lag, we can just return what we have (not used by much)
      return { id: assistantMessageId, role: "assistant", content: currentText };
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
      scheduleInactivityClose();
      return errorMessage;
    } finally {
      setIsLoading(false);
    }
  };

  // Persists items to the server-side (Redis) cart so the background
  // syncCart poll (every 3s) doesn't clobber an optimistic local update with
  // a stale server cart that never learned about them.
  const persistCartItems = async (items: CartItem[]) => {
    const sessionId = getOrCreateSessionId(mode);
    if (!sessionId) return;
    for (const item of items) {
      await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, item }),
      });
    }
    syncCart();
  };

  // Appends a deterministic assistant confirmation whenever items are added
  // to the cart from a UI button (quantity stepper, "Add All", suggestion
  // chip) rather than through the chat API — those flows never otherwise
  // produce a chat message, so the conversation would go silent right when
  // the user needs a prompt to keep going or check out.
  const pushAddedToCartMessage = (items: CartItem[]) => {
    if (items.length === 0) return;
    resumeSession();
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const content =
      items.length === 1
        ? `✅ Added **${items[0].name}** (${items[0].quantity} ${items[0].unit}) to your cart! Would you like anything else, or are you ready to checkout?`
        : `✅ Added ${items.length} items to your cart! Would you like anything else, or are you ready to checkout?`;
    setMessages((prev) => [
      ...prev,
      {
        id: `asst-cart-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: currentTime,
      },
    ]);
    scheduleInactivityClose();
  };

  // Add cross-sell suggestion directly to cart
  const handleAddSuggestionToCart = (suggestion: Suggestion) => {
    const newItem = suggestionToCartItem(suggestion);
    addToCart(newItem);
  };

  // Update item quantity
  const handleUpdateQuantity = async (productId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    // Optimistic update
    setCart((prev) =>
      prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: newQty, total: newQty * item.unit_price }
          : item
      )
    );

    const sessionId = getOrCreateSessionId(mode);
    if (sessionId) {
      await fetch("/api/cart/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, product_id: productId, quantity: newQty }),
      });
      syncCart();
    }
  };

  // Remove single item
  const handleRemoveItem = async (productId: string) => {
    // Optimistic update
    setCart((prev) => prev.filter((item) => item.product_id !== productId));
    
    const sessionId = getOrCreateSessionId(mode);
    if (sessionId) {
      await fetch("/api/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, product_id: productId }),
      });
      syncCart();
    }
  };

  // Clear all items
  const handleClearCart = () => {
    setCart([]);
    // Optionally clear it on the server if needed
  };

  // Reset conversation to mode's clean greeting
  const handleResetChat = () => {
    setMessages([getInitialGreeting(mode)]);
    setSelectedLanguage(null);
    setAwaitingLanguageConfirm(false);
    clearInactivityTimer();
    setSessionEnded(false);
  };

  // Explicit pick from the language button's menu — always resolves any
  // pending confirmation immediately.
  const handleSelectLanguage = (language: string | null) => {
    setSelectedLanguage(language);
    setAwaitingLanguageConfirm(false);
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

    // The user completed the purchase without needing to reply again —
    // that's a natural end to the session, so close it rather than leaving
    // it waiting on a reply that will never come.
    clearInactivityTimer();
    setSessionEnded(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `asst-order-placed-${Date.now()}`,
        role: "assistant",
        content: `🎉 Order placed! Your materials are on the way — this chat session is now complete. Start a new chat anytime for your next order.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    if (onSuccess) onSuccess();
  };

  // Add single product directly to cart
  const addToCart = async (product: CartItem) => {
    // Optimistic update
    setCart((prevCart) => mergeItemIntoCart(prevCart, product));
    pushAddedToCartMessage([product]);
    await persistCartItems([product]);
  };

  // Add multiple products directly to cart
  const addAllToCart = async (products: CartItem[]) => {
    // Optimistic update
    setCart((prevCart) => {
      let updated = [...prevCart];
      products.forEach((p) => {
        updated = mergeItemIntoCart(updated, p);
      });
      return updated;
    });
    pushAddedToCartMessage(products);
    await persistCartItems(products);
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
    sessionEnded,
    selectedLanguage,
    awaitingLanguageConfirm,
    handleSelectLanguage,
    selectLanguage: handleSelectLanguage, // alias
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
