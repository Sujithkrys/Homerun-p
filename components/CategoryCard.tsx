"use client";

import React from "react";
import { CategoryWithSvg } from "@/lib/categories";

interface CategoryCardProps {
  category: CategoryWithSvg;
  onClick: () => void;
  variant?: "mobile" | "web";
}

export default function CategoryCard({ category, onClick, variant = "mobile" }: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col items-center justify-start text-center group cursor-pointer active:scale-95 transition-transform"
    >
      {/* Light Mint Rounded Card with SVG illustration */}
      <div className="w-full aspect-square rounded-2xl bg-[#eef7f3] hover:bg-[#e4f3ed] p-2 sm:p-2.5 flex items-center justify-center transition-all border border-[#d8eee3] shadow-2xs group-hover:shadow-xs group-hover:scale-102">
        <div
          className="w-full h-full flex items-center justify-center pointer-events-none"
          dangerouslySetInnerHTML={{ __html: category.svg }}
        />
      </div>

      {/* Category Name below */}
      <span className="mt-1.5 text-[11.5px] sm:text-xs font-semibold text-[#1a1a1a] leading-tight line-clamp-2 px-0.5 group-hover:text-homerun-green transition-colors">
        {category.name}
      </span>
    </button>
  );
}
