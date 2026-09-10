"use client";

import React, { useState } from "react";
import { DemoOrder } from "@/lib/types";
import { ArrowLeft, Sparkles, Truck, CheckCircle2, Clock } from "lucide-react";

interface OrdersScreenProps {
  onBack?: () => void;
  onNavigateToEstimator: () => void;
  demoOrder: DemoOrder | null;
  variant?: "mobile" | "web";
}

export default function OrdersScreen({
  onBack,
  onNavigateToEstimator,
  demoOrder,
  variant = "mobile",
}: OrdersScreenProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isWeb = variant === "web";

  const handleTrackOrder = () => {
    setToastMessage("🚚 Your order is on the way! Live Bangalore dispatch ETA: ~45 mins");
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-full relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Mobile Header Bar */}
      {!isWeb && (
        <div className="bg-homerun-green text-white px-3.5 pt-11 pb-3 flex items-center gap-2 shrink-0 shadow-xs select-none">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <h2 className="font-extrabold text-base tracking-tight font-display">
            My Orders
          </h2>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto ${
          isWeb ? "p-6 md:p-8 max-w-4xl mx-auto space-y-6 w-full" : "p-4 space-y-4"
        }`}
      >
        {isWeb && (
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-black text-2xl text-slate-900 font-display">My Orders</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live orders and express delivery status
            </p>
          </div>
        )}

        {demoOrder ? (
          /* Demo Active Order Card */
          <div className="rounded-2xl border border-emerald-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                  Order #{demoOrder.id}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Placed on {demoOrder.date}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Arriving in ~45 mins</span>
              </div>
            </div>

            {/* Items snippet */}
            <div className="text-xs text-slate-700 font-medium">
              <p className="line-clamp-2">
                {demoOrder.items
                  .map((it) => `${it.name} × ${it.quantity}`)
                  .join(", ")}
              </p>
              {demoOrder.items.length > 3 && (
                <span className="text-slate-400 text-[11px] block mt-0.5">
                  + {demoOrder.items.length - 3} more materials
                </span>
              )}
            </div>

            {/* Total and Track CTA */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Total Amount</span>
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  ₹{demoOrder.total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleTrackOrder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-homerun-green text-white font-bold text-xs shadow-2xs hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Track Order →</span>
              </button>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl mb-4 select-none shadow-2xs">
              📦
            </div>
            <h3 className="font-extrabold text-lg text-slate-800 font-display">
              No orders yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 leading-relaxed">
              Start by asking our AI estimator for a material estimate — then place your first order directly to your site!
            </p>
            <button
              type="button"
              onClick={onNavigateToEstimator}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-homerun-green text-white text-xs sm:text-sm font-bold shadow-md hover:bg-emerald-800 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-homerun-yellow" />
              <span>Try AI Estimator</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
