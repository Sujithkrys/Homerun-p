"use client";

import React, { useState } from "react";
import { CartItem } from "@/lib/types";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";

interface ProductRecommendationProps {
  products: CartItem[];
  onAddToCart: (product: CartItem) => void;
  onAddAllToCart: (products: CartItem[]) => void;
}

export default function ProductRecommendation({
  products,
  onAddToCart,
  onAddAllToCart,
}: ProductRecommendationProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(products.map((p) => p.product_id)));
  const [quantities, setQuantities] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.product_id, p.quantity]))
  );
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  if (!products || products.length === 0) return null;

  const toggleSelect = (productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const withCurrentQuantity = (product: CartItem): CartItem => {
    const quantity = quantities[product.product_id] ?? product.quantity;
    return { ...product, quantity, total: quantity * product.unit_price };
  };

  const addSelected = () => {
    const selectedItems = products.filter((p) => selectedIds.has(p.product_id)).map(withCurrentQuantity);
    if (selectedItems.length === 0) return;
    selectedItems.forEach((p) => onAddToCart(p));
    setAddedMessage(`Added ${selectedItems.length} item${selectedItems.length > 1 ? "s" : ""} to cart!`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  const addAll = () => {
    onAddAllToCart(products.map(withCurrentQuantity));
    setAddedMessage(`Added all ${products.length} items to cart!`);
    setTimeout(() => setAddedMessage(null), 3000);
  };

  const getTotal = (product: CartItem) => (quantities[product.product_id] ?? product.quantity) * product.unit_price;

  const total = products.reduce((sum, p) => sum + getTotal(p), 0);
  const selectedTotal = products
    .filter((p) => selectedIds.has(p.product_id))
    .reduce((sum, p) => sum + getTotal(p), 0);

  return (
    <div className="mt-3.5 space-y-2.5 pt-2.5 border-t border-slate-200/80 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-slate-800">
            Recommended Products ({products.length})
          </span>
        </div>
        <span className="text-xs font-extrabold text-[#1a7a3a]">
          Total: ₹{total.toLocaleString("en-IN")}
        </span>
      </div>

      {/* Subtitle helper */}
      <p className="text-[11.5px] text-slate-500 font-medium leading-tight">
        Select the items you need, then click Add to Cart:
      </p>

      {/* Product cards */}
      <div className="space-y-2">
        {products.map((product) => {
          const isSelected = selectedIds.has(product.product_id);
          const qty = quantities[product.product_id] ?? product.quantity;
          return (
            <div
              key={product.product_id}
              onClick={() => toggleSelect(product.product_id)}
              className={`flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? "border-[#1a7a3a] bg-[#e8f5e9]/50 shadow-2xs"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  isSelected
                    ? "border-[#1a7a3a] bg-[#1a7a3a] text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>

              {/* Product info */}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                  {product.name}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {product.unit} × ₹{product.unit_price}
                </div>
                {product.reason && (
                  <div className="text-[10.5px] text-slate-400 mt-1 leading-snug italic">
                    {product.reason}
                  </div>
                )}

                {/* Quantity Stepper */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2 inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.product_id, -1)}
                    disabled={qty <= 1}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2.5 font-bold text-xs font-mono min-w-[24px] text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(product.product_id, 1)}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="text-xs sm:text-sm font-extrabold text-slate-900 shrink-0 mt-0.5">
                ₹{getTotal(product).toLocaleString("en-IN")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Alert if items were just added */}
      {addedMessage && (
        <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-fadeIn">
          <span>✓</span>
          <span>{addedMessage}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={addSelected}
          disabled={selectedIds.size === 0}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
            selectedIds.size > 0
              ? "bg-[#1a7a3a] text-white hover:bg-[#155d2c]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
          }`}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>
            Add Selected ({selectedIds.size})
            {selectedIds.size > 0 ? ` • ₹${selectedTotal.toLocaleString("en-IN")}` : ""}
          </span>
        </button>

        <button
          type="button"
          onClick={addAll}
          className="py-2 px-3 rounded-xl text-xs font-bold border border-[#1a7a3a] text-[#1a7a3a] bg-white hover:bg-emerald-50 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs active:scale-98 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add All</span>
        </button>
      </div>
    </div>
  );
}
