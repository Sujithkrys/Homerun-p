"use client";

import React, { useState } from "react";
import { ArrowLeft, Plus, Minus, Truck } from "lucide-react";

interface WalletOverlayProps {
  onClose: () => void;
}

export default function WalletOverlay({ onClose }: WalletOverlayProps) {
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const faqs = [
    {
      q: "What is HomeRun Wallet?",
      a: "HomeRun Cash is our loyalty cashback program for contractors and site engineers. You earn guaranteed cashback on every qualifying materials purchase.",
    },
    {
      q: "How can I use my wallet balance?",
      a: "Your HomeRun Cash is automatically deducted from your cart subtotal on any future order value above ₹500.",
    },
    {
      q: "How long does it take for cashback to reflect in my wallet?",
      a: "Your cashback is automatically added within 24 hours after your order has been successfully delivered to your site.",
    },
    {
      q: "What is the validity period of my cashback?",
      a: "HomeRun Cash remains valid for 12 months from the date of credit.",
    },
    {
      q: "Who can I contact for wallet-related issues?",
      a: "You can reach our dedicated Bangalore contractor support desk via WhatsApp or call our helpline directly from the Support tab.",
    },
  ];

  return (
    <div className="absolute inset-0 z-40 bg-[#e8f5e9] flex flex-col overflow-y-auto p-4 select-none">
      {/* Top Header with Back button */}
      <div className="pt-8 pb-3 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white border border-[#c8e6c9] text-[#1a5c2d] flex items-center justify-center shadow-xs hover:bg-[#dcedc8] transition-colors cursor-pointer"
          aria-label="Close wallet"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="font-extrabold text-base text-[#1a5c2d] font-display">
          HomeRun Wallet
        </h2>
      </div>

      {/* Main Content */}
      <div className="space-y-4 pb-8">
        {/* 1. Dark Green Wallet Card */}
        <div className="w-full rounded-2xl bg-linear-to-br from-[#1a5c2d] to-[#0d3d1c] p-4 text-white shadow-md relative overflow-hidden">
          {/* Inner Dashed Border */}
          <div className="w-full h-full border border-dashed border-white/30 rounded-xl p-3 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-200">Wallet Balance</span>
                <h3 className="text-sm font-bold text-white mt-0.5">HomeRun Cash</h3>
              </div>

              {/* Rupee & Currency SVG graphics */}
              <div className="w-12 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-xl font-black text-[#f5c518]">
                ₹
              </div>
            </div>

            <div className="mt-4">
              <span className="text-4xl font-black tracking-tight text-white font-mono">
                ₹0
              </span>
              <p className="text-[10.5px] text-emerald-200/90 mt-1">
                Wallet balance auto-applied above ₹500
              </p>
            </div>
          </div>
        </div>

        {/* 2. "How it works" Card */}
        <div className="rounded-2xl bg-white p-4 border border-[#c8e6c9] shadow-xs space-y-3">
          <h4 className="font-extrabold text-sm text-[#1a1a1a]">How it works</h4>

          <ul className="space-y-2.5 text-xs text-[#4b5563]">
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1a7a3a] shrink-0 mt-1.5" />
              <span>Shop For ₹100 get 1% off, Earn 2% above ₹50,000</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1a7a3a] shrink-0 mt-1.5" />
              <span>Your cashback is auto added in 24 hours after order is fulfilled</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#1a7a3a] shrink-0 mt-1.5" />
              <span>Use balance on future order value above ₹500</span>
            </li>
          </ul>

          {/* Yellow Highlight Strip */}
          <div className="rounded-xl bg-[#fef9e7] border border-[#faecd2] p-2.5 flex items-center gap-2 text-xs font-bold text-[#7d5a00]">
            <Truck className="w-4 h-4 text-[#1a7a3a] shrink-0" />
            <span>Shop For ₹100 get 1% off, Earn 2% above ₹50,000</span>
          </div>
        </div>

        {/* 3. FAQs Section */}
        <div className="rounded-2xl bg-white p-4 border border-[#c8e6c9] shadow-xs space-y-2">
          <h4 className="font-extrabold text-sm text-[#1a1a1a] mb-1">FAQs</h4>

          <div className="divide-y divide-[#e5e5e5]">
            {faqs.map((faq, idx) => {
              const isOpen = !!openFaq[idx];
              return (
                <div key={idx} className="py-2.5">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1a1a1a] hover:text-[#1a7a3a] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <span className="text-sm font-black text-[#1a7a3a] ml-2 shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-[#555555] mt-1.5 leading-relaxed pr-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
