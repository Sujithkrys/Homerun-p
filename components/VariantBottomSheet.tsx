"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { StructuredProduct } from "@/lib/structured-catalog";
import { CartItem } from "@/lib/types";

interface VariantBottomSheetProps {
  product: StructuredProduct;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export default function VariantBottomSheet({
  product,
  onClose,
  onAddToCart,
}: VariantBottomSheetProps) {
  // If product doesn't have option groups or variants, it shouldn't be here really.
  const groups = product.optionGroups || [];
  const primaryGroup = groups[0];
  const secondaryGroup = groups[1];

  const [selectedPrimary, setSelectedPrimary] = useState<string>(
    primaryGroup?.options[0] || ""
  );

  const currentVariants = product.variants?.[selectedPrimary] || [];

  const handleAddVariant = (variant: any) => {
    const item: CartItem = {
      product_id: variant.id,
      name: `${product.name} - ${selectedPrimary} x ${variant.name}`,
      quantity: 1,
      unit: product.unit,
      unit_price: variant.price,
      total: variant.price,
      reason: "Added via Product Catalog",
    };
    onAddToCart(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Bottom Sheet */}
      <div className="relative bg-white w-full max-w-md mx-auto rounded-t-2xl shadow-xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between">
          <h2 className="text-sm font-bold text-slate-900 pr-4">{product.name}</h2>
          <button
            onClick={onClose}
            className="p-1 -mr-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-6">
          {/* Primary Options (e.g. Depth) */}
          {primaryGroup && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800">
                {primaryGroup.name}
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {primaryGroup.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedPrimary(opt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      selectedPrimary === opt
                        ? "border-[#f4d03f] bg-[#fcf8e3] text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Options (e.g. Tandem Height) */}
          {secondaryGroup && (
            <div className="space-y-3">
              <h3 className="text-sm font-extrabold text-slate-800">
                {secondaryGroup.name}
              </h3>
              <div className="space-y-4 pt-1">
                {currentVariants.map((variant) => (
                  <div key={variant.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={variant.name}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-900">{variant.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-sm font-bold text-slate-900">₹{variant.price}</span>
                        {variant.mrp > variant.price && (
                          <span className="text-xs text-slate-400 line-through">₹{variant.mrp}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      {variant.inStock ? (
                        <button
                          onClick={() => handleAddVariant(variant)}
                          className="px-6 py-1.5 rounded-lg border-2 border-[#1a7a3a] text-[#1a7a3a] font-bold text-sm hover:bg-[#e8f5e9] active:scale-95 transition-all"
                        >
                          Add
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-6 py-1.5 rounded-lg border border-slate-200 text-slate-400 font-bold text-sm bg-slate-50 cursor-not-allowed"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white pb-safe">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
