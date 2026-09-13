"use client";

import React, { useState } from "react";
import { CartItem, ProjectEstimate, EstimationSummary } from "@/lib/types";
import { generateEstimatePDF } from "@/lib/generatePDF";
import { FileDown, Loader2 } from "lucide-react";

interface DownloadEstimateButtonProps {
  items: CartItem[];
  projectEstimate?: ProjectEstimate | null;
  estimationSummary?: EstimationSummary | null;
  variant?: "in-app" | "whatsapp";
}

export default function DownloadEstimateButton({
  items,
  projectEstimate = null,
  estimationSummary = null,
  variant = "in-app",
}: DownloadEstimateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const hasItems = (items && items.length > 0) || (projectEstimate?.rooms && projectEstimate.rooms.length > 0);
  const shouldShow = hasItems && Boolean(estimationSummary || projectEstimate);

  if (!shouldShow) {
    return null;
  }

  const handleDownload = () => {
    try {
      setIsGenerating(true);
      const blob = generateEstimatePDF(
        items,
        projectEstimate || null,
        estimationSummary || null
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().split("T")[0];
      a.download = `HomeRun_Estimate_${dateStr}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Failed to generate estimate PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // WhatsApp Variant
  if (variant === "whatsapp") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full mt-2 py-1.5 px-3 text-[12px] font-medium text-emerald-800 bg-white border border-emerald-300 rounded shadow-2xs hover:bg-emerald-50 active:scale-98 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <span>📄</span>
        )}
        <span>Download Estimate PDF</span>
      </button>
    );
  }

  // In-App / Web Platform / Mobile App Variant
  return (
    <div className="mt-3 flex items-center">
      <button
        type="button"
        onClick={handleDownload}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 bg-white border border-emerald-600/70 hover:bg-emerald-50 active:bg-emerald-100 rounded-xl shadow-2xs transition-all cursor-pointer disabled:opacity-60"
      >
        {isGenerating ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <FileDown className="w-3.5 h-3.5 text-emerald-600" />
        )}
        <span>📄 Download Estimate (PDF)</span>
      </button>
    </div>
  );
}
