"use client";

import React, { useState } from "react";
import { Message, CartItem, Suggestion, AppScreen, DemoOrder, BillDetails as BillDetailsType } from "@/lib/types";
import HomeScreen from "./screens/HomeScreen";
import AIEstimatorScreen from "./screens/AIEstimatorScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import OrdersScreen from "./screens/OrdersScreen";
import AccountScreen from "./screens/AccountScreen";
import BottomNavBar from "./BottomNavBar";
import CartSheet from "./CartSheet";

interface MobileAppProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  messages: Message[];
  cart: CartItem[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onResetChat?: () => void;
  onAddSuggestion: (suggestion: Suggestion) => void;
  onAddToCart?: (product: CartItem) => void;
  onAddAllToCart?: (products: CartItem[]) => void;
  unloadingService: boolean;
  setUnloadingService: (value: boolean | ((prev: boolean) => boolean)) => void;
  gstin: string;
  setGstin: (val: string) => void;
  couponCode: string;
  setCouponCode: (val: string) => void;
  demoOrder: DemoOrder | null;
  onPlaceOrder: () => void;
  bill: BillDetailsType;
}

export default function MobileApp({
  currentScreen,
  onNavigate,
  messages,
  cart,
  isLoading,
  onSendMessage,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onResetChat,
  onAddSuggestion,
  onAddToCart,
  onAddAllToCart,
  unloadingService,
  setUnloadingService,
  gstin,
  setGstin,
  couponCode,
  setCouponCode,
  demoOrder,
  onPlaceOrder,
  bill,
}: MobileAppProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSelectCategory = (categoryName: string) => {
    onNavigate("ai-estimator");
    setTimeout(() => {
      onSendMessage(`Show me ${categoryName} products with prices`);
    }, 300);
  };

  const handleNavigateToEstimatorWithPrompt = (prompt?: string) => {
    onNavigate("ai-estimator");
    if (prompt) {
      setTimeout(() => {
        onSendMessage(prompt);
      }, 300);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden relative">
      {/* Screen Content */}
      <div className="flex-1 w-full min-h-0 overflow-hidden flex flex-col">
        {currentScreen === "home" && (
          <HomeScreen
            onNavigateToEstimator={handleNavigateToEstimatorWithPrompt}
            onNavigateToCategories={() => onNavigate("categories")}
            onSelectCategory={handleSelectCategory}
            variant="mobile"
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentScreen === "ai-estimator" && (
          <AIEstimatorScreen
            messages={messages}
            cart={cart}
            isLoading={isLoading}
            onSendMessage={onSendMessage}
            onAddSuggestion={onAddSuggestion}
            onAddToCart={onAddToCart}
            onAddAllToCart={onAddAllToCart}
            onBack={() => onNavigate("home")}
            onOpenCart={() => setIsCartOpen(true)}
            onResetChat={onResetChat}
            variant="mobile"
          />
        )}

        {currentScreen === "categories" && (
          <CategoriesScreen
            onBack={() => onNavigate("home")}
            onSelectCategory={handleSelectCategory}
            variant="mobile"
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentScreen === "orders" && (
          <OrdersScreen
            onBack={() => onNavigate("home")}
            onNavigateToHome={() => onNavigate("home")}
            onNavigateToEstimator={() => onNavigate("ai-estimator")}
            demoOrder={demoOrder}
            variant="mobile"
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentScreen === "account" && (
          <AccountScreen
            onBack={() => onNavigate("home")}
            onNavigateToOrders={() => onNavigate("orders")}
            variant="mobile"
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}
      </div>

      {/* Persistent Bottom Navigation Bar */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={onNavigate}
      />

      {/* Cart Bottom Sheet Overlay */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onPlaceOrder={() => {
          setIsCartOpen(false);
          onPlaceOrder();
        }}
        onNavigateToEstimator={() => onNavigate("ai-estimator")}
        variant="mobile-bottom-sheet"
        unloadingService={unloadingService}
        setUnloadingService={setUnloadingService}
        gstin={gstin}
        setGstin={setGstin}
        couponCode={couponCode}
        setCouponCode={setCouponCode}
        bill={bill}
      />
    </div>
  );
}
