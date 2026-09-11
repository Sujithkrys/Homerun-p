"use client";

import React, { useState } from "react";
import HomeRunHeader from "../HomeRunHeader";
import { DemoOrder } from "@/lib/types";
import { Truck } from "lucide-react";

interface OrdersScreenProps {
  onBack?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToEstimator: () => void;
  demoOrder: DemoOrder | null;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function OrdersScreen({
  onNavigateToHome,
  onNavigateToEstimator,
  demoOrder,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: OrdersScreenProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isWeb = variant === "web";

  const handleTrackOrder = () => {
    setToastMessage("🚚 Your order is dispatched! Bangalore live ETA: ~45 mins");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full flex flex-col bg-[#fbfbfb] min-h-full relative select-none">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Real HomeRun Header on Mobile */}
      {!isWeb && (
        <HomeRunHeader
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto ${
          isWeb ? "p-6 md:p-8 max-w-4xl mx-auto space-y-6 w-full" : "p-4 space-y-4"
        }`}
      >
        {demoOrder ? (
          /* Active Order Card */
          <div className="rounded-2xl border border-[#e5e5e5] bg-white p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] pb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a7a3a] animate-pulse" />
                <span className="font-extrabold text-xs text-[#1a7a3a]">
                  Delivery in 60 mins
                </span>
              </div>
              <span className="text-[11px] text-[#888888] font-mono">
                Order of {demoOrder.items.length} items
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-1.5 text-xs text-[#333333]">
              {demoOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between items-center py-0.5">
                  <span className="truncate max-w-[220px]">
                    • {it.name} × {it.quantity}
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    ₹{it.total.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Total and Tracking */}
            <div className="pt-2.5 border-t border-[#f0f0f0] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#888888] block">Total Amount</span>
                <span className="font-extrabold text-sm text-[#1a1a1a]">
                  ₹{demoOrder.total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleTrackOrder}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a7a3a] text-white text-xs font-bold hover:bg-[#155d2c] transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order →</span>
              </button>
            </div>
          </div>
        ) : (
          /* Real HomeRun Empty State matching Screenshot 5 exactly! */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            {/* Receipt Icon inside Circular background */}
            <div className="w-20 h-20 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-[#9ca3af]" fill="currentColor">
                <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM8 7H16V9H8V7ZM16 11H8V13H16V11ZM13 15H8V17H13V15Z" />
              </svg>
            </div>

            {/* Heading */}
            <h3 className="font-black text-lg text-[#1a1a1a] font-display">
              No orders yet
            </h3>

            {/* Subtitle */}
            <p className="text-xs text-[#777777] max-w-xs mt-1 leading-relaxed">
              Your orders will appear here once you place one.
            </p>

            {/* Solid Green "Continue Shopping" button from Screenshot 5 */}
            <button
              type="button"
              onClick={onNavigateToHome || onNavigateToEstimator}
              className="mt-6 w-full max-w-[280px] py-3 px-6 rounded-xl bg-[#1a7a3a] hover:bg-[#145f2d] active:scale-98 text-white font-extrabold text-sm shadow-xs transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
