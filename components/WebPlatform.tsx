"use client";

import React, { useState } from "react";
import {
  Message,
  CartItem,
  Suggestion,
  AppScreen,
  DemoOrder,
  BillDetails as BillDetailsType,
} from "@/lib/types";
import TopNavBar from "./TopNavBar";
import HomeScreen from "./screens/HomeScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import OrdersScreen from "./screens/OrdersScreen";
import AccountScreen from "./screens/AccountScreen";
import AIEstimatorScreen from "./screens/AIEstimatorScreen";
import CartSheet from "./CartSheet";
import BillDetails from "./BillDetails";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Truck,
  ArrowRight,
  Sparkles,
  Receipt,
  Tag,
  MapPin,
  RefreshCw,
} from "lucide-react";
import confetti from "canvas-confetti";
import { HomeRunThunder } from "./HomeRunLogo";

interface WebPlatformProps {
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

export default function WebPlatform({
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
}: WebPlatformProps) {
  const [isSidebarCartOpen, setIsSidebarCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    showToast("⚠️ Invalid coupon code (Demo promo)");
  };

  const handlePlaceOrderClick = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {}

    onPlaceOrder();
  };

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
    <div className="w-full h-full max-h-full bg-slate-100/70 flex flex-col rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Persistent Top Navigation Bar */}
      <TopNavBar
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        cartCount={cartCount}
        onOpenCart={() => setIsSidebarCartOpen(true)}
      />

      {/* Main Screen Content */}
      <div className="flex-1 flex overflow-hidden">
        {currentScreen === "home" && (
          <HomeScreen
            onNavigateToEstimator={handleNavigateToEstimatorWithPrompt}
            onNavigateToCategories={() => onNavigate("categories")}
            onSelectCategory={handleSelectCategory}
            variant="web"
            cartCount={cartCount}
            onOpenCart={() => setIsSidebarCartOpen(true)}
          />
        )}

        {currentScreen === "categories" && (
          <CategoriesScreen
            onBack={() => onNavigate("home")}
            onSelectCategory={handleSelectCategory}
            variant="web"
            cartCount={cartCount}
            onOpenCart={() => setIsSidebarCartOpen(true)}
          />
        )}

        {currentScreen === "orders" && (
          <OrdersScreen
            onBack={() => onNavigate("home")}
            onNavigateToHome={() => onNavigate("home")}
            onNavigateToEstimator={() => onNavigate("ai-estimator")}
            demoOrder={demoOrder}
            variant="web"
            cartCount={cartCount}
            onOpenCart={() => setIsSidebarCartOpen(true)}
          />
        )}

        {currentScreen === "account" && (
          <AccountScreen
            onBack={() => onNavigate("home")}
            onNavigateToOrders={() => onNavigate("orders")}
            variant="web"
            cartCount={cartCount}
            onOpenCart={() => setIsSidebarCartOpen(true)}
          />
        )}

