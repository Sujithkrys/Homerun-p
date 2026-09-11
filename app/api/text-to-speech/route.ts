export async function POST(req: Request) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Text-to-speech is not configured. Add SARVAM_API_KEY to environment variables." },
      { status: 500 }
    );
  }

  try {
    const { text, language } = await req.json();

    if (!text || typeof text !== "string") {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    // Map language codes to Sarvam TTS BCP-47 format
    // STT returns "hi-IN" format, TTS also expects "hi-IN" format
    const languageMap: Record<string, string> = {
      "hi-IN": "hi-IN",
      "kn-IN": "kn-IN",
      "te-IN": "te-IN",
      "ta-IN": "ta-IN",
      "ml-IN": "ml-IN",
      "mr-IN": "mr-IN",
      "bn-IN": "bn-IN",
      "gu-IN": "gu-IN",
      "pa-IN": "pa-IN",
      "en-IN": "en-IN",
      // Short codes → full BCP-47
      hi: "hi-IN",
      kn: "kn-IN",
      te: "te-IN",
      ta: "ta-IN",
      ml: "ml-IN",
      mr: "mr-IN",
      bn: "bn-IN",
      gu: "gu-IN",
      pa: "pa-IN",
      en: "en-IN",
    };

    let ttsLanguage = languageMap[language || ""] || "";
    if (!ttsLanguage || ttsLanguage === "en-IN") {
      // Auto-detect native script from text
      if (/[\u0C80-\u0CFF]/.test(text)) ttsLanguage = "kn-IN"; // Kannada
      else if (/[\u0900-\u097F]/.test(text)) ttsLanguage = "hi-IN"; // Hindi / Marathi
      else if (/[\u0C00-\u0C7F]/.test(text)) ttsLanguage = "te-IN"; // Telugu
      else if (/[\u0B80-\u0BFF]/.test(text)) ttsLanguage = "ta-IN"; // Tamil
      else if (/[\u0D00-\u0D7F]/.test(text)) ttsLanguage = "ml-IN"; // Malayalam
      else if (/[\u0980-\u09FF]/.test(text)) ttsLanguage = "bn-IN"; // Bengali
      else if (/[\u0A80-\u0AFF]/.test(text)) ttsLanguage = "gu-IN"; // Gujarati
      else if (/[\u0A00-\u0A7F]/.test(text)) ttsLanguage = "pa-IN"; // Punjabi
      else ttsLanguage = "en-IN";
    }

    // Truncate text to 1000 chars for rapid voice synthesis
    const truncatedText = text.slice(0, 1000);

    const response = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        text: truncatedText,
        language_code: ttsLanguage,
        model: "bulbul:v3",
        // Speaker selection — pick a clear natural voice
        speaker: "priya",
        // Audio config — use mp3 for smaller size and browser compat
        output_audio_codec: "mp3",
        // Speech sample rate
        speech_sample_rate: 22050,
        // Fluid natural conversational speed
        pace: 1.05,
        // Normalize English words and numbers in Indian language text
        enable_preprocessing: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[TTS] Sarvam API error:", response.status, errorText);
      return Response.json(
        { error: "Text-to-speech failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    // Sarvam TTS returns: { audios: ["base64_encoded_audio_string"] }
    const audioBase64 = data.audios?.[0];

    if (!audioBase64) {
      return Response.json(
        { error: "No audio generated" },
        { status: 500 }
      );
    }

    return Response.json({
      audio: audioBase64,
      format: "mp3",
    });
  } catch (error: any) {
    console.error("[TTS] Error:", error.message);
    return Response.json(
      { error: "Text-to-speech failed. Please try again." },
      { status: 500 }
    );
  }
}
