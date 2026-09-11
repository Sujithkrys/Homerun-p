"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceOptions {
  onSpeechResult?: (transcript: string) => void;
}

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

export function useVoice(options?: UseVoiceOptions): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingSTT, setIsProcessingSTT] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const hasSpokenRef = useRef(false);
  const isRecordingRef = useRef(false);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  // Clean text helper for natural human speech synthesis
  const cleanForSpeech = (rawText: string): string => {
    return rawText
      .replace(/[*_~`#]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/₹\s*/g, "rupees ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 600); // 600 chars is ideal for rapid voice response
  };

  // Browser speech synthesis fallback (0ms latency, always works)
  const speakWithBrowserSynthesis = (text: string, lang?: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Select voice matching language if available
      const voices = window.speechSynthesis.getVoices();
      const targetLang = (lang || "en").toLowerCase();
      const matchedVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(targetLang)
      );
      if (matchedVoice) utterance.voice = matchedVoice;

      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("[Voice] Web Speech Synthesis error:", e);
      setIsPlayingAudio(false);
    }
  };

  // Internal stop handler
  const executeStop = useCallback(async (): Promise<string | null> => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") {
      return null;
    }

    // Cancel silence detection loops
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    return new Promise((resolve) => {
      const mediaRecorder = mediaRecorderRef.current!;

      mediaRecorder.onstop = async () => {
        // Stop all mic tracks
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        isRecordingRef.current = false;
        setIsRecording(false);
        setIsProcessingSTT(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: mediaRecorder.mimeType || "audio/webm",
          });
          audioChunksRef.current = [];

          if (audioBlob.size < 250) {
            setIsProcessingSTT(false);
            resolve(null);
            return;
          }

          const ext = (mediaRecorder.mimeType || "").includes("mp4") ? "mp4" : "webm";
          const formData = new FormData();
          formData.append("audio", audioBlob, `recording.${ext}`);

          const response = await fetch("/api/speech-to-text", {
            method: "POST",
            body: formData,
          });

          const data = await response.json();

          if (data.error) {
            setError(data.error);
            resolve(null);
          } else if (!data.transcript || data.transcript.trim() === "") {
            setError("Could not understand your speech. Please speak clearly.");
            resolve(null);
          } else {
            const cleanTranscript = data.transcript.trim();
            resolve(cleanTranscript);
            // Trigger auto-callback if provided
            if (optionsRef.current?.onSpeechResult) {
              optionsRef.current.onSpeechResult(cleanTranscript);
            }
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

  // Start recording from microphone
  const startRecording = useCallback(async () => {
    try {
      setError(null);
      hasSpokenRef.current = false;

      // 1. Pre-warm and unlock audio element ON DIRECT USER GESTURE
      // This is crucial: Chrome/Safari require .play() during direct click
      if (!audioElementRef.current) {
        audioElementRef.current = new Audio();
      }
      const audio = audioElementRef.current;
      // Play 0.05s silent wav to establish autoplay permission
      audio.src =
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
      audio.play().catch(() => {});

      // 2. Request microphone access
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

      // 3. Determine best supported audio MIME type across all browsers (including iOS Safari)
      let mimeType = "";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }
      }

      const mediaRecorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(200);
      isRecordingRef.current = true;
      setIsRecording(true);

      // 4. Voice Activity Detection (VAD) / Silence Auto-Endpointing
      try {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          analyserRef.current = analyser;

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let silenceStart: number | null = null;

          const monitorAudio = () => {
            if (!isRecordingRef.current) return;
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avgVolume = sum / dataArray.length;

            // Volume threshold for human speech
            if (avgVolume > 14) {
              hasSpokenRef.current = true;
              silenceStart = null;
            } else if (hasSpokenRef.current) {
              if (silenceStart === null) {
                silenceStart = Date.now();
              } else if (Date.now() - silenceStart > 1800) {
                // User spoke and has now been silent for 1.8 seconds -> auto-respond!
                executeStop();
                return;
              }
            }

            animFrameRef.current = requestAnimationFrame(monitorAudio);
          };

          animFrameRef.current = requestAnimationFrame(monitorAudio);
        }
      } catch (vadErr) {
        console.warn("[Voice] VAD initialization skipped:", vadErr);
      }
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
  }, [executeStop]);

  // Stop recording and send to STT
  const stopRecording = useCallback(async (): Promise<string | null> => {
    return executeStop();
  }, [executeStop]);

  // Play bot response as audio using Sarvam TTS (with browser synthesis fallback)
  const playBotAudio = useCallback(async (text: string, language?: string) => {
    if (!text || !text.trim()) return;

    try {
      setError(null);
      setIsPlayingAudio(true);

      const cleanText = cleanForSpeech(text);

      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          language: language || "en",
        }),
      });

      const data = await response.json();

      if (data.error || !data.audio) {
        console.warn("[Voice] TTS API error, using browser synthesis fallback:", data.error);
        speakWithBrowserSynthesis(cleanText, language);
        return;
      }

      // Convert base64 audio to Blob URL
      const audioBytes = atob(data.audio);
      const audioArray = new Uint8Array(audioBytes.length);
      for (let i = 0; i < audioBytes.length; i++) {
        audioArray[i] = audioBytes.charCodeAt(i);
      }

      const audioBlob = new Blob([audioArray], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Reuse the pre-warmed, unlocked audio element
      let audio = audioElementRef.current;
      if (!audio) {
        audio = new Audio();
        audioElementRef.current = audio;
      }

      audio.src = audioUrl;

      audio.onended = () => {
        setIsPlayingAudio(false);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = (e) => {
        console.warn("[Voice] Audio playback failed, using browser synthesis fallback:", e);
        URL.revokeObjectURL(audioUrl);
        speakWithBrowserSynthesis(cleanText, language);
      };

      await audio.play();
    } catch (err: any) {
      console.warn("[Voice] Playback error, using browser synthesis fallback:", err.message);
      speakWithBrowserSynthesis(cleanForSpeech(text), language);
    }
  }, []);

  // Stop audio playback / interrupt agent
  const stopAudio = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    setIsPlayingAudio(false);
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
