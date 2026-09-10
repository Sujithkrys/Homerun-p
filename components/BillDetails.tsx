"use client";

import React from "react";
import { BillDetails as BillDetailsType } from "@/lib/types";
import { Info } from "lucide-react";

interface BillDetailsProps {
  bill: BillDetailsType;
  unloadingService?: boolean;
}

export default function BillDetails({ bill, unloadingService = false }: BillDetailsProps) {
  return (
    <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 text-xs space-y-2">
      <div className="flex items-center justify-between font-bold text-slate-800 text-[13px] border-b border-slate-200 pb-1.5">
        <span>📝 Bill Details</span>
        <span className="text-[10.5px] font-normal text-slate-500">Incl. all taxes</span>
      </div>

      <div className="space-y-1.5 text-slate-600">
        <div className="flex justify-between items-center">
          <span>Sub Total (incl. GST)</span>
          <span className="font-medium text-slate-800">
            ₹{bill.subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {unloadingService && (
          <div className="flex justify-between items-center text-emerald-700">
            <span>• Site Unloading Service</span>
            <span className="font-semibold">₹199</span>
          </div>
        )}

        <div className="flex justify-between items-center text-emerald-700">
          <span>Discount</span>
          <span>−₹{bill.discount}</span>
        </div>

        <div className="flex justify-between items-center text-slate-500">
          <span>HomeRun Cash</span>
          <span>−₹{bill.walletApplied}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          {bill.deliveryCharge === 0 ? (
            <span className="font-bold text-emerald-700 uppercase text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded">
              FREE
            </span>
          ) : (
            <span className="font-medium text-slate-800">₹{bill.deliveryCharge}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <span>Handling Charge</span>
          <span className="font-medium text-slate-800">₹{bill.handlingCharge}</span>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-black text-sm text-slate-900">
        <span>Total Payable</span>
        <span className="text-homerun-green text-base">
          ₹{bill.total.toLocaleString("en-IN")}
        </span>
      </div>

      <div className="pt-1.5 border-t border-dashed border-slate-200 flex items-start gap-1 text-[10.5px] text-slate-500">
        <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
        <span>
          <strong>Cancellation Policy:</strong> Free instant cancellation before site dispatch from hub.
        </span>
      </div>
    </div>
  );
}
