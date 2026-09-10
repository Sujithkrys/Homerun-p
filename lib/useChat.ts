"use client";

import { useState } from "react";
import { Message, CartItem, ChatResponse, Suggestion } from "./types";

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

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addSuggestionToCart = (suggestion: Suggestion) => {
    const item = suggestionToCartItem(suggestion);
    setCartItems((prev) => mergeItemIntoCart(prev, item));
  };

  const addItemToCart = (item: CartItem) => {
    setCartItems((prev) => mergeItemIntoCart(prev, item));
  };

  const updateQuantity = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((it) => it.product_id !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((it) =>
        it.product_id === productId
          ? { ...it, quantity: newQty, total: newQty * it.unit_price }
          : it
      )
    );
  };

  const clearCart = () => setCartItems([]);

  return {
    messages,
    setMessages,
    cartItems,
    setCartItems,
    isLoading,
    setIsLoading,
    addSuggestionToCart,
    addItemToCart,
    updateQuantity,
    clearCart,
  };
}
