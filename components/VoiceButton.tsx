"use client";

import { useSarvamVoice, CallState } from "@/hooks/useSarvamVoice";

export function VoiceButton() {
  const { callState, start, stop } = useSarvamVoice();

  const handleClick = () => {
    if (callState === "idle") {
      start();
    } else {
      stop();
    }
  };

  // Determine button styles based on call state
  let buttonClasses = "flex items-center justify-center rounded-full transition-all duration-200 shrink-0 h-10 w-10 ";
  let disabled = false;

  const micIcon = (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );

  let content = micIcon;

  switch (callState) {
    case "idle":
      buttonClasses += "bg-[#1a7a3a] text-white hover:bg-[#145f2d] shadow-xs active:scale-95 cursor-pointer";
      break;

    case "connecting":
      buttonClasses += "bg-amber-100 text-amber-700 cursor-wait border border-amber-300";
      disabled = true;
      content = (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      );
      break;

    case "listening":
      buttonClasses += "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-md ring-2 ring-emerald-300 scale-105 cursor-pointer animate-pulse";
      break;

    case "speaking":
      buttonClasses += "bg-orange-100 text-orange-800 border border-orange-300 shadow-md ring-2 ring-orange-300 scale-105 cursor-pointer animate-pulse";
      break;
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={buttonClasses}
      aria-label="Toggle Voice Agent"
    >
      {content}
    </button>
  );
}

export default VoiceButton;
