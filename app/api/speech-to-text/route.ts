export async function POST(req: Request) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Speech-to-text is not configured. Add SARVAM_API_KEY to environment variables." },
      { status: 500 }
    );
  }

  try {
    // Get the audio file from the request
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return Response.json({ error: "No audio file provided" }, { status: 400 });
    }

    // Forward to Sarvam STT API
    const sarvamFormData = new FormData();
    sarvamFormData.append("file", audioFile);
    sarvamFormData.append("model", "saaras:v1");
    // "unknown" tells Sarvam to auto-detect the language
    sarvamFormData.append("language_code", "unknown");
    // Enable timestamps for better accuracy
    sarvamFormData.append("with_timestamps", "true");
    // Transcription mode
    sarvamFormData.append("mode", "transcribe");

    const response = await fetch("https://api.sarvam.ai/speech-to-text", {
      method: "POST",
      headers: {
        "api-subscription-key": apiKey,
      },
      body: sarvamFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[STT] Sarvam API error:", response.status, errorText);
      return Response.json(
        { error: "Speech recognition failed. Please try again." },
        { status: 500 }
      );
    }

    const data = await response.json();
    // Sarvam STT returns: { transcript: "...", language_code: "hi-IN", ... }
    return Response.json({
      transcript: data.transcript || "",
      language: data.language_code || "unknown",
    });
  } catch (error: any) {
    console.error("[STT] Error:", error.message);
    return Response.json(
      { error: "Speech recognition failed. Please try again." },
      { status: 500 }
    );
  }
}
