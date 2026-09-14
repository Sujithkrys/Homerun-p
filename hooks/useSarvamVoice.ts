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

    // Diagnostic only. The SDK's own compiled code (voice-agent.js) already
    // calls audioInterface.interrupt() when it receives USER_INTERRUPT from
    // the server — the mechanism looks complete reading the source (it stops
    // every currently-scheduled AudioBufferSourceNode). What can't be
    // confirmed by reading source is whether that call is actually reaching
    // *this* instance at the right moment in a real browser session. Wrapping
    // the method (rather than guessing at a fix) makes that directly
    // observable: this log only fires if the SDK internally invokes it.
    const audioInterface = new BrowserAudioInterface();
    const originalInterrupt = audioInterface.interrupt.bind(audioInterface);
    audioInterface.interrupt = () => {
      console.log("[useSarvamVoice] audioInterface.interrupt() called by SDK at", new Date().toISOString());
      originalInterrupt();
    };

    const session = new ConversationAgent({
      apiKey: process.env.NEXT_PUBLIC_SARVAM_EMBED_KEY || "",
      audioInterface,
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
        } else if (event.type === "server.event.user_interrupt") {
          // Own log line (not just the generic fallback below) so it's easy
          // to line this timestamp up against the
          // "audioInterface.interrupt() called by SDK" log above — if that
          // line is missing or arrives noticeably later than this one, the
          // gap is the actual bug; if both fire together and audio still
          // plays, the problem is downstream of our code entirely.
          console.log("[useSarvamVoice] user_interrupt event received at", new Date().toISOString(), JSON.stringify(event));
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
