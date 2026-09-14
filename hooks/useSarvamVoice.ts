"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ConversationAgent, AgentState, InteractionType, BrowserAudioInterface } from "sarvam-conv-ai-sdk";
export type CallState = "idle" | "connecting" | "listening" | "speaking";

export type TranscriptEntry = {
  role: "user" | "bot";
  content: string;
  timestamp: number;
  cart_items?: import("@/lib/types").CartItem[];
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

export function useSarvamVoice(mode: string = "default", preferredLanguage?: string | null) {
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
      ...(preferredLanguage ? { initial_language_name: preferredLanguage } : {}),
      agent_variables: {
        user_identifier: sessionId,
        // Kept for fallback/prompt injection if the template reads it
        ...(preferredLanguage ? { preferred_language: preferredLanguage } : {}),
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
      // Diagnostic only — not currently rendered anywhere. The SDK's own
      // type for "server.action.interaction_connected" (ServerInteractionConnectedEvent)
      // echoes back whatever CustomAppOverrides the server actually received
      // and accepted, including initial_language_name. That's the one place
      // we can directly confirm — instead of guessing — whether our
      // preferredLanguage value ever reaches Sarvam's agent, as opposed to
      // being silently dropped or ignored by the specific agent template
      // behind app_id. server.event.language_change is also logged in full
      // (its payload isn't typed in this SDK version, so this is the only
      // way to see what fields it actually carries at runtime).
      eventCallback: async (event: any) => {
        if (event.type === "server.action.interaction_connected") {
          console.log("[useSarvamVoice] interaction_connected — server-acknowledged config:", JSON.stringify(event));
        } else if (event.type === "server.event.language_change") {
          console.log("[useSarvamVoice] language_change event:", JSON.stringify(event));
        } else {
          console.log("[useSarvamVoice] event:", event.type, JSON.stringify(event));
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
      // Clean up the session when unmounting, or before rebuilding it below
      // with a new preferredLanguage.
      if (sessionRef.current) {
        sessionRef.current.stop();
      }
    };
    // Rebuilding the session (and reconnecting) is how a language switch
    // mid-conversation takes effect — the agent needs a fresh session to
    // pick up the new preferred_language.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferredLanguage]);

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
