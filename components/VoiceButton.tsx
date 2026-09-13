"use client";

import { CallState } from "@/hooks/useSarvamVoice";

interface VoiceButtonProps {
  callState: CallState;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceButton({ callState, onStart, onStop }: VoiceButtonProps) {
  const handleClick = () => {
    if (callState === "idle") {
      onStart();
    } else {
      onStop();
    }
  };

  // Determine button styles based on call state
  let buttonClasses = "flex items-center justify-center rounded-full transition-all duration-200 shrink-0 h-10 w-10 ";
  let disabled = false;

  const micIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="9" x2="6" y2="15"/>
      <line x1="10" y1="6" x2="10" y2="18"/>
      <line x1="14" y1="4" x2="14" y2="20"/>
      <line x1="18" y1="8" x2="18" y2="16"/>
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
