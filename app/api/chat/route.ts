import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export async function POST(req: Request) {
  console.log("=== /api/chat called ===");

  // Check API key
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("ERROR: GOOGLE_GEMINI_API_KEY is not set!");
    return Response.json(
      {
        message:
          "⚠️ AI is not configured. The API key is missing. Please add GOOGLE_GEMINI_API_KEY to your environment variables.",
        cart_items: [],
        estimation_summary: null,
      },
      { status: 200 } // Return 200 so the frontend doesn't crash — the error shows as a bot message
    );
  }

  console.log("API key found, length:", apiKey.length);

  try {
    const body = await req.json();
    const { message, history } = body;

    console.log("User message:", message);
    console.log("History length:", history?.length || 0);

    if (!message || typeof message !== "string") {
      return Response.json({
        message: "I didn't receive a message. Please try again.",
        cart_items: [],
        estimation_summary: null,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const candidateModels = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

    // Build and sanitize chat history for Gemini:
    // 1. Map role "assistant" -> "model", filter empty messages
    // 2. Remove any leading "model" messages (Gemini requires history to start with "user")
    // 3. Ensure strictly alternating user <-> model sequence
    // 4. Exclude the current user message from history if present so chat.sendMessage(message) sends it
    const rawHistory = (history || [])
      .slice(-10)
      .map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || "" }],
      }))
      .filter((msg: any) => msg.parts[0].text.trim().length > 0);

    const chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    for (const msg of rawHistory) {
      if (chatHistory.length === 0) {
        // Gemini strictly requires the first message in history to be "user"
        if (msg.role === "user") {
          chatHistory.push(msg);
        }
      } else {
        // Gemini requires alternating roles
        const prev = chatHistory[chatHistory.length - 1];
        if (msg.role !== prev.role) {
          chatHistory.push(msg);
        }
      }
    }

    // If the last message in history is "user", remove it so chat.sendMessage(message) provides the active user turn
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === "user") {
      chatHistory.pop();
    }

    console.log("Sending to Gemini with", chatHistory.length, "sanitized history messages");

    let responseText = "";
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
        });

        // Try with 1 retry for resilience against 503 / network blips
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const chat = model.startChat({ history: chatHistory });
            const result = await chat.sendMessage(message);
            responseText = result.response.text();
            break;
          } catch (chatErr: any) {
            if (attempt === 0 && (chatErr.status === 503 || String(chatErr).includes("503"))) {
              console.warn(`Attempt 1 failed on ${modelName} with 503, retrying in 800ms...`);
              await new Promise((r) => setTimeout(r, 800));
              continue;
            }
            throw chatErr;
          }
        }

        if (responseText) {
          console.log(`Success with model ${modelName}, response length:`, responseText.length);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err.message);
        // If it's a 404 (model not found), try next model in candidate list
        const errMsg = (err.message || "").toLowerCase();
        if (errMsg.includes("404") || errMsg.includes("not found")) {
          continue;
        }
        // If other error, throw to outer catch
        throw err;
      }
    }

    if (!responseText) {
      throw lastError || new Error("All candidate models failed to respond");
    }

    console.log("Raw response preview:", responseText.substring(0, 200));

    // Parse JSON from response
    let parsed: any;
    try {
      let jsonStr = responseText;
      // Strip markdown code fences if present
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      parsed = JSON.parse(jsonStr);
      console.log("JSON parsed successfully");
    } catch (parseError) {
      console.warn("Failed to parse JSON from Gemini response, using raw text");
      parsed = {
        message: responseText,
        recommended_products: [],
        cart_items: [],
        estimation_summary: null,
      };
    }

    return Response.json(parsed);
  } catch (error: any) {
    console.error("=== GEMINI API ERROR ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", JSON.stringify(error, null, 2));

    // Return a friendly error message as a bot response (not a 500)
    let userMessage =
      "Oops, I'm having trouble connecting right now. Please try again in a moment.";

    const errMsg = (error.message || "").toLowerCase();
    if (
      errMsg.includes("api key") ||
      errMsg.includes("401") ||
      errMsg.includes("unauthorized") ||
      errMsg.includes("key not valid")
    ) {
      userMessage =
        "⚠️ The API key seems invalid. Please check GOOGLE_GEMINI_API_KEY in your environment variables.";
    } else if (
      (errMsg.includes("model") && errMsg.includes("not found")) ||
      errMsg.includes("404")
    ) {
      userMessage =
        "⚠️ The AI model was not found. Please verify the Gemini model configuration.";
    } else if (
      errMsg.includes("429") ||
      errMsg.includes("quota") ||
      errMsg.includes("rate")
    ) {
      userMessage =
        "⚠️ Rate limit reached. The free tier allows 15 requests per minute. Please wait a moment and try again.";
    } else if (errMsg.includes("503") || errMsg.includes("unavailable")) {
      userMessage =
        "⚠️ Google's AI service is temporarily busy. Please wait a few seconds and try your message again.";
    }

    return Response.json(
      {
        message: userMessage,
        recommended_products: [],
        cart_items: [],
        estimation_summary: null,
      },
      { status: 200 } // Return 200 so frontend handles it as a normal bot message
    );
  }
}
