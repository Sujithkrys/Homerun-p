"use client";

import React, { useState } from "react";
import { ProjectEstimate } from "@/lib/types";
import { ChevronDown, ChevronUp, ClipboardList, Sparkles } from "lucide-react";

interface ProjectEstimateCardProps {
  projectEstimate: ProjectEstimate;
  variant?: "in-app" | "whatsapp";
}

export default function ProjectEstimateCard({
  projectEstimate,
  variant = "in-app",
}: ProjectEstimateCardProps) {
  // Default first room open, others closed
  const [openRooms, setOpenRooms] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleRoom = (index: number) => {
    setOpenRooms((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!projectEstimate || !projectEstimate.rooms || projectEstimate.rooms.length === 0) {
    return null;
  }

  // WhatsApp variant: text-friendly formatted card
  if (variant === "whatsapp") {
    return (
      <div className="mt-2.5 pt-2 border-t border-slate-200/80 bg-emerald-50/40 -mx-1.5 px-2.5 py-2.5 rounded-md font-sans text-xs">
        <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-[13px]">
          <span>📋</span>
          <span>{projectEstimate.project_name || "Project Breakdown"}</span>
        </div>

        <div className="mt-1 text-[11px] text-slate-600">
          Grand Total:{" "}
          <strong className="text-slate-900 font-bold">
            ₹{projectEstimate.grand_total.toLocaleString("en-IN")}
          </strong>
        </div>

        {projectEstimate.savings_on_bulk > 0 && (
          <div className="mt-0.5 text-[11px] text-emerald-700 font-medium">
            🎉 You save ₹{projectEstimate.savings_on_bulk.toLocaleString("en-IN")} with bulk pricing!
          </div>
        )}

        <div className="mt-2 space-y-2 border-t border-emerald-200/60 pt-2">
          {projectEstimate.rooms.map((room, idx) => (
            <div key={idx} className="bg-white/90 p-2 rounded border border-emerald-100">
              <div className="flex justify-between items-center font-bold text-slate-800 text-[11.5px]">
                <span>
                  {room.room_name} ({room.task_type})
                </span>
                <span className="text-emerald-800">
                  ₹{room.room_total.toLocaleString("en-IN")}
                </span>
              </div>
              <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 font-mono">
                {room.cart_items.map((item, iIdx) => (
                  <li key={iIdx} className="flex justify-between">
                    <span className="truncate max-w-[180px]">
                      • {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-700 ml-1">
                      ₹{item.total.toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // In-App / Web Platform / Mobile App variant
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-emerald-200 bg-white shadow-xs">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-50 to-teal-50/50 p-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">
              {projectEstimate.project_name || "Project Estimate"}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-600">Grand Total:</span>
              <span className="text-sm font-extrabold text-emerald-800">
                ₹{projectEstimate.grand_total.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {projectEstimate.savings_on_bulk > 0 && (
          <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>
              You save ₹{projectEstimate.savings_on_bulk.toLocaleString("en-IN")} with bulk pricing!
            </span>
          </div>
        )}
      </div>

      {/* Collapsible Rooms */}
      <div className="divide-y divide-slate-100">
        {projectEstimate.rooms.map((room, index) => {
          const isOpen = !!openRooms[index];
          return (
            <div key={index} className="transition-colors">
              {/* Room Toggle Row */}
              <button
                type="button"
                onClick={() => toggleRoom(index)}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="text-slate-400">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-xs text-slate-800">
                      {room.room_name}
                    </span>
                    <span className="ml-1.5 text-[11px] text-slate-600 font-medium capitalize">
                      — {room.task_type}
                      {room.area_sqft ? ` (${room.area_sqft} sqft)` : ""}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-xs font-bold text-emerald-700">
                    ₹{room.room_total.toLocaleString("en-IN")}
                  </span>
                </div>
              </button>

              {/* Room Items List (Collapsible) */}
              {isOpen && (
                <div className="px-3 pb-2.5 pt-0 bg-slate-50/50">
                  <div className="rounded-lg bg-white p-2 border border-slate-100 space-y-1.5">
                    {room.cart_items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="flex items-center justify-between text-xs py-0.5 text-slate-700"
                      >
                        <div className="truncate pr-2">
                          <span className="text-emerald-700 mr-1">•</span>
                          <span>{item.name}</span>
                          <span className="text-[11px] text-slate-600 ml-1">
                            × {item.quantity} {item.unit}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 shrink-0">
                          ₹{item.total.toLocaleString("en-IN")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Callout */}
      <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">All items merged into cart</span>
        <span className="font-bold text-emerald-800">
          Total ₹{projectEstimate.grand_total.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