        {/* AI Estimator Screen: Desktop 2-Panel Layout (Chat Left ~62%, Enhanced Cart Right ~38%) */}
        {currentScreen === "ai-estimator" && (
          <div className="w-full flex h-full max-h-full overflow-hidden bg-white">
            {/* Left Panel: Chat Interface */}
            <div className="flex-1 flex flex-col h-full border-r border-slate-200/80 bg-slate-50/50">
              <div className="p-3.5 px-5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-homerun-green text-white flex items-center justify-center font-bold shadow-xs">
                    <HomeRunThunder className="w-4 h-4 text-homerun-yellow" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 leading-tight font-display">
                      AI Material Estimator
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-medium">
                      60-Minute Site Delivery in Bangalore
                    </span>
                  </div>
                </div>

                {onResetChat && (
                  <button
                    type="button"
                    onClick={onResetChat}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                    title="Reset Chat"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                <AIEstimatorScreen
                  messages={messages}
                  cart={cart}
                  isLoading={isLoading}
                  onSendMessage={onSendMessage}
                  onAddSuggestion={onAddSuggestion}
                  onAddToCart={onAddToCart}
                  onAddAllToCart={onAddAllToCart}
                  onOpenCart={() => setIsSidebarCartOpen(true)}
                  onResetChat={onResetChat}
                  variant="web"
                />
              </div>
            </div>

            {/* Right Panel: Embedded Live Enhanced Cart */}
            <div className="w-[380px] lg:w-[420px] h-full flex flex-col bg-white overflow-hidden shrink-0">
              {/* Header */}
              <div className="p-3.5 px-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-homerun-green" />
                  <h4 className="font-bold text-sm text-slate-900">
                    Live Bill of Materials ({cartCount})
                  </h4>
                </div>
                {cart.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearCart}
                    className="text-[11px] text-slate-400 hover:text-red-500 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center text-slate-400">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-3">
                      🛒
                    </div>
                    <p className="font-bold text-sm text-slate-700">Your cart is empty</p>
                    <p className="text-xs text-slate-500 max-w-[240px] mt-1">
                      Ask the AI estimator on the left for room materials, cements, or adhesives!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Delivery notice */}
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-xs text-emerald-900 font-medium">
                      <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>⚡ Bangalore dispatch in 60 minutes</span>
                    </div>

                    {/* Item list */}
                    <div className="space-y-2.5">
                      {cart.map((item) => {
                        const cashback = Math.round(
                          item.total * (bill.subtotal >= 50000 ? 0.02 : 0.01)
                        );
                        return (
                          <div
                            key={item.product_id}
                            className="rounded-xl border border-slate-200/80 p-3 bg-white shadow-2xs space-y-2"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                                  {item.name}
                                </h5>
                                <p className="text-[11px] text-slate-500">
                                  ₹{item.unit_price} per {item.unit}
                                </p>
                              </div>
                              <span className="font-bold text-xs text-slate-900">
                                ₹{item.total.toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                              {/* Stepper */}
                              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.product_id, item.quantity - 1)
                                  }
                                  className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-2 font-bold text-xs font-mono">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdateQuantity(item.product_id, item.quantity + 1)
                                  }
                                  className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <span className="text-[10.5px] text-emerald-700 font-medium">
                                💰 ₹{cashback} cashback
                              </span>

                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.product_id)}
                                className="text-slate-400 hover:text-red-500 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Unloading toggle */}
                    <div className="rounded-xl border border-slate-200/80 p-3 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">📦</span>
                          <span className="font-bold text-xs text-slate-800">
                            Unloading Service (+₹199)
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-500 mt-0.5">
                          Labor crew unloads materials directly at site
                        </p>
                      </div>

                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={unloadingService}
                          onChange={(e) => setUnloadingService(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-homerun-green"></div>
                      </label>
                    </div>

                    {/* GSTIN */}
                    <div className="rounded-xl border border-slate-200/80 p-3 bg-white space-y-1">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Receipt className="w-3.5 h-3.5 text-slate-400" />
                        <span>GSTIN for Tax Invoice (Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 29ABCDE1234F1Z5"
                        maxLength={15}
                        className="w-full text-xs font-mono px-3 py-1.5 rounded-lg border border-slate-200 uppercase focus:outline-hidden focus:border-homerun-green"
                      />
                    </div>

                    {/* Coupon */}
                    <div className="rounded-xl border border-slate-200/80 p-3 bg-white space-y-1.5">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-slate-400" />
                        <span>Savings Corner</span>
                      </label>
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code"
                          className="flex-1 text-xs font-mono uppercase px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-homerun-green"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                        >
                          Apply
                        </button>
                      </form>
                    </div>

                    {/* Bill breakdown */}
                    <BillDetails bill={bill} unloadingService={unloadingService} />
                  </>
                )}
              </div>

              {/* Place Order CTA */}
              {cart.length > 0 && (
                <div className="p-3.5 border-t border-slate-200 bg-white shrink-0 shadow-lg">
                  <button
                    type="button"
                    onClick={handlePlaceOrderClick}
                    className="w-full py-3 px-4 rounded-xl bg-homerun-green hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>🛒 Place Order</span>
                    <div className="flex items-center gap-1">
                      <span>₹{bill.total.toLocaleString("en-IN")}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </button>
                  <p className="text-center text-[10.5px] text-slate-400 mt-1">
                    Free cancellation before dispatch • 60-min delivery
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Slide-in Cart Sidebar (Used when opening Cart from Home, Categories, Orders, or Account screens on Web) */}
      <CartSheet
        isOpen={isSidebarCartOpen}
        onClose={() => setIsSidebarCartOpen(false)}
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveItem={onRemoveItem}
        onClearCart={onClearCart}
        onPlaceOrder={() => {
          setIsSidebarCartOpen(false);
          onPlaceOrder();
        }}
        onNavigateToEstimator={() => {
          setIsSidebarCartOpen(false);
          onNavigate("ai-estimator");
        }}
        variant="web-sidebar"
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
