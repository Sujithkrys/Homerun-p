"use client";

import React, { useState } from "react";
import { CartItem } from "@/lib/types";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Gift,
  ArrowRight,
  X,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CartSidebarProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export default function CartSidebar({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}: CartSidebarProps) {
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Totals calculations
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= 500 ? 0 : 150;
  const grandTotal = subtotal + deliveryFee;

  // Cashback note for orders > ₹50,000
  const qualifiesForCashback = subtotal >= 50000;
  const cashbackAmount = qualifiesForCashback ? Math.round(subtotal * 0.05) : 0;

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setIsOrderPlaced(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1a7a3a", "#f5c518", "#0d4a22"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsOrderPlaced(false);
    }, 4500);
  };

  return (
    <div
      className={`flex flex-col h-full bg-white border-l border-slate-200 shadow-xs ${
        isMobileDrawer ? "p-4" : "p-5"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-homerun-green/10 flex items-center justify-center text-homerun-green">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Your Cart
              {totalItemsCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-homerun-yellow text-slate-900 rounded-full">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"}
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Bangalore Quick Dispatch
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1"
              title="Empty Cart"
            >
              Clear
            </button>
          )}

          {isMobileDrawer && onCloseMobileDrawer && (
            <button
              type="button"
              onClick={onCloseMobileDrawer}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4 py-8">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <p className="text-sm font-semibold text-slate-700">Your cart is empty</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Ask the assistant for cement, adhesives, paints, or project estimations to add materials.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.product_id}
              className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 leading-snug truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ₹{item.unit_price} per {item.unit}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.product_id)}
                  className="text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quantity Stepper & Line Total */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 text-xs transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-slate-800 min-w-[20px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="w-5 h-5 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 text-xs transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">
                    ₹{item.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bill Details & Checkout */}
      {cart.length > 0 && (
        <div className="pt-3 border-t border-slate-200 space-y-3">
          {/* Cashback Note */}
          {qualifiesForCashback ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                🎉 <strong>5% Cashback (₹{cashbackAmount.toLocaleString("en-IN")})</strong> will be credited on this bulk order!
              </span>
            </div>
          ) : (
            <div className="px-2 py-1 text-[11px] text-slate-500 flex items-center gap-1.5">
              <Gift className="w-3 h-3 text-slate-400" />
              <span>Orders above ₹50,000 get 5% instant cashback</span>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-semibold text-slate-800">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                Delivery Partner Fee
                {subtotal >= 500 && (
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100/70 px-1.5 py-0.2 rounded">
                    FREE
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-800">
                {deliveryFee === 0 ? (
                  <span className="text-emerald-700">₹0</span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>
            <div className="pt-1.5 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
              <span>Grand Total</span>
              <span className="text-base font-black text-homerun-green-dark">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* Delivery Promise Badge */}
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-emerald-800 text-[11.5px] font-medium">
            <Zap className="w-4 h-4 text-homerun-yellow fill-homerun-yellow shrink-0" />
            <span>
              <strong>⚡ Delivered in 60 minutes</strong> directly to your site in Bangalore
            </span>
          </div>

          {/* Place Order Button */}
          <button
            type="button"
            onClick={handlePlaceOrder}
            className="w-full py-3 px-4 rounded-xl bg-homerun-green hover:bg-homerun-green-hover text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Place Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Order Placed Notification Toast */}
          {isOrderPlaced && (
            <div className="p-3 bg-emerald-900 text-white rounded-xl text-xs flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-homerun-yellow shrink-0" />
              <div>
                <p className="font-bold">Order Received! (Mock Demo)</p>
                <p className="text-[11px] text-emerald-200">
                  HomeRun fleet dispatched. Delivery within 60 mins.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[10.5px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>100% Genuine Materials • Secure Billing</span>
          </div>
        </div>
      )}
    </div>
  );
}
