"use client";

import React, { useState } from "react";
import ModeToggle, { DemoMode } from "@/components/ModeToggle";
import WebPlatform from "@/components/WebPlatform";
import MobileApp from "@/components/MobileApp";
import WhatsAppChat from "@/components/WhatsAppChat";
import PhoneFrame from "@/components/PhoneFrame";
import { useNavigation } from "@/lib/useNavigation";
import { useChat } from "@/lib/useChat";
import { ExternalLink } from "lucide-react";
import { HomeRunLogo } from "@/components/HomeRunLogo";

export default function HomePage() {
  const [mode, setMode] = useState<DemoMode>("web");
  const { currentScreen, navigateTo } = useNavigation("home");

  // Three separate chat state instances — one per mode (Option A)
  const webChat = useChat("web");
  const mobileChat = useChat("mobile");
  const whatsappChat = useChat("whatsapp");

  // Active cart count and per-mode cart counts for badges
  const modeCartCounts = {
    web: webChat.totalCartCount,
    mobile: mobileChat.totalCartCount,
    whatsapp: whatsappChat.totalCartCount,
  };
  const activeCartCount = modeCartCounts[mode];

  return (
    <main className="h-screen max-h-screen w-screen overflow-hidden flex flex-col justify-between bg-slate-100/70 antialiased selection:bg-homerun-yellow/40">
      {/* 1. Unified Single Top Bar (No empty space after name, sleek 44px) */}
      <header className="h-11 shrink-0 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between select-none z-40">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2 shrink-0">
          <HomeRunLogo size={22} className="w-[22px] h-[22px] rounded-sm shadow-2xs" />
          <a
            href="https://home-run.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-black tracking-tight text-slate-900 hover:text-homerun-green transition-colors flex items-center gap-1 font-display"
          >
            HomeRun <span className="text-homerun-green">AI Assistant</span>
          </a>
        </div>

        {/* 3-Mode Switcher in header bar (Desktop/Tablet one-line layout) */}
        <div className="hidden sm:flex items-center justify-center">
          <ModeToggle
            mode={mode}
            onModeChange={setMode}
            cartItemCount={activeCartCount}
            modeCartCounts={modeCartCounts}
          />
        </div>

        {/* Creator Link */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium shrink-0">
          <span className="hidden sm:inline">Built by</span>
          <a
            href="https://linkedin.com/in/thalathotysujith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-homerun-green hover:underline inline-flex items-center gap-0.5"
          >
            Sujith Thalathoty <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
        </div>
      </header>

      {/* 2. Main Interactive Demo Area (Pushed directly to top, fitting screen correctly) */}
      <section className="flex-1 w-full max-w-6xl mx-auto flex flex-col items-center justify-start pt-1 px-1 sm:px-2 pb-0 overflow-hidden min-h-0">
        {mode === "web" && (
          <div className="w-full h-full max-h-full overflow-hidden flex flex-col">
            <WebPlatform
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              messages={webChat.messages}
              cart={webChat.cart}
              isLoading={webChat.isLoading}
              onSendMessage={webChat.handleSendMessage}
              onUpdateQuantity={webChat.handleUpdateQuantity}
              onRemoveItem={webChat.handleRemoveItem}
              onClearCart={webChat.handleClearCart}
              onResetChat={webChat.handleResetChat}
              onAddSuggestion={webChat.handleAddSuggestionToCart}
              onAddToCart={webChat.addToCart}
              onAddAllToCart={webChat.addAllToCart}
              unloadingService={webChat.unloadingService}
              setUnloadingService={webChat.setUnloadingService}
              gstin={webChat.gstin}
              setGstin={webChat.setGstin}
              couponCode={webChat.couponCode}
              setCouponCode={webChat.setCouponCode}
              demoOrder={webChat.demoOrder}
              onPlaceOrder={() => webChat.handlePlaceOrder(() => navigateTo("orders"))}
              bill={webChat.bill}
            />
          </div>
        )}

        {mode === "mobile" && (
          <PhoneFrame statusBarTheme="light">
            <MobileApp
              currentScreen={currentScreen}
              onNavigate={navigateTo}
              messages={mobileChat.messages}
              cart={mobileChat.cart}
              isLoading={mobileChat.isLoading}
              onSendMessage={mobileChat.handleSendMessage}
              onUpdateQuantity={mobileChat.handleUpdateQuantity}
              onRemoveItem={mobileChat.handleRemoveItem}
              onClearCart={mobileChat.handleClearCart}
              onResetChat={mobileChat.handleResetChat}
              onAddSuggestion={mobileChat.handleAddSuggestionToCart}
              onAddToCart={mobileChat.addToCart}
              onAddAllToCart={mobileChat.addAllToCart}
              unloadingService={mobileChat.unloadingService}
              setUnloadingService={mobileChat.setUnloadingService}
              gstin={mobileChat.gstin}
              setGstin={mobileChat.setGstin}
              couponCode={mobileChat.couponCode}
              setCouponCode={mobileChat.setCouponCode}
              demoOrder={mobileChat.demoOrder}
              onPlaceOrder={() => mobileChat.handlePlaceOrder(() => navigateTo("orders"))}
              bill={mobileChat.bill}
            />
          </PhoneFrame>
        )}

        {mode === "whatsapp" && (
          <PhoneFrame statusBarTheme="light">
            <WhatsAppChat
              messages={whatsappChat.messages}
              cart={whatsappChat.cart}
              isLoading={whatsappChat.isLoading}
              onSendMessage={whatsappChat.handleSendMessage}
              onActionClick={whatsappChat.handleWhatsAppActionClick}
              onResetChat={whatsappChat.handleResetChat}
              onAddSuggestion={whatsappChat.handleAddSuggestionToCart}
              onAddToCart={whatsappChat.addToCart}
              onAddAllToCart={whatsappChat.addAllToCart}
              setMessages={whatsappChat.setMessages}
            />
          </PhoneFrame>
        )}
      </section>

      {/* 3. Mobile-Only Bottom Mode Switcher Dock (Easy thumb access, keeps mobile screen clean) */}
      <div className="sm:hidden w-full bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-center shrink-0 z-40 shadow-xs">
        <ModeToggle
          mode={mode}
          onModeChange={setMode}
          cartItemCount={activeCartCount}
          modeCartCounts={modeCartCounts}
        />
      </div>

      {/* 4. Minimal Footer (Single line, 28px tall max, inside page layout) */}
      <footer className="w-full h-7 shrink-0 bg-white border-t border-slate-200 px-4 flex items-center justify-center text-[11px] text-slate-500 select-none">
        <p className="flex items-center justify-center flex-wrap gap-1 font-medium truncate">
          <span>Built by</span>
          <a
            href="https://linkedin.com/in/thalathotysujith"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-homerun-green hover:underline inline-flex items-center gap-0.5"
          >
            Sujith Thalathoty <ExternalLink className="w-2.5 h-2.5 inline" />
          </a>
          <span>|</span>
          <span className="text-slate-700">AI Product Demo for HomeRun</span>
          <span className="text-slate-400 font-normal hidden md:inline">
            (Bangalore Quick Commerce)
          </span>
        </p>
      </footer>
    </main>
  );
}
