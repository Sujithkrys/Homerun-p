"use client";

import React, { useState } from "react";
import { ChevronLeft, Search, ShoppingCart } from "lucide-react";
import { STRUCTURED_CATALOG, StructuredProduct } from "@/lib/structured-catalog";
import VariantBottomSheet from "../VariantBottomSheet";
import { CartItem } from "@/lib/types";

interface ProductsScreenProps {
  categoryName: string;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onUpdateQuantity: (productId: string, newQty: number) => void;
  cart: CartItem[];
  cartCount: number;
  onOpenCart?: () => void;
  variant?: "mobile" | "web";
}

export default function ProductsScreen({
  categoryName,
  onBack,
  onAddToCart,
  onUpdateQuantity,
  cart,
  cartCount,
  onOpenCart,
  variant = "mobile",
}: ProductsScreenProps) {
  const isWeb = variant === "web";
  const [activeFilter, setActiveFilter] = useState<string>("Category");
  const [selectedProduct, setSelectedProduct] = useState<StructuredProduct | null>(null);

  const catalogProducts = STRUCTURED_CATALOG.filter((p) => p.category === categoryName);

  // Fallback to dummy products if the category hasn't been populated in the catalog yet
  const products: StructuredProduct[] = catalogProducts.length > 0 ? catalogProducts : [
    {
      id: `dummy-${categoryName.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: `Premium ${categoryName} Material`,
      brand: "Top Brand",
      category: categoryName,
      image: "",
      mrp: 1200,
      price: 1050,
      bulk_price: 900,
      bulk_threshold: 100,
      discount_percentage: 12,
      unit: "unit",
      badges: ["Assured 2% Cashback", "Free Delivery"],
    },
    {
      id: `dummy-${categoryName.toLowerCase().replace(/\s+/g, '-')}-2`,
      name: `Standard ${categoryName} Pack`,
      brand: "Value Brand",
      category: categoryName,
      image: "",
      mrp: 850,
      price: 780,
      bulk_price: 700,
      bulk_threshold: 100,
      discount_percentage: 8,
      unit: "pack",
      badges: ["Assured 2% Cashback", "Free Delivery"],
    },
    {
      id: `dummy-${categoryName.toLowerCase().replace(/\s+/g, '-')}-3`,
      name: `Bulk ${categoryName} Supply`,
      brand: "Pro Build",
      category: categoryName,
      image: "",
      mrp: 5400,
      price: 4900,
      bulk_price: 4500,
      bulk_threshold: 50,
      discount_percentage: 9,
      unit: "pallet",
      badges: ["Assured 2% Cashback", "Free Delivery"],
    }
  ];

  const filters = ["Category", "Brand", "Type", "Price"];

  const handleAddDirect = (product: StructuredProduct) => {
    const item: CartItem = {
      product_id: product.id,
      name: product.name,
      quantity: 1,
      unit: product.unit,
      unit_price: product.price,
      total: product.price,
      reason: "Added via Product Catalog",
    };
    onAddToCart(item);
  };

  const getCartQty = (productId: string) => {
    const item = cart.find((c) => c.product_id === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#f5f5f5] overflow-hidden">
      {/* Header */}
      <div className={`bg-[#f5f5f5] px-4 ${isWeb ? "py-3" : "pt-10 pb-3"} flex items-center justify-between shrink-0`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 -ml-1 text-slate-800">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 truncate">
            {categoryName}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-600">
            <Search className="w-5 h-5" />
          </button>
          <button onClick={onOpenCart} className="relative text-slate-600">
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            {cartCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-[#1a7a3a] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {cartCount}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-slate-200">
        <button className="p-2 border border-slate-300 rounded-lg bg-white shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
        </button>
        {filters.map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-700 flex items-center gap-1 shrink-0"
          >
            {filter} <span className="text-slate-400">v</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {/*
          Column count is driven by the `isWeb` prop rather than Tailwind's sm:/md:
          viewport breakpoints. The mobile view renders inside a fixed-width phone
          frame that sits within the same (desktop-width) browser viewport, so
          viewport-based breakpoints like sm:grid-cols-3 would activate there too
          and force a cramped 3-column grid into ~380px of space.
        */}
        <div className={`grid gap-3 items-start ${isWeb ? "grid-cols-3 lg:grid-cols-4 gap-4" : "grid-cols-2"}`}>
          {products.map((product) => {
            const hasVariants = !!product.variants;
            const qty = getCartQty(product.id);
            const variantCount = hasVariants ? Object.values(product.variants || {}).flat().length : 0;

            return (
              <div key={product.id} className="bg-white rounded-2xl overflow-hidden flex flex-col shadow-sm border border-slate-100">
                {/* Image Area */}
                <div className="relative aspect-[4/3] p-4 bg-white flex items-center justify-center border-b border-slate-50">
                  {product.discount_percentage && (
                    <div className="absolute top-2 left-2 bg-[#f4d03f] text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">
                      {product.discount_percentage}% OFF
                    </div>
                  )}
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      <span className="text-[10px] text-slate-400 font-medium italic px-2 text-center">Image will attach soon</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3 flex flex-col flex-1">
                  {/* Badges (Cashback has its own dedicated box below, so it's excluded here to avoid showing it twice) */}
                  <div className="flex flex-wrap gap-1 mb-1.5 min-h-[30px]">
                    {product.badges?.filter((badge) => badge !== "Assured 2% Cashback").map((badge, idx) => (
                      <div key={idx} className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${
                        badge === "Free Delivery" ? "bg-[#1a7a3a] text-white" : ""
                      }`}>
                        {badge}
                        {badge === "Free Delivery" && <div className="text-[8px] font-normal font-sans opacity-90 mt-0.5">on orders above ₹500</div>}
                      </div>
                    ))}
                  </div>

                  {/* Title */}
                  <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-2">
                    {product.name}
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="text-sm font-extrabold text-slate-900">₹ {product.price}</div>
                    {product.mrp > product.price && (
                      <div className="text-[10px] font-medium text-slate-400 line-through">₹ {product.mrp}</div>
                    )}
                  </div>

                  {/* Cashback Box (if present) */}
                  {product.badges?.includes("Assured 2% Cashback") && (
                    <div className="bg-[#fdf9e6] rounded-md p-1.5 mb-2 flex items-start gap-1.5">
                      <div className="text-[#d4a300] shrink-0">🎁</div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-900">Assured 2% Cashback</div>
                        <div className="text-[9px] text-slate-600">On purchases above ₹50,000</div>
                      </div>
                    </div>
                  )}

                  {/* Bulk Price */}
                  {product.bulk_price && (
                    <div className="text-[10px] font-bold text-[#1f72b6] mb-3 border-b border-dashed border-[#1f72b6]/30 inline-block pb-0.5">
                      Unlock Bulk Prices of ₹{product.bulk_price}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-1">
                    {hasVariants ? (
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="w-full py-2 rounded-lg border border-[#1a7a3a] text-[#1a7a3a] text-xs font-bold"
                      >
                        {variantCount} Options
                      </button>
                    ) : qty > 0 ? (
                      <div className="w-full h-8 bg-[#1a7a3a] rounded-lg flex items-center justify-between px-3 text-white">
                        <button onClick={() => onUpdateQuantity(product.id, qty - 1)} className="font-bold p-1 text-sm">&minus;</button>
                        <span className="font-bold text-xs">{qty}</span>
                        <button onClick={() => onUpdateQuantity(product.id, qty + 1)} className="font-bold p-1 text-sm">+</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddDirect(product)}
                        className="w-full py-2 rounded-lg border border-[#1a7a3a] text-[#1a7a3a] text-xs font-bold hover:bg-green-50"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Variant Bottom Sheet */}
      {selectedProduct && (
        <VariantBottomSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
