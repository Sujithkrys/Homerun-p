"use client";

interface VoiceButtonProps {
  isRecording: boolean;
  isProcessingSTT: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  disabled?: boolean;
}

export function VoiceButton({
  isRecording,
  isProcessingSTT,
  onStartRecording,
  onStopRecording,
  disabled,
}: VoiceButtonProps) {
  // Toggle recording on tap
  const handleClick = () => {
    if (disabled || isProcessingSTT) return;
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
      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 shrink-0 ${
        isRecording
          ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
          : isProcessingSTT
          ? "bg-gray-300 text-gray-500 cursor-wait"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      title={
        isRecording
          ? "Tap to stop recording"
          : isProcessingSTT
          ? "Processing speech..."
          : "Tap to speak"
      }
      aria-label={isRecording ? "Stop recording" : "Start voice recording"}
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
