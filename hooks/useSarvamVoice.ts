"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type CallState = "idle" | "connecting" | "listening" | "speaking";

export function useSarvamVoice() {
  const [callState, setCallState] = useState<CallState>("idle");
  const sessionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Dynamically load the SDK only on the client side to avoid SSR ReferenceErrors
    let SarvamSessionModule: any;
    try {
      const pkg = require("sarvam-convai-embed");
      SarvamSessionModule = pkg.SarvamSession || pkg.default || pkg;
    } catch (e) {
      console.warn("Could not load sarvam-convai-embed");
      return;
    }

    if (!SarvamSessionModule) return;

    const session = new SarvamSessionModule({
      apiKey: process.env.NEXT_PUBLIC_SARVAM_EMBED_KEY || "",
      orgId: process.env.NEXT_PUBLIC_SARVAM_ORG_ID || "",
      workspaceId: process.env.NEXT_PUBLIC_SARVAM_WORKSPACE_ID || "",
      appId: process.env.NEXT_PUBLIC_SARVAM_AGENT_ID || "",
      interactionType: "call"
    });

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
