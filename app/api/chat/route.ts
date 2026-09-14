import { SYSTEM_PROMPT, WHATSAPP_BEHAVIOR } from "@/lib/system-prompt";
import { detectLanguage } from "@/lib/language-detector";

// Determine which provider to use based on available API keys
function getProvider(): "sarvam" | "gemini" {
  if (process.env.SARVAM_API_KEY) return "sarvam";
  if (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY) return "gemini";
  return "sarvam"; // default
}

// Compact system prompt for Sarvam to stay well within its 32,000 token context window
function getSarvamSystemPrompt(channel?: string, detectedLang?: string | null): string {
  let prompt = SYSTEM_PROMPT
    .replace(/(\n\s{2,})/g, " ")
    .replace(/:\s+/g, ":")
    .replace(/,\s+/g, ",");
    
  if (channel === "whatsapp") {
    prompt += "\n" + WHATSAPP_BEHAVIOR.replace(/(\n\s{2,})/g, " ");
  }
  return prompt;
}

// ---- SARVAM AI (OpenAI-compatible API) ----
async function callSarvam(message: string, history: any[], channel?: string, detectedLang?: string | null) {
  const apiKey = process.env.SARVAM_API_KEY!;

  // Build messages array in OpenAI format
  const messages: any[] = [
    { role: "system", content: getSarvamSystemPrompt(channel, detectedLang) },
  ];

  // Add conversation history
  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
    }
  }

  // Add current user message
  let finalMessage = message;
  if (detectedLang) {
    const langSuffix = detectedLang === "English" ? "" : " (Romanized)";
    finalMessage += `\n\n[SYSTEM DIRECTIVE FOR ASSISTANT: The user's message above is in ${detectedLang}. You MUST write your reply in ${detectedLang}${langSuffix}, ignoring the language of previous messages. Do NOT use native script for Indian languages.]`;
  }
  messages.push({ role: "user", content: finalMessage });

  // Use sarvam-105b-conversations (latest active conversational chat model on Sarvam API; 'sarvam-m' is deprecated by Sarvam)
  const model = process.env.SARVAM_MODEL || "sarvam-105b-conversations";

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      response_format: { type: "json_object" },
      temperature: 0.6,
      max_tokens: 4096,
      // Guards against occasional repetition loops where the model gets stuck
      // re-emitting the same phrase until it hits max_tokens without ever
      // closing valid JSON.
      frequency_penalty: 0.4,
      presence_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Sarvam API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const responseText = data.choices[0].message.content;
  return responseText;
}

// ---- GEMINI (Google Generative AI) ----
async function callGemini(message: string, history: any[], channel?: string, detectedLang?: string | null) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Google Gemini API key");
  const genAI = new GoogleGenerativeAI(apiKey);

  const finalPrompt = channel === "whatsapp" ? SYSTEM_PROMPT + "\n" + WHATSAPP_BEHAVIOR : SYSTEM_PROMPT;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: finalPrompt,
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 4096,
      frequencyPenalty: 0.4,
      presencePenalty: 0.3,
    },
  });

  // Build chat history in Gemini format
  const chatHistory = (history || [])
    .slice(-10)
    .map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || "" }],
    }))
    .filter((msg: any) => msg.parts[0].text.trim().length > 0);

  // Sanitize: ensure history starts with "user" and alternates
  const sanitized: any[] = [];
  for (const msg of chatHistory) {
    if (sanitized.length === 0) {
      if (msg.role === "user") sanitized.push(msg);
    } else {
      const prev = sanitized[sanitized.length - 1];
      if (msg.role !== prev.role) sanitized.push(msg);
    }
  }
  // Remove trailing user message (sendMessage will add the current one)
  if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === "user") {
    sanitized.pop();
  }

  const chat = model.startChat({ history: sanitized });
  
  let finalMessage = message;
  if (detectedLang) {
    const langSuffix = detectedLang === "English" ? "" : " (Romanized)";
    finalMessage += `\n\n[SYSTEM DIRECTIVE FOR ASSISTANT: The user's message above is in ${detectedLang}. You MUST write your reply in ${detectedLang}${langSuffix}, ignoring the language of previous messages. Do NOT use native script for Indian languages.]`;
  }
  
  const result = await chat.sendMessage(finalMessage);
  return result.response.text();
}

