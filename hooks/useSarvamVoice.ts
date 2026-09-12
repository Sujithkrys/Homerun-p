"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ConversationAgent, AgentState, InteractionType, BrowserAudioInterface } from "sarvam-conv-ai-sdk";

export type CallState = "idle" | "connecting" | "listening" | "speaking";

export function useSarvamVoice() {
  const [callState, setCallState] = useState<CallState>("idle");
  const sessionRef = useRef<ConversationAgent | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const session = new ConversationAgent({
      apiKey: process.env.NEXT_PUBLIC_SARVAM_EMBED_KEY || "",
      audioInterface: new BrowserAudioInterface(),
      config: {
        org_id: process.env.NEXT_PUBLIC_SARVAM_ORG_ID || "",
        workspace_id: process.env.NEXT_PUBLIC_SARVAM_WORKSPACE_ID || "",
        app_id: process.env.NEXT_PUBLIC_SARVAM_AGENT_ID || "",
        interaction_type: InteractionType.CALL,
        user_identifier_type: "custom",
        user_identifier: "web_user",
        input_sample_rate: 16000,
        output_sample_rate: 16000
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
  };
}
