"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ConversationAgent, AgentState, InteractionType, BrowserAudioInterface } from "sarvam-conv-ai-sdk";
export type CallState = "idle" | "connecting" | "listening" | "speaking";

export type TranscriptEntry = {
  role: "user" | "bot";
  content: string;
  timestamp: number;
};


// Helper to get or create a persistent session ID scoped by mode
const sessionCache = new Map<string, string>();

export function getOrCreateSessionId(mode: string = "default") {
  if (typeof window === "undefined") return `server-session-${mode}`;
  
  if (!sessionCache.has(mode)) {
    const newSessionId = crypto.randomUUID();
    sessionCache.set(mode, newSessionId);
  }
  return sessionCache.get(mode)!;
}

export function useSarvamVoice(mode: string = "default") {
  const [callState, setCallState] = useState<CallState>("idle");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const sessionRef = useRef<ConversationAgent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionId = getOrCreateSessionId(mode);
    console.log(`[useSarvamVoice] Session ID being used for mode ${mode}:`, sessionId);

    const configObject: any = {
      org_id: process.env.NEXT_PUBLIC_SARVAM_ORG_ID || "",
      workspace_id: process.env.NEXT_PUBLIC_SARVAM_WORKSPACE_ID || "",
      app_id: process.env.NEXT_PUBLIC_SARVAM_AGENT_ID || "",
      interaction_type: InteractionType.CALL,
      user_identifier_type: "custom",
      user_identifier: sessionId,
      input_sample_rate: 16000 as const,
      output_sample_rate: 16000 as const,
      agent_variables: {
        user_identifier: sessionId,
      }
    };

    console.log("[useSarvamVoice] Full session config:", JSON.stringify(configObject));
    console.log("[useSarvamVoice] agent_variables being sent:", JSON.stringify(configObject.agent_variables));

    const session = new ConversationAgent({
      apiKey: process.env.NEXT_PUBLIC_SARVAM_EMBED_KEY || "",
      audioInterface: new BrowserAudioInterface(),
      config: configObject,
      transcriptCallback: async (event: any) => {
        if (event.type === "server.event.transcription") {
          console.log("[Transcript] New entry:", event.role, event.content);
          setTranscript((prev) => {
            // Deduplicate by timestamp
            if (prev.some((entry) => entry.timestamp === event.timestamp)) {
              return prev;
            }
            return [...prev, {
              role: event.role,
              content: event.content,
              timestamp: event.timestamp
            }];
          });
        }
      },
      stateCallback: (newState: AgentState) => {
        // Map connected to listening, and error to idle to match the UI states
        if (newState === "connected" || newState === "listening") {
          setCallState("listening");
        } else if (newState === "error") {
          setCallState("idle");
        } else {
          setCallState(newState as CallState);
        }
      }
    });

    sessionRef.current = session;

    return () => {
      // Clean up the session when unmounting
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
  }, []);

  const start = useCallback(() => {
    if (sessionRef.current && callState === "idle") {
      setTranscript([]);
      sessionRef.current.start();
    }
  }, [callState]);

  const stop = useCallback(() => {
    if (sessionRef.current && callState !== "idle") {
      sessionRef.current.stop();
    }
  }, [callState]);

  return {
    callState,
    start,
    stop,
    transcript,
    setTranscript,
  };
}
