import { SYSTEM_PROMPT, WHATSAPP_BEHAVIOR } from "@/lib/system-prompt";
import { detectLanguage } from "@/lib/language-detector";
import { SUPPORTED_LANGUAGES } from "@/lib/types";
import { PRODUCT_CATALOG } from "@/lib/catalog";
import { NextRequest } from "next/server";

export const runtime = "edge";

function detectExplicitLanguageName(text: string): string | null {
  const lower = text.toLowerCase();
  for (const lang of SUPPORTED_LANGUAGES) {
    if (new RegExp(`\\b${lang.toLowerCase()}\\b`).test(lower)) return lang;
  }
  return null;
}

function getProvider(): "sarvam" | "gemini" {
  if (process.env.SARVAM_API_KEY) return "sarvam";
  if (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY) return "gemini";
  return "sarvam";
}

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

// ---- SARVAM AI ----
async function callSarvamStream(message: string, history: any[], channel?: string, detectedLang?: string | null) {
  const apiKey = process.env.SARVAM_API_KEY!;
  const messages: any[] = [{ role: "system", content: getSarvamSystemPrompt(channel, detectedLang) }];

  if (history && history.length > 0) {
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content,
      });
    }
  }

  let finalMessage = message;
  if (detectedLang) {
    finalMessage += `\n\n[SYSTEM DIRECTIVE FOR ASSISTANT: You MUST write your reply in ${detectedLang}, ignoring the language of previous messages. CRITICAL: You MUST use Latin/English letters (Romanized script) for your reply, even if the user typed in native script. DO NOT output any native Indian script characters.]`;
  }
  messages.push({ role: "user", content: finalMessage });

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
      stream: true,
      temperature: 0.6,
      max_tokens: 4096,
      frequency_penalty: 0.4,
      presence_penalty: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Sarvam API error (${response.status}): ${await response.text()}`);
  }

  return response.body!;
}

// ---- GEMINI ----
async function callGeminiStream(message: string, history: any[], channel?: string, detectedLang?: string | null) {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Missing Google Gemini API key");
  const genAI = new GoogleGenerativeAI(apiKey);

  const finalPrompt = channel === "whatsapp" ? SYSTEM_PROMPT + "\n" + WHATSAPP_BEHAVIOR : SYSTEM_PROMPT;

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: finalPrompt,
    generationConfig: {
      maxOutputTokens: 4096,
      frequencyPenalty: 0.4,
      presencePenalty: 0.3,
    },
  });

  const chatHistory = (history || [])
    .slice(-10)
    .map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content || "" }],
    }))
    .filter((msg: any) => msg.parts[0].text.trim().length > 0);

  const sanitized: any[] = [];
  for (const msg of chatHistory) {
    if (sanitized.length === 0) {
      if (msg.role === "user") sanitized.push(msg);
    } else {
      const prev = sanitized[sanitized.length - 1];
      if (msg.role !== prev.role) sanitized.push(msg);
    }
  }
  if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === "user") {
    sanitized.pop();
  }

  const chat = model.startChat({ history: sanitized });
  
  let finalMessage = message;
  if (detectedLang) {
    finalMessage += `\n\n[SYSTEM DIRECTIVE FOR ASSISTANT: You MUST write your reply in ${detectedLang}, ignoring the language of previous messages. CRITICAL: You MUST use Latin/English letters (Romanized script) for your reply, even if the user typed in native script. DO NOT output any native Indian script characters.]`;
  }
  
  const result = await chat.sendMessageStream(finalMessage);
  
  // Convert AsyncGenerator to ReadableStream
  return new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    }
  });
}

// Models occasionally tack on stray trailing characters (e.g. an extra `}`)
// after an otherwise-complete JSON object, no matter how firmly the prompt
// says not to — JSON.parse then throws on the whole buffer even though the
// real object is fine. Scanning for the first balanced-brace object (respecting
// quoted strings) recovers it regardless of what follows.
function extractFirstJsonObject(str: string): string | null {
  const start = str.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < str.length; i++) {
    const ch = str[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
    } else if (ch === '"') {
      inString = true;
    } else if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0) return str.slice(start, i + 1);
    }
  }
  return null;
}

// Extract recommended products from message text
function extractRecommendedProductsFromText(messageText: string, cartItems: any[] = []) {
  const recommended: any[] = [];
  const lowerMsg = messageText.toLowerCase();

  // Products the model just put in cart_items (e.g. "buy 10 bags of X" gets
  // added directly) are almost always ALSO named in the reply's confirmation
  // sentence ("I've added 10 bags of X..."). Matching against the reply text
  // alone can't tell "still just being suggested" apart from "already
  // ordered" — so anything already in cart_items is excluded here rather
  // than being re-added as a "recommendation" defaulted to quantity 1, which
  // silently contradicted the real (correct) quantity already in the cart.
  const cartNamesLower = cartItems
    .filter((c) => c && typeof c.name === "string")
    .map((c) => c.name.toLowerCase());

  for (const product of PRODUCT_CATALOG) {
    const pName = product.name.toLowerCase();

    // Remove common generic words and normalize spacing to create a distinctive core phrase
    const coreName = pName
      .replace(/\b(cement|adani|bag|bags|the|for|with)\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (coreName.length > 3 && lowerMsg.includes(coreName)) {
      // Match on the same core phrase (not product_id) since cart_items'
      // product_id comes from the LLM's own free-text JSON and can drift
      // from the catalog id used here — the name is the reliable signal.
      const alreadyInCart = cartNamesLower.some(
        (cn) => cn.includes(coreName) || coreName.includes(cn)
      );
      if (alreadyInCart) continue;

      if (!recommended.find(r => r.product_id === product.id)) {
        recommended.push({
          product_id: product.id,
          name: product.name,
          quantity: 1, // Default quantity for display
          unit: product.unit,
          unit_price: product.price,
          total: product.price,
          reason: "Suggested option"
        });
      }
    }
  }

  return recommended;
}

// The model occasionally derails entirely — instead of the expected plain
// text + "---JSON_START---" + JSON format, it emits something like a
// tool-call/function-call block (e.g. "<tool_call><arg_key>...") that was
// never meant to be shown to a user. Because that has no "---JSON_START---"
// delimiter, the code above would otherwise treat the whole broken blob as
// ordinary "safe text" and stream it straight into the chat bubble. This
// heuristic catches that failure mode so it can be swapped for a clean
// fallback instead: a legitimate conversational reply never starts with
// "<" or "{", and never contains tool/function-call tag syntax.
function looksMalformed(text: string): boolean {
  const trimmed = text.trimStart();
  if (trimmed.length === 0) return false;
  if (trimmed[0] === "<" || trimmed[0] === "{") return true;
  return /<\/?\s*(tool_call|arg_key|arg_value|function_call|invoke)\b/i.test(text);
}

const MALFORMED_OUTPUT_FALLBACK =
  "Sorry, I had trouble putting that reply together — could you try rephrasing your message?";

// Validate cart items
function validateCartItems(parsed: any, history: any[], message: string) {
  if (Array.isArray(parsed.cart_items) && parsed.cart_items.length > 0) {
    const prevAssistantMsg = history && history.length >= 2 ? history[history.length - 2] : null;
    const prevOptions = prevAssistantMsg && prevAssistantMsg.role === "assistant" && Array.isArray(prevAssistantMsg.recommended_products)
      ? prevAssistantMsg.recommended_products
      : [];

    const wordCounts: Record<string, number> = {};
    if (prevOptions.length > 0) {
      prevOptions.forEach((opt: any) => {
        if (!opt || typeof opt.name !== "string") return;
        const words = opt.name.toLowerCase().split(/[^a-z0-9]+/);
        const uniqueWords = new Set<string>(words.filter((w: string) => w.length > 2));
        uniqueWords.forEach(w => {
          wordCounts[w] = (wordCounts[w] || 0) + 1;
        });
      });
    }

    const userMsgLower = message.toLowerCase();
    const hasNumberMatch = /\d/.test(userMsgLower) || /\b(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|1st|2nd|3rd|4th|5th|6th|7th|8th|9th|10th|one|two|three|four|five|six|seven|eight|nine|ten)\b/.test(userMsgLower);

    parsed.cart_items = parsed.cart_items.filter((item: any) => {
      if (!item || typeof item.name !== "string") return false;
      if (hasNumberMatch) return true;

      const itemWords = item.name.toLowerCase().split(/[^a-z0-9]+/);
      const hasDistinguishingWord = itemWords.some((word: string) => {
        if (word.length <= 2) return false;
        const isGeneric = prevOptions.length > 0 ? (wordCounts[word] > 1) : false;
        const isSuperGeneric = ["cement", "wire", "paint", "putty", "pipe", "bag", "bags", "cable", "tile", "adhesive"].includes(word);
        return !isGeneric && !isSuperGeneric && userMsgLower.includes(word);
      });

      return hasDistinguishingWord;
    });
  }
  return parsed;
}

export async function POST(req: NextRequest) {
  const provider = getProvider();

  if (!process.env.SARVAM_API_KEY && !process.env.GOOGLE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
    return new Response("⚠️ No API key configured. Add SARVAM_API_KEY or GOOGLE_GEMINI_API_KEY to your environment variables.");
  }

  try {
    const { message, history, channel, locked_language } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response("I didn't receive a message. Please try again.");
    }

    const detectedLang = detectExplicitLanguageName(message) || detectLanguage(message);
    if (detectedLang) {
      console.log(`[LANGUAGE DETECTOR] Forced directive: ${detectedLang}`);
    }
    console.log(`[${provider.toUpperCase()}] User: ${message} (channel: ${channel || "web"})`);

    if (locked_language && SUPPORTED_LANGUAGES.includes(locked_language) && detectedLang && detectedLang !== locked_language) {
      // Match the same wire format as the normal path (streamed text, then
      // a ---JSON_START--- delimiter, then a trailing metadata blob) — the
      // client only ever reads the message text from what comes before the
      // delimiter, so a bare JSON body here would render as raw JSON text
      // in the chat bubble instead of the confirmation question.
      const mismatchText = `You'd previously chosen **${locked_language}**, but this message looks like **${detectedLang}**. Which language should I continue in — ${locked_language} or ${detectedLang}?`;
      const tail = JSON.stringify({ detected_language: detectedLang, language_mismatch: true });
      return new Response(`${mismatchText}---JSON_START---${tail}`, {
        headers: { "X-Detected-Language": detectedLang },
      });
    }

    const effectiveLangDirective = locked_language && SUPPORTED_LANGUAGES.includes(locked_language) ? locked_language : detectedLang;

    // Get the raw stream from provider
    let rawStream: ReadableStream<Uint8Array>;
    if (provider === "sarvam") {
      // Sarvam returns SSE. We need to extract the text from the SSE chunks.
      //
      // Network chunk boundaries almost never line up with SSE "line"
      // boundaries — a `data: {...}\n` frame routinely arrives split across
      // two (or more) separate chunk() calls. The previous version decoded
      // and split('\n') each chunk in total isolation, so a line broken mid-
      // chunk produced two unparsable fragments (fails JSON.parse, silently
      // caught) and BOTH halves of that piece of text were dropped — visible
      // as blank or truncated replies, and worse under real network
      // conditions than in same-machine curl testing where a short response
      // often arrives as a single chunk. A persistent decoder (with
      // {stream:true}, so multi-byte UTF-8 — ₹, bullets, native scripts —
      // isn't corrupted either) plus a carried-over partial-line buffer
      // fixes this: only complete lines are ever parsed.
      const sseStream = await callSarvamStream(message, history || [], channel, effectiveLangDirective);
      const sseDecoder = new TextDecoder();
      let sseLineBuffer = "";

      const processSseLine = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
        if (line.startsWith('data: ') && line !== 'data: [DONE]') {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices[0]?.delta?.content;
            if (content) controller.enqueue(new TextEncoder().encode(content));
          } catch (e) {
            console.warn("[SARVAM] Dropped unparsable SSE line:", line.slice(0, 120));
          }
        }
      };

      rawStream = sseStream.pipeThrough(new TransformStream({
        transform(chunk, controller) {
          sseLineBuffer += sseDecoder.decode(chunk, { stream: true });
          const lines = sseLineBuffer.split('\n');
          // The last entry may be a partial line cut off mid-chunk — hold it
          // back and prepend it to whatever arrives next instead of parsing it now.
          sseLineBuffer = lines.pop() ?? "";
          for (const line of lines) {
            processSseLine(line, controller);
          }
        },
        flush(controller) {
          sseLineBuffer += sseDecoder.decode();
          if (sseLineBuffer) processSseLine(sseLineBuffer, controller);
        }
      }));
    } else {
      rawStream = await callGeminiStream(message, history || [], channel, effectiveLangDirective);
    }

    // Now pipe the raw text stream through our validation gate
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let buffer = "";
    let fullText = "";
    let isJsonMode = false;
    let jsonBuffer = "";

    // Before releasing any text live, hold back the first SNIFF_THRESHOLD
    // characters to check for a malformed/tool-call-style derailment (see
    // looksMalformed above) rather than streaming it straight to the user.
    // Once past that check for a given response, the rest streams exactly
    // as before — this only adds a few characters of buffering latency to
    // the very start of a normal reply.
    const SNIFF_THRESHOLD = 40;
    let sniffed = false;
    let suppressed = false;

    const validationStream = new TransformStream({
      transform(chunk, controller) {
        const text = decoder.decode(chunk, { stream: true });
        buffer += text;
        if (!isJsonMode) fullText += text;

        if (suppressed) return; // already decided this response is broken

        if (!isJsonMode) {
          if (!sniffed) {
            if (buffer.trim().length === 0) return; // wait for real content
            if (buffer.length < SNIFF_THRESHOLD && !looksMalformed(buffer)) {
              return; // not enough signal yet, keep buffering silently
            }
            sniffed = true;
            if (looksMalformed(buffer)) {
              suppressed = true;
              console.warn("[CHAT] Suppressed malformed model output:", buffer.slice(0, 200));
              return;
            }
          }

          const splitIdx = buffer.indexOf("---JSON_START---");
          if (splitIdx !== -1) {
            isJsonMode = true;
            // Emit everything before the delimiter as text
            const before = buffer.slice(0, splitIdx);
            if (before) controller.enqueue(encoder.encode(before));

            // The rest belongs to the JSON buffer
            jsonBuffer = buffer.slice(splitIdx + "---JSON_START---".length);
            // We also emit the delimiter itself so the frontend knows JSON is starting
            controller.enqueue(encoder.encode("---JSON_START---"));
          } else {
            // No delimiter found yet.
            // We must hold back enough chars to not accidentally split the delimiter.
            // "---JSON_START---" is 16 chars.
            if (buffer.length > 16) {
              const safeText = buffer.slice(0, buffer.length - 16);
              controller.enqueue(encoder.encode(safeText));
              buffer = buffer.slice(buffer.length - 16);
            }
          }
        } else {
          // Accumulate JSON
          jsonBuffer += text;
        }
      },
      flush(controller) {
        // Never expose a malformed/tool-call-derailed reply to the user,
        // whether it was caught by the early sniff or only became clear
        // once the (short) response had fully arrived.
        if (suppressed || (!isJsonMode && looksMalformed(fullText))) {
          if (!suppressed) {
            console.warn("[CHAT] Suppressed malformed model output (late detection):", fullText.slice(0, 200));
          }
          const tail = JSON.stringify({
            recommended_products: [],
            cart_items: [],
            estimation_summary: null,
          });
          controller.enqueue(encoder.encode(`${MALFORMED_OUTPUT_FALLBACK}---JSON_START---${tail}`));
          return;
        }

        // Emit any remaining safe text if we never hit JSON_START
        if (!isJsonMode && buffer.length > 0) {
          controller.enqueue(encoder.encode(buffer));
        }

        // Parse and validate the JSON buffer
        if (isJsonMode && jsonBuffer.trim().length > 0) {
          let parsed;
          let jsonStr = jsonBuffer;
          // First try to just extract a JSON object directly since that's safest
          const extracted = extractFirstJsonObject(jsonStr);
          if (extracted) {
             jsonStr = extracted;
          } else {
             // Fallback to stripping markdown if extractFirstJsonObject failed
             if (jsonStr.includes("```json")) {
               jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
             } else if (jsonStr.includes("```")) {
               const parts = jsonStr.split("```");
               jsonStr = parts.length > 1 ? parts[1].trim() : parts[0].trim();
             }
          }
          try {
            parsed = JSON.parse(jsonStr);
          } catch {
            console.warn(`Failed to parse JSON buffer, yielding raw buffer as fallback`);
            controller.enqueue(encoder.encode(jsonBuffer));
            return;
          }

          parsed = validateCartItems(parsed, history || [], message);
          
          // --- NEW RULE: Enforce deterministic recommended_products ---
          // Always compute recommended_products directly from the assistant's message text
          // to completely sidestep the LLM's unreliability in returning the JSON array.
          const splitIdx = fullText.indexOf("---JSON_START---");
          const msgText = splitIdx !== -1 ? fullText.slice(0, splitIdx) : fullText;
          parsed.recommended_products = extractRecommendedProductsFromText(
            msgText,
            Array.isArray(parsed.cart_items) ? parsed.cart_items : []
          );
          
          // Emit the validated JSON string
          controller.enqueue(encoder.encode(JSON.stringify(parsed)));
        }
      }
    });

    // Authoritative source for the client's language-lock resolution — the
    // model's own trailing JSON is what actually carries detected_language,
    // but it occasionally skips that JSON block on short/ambiguous replies,
    // silently losing every field in it. This header reflects what the
    // server itself already determined (explicit-name match, keyword
    // detector, or the standing lock), so the language picker can trust it
    // even when the JSON tail comes back empty.
    const headers: Record<string, string> = {};
    if (effectiveLangDirective) headers["X-Detected-Language"] = effectiveLangDirective;

    return new Response(rawStream.pipeThrough(validationStream), { headers });

  } catch (error: any) {
    console.error(`[${provider.toUpperCase()}] Error:`, error.message);
    const errMsg = (error.message || "").toLowerCase();
    let userMessage = "Oops, I'm having trouble connecting. Please try again.";
    if (errMsg.includes("api key") || errMsg.includes("401") || errMsg.includes("unauthorized")) {
      userMessage = `⚠️ The API key is invalid. Check your environment variables.`;
    }
    return new Response(userMessage);
  }
}
