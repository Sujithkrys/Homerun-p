"use client";

import React, { useState } from "react";
import { CartItem, BillDetails as BillDetailsType } from "@/lib/types";
import BillDetails from "./BillDetails";
import {
  X,
  Trash2,
  Plus,
  Minus,
  Truck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  Receipt,
  MapPin,
} from "lucide-react";
import confetti from "canvas-confetti";

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, newQty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: () => void;
  onNavigateToEstimator?: () => void;
  variant?: "mobile-bottom-sheet" | "web-sidebar";
  unloadingService: boolean;
  setUnloadingService: (value: boolean | ((prev: boolean) => boolean)) => void;
  gstin: string;
  setGstin: (val: string) => void;
  couponCode: string;
  setCouponCode: (val: string) => void;
  bill: BillDetailsType;
}

export default function CartSheet({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPlaceOrder,
  onNavigateToEstimator,
  variant = "mobile-bottom-sheet",
  unloadingService,
  setUnloadingService,
  gstin,
  setGstin,
  couponCode,
  setCouponCode,
  bill,
}: CartSheetProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {}

    onPlaceOrder();
  };

  if (!isOpen) return null;

  const isMobile = variant === "mobile-bottom-sheet";
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Drawer Container: bottom-sheet for mobile, right-sidebar for web */}
      <div
        className={`relative z-10 bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${
          isMobile
            ? "w-full h-[88%] mt-auto rounded-t-3xl border-t border-slate-200 animate-slide-up"
            : "w-full max-w-md h-full border-l border-slate-200"
        }`}
      >
        {/* Mobile Drag Handle */}
        {isMobile && (
          <div className="w-full flex justify-center pt-2.5 pb-1">
            <div className="w-12 h-1.5 rounded-full bg-slate-300 select-none" />
          </div>
        )}

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Your Cart</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {totalItemCount} {totalItemCount === 1 ? "item" : "items"} ready for dispatch
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-3 select-none">
                🛒
              </div>
              <h4 className="font-bold text-base text-slate-800">Your cart is empty</h4>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Start by asking our AI estimator for a material estimate or add items from popular categories!
              </p>
              {onNavigateToEstimator && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToEstimator();
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-homerun-green text-white text-xs font-bold shadow-md hover:bg-emerald-800 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-homerun-yellow" />
                  <span>Go to AI Estimator</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Delivery Guarantee Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2 text-xs text-emerald-900 font-medium">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  ⚡ Guaranteed <strong>60-minute site delivery</strong> across Bangalore
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {cart.map((item) => {
                  const cashback = Math.round(
                    item.total * (bill.subtotal >= 50000 ? 0.02 : 0.01)
                  );
                  return (
                    <div
                      key={item.product_id}
                      className="rounded-xl border border-slate-200/90 p-3 bg-white shadow-2xs space-y-2"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h5 className="font-bold text-xs text-slate-900 line-clamp-1">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            ₹{item.unit_price} per {item.unit}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs text-slate-900">
                            ₹{item.total.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Controls and Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        {/* Qty Stepper */}
                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product_id, item.quantity - 1)
                            }
                            className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-slate-800 font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="p-1 px-2 text-slate-600 hover:bg-slate-200 transition-colors"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Cashback & Bulk Link */}
                        <div className="flex items-center gap-2 text-[10.5px]">
                          <span className="text-emerald-700 font-medium">
                            💰 ₹{cashback} cashback
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              showToast("💡 Order 10+ bags for wholesale bulk rate discount!")
                            }
                            className="text-blue-600 hover:underline hidden sm:inline"
                          >
                            Bulk rates
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product_id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unloading Service Toggle */}
              <div className="rounded-xl border border-slate-200/90 p-3 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📦</span>
                    <span className="font-bold text-xs text-slate-800">
                      Site Unloading Service
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                      +₹199
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Our crew unloads and stacks materials at your job site
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

              {/* GSTIN Input */}
              <div className="rounded-xl border border-slate-200/90 p-3 bg-white space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-slate-500" />
                  <span>GSTIN for Tax Invoice (Optional)</span>
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 29ABCDE1234F1Z5"
                  maxLength={15}
                  className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-homerun-green uppercase"
                />
              </div>

              {/* Savings Corner (Coupon Code) */}
              <div className="rounded-xl border border-slate-200/90 p-3 bg-white space-y-2">
                <label className="block text-xs font-bold text-slate-800 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500" />
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
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              </div>

              {/* Bill Details */}
              <BillDetails bill={bill} unloadingService={unloadingService} />

              {/* Delivery Address */}
              <div className="rounded-xl border border-slate-200/90 p-3 bg-slate-50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block text-[11.5px]">
                      Delivery Destination
                    </span>
                    <span className="text-[11px] text-slate-600">
                      Bangalore, Karnataka (Demo Site Address)
                    </span>
                  </div>
                </div>
                <span className="text-[10.5px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                  Active
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer with Place Order Button */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 bg-white shrink-0 shadow-lg">
            <button
              type="button"
              onClick={handlePlaceOrderClick}
              className="w-full py-3 px-4 rounded-xl bg-homerun-green hover:bg-emerald-800 active:scale-98 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <span>🛒</span>
                <span>Place Order</span>
              </div>
              <div className="flex items-center gap-1">
                <span>₹{bill.total.toLocaleString("en-IN")}</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-1.5">
              Instant site confirmation • Pay on delivery available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
