"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Wallet,
  ClipboardList,
  MapPin,
  MessageSquare,
  Package,
  RotateCcw,
  Shield,
  FileText,
  LogOut,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface AccountScreenProps {
  onBack?: () => void;
  onNavigateToOrders: () => void;
  variant?: "mobile" | "web";
}

export default function AccountScreen({
  onBack,
  onNavigateToOrders,
  variant = "mobile",
}: AccountScreenProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true });

  const isWeb = variant === "web";

  const showToast = (feature: string) => {
    setToastMessage(`This is a demo — ${feature} would open here.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = [
    {
      q: "How does HomeRun Cash work?",
      a: "You earn cashback on every order. It's automatically credited to your HomeRun wallet and applied on your next order above ₹500.",
    },
    {
      q: "When is cashback credited?",
      a: "Cashback is credited within 24 hours of successful order delivery to your site.",
    },
    {
      q: "Can I transfer my balance?",
      a: "HomeRun Cash cannot be transferred to a bank account or withdrawn. It can only be used for purchases on HomeRun.",
    },
  ];

  const menuItems = [
    {
      icon: <ClipboardList className="w-4 h-4 text-emerald-700" />,
      label: "Order History",
      action: onNavigateToOrders,
    },
    {
      icon: <MapPin className="w-4 h-4 text-blue-600" />,
      label: "My Addresses",
      action: () => showToast("My Addresses"),
    },
    {
      icon: <MessageSquare className="w-4 h-4 text-amber-600" />,
      label: "HomeRun Support",
      action: () => showToast("HomeRun Support"),
    },
    {
      icon: <Package className="w-4 h-4 text-indigo-600" />,
      label: "Shipping Policy (60-Min Express)",
      action: () => showToast("Shipping Policy"),
    },
    {
      icon: <RotateCcw className="w-4 h-4 text-teal-600" />,
      label: "Refund & Replacement Policy",
      action: () => showToast("Refund Policy"),
    },
    {
      icon: <Shield className="w-4 h-4 text-emerald-600" />,
      label: "Privacy Policy",
      action: () => showToast("Privacy Policy"),
    },
    {
      icon: <FileText className="w-4 h-4 text-slate-600" />,
      label: "Terms of Service",
      action: () => showToast("Terms of Service"),
    },
    {
      icon: <LogOut className="w-4 h-4 text-red-500" />,
      label: "Log Out",
      action: () => showToast("Log Out"),
    },
  ];

  return (
    <div className="w-full flex flex-col bg-slate-50 min-h-full relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Mobile Header */}
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
            My Account
          </h2>
        </div>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 overflow-y-auto ${
          isWeb ? "p-6 md:p-8 max-w-5xl mx-auto space-y-6 w-full" : "p-3 sm:p-4 space-y-3.5"
        }`}
      >
        {isWeb && (
          <div className="border-b border-slate-200 pb-3">
            <h2 className="font-black text-2xl text-slate-900 font-display">My Account</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Contractor profile, HomeRun Cash wallet, and platform policies
            </p>
          </div>
        )}

        <div className={`grid gap-4 ${isWeb ? "grid-cols-12" : "grid-cols-1"}`}>
          {/* Left Column: Account profile + Menu */}
          <div className={`space-y-3 ${isWeb ? "col-span-6" : ""}`}>
            {/* Account Info Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-4 flex items-center gap-3.5 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                👤
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Demo User</h4>
                <p className="text-xs text-slate-500 font-medium">+91 98765 43210</p>
                <span className="inline-block mt-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                  Verified Contractor
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden divide-y divide-slate-100 shadow-2xs">
              {menuItems.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 text-left hover:bg-slate-50 active:bg-slate-100 transition-colors text-xs font-semibold text-slate-800 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="p-1 rounded-lg bg-slate-50 group-hover:bg-white transition-colors">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: HomeRun Cash Card + FAQs */}
          <div className={`space-y-3 ${isWeb ? "col-span-6" : ""}`}>
            {/* HomeRun Cash Card */}
            <div className="rounded-2xl bg-linear-to-br from-[#0d4a22] to-[#1a7a3a] text-white p-4 sm:p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <div className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-homerun-yellow" />
                  <span className="font-bold text-sm">HomeRun Cash</span>
                </div>
                <span className="font-black text-lg text-homerun-yellow">₹0</span>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-100/90">
                <p className="font-semibold text-white">Earn cashback on every order:</p>
                <ul className="space-y-1 text-[11px] list-disc list-inside">
                  <li>1% cashback on all orders above ₹100</li>
                  <li>2% bulk cashback on orders above ₹50,000</li>
                  <li>Auto-applied to cart on orders above ₹500</li>
                </ul>
              </div>
            </div>

            {/* FAQ Accordions on Web */}
            {isWeb && (
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 shadow-2xs">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  HomeRun Cash FAQ
                </h4>
                <div className="divide-y divide-slate-100">
                  {faqs.map((faq, fIdx) => {
                    const isOpen = !!openFaq[fIdx];
                    return (
                      <div key={fIdx} className="py-2.5">
                        <button
                          type="button"
                          onClick={() => toggleFaq(fIdx)}
                          className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800 hover:text-homerun-green transition-colors"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        {isOpen && (
                          <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                            {faq.a}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
