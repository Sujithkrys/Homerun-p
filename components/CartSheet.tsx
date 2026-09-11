"use client";

import React, { useState } from "react";
import { CartItem, BillDetails as BillDetailsType } from "@/lib/types";
import {
  ArrowLeft,
  Trash2,
  Clock,
  Truck,
  FileText,
  Tag,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ShoppingBag,
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
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isGstinOpen, setIsGstinOpen] = useState(Boolean(gstin));
  const [isBillOpen, setIsBillOpen] = useState(true);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [addressSet, setAddressSet] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError("Invalid coupon code");
    setTimeout(() => setCouponError(null), 3000);
  };

  const handlePlaceOrderClick = () => {
    if (!addressSet) {
      setAddressSet(true);
      showToast("📍 Delivery address confirmed: Bangalore Hub");
      return;
    }

    try {
      confetti({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}

    onPlaceOrder();
  };

  if (!isOpen) return null;

  const isMobile = variant === "mobile-bottom-sheet";
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCashback = Math.round(
    bill.subtotal * (bill.subtotal >= 50000 ? 0.02 : 0.01)
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-2xs transition-opacity duration-300"
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-60 bg-[#1a1a1a] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Sheet Container: Full-height bottom-sheet (~92%) for mobile, right sidebar (400px) for web */}
      <div
        className={`relative z-10 bg-[#f8f9fa] flex flex-col shadow-2xl transition-transform duration-300 ease-out overflow-hidden ${
          isMobile
            ? "w-full h-[92%] mt-auto rounded-t-3xl border-t border-[#e5e5e5]"
            : "w-full max-w-[420px] h-full border-l border-[#e5e5e5]"
        }`}
      >
        {/* Header Bar */}
        <div className="bg-white px-4 py-3 border-b border-[#eeeeee] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1 -ml-1 text-[#1a1a1a] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h3 className="font-extrabold text-base text-[#1a1a1a] font-display">
              Your Cart
            </h3>
          </div>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs font-bold text-[#e53935] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
          {cart.length === 0 ? (
            /* Empty Cart View */
            <div className="flex flex-col items-center justify-center h-full py-20 text-center px-4">
              <div className="w-16 h-16 rounded-full bg-[#f0f0f0] flex items-center justify-center text-3xl mb-3 text-[#9ca3af]">
                🛒
              </div>
              <h4 className="font-black text-base text-[#1a1a1a] font-display">
                Your cart is empty
              </h4>
              <p className="text-xs text-[#777777] max-w-xs mt-1">
                Start by estimating materials with our AI assistant or browse categories!
              </p>
              {onNavigateToEstimator && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToEstimator();
                  }}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-[#1a7a3a] text-white text-xs font-extrabold shadow-sm hover:bg-[#145f2d] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Go to AI Estimator</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* 1. Green "Congrats" Cashback Banner from real app */}
              <div className="rounded-xl bg-[#1a7a3a] text-white p-3 text-center shadow-xs">
                <span className="text-[10.5px] uppercase tracking-widest font-extrabold text-emerald-200 block">
                  Congrats
                </span>
                <p className="text-xs font-bold text-white mt-0.5">
                  You&apos;ve earned ₹{totalCashback} cashback on this order
                </p>
              </div>

              {/* 2. Delivery Info Strip */}
              <div className="rounded-xl bg-white border border-[#e5e5e5] p-3 flex items-center gap-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#1a7a3a] shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#1a1a1a]">
                    Delivery in 60 mins
                  </h4>
                  <p className="text-[11px] text-[#777777]">
                    Order of {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {/* 3. Cart Item Cards */}
              <div className="space-y-2.5">
                {cart.map((item) => {
                  const itemCashback = Math.round(
                    item.total * (bill.subtotal >= 50000 ? 0.02 : 0.01)
                  );
                  return (
                    <div
                      key={item.product_id}
                      className="rounded-xl bg-white border border-[#e5e5e5] p-3 shadow-2xs space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {/* Product info */}
                        <div className="min-w-0 flex-1">
                          <h5 className="font-extrabold text-xs text-[#1a1a1a] line-clamp-1">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-[#777777] mt-0.5">
                            ₹{item.unit_price} per {item.unit}
                          </p>
                        </div>

                        {/* Price */}
                        <span className="font-extrabold text-xs text-[#1a1a1a] shrink-0">
                          ₹{item.total.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Controls Bar: « − count + » in solid dark green */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center rounded-lg bg-[#1a7a3a] text-white px-1 py-0.5 shadow-2xs">
                          {/* Quick jump down « */}
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.product_id)}
                            className="px-1.5 py-0.5 text-xs font-bold text-emerald-200 hover:text-white"
                            title="Remove"
                          >
                            «
                          </button>
                          {/* Decrement − */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product_id, item.quantity - 1)
                            }
                            className="px-1.5 py-0.5 text-xs font-bold hover:text-emerald-100"
                            title="Decrease"
                          >
                            −
                          </button>
                          {/* Current Count */}
                          <span className="px-2 font-mono font-extrabold text-xs">
                            {item.quantity}
                          </span>
                          {/* Increment + */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="px-1.5 py-0.5 text-xs font-bold hover:text-emerald-100"
                            title="Increase"
                          >
                            +
                          </button>
                          {/* Quick jump up » */}
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(item.product_id, item.quantity + 5)
                            }
                            className="px-1.5 py-0.5 text-xs font-bold text-emerald-200 hover:text-white"
                            title="Add 5"
                          >
                            »
                          </button>
                        </div>

                        {/* Cashback Pill Badge */}
                        <span className="bg-[#e8f5e9] text-[#1a7a3a] text-[10.5px] font-bold px-2 py-0.5 rounded-full border border-[#c8e6c9]">
                          ₹{itemCashback} cashback
                        </span>
                      </div>

                      {/* Unlock Bulk Prices */}
                      <div className="pt-0.5 flex justify-between items-center text-[10.5px]">
                        <button
                          type="button"
                          onClick={() => showToast("💡 Order 10+ units for bulk pricing discounts!")}
                          className="text-[#1a7a3a] font-bold border-b border-dashed border-[#1a7a3a] hover:opacity-80 cursor-pointer"
                        >
                          Unlock Bulk Prices
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product_id)}
                          className="text-[#999999] hover:text-[#dc3545] transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 4. Unloading Service Section (Light green #eef7f3 background) */}
              <div className="rounded-xl bg-[#eef7f3] border border-[#d2edd9] p-3.5 space-y-2">
                <div>
                  <h4 className="font-black text-xs text-[#1a1a1a]">
                    Need help with unloading?
                  </h4>
                  <p className="text-[10.5px] text-[#555555] mt-0.5 leading-tight">
                    Includes unloading &amp; keeping at designated place on ground level.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#d2edd9]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#1a7a3a]" />
                    <div>
                      <span className="font-bold text-xs text-[#1a1a1a] block">
                        Unloading Service / 1 Helper
                      </span>
                      <span className="text-[11px] font-extrabold text-[#1a7a3a]">
                        ₹199
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUnloadingService((prev) => !prev)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      unloadingService
                        ? "bg-[#1a7a3a] text-white"
                        : "bg-white border border-[#1a7a3a] text-[#1a7a3a] hover:bg-[#e8f5e9]"
                    }`}
                  >
                    {unloadingService ? "Added ✓" : "Add"}
                  </button>
                </div>
              </div>

              {/* 5. GSTIN Section */}
              <div className="rounded-xl bg-white border border-[#e5e5e5] p-3 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#f0fdf4] text-[#1a7a3a] flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-[#1a1a1a]">Add GSTIN</h5>
                      <p className="text-[10.5px] text-[#777777]">
                        Claim GST input credit on your order
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsGstinOpen(!isGstinOpen)}
                    className="text-xs font-bold text-[#1a7a3a] hover:underline cursor-pointer"
                  >
                    {isGstinOpen ? "Close" : "Add"}
                  </button>
                </div>

                {isGstinOpen && (
                  <div className="pt-1.5 border-t border-[#f0f0f0]">
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="Enter 15-digit GSTIN"
                      maxLength={15}
                      className="w-full text-xs font-mono uppercase px-3 py-1.5 rounded-lg border border-[#e5e5e5] focus:outline-hidden focus:border-[#1a7a3a]"
                    />
                  </div>
                )}
              </div>

              {/* 6. Savings Corner */}
              <div className="rounded-xl bg-white border border-[#e5e5e5] p-3 space-y-2 shadow-2xs">
                <h5 className="font-bold text-xs text-[#1a1a1a] flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-[#1a7a3a]" />
                  <span>Savings Corner</span>
                </h5>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon Code"
                    className="flex-1 text-xs font-mono uppercase px-3 py-1.5 rounded-lg border border-[#e5e5e5] focus:outline-hidden focus:border-[#1a7a3a]"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-[#1a7a3a] hover:bg-[#145f2d] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {couponError && (
                  <span className="text-[10.5px] text-[#dc3545] font-semibold block">
                    {couponError}
                  </span>
                )}
              </div>

              {/* 7. Bill Details (Collapsible) */}
              <div className="rounded-xl bg-white border border-[#e5e5e5] p-3 shadow-2xs space-y-2">
                <button
                  type="button"
                  onClick={() => setIsBillOpen(!isBillOpen)}
                  className="w-full flex items-center justify-between text-left text-xs font-extrabold text-[#1a1a1a] cursor-pointer"
                >
                  <span>Bill Details</span>
                  {isBillOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#777777]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777777]" />
                  )}
                </button>

                {isBillOpen && (
                  <div className="pt-2 border-t border-[#f0f0f0] space-y-1.5 text-xs text-[#555555]">
                    <div className="flex justify-between items-center">
                      <span>Sub Total (Inclusive of GST)</span>
                      <span className="font-medium text-[#1a1a1a]">
                        ₹{bill.subtotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {unloadingService && (
                      <div className="flex justify-between items-center text-[#1a7a3a]">
                        <span>• Unloading Service</span>
                        <span className="font-semibold">₹199</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span>Discount</span>
                      <span className="font-medium text-[#1a1a1a]">₹0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Wallet</span>
                      <span className="font-medium text-[#1a1a1a]">₹0</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Delivery Charge</span>
                      {bill.deliveryCharge === 0 ? (
                        <span className="font-extrabold text-[#1a7a3a]">FREE</span>
                      ) : (
                        <span className="font-medium text-[#1a1a1a]">
                          ₹{bill.deliveryCharge}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Handling Charge</span>
                      <span className="font-medium text-[#1a1a1a]">₹0</span>
                    </div>

                    <div className="pt-2 border-t border-[#f0f0f0] flex justify-between items-center text-sm font-black text-[#1a1a1a]">
                      <span>Total</span>
                      <span className="text-base text-[#1a7a3a]">
                        ₹{bill.total.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 8. Cancellation Policy (Collapsible) */}
              <div className="rounded-xl bg-white border border-[#e5e5e5] p-3 shadow-2xs space-y-1.5">
                <button
                  type="button"
                  onClick={() => setIsPolicyOpen(!isPolicyOpen)}
                  className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1a1a1a] cursor-pointer"
                >
                  <span>📋 Cancellation Policy</span>
                  {isPolicyOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#777777]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#777777]" />
                  )}
                </button>

                {isPolicyOpen && (
                  <ul className="pt-1.5 border-t border-[#f0f0f0] space-y-1 text-[10.5px] text-[#666666] list-disc list-inside">
                    <li>Orders cannot be modified once packed.</li>
                    <li>Delivery location change: INR 249.</li>
                    <li>Cancellation charges of INR 199 apply once packed.</li>
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Sticky Action Button */}
        {cart.length > 0 && (
          <div className="p-3.5 border-t border-[#e5e5e5] bg-white shrink-0 shadow-lg">
            <button
              type="button"
              onClick={handlePlaceOrderClick}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1a7a3a] hover:bg-[#145f2d] active:scale-98 text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {addressSet ? (
                <span>Place Order — ₹{bill.total.toLocaleString("en-IN")}</span>
              ) : (
                <span>Add Your Address ›</span>
              )}
            </button>
            <p className="text-center text-[10px] text-[#888888] mt-1.5">
              60-minute site delivery across Bangalore
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
