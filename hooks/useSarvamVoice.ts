"use client";

import { useState, useEffect, useRef, useCallback } from "react";
// We import SarvamSession from the newly installed SDK
import SarvamSession from "sarvam-conval-embed";

export type CallState = "idle" | "connecting" | "listening" | "speaking";

export function useSarvamVoice() {
  const [callState, setCallState] = useState<CallState>("idle");
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize the Sarvam Session instance
    // The instructions specified using the env variables and interactionType = "call"
    const session = new SarvamSession({
      apiKey: process.env.NEXT_PUBLIC_SARVAM_EMBED_KEY || "",
      orgId: process.env.NEXT_PUBLIC_SARVAM_ORG_ID || "",
      workspaceId: process.env.NEXT_PUBLIC_SARVAM_WORKSPACE_ID || "",
      appId: process.env.NEXT_PUBLIC_SARVAM_AGENT_ID || "",
      interactionType: "call"
    });

    // Listen for state changes from the SDK
    session.on("stateChange", (newState: CallState) => {
      setCallState(newState);
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
