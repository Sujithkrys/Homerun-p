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

    const ttsLanguage = languageMap[language || "en"] || "en-IN";

    // Truncate text to 2500 chars (Sarvam TTS limit for bulbul:v3)
    const truncatedText = text.slice(0, 2500);

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
        // Speaker selection — pick a clear voice
        speaker: "priya",
        // Audio config — use mp3 for smaller size and browser compat
        output_audio_codec: "mp3",
        // Speech sample rate
        speech_sample_rate: 22050,
        // Moderate speed (0.5 to 2.0)
        pace: 1.0,
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
