"use client";

import React, { useState } from "react";
import HomeRunHeader from "../HomeRunHeader";
import WalletOverlay from "./WalletOverlay";
import {
  ClipboardList,
  MapPin,
  Headphones,
  Truck,
  RotateCcw,
  ShieldCheck,
  FileText,
  LogOut,
  Trash2,
  ChevronRight,
  PenSquare,
  Wallet,
} from "lucide-react";

interface AccountScreenProps {
  onBack?: () => void;
  onNavigateToOrders: () => void;
  variant?: "mobile" | "web";
  cartCount?: number;
  onOpenCart?: () => void;
}

export default function AccountScreen({
  onNavigateToOrders,
  variant = "mobile",
  cartCount = 0,
  onOpenCart,
}: AccountScreenProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const isWeb = variant === "web";

  const showToast = (feature: string) => {
    setToastMessage(`This is a demo — ${feature} would open here.`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const menuItems = [
    {
      id: "orders",
      label: "Order History",
      icon: <ClipboardList className="w-4 h-4 text-[#1a7a3a]" />,
      action: onNavigateToOrders,
      isDanger: false,
    },
    {
      id: "addresses",
      label: "My Addresses",
      icon: <MapPin className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("My Addresses"),
      isDanger: false,
    },
    {
      id: "support",
      label: "HomeRun Support",
      icon: <Headphones className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("HomeRun Support"),
      isDanger: false,
    },
    {
      id: "shipping",
      label: "Shipping Policy",
      icon: <Truck className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("Shipping Policy"),
      isDanger: false,
    },
    {
      id: "refund",
      label: "Refund Policy",
      icon: <RotateCcw className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("Refund Policy"),
      isDanger: false,
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      icon: <ShieldCheck className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("Privacy Policy"),
      isDanger: false,
    },
    {
      id: "terms",
      label: "Terms of Service",
      icon: <FileText className="w-4 h-4 text-[#1a7a3a]" />,
      action: () => showToast("Terms of Service"),
      isDanger: false,
    },
    {
      id: "logout",
      label: "Log Out",
      icon: <LogOut className="w-4 h-4 text-[#dc3545]" />,
      action: () => showToast("Log Out"),
      isDanger: true,
    },
    {
      id: "delete",
      label: "Delete Account",
      icon: <Trash2 className="w-4 h-4 text-[#dc3545]" />,
      action: () => showToast("Delete Account"),
      isDanger: true,
    },
  ];

  return (
    <div className="w-full h-full flex-1 flex flex-col min-h-0 bg-[#fbfbfb] overflow-hidden relative">
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

      {/* Wallet Overlay */}
      {isWalletOpen && (
        <WalletOverlay onClose={() => setIsWalletOpen(false)} />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 w-full overflow-y-auto overflow-x-hidden no-scrollbar ${
          isWeb ? "p-6 md:p-8 max-w-5xl mx-auto space-y-6" : "p-3 space-y-3 pb-6"
        }`}
      >
        {/* Account Info: Centered "My Account" with pen icon from Screenshot 4 */}
        <div className="text-center py-2">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <h2 className="font-extrabold text-base sm:text-lg text-[#1a1a1a] font-display">
              My Account
            </h2>
            <PenSquare className="w-4 h-4 text-[#1a1a1a]" />
          </div>
          <p className="text-xs text-[#666666] font-medium mt-0.5">
            +91 6303031919
          </p>
        </div>

        {/* Menu Items: Individual White Rounded Cards with Gaps (from Screenshot 4) */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.action}
              className="w-full bg-white rounded-xl border border-[#eeeeee] p-3 flex items-center justify-between shadow-2xs hover:shadow-xs active:bg-[#f9f9f9] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                {/* Green or Red circular icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    item.isDanger ? "bg-[#fee2e2]" : "bg-[#e8f5e9]"
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-xs font-bold ${
                    item.isDanger ? "text-[#dc3545]" : "text-[#222222]"
                  }`}
                >
                  {item.label}
                </span>
              </div>

              <ChevronRight
                className={`w-4 h-4 ${
                  item.isDanger ? "text-[#dc3545]" : "text-[#aaaaaa]"
                } group-hover:translate-x-0.5 transition-transform`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
