"use client";

import React from "react";
import { Wifi } from "lucide-react";

interface PhoneFrameProps {
  children: React.ReactNode;
  statusBarTheme?: "light" | "dark";
}

export default function PhoneFrame({
  children,
  statusBarTheme = "light",
}: PhoneFrameProps) {
  const isLightText = statusBarTheme === "light";

  return (
    <div className="flex items-start justify-center pt-0 pb-1 px-1 select-none h-full max-h-full">
      {/* Phone Mockup Frame: Responsive on mobile, Big size (380px) on desktop, fitting screen height */}
      <div className="relative w-full max-w-[375px] sm:max-w-[380px] h-[calc(100vh-125px)] sm:h-[calc(100vh-68px)] max-h-[812px] min-h-0 bg-slate-950 rounded-[38px] sm:rounded-[44px] p-1.5 sm:p-2.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] border-3 sm:border-4 border-slate-800 ring-1 ring-slate-700/50 flex flex-col shrink-0 overflow-hidden">
        
        {/* Dynamic Island Pill - EXACTLY Centered at 50% */}
        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-50 flex items-center justify-center pointer-events-none shadow-sm">
          {/* Centered Camera Aperture */}
          <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-neutral-800/90 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1e293b]/90"></div>
          </div>
        </div>

        {/* Status Bar Row (Time left, Icons right) */}
        <div className="absolute top-2.5 left-2.5 right-2.5 z-40 px-6 pt-2.5 pb-1 flex items-center justify-between pointer-events-none">
          {/* Time */}
          <span
            className={`text-[12px] font-semibold tracking-tight min-w-[36px] ${
              isLightText ? "text-white" : "text-slate-900"
            }`}
          >
            9:41
          </span>

          {/* Invisible spacer so flex doesn't crowd center */}
          <div className="w-24 h-5" aria-hidden="true" />

          {/* Signal, WiFi, Battery */}
          <div
            className={`flex items-center justify-end gap-1.5 text-xs min-w-[36px] ${
              isLightText ? "text-white" : "text-slate-900"
            }`}
          >
            {/* Cellular bars */}
            <div className="flex items-end gap-0.5 h-2.5">
              <span
                className={`w-0.5 h-1 rounded-xs ${
                  isLightText ? "bg-white" : "bg-slate-900"
                }`}
              ></span>
              <span
                className={`w-0.5 h-1.5 rounded-xs ${
                  isLightText ? "bg-white" : "bg-slate-900"
                }`}
              ></span>
              <span
                className={`w-0.5 h-2 rounded-xs ${
                  isLightText ? "bg-white" : "bg-slate-900"
                }`}
              ></span>
              <span
                className={`w-0.5 h-2.5 rounded-xs ${
                  isLightText ? "bg-white" : "bg-slate-900"
                }`}
              ></span>
            </div>

            {/* WiFi */}
            <Wifi className="w-3 h-3 stroke-[2.5]" />

            {/* Battery */}
            <div className="flex items-center">
              <div
                className={`w-5 h-2.5 rounded-[3px] border px-0.5 flex items-center ${
                  isLightText ? "border-white" : "border-slate-900"
                }`}
              >
                <div
                  className={`w-full h-1.5 rounded-[1px] ${
                    isLightText ? "bg-white" : "bg-slate-900"
                  }`}
                ></div>
              </div>
              <div
                className={`w-0.5 h-1 rounded-r-xs -ml-px ${
                  isLightText ? "bg-white" : "bg-slate-900"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full bg-white rounded-[36px] overflow-hidden flex flex-col shadow-inner">
          {children}

          {/* Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900/40 rounded-full z-40 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
}
