"use client";

interface AudioPlayButtonProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}

export function AudioPlayButton({ isPlaying, onPlay, onStop }: AudioPlayButtonProps) {
  return (
    <button
      type="button"
      onClick={isPlaying ? onStop : onPlay}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
        isPlaying
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 animate-pulse"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800"
      }`}
      title={isPlaying ? "Stop audio" : "Listen to this message"}
    >
      {isPlaying ? (
        /* Stop icon */
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        /* Speaker icon */
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.54 8.46a5 5 0 010 7.07"
          />
        </svg>
      )}
      <span>{isPlaying ? "Stop" : "Listen"}</span>
    </button>
  );
}

export default AudioPlayButton;