// ---- MAIN ROUTE ----
export async function POST(req: Request) {
  const provider = getProvider();

  // Check that we have at least one API key
  if (!process.env.SARVAM_API_KEY && !process.env.GOOGLE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    return Response.json({
      message: "⚠️ No API key configured. Add SARVAM_API_KEY or GOOGLE_GEMINI_API_KEY to your environment variables.",
      recommended_products: [],
      cart_items: [],
      estimation_summary: null,
    });
  }

  try {
    const { message, history, channel } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({
        message: "I didn't receive a message. Please try again.",
        recommended_products: [],
        cart_items: [],
        estimation_summary: null,
      });
    }

    const detectedLang = detectLanguage(message);
    if (detectedLang) {
      console.log(`[LANGUAGE DETECTOR] Forced directive: ${detectedLang}`);
    }

    console.log(`[${provider.toUpperCase()}] User: ${message} (channel: ${channel || "web"})`);

    // Call the active provider
    let responseText: string;
    if (provider === "sarvam") {
      responseText = await callSarvam(message, history || [], channel, detectedLang);
    } else {
      responseText = await callGemini(message, history || [], channel, detectedLang);
    }

    console.log(`[${provider.toUpperCase()}] Response length: ${responseText.length}`);

    // Parse JSON from response (both providers might wrap in ```json blocks)
    let parsed;
    let jsonStr = responseText;
    try {
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      console.warn(`[${provider.toUpperCase()}] Failed to parse JSON (likely truncated), attempting recovery`);
      // The JSON is usually cut off mid-array (e.g. a long recommended_products
      // list overran max_tokens) rather than mid-"message" — "message" comes
      // first in the schema, so try to salvage just that field via regex
      // rather than ever showing the user raw/truncated JSON.
      let recoveredMessage: string | null = null;
      try {
        const match = jsonStr.match(/"message"\s*:\s*"((?:\\.|[^"\\])*)"/);
        if (match) recoveredMessage = JSON.parse(`"${match[1]}"`);
      } catch {}
      parsed = {
        message:
          recoveredMessage ||
          "Sorry, that request generated too large a response for me to complete. Could you narrow it down — e.g. one room or one category at a time?",
        recommended_products: [],
        cart_items: [],
        estimation_summary: null,
      };
    }

    // Ensure all expected fields exist (in case the model skips one)
    parsed.message = parsed.message || responseText;
    parsed.recommended_products = parsed.recommended_products || [];
    parsed.cart_items = parsed.cart_items || [];
    parsed.estimation_summary = parsed.estimation_summary || null;
    // Guard against the model emitting a placeholder summary (e.g. total_cost: 0)
    // while it's still asking a clarifying question instead of a real estimate.
    if (parsed.estimation_summary && !parsed.estimation_summary.total_cost) {
      parsed.estimation_summary = null;
    }

    // Temporary debug log requested by user
    parsed._debug_provider = provider;
    parsed._debug_model = provider === "sarvam" ? (process.env.SARVAM_MODEL || "sarvam-105b-conversations") : "gemini-1.5-flash";
    parsed._debug_user_message_received = message;

    return Response.json(parsed);

  } catch (error: any) {
    console.error(`[${provider.toUpperCase()}] Error:`, error.message);

    let userMessage = "Oops, I'm having trouble connecting. Please try again.";
    const errMsg = (error.message || "").toLowerCase();

    if (errMsg.includes("api key") || errMsg.includes("401") || errMsg.includes("unauthorized")) {
      userMessage = `⚠️ The ${provider === "sarvam" ? "Sarvam" : "Gemini"} API key is invalid. Check your environment variables.`;
    } else if (errMsg.includes("model") || errMsg.includes("404")) {
      userMessage = `⚠️ Model not found on ${provider === "sarvam" ? "Sarvam" : "Gemini"}. The model name may need updating.`;
    } else if (errMsg.includes("429") || errMsg.includes("quota") || errMsg.includes("rate")) {
      userMessage = "⚠️ Rate limit reached. Please wait a moment and try again.";
    }

    return Response.json({
      message: userMessage,
      recommended_products: [],
      cart_items: [],
      estimation_summary: null,
    });
  }
}
