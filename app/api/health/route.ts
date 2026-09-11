import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET() {
  const checks: Record<string, any> = {};

  // Check 1: Is the env var set?
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  checks.env_var_exists = !!apiKey;
  checks.env_var_name = process.env.GOOGLE_GEMINI_API_KEY
    ? "GOOGLE_GEMINI_API_KEY"
    : process.env.GEMINI_API_KEY
    ? "GEMINI_API_KEY"
    : "GOOGLE_GEMINI_API_KEY";
  checks.env_var_length = apiKey ? apiKey.length : 0;
  checks.env_var_prefix = apiKey ? apiKey.substring(0, 6) + "..." : "MISSING";

  if (!apiKey) {
    return Response.json(
      {
        status: "FAIL",
        error: "GOOGLE_GEMINI_API_KEY environment variable is not set",
        checks,
        fix: "Add GOOGLE_GEMINI_API_KEY to .env.local (local dev) or Vercel Environment Variables (production). Then restart the dev server or redeploy on Vercel.",
      },
      { status: 500 }
    );
  }

  // Check 2: Can we initialize the Gemini client and call the model?
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    checks.client_initialized = true;

    // Try gemini-3.6-flash first (current supported version), fallback to gemini-2.0-flash
    const candidateModels = ["gemini-3.6-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
    let responseText = "";
    let workingModel = "";
    let lastErr: any = null;

    for (const mName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: mName });
        const result = await model.generateContent("Say hello in one word.");
        responseText = result.response.text();
        workingModel = mName;
        break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (!workingModel) {
      throw lastErr;
    }

    checks.model_name = workingModel;
    checks.api_response = responseText.trim();
    checks.api_works = true;

    return Response.json({
      status: "OK",
      message: `Gemini API is working correctly with model: ${workingModel}!`,
      checks,
    });
  } catch (error: any) {
    checks.api_works = false;
    checks.error_message = error.message || String(error);
    checks.error_name = error.name || "Unknown";

    // Detect common error patterns and suggest fixes
    let fix = "";
    const errMsg = (error.message || "").toLowerCase();

    if (
      errMsg.includes("api key") ||
      errMsg.includes("api_key_invalid") ||
      errMsg.includes("unauthorized") ||
      errMsg.includes("401") ||
      errMsg.includes("key not valid")
    ) {
      fix =
        "The API key is invalid or expired. Go to https://aistudio.google.com/apikey and generate a new key. Replace the old key in .env.local and Vercel.";
    } else if (
      errMsg.includes("model") ||
      errMsg.includes("not found") ||
      errMsg.includes("404")
    ) {
      fix =
        "The model name 'gemini-3.6-flash' or 'gemini-2.0-flash' may not be available. Try changing to 'gemini-3.6-flash' or 'gemini-1.5-flash' in both this health check and app/api/chat/route.ts.";
    } else if (
      errMsg.includes("quota") ||
      errMsg.includes("rate") ||
      errMsg.includes("429")
    ) {
      fix =
        "Rate limit or quota exceeded. The free tier allows 1500 requests/day and 15 requests/minute. Wait a few minutes and try again.";
    } else if (
      errMsg.includes("network") ||
      errMsg.includes("fetch") ||
      errMsg.includes("econnrefused")
    ) {
      fix =
        "Network error — cannot reach Google's API. Check your internet connection. If on Vercel, this should work automatically.";
    } else {
      fix =
        "Unknown error. Check the full error message above and search for it in the Gemini API docs.";
    }

    return Response.json(
      {
        status: "FAIL",
        error: error.message,
        fix,
        checks,
      },
      { status: 500 }
    );
  }
}
