"use client";

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessingSTT: boolean;
  isPlayingAudio?: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onStopAudio?: () => void;
  disabled?: boolean;
}

export function VoiceButton({
  isRecording,
  isProcessingSTT,
  isPlayingAudio = false,
  onStartRecording,
  onStopRecording,
  onStopAudio,
  disabled,
}: VoiceButtonProps) {
  // Toggle recording or interrupt speaking on tap
  const handleClick = () => {
    if (disabled || isProcessingSTT) return;
    if (isPlayingAudio) {
      onStopAudio?.();
      onStartRecording();
      return;
    }
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || isProcessingSTT}
      className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shrink-0 ${
        isRecording
          ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40 ring-2 ring-red-300 scale-105"
          : isProcessingSTT
          ? "bg-amber-100 text-amber-700 cursor-wait border border-amber-300"
          : isPlayingAudio
          ? "bg-[#1a7a3a] text-white animate-pulse shadow-md shadow-emerald-500/40 ring-2 ring-emerald-300 scale-105"
          : "bg-emerald-50 text-[#1a7a3a] border border-emerald-300 hover:bg-[#1a7a3a] hover:text-white hover:border-[#1a7a3a] shadow-xs active:scale-95"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={
        isRecording
          ? "Tap to stop recording"
          : isProcessingSTT
          ? "Transcribing speech with Sarvam AI..."
          : isPlayingAudio
          ? "Voice Agent is speaking (tap to interrupt and speak)"
          : "Voice Assistant — Speak in Kannada, Hindi, Telugu, English"
      }
      aria-label={isRecording ? "Stop recording" : isPlayingAudio ? "Interrupt voice" : "Start voice recording"}
    >
      {isProcessingSTT ? (
        /* Spinner icon */
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : isRecording ? (
        /* Stop icon (square) */
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : isPlayingAudio ? (
        /* Animated speaking sound waves */
        <div className="flex items-center gap-0.5 h-4 select-none pointer-events-none">
          <span className="w-1 bg-white h-2.5 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1 bg-white h-4 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1 bg-white h-3 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      ) : (
        /* Microphone icon */
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 10v2a7 7 0 01-14 0v-2"
          />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      )}
    </button>
  );
}

export default VoiceButton;
