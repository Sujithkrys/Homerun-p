"use client";

import { useState, useRef, useCallback } from "react";

interface UseVoiceReturn {
  isRecording: boolean;
  isProcessingSTT: boolean;
  isPlayingAudio: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
  playBotAudio: (text: string, language?: string) => Promise<void>;
  stopAudio: () => void;
  error: string | null;
}

export function useVoice(): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    try {
      setError(null);

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      // Use webm format (widely supported in browsers)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250); // Collect data every 250ms
      setIsRecording(true);
    } catch (err: any) {
      console.error("[Voice] Mic error:", err.message);
      if (err.name === "NotAllowedError") {
        setError("Microphone access denied. Please allow microphone in your browser settings.");
      } else if (err.name === "NotFoundError") {
        setError("No microphone found. Please connect a microphone.");
      } else {
        setError("Could not access microphone. Please try again.");
      }
    }
  }, []);

  // Stop recording and send to STT
  const stopRecording = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      return null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        // Stop all tracks to release the microphone
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        setIsRecording(false);
        setIsProcessingSTT(true);

        try {
          // Create audio blob from chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          audioChunksRef.current = [];

          // Don't send empty/tiny recordings
          if (audioBlob.size < 1000) {
            setIsProcessingSTT(false);
            setError("Recording too short. Please hold the button and speak.");
            resolve(null);
            return;
          }

          // Send to our STT API route
          const formData = new FormData();
          formData.append("audio", audioBlob, "recording.webm");

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.error) {
            setError(data.error);
            resolve(null);
          } else if (!data.transcript || data.transcript.trim() === "") {
            setError("Could not understand. Please speak clearly and try again.");
            resolve(null);
          } else {
            resolve(data.transcript.trim());
          }
        } catch (err: any) {
          console.error("[Voice] STT error:", err.message);
          setError("Speech recognition failed. Please try again.");
          resolve(null);
        } finally {
          setIsProcessingSTT(false);
        }
      };

      mediaRecorder.stop();
    });
  }, []);

  // Play bot response as audio using TTS
  const playBotAudio = useCallback(async (text: string, language?: string) => {
    try {
      setError(null);
      setIsPlayingAudio(true);

      // Strip markdown, emojis formatting for cleaner speech
      const cleanText = text
        .replace(/[*_~`#]/g, "")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/₹\s*/g, "rupees ")
        .slice(0, 2500);

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          language: language || "en",
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.warn("[Voice] TTS error:", data.error);
        setIsPlayingAudio(false);
        return;
      }

      // Convert base64 to audio and play
      const audioBytes = atob(data.audio);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }

      const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Stop any currently playing audio
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        audioElementRef.current = null;
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
        audioElementRef.current = null;
      };

      await audio.play();
    } catch (err: any) {
      console.error("[Voice] TTS playback error:", err.message);
      setIsPlayingAudio(false);
    }
  }, []);

  // Stop audio playback
  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
      setIsPlayingAudio(false);
    }
  }, []);

  return {
    isRecording,
    isProcessingSTT,
    isPlayingAudio,
    startRecording,
    stopRecording,
    playBotAudio,
    stopAudio,
    error,
  };
}
