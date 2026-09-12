import { SYSTEM_PROMPT } from "@/lib/system-prompt";

// Determine which provider to use based on available API keys
function getProvider(): "sarvam" | "gemini" {
  if (process.env.SARVAM_API_KEY) return "sarvam";
  if (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY) return "gemini";
  return "sarvam"; // default
}

// Compact system prompt for Sarvam to stay well within its 32,000 token context window
function getSarvamSystemPrompt(): string {
  let prompt = SYSTEM_PROMPT
    .replace(/(\n\s{2,})/g, " ")
    .replace(/:\s+/g, ":")
    .replace(/,\s+/g, ",");
  return prompt + " IMPORTANT: You MUST always reply in the same language that the user uses to communicate with you. For example, if they speak in Hindi, reply in Hindi. If they speak in English, reply in English.";
}

// ---- SARVAM AI (OpenAI-compatible API) ----
async function callSarvam(message: string, history: any[]) {
  const apiKey = process.env.SARVAM_API_KEY!;

  // Build messages array in OpenAI format
  const messages: any[] = [
    { role: "system", content: getSarvamSystemPrompt() },
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
  messages.push({ role: "user", content: message });

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
      max_tokens: 1024,
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
async function callGemini(message: string, history: any[]) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Google Gemini API key");
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      responseMimeType: "application/json",
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
  const result = await chat.sendMessage(message);
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
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json({
        message: "I didn't receive a message. Please try again.",
        recommended_products: [],
        cart_items: [],
        estimation_summary: null,
      });
    }

    console.log(`[${provider.toUpperCase()}] User: ${message}`);

    // Call the active provider
    let responseText: string;
    if (provider === "sarvam") {
      responseText = await callSarvam(message, history || []);
    } else {
      responseText = await callGemini(message, history || []);
    }

    console.log(`[${provider.toUpperCase()}] Response length: ${responseText.length}`);

    // Parse JSON from response (both providers might wrap in ```json blocks)
    let parsed;
    try {
      let jsonStr = responseText;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      console.warn(`[${provider.toUpperCase()}] Failed to parse JSON, using raw text`);
      parsed = {
        message: responseText,
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
