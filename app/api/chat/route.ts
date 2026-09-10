import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { CartItem, ChatResponse, EstimationSummary } from "@/lib/types";

// Local fallback responses for the 5 demo quick actions if API key is not configured yet
function getMockDemoResponse(message: string): ChatResponse | null {
  const lower = message.toLowerCase();

  if (lower.includes("10 bags ultratech ppc") || (lower.includes("ultratech") && lower.includes("10"))) {
    const item: CartItem = {
      product_id: "cem-001",
      name: "UltraTech PPC Cement",
      quantity: 10,
      unit: "bag",
      unit_price: 410,
      total: 4100,
      reason: "Direct contractor bulk order for 10 bags",
    };
    return {
      message: "Here is your order breakdown for **10 bags of UltraTech PPC Cement (50 Kg Bag)**.\n\n- **Unit Price:** ₹410 / bag (MRP: ₹440, Bulk Rate: ₹390)\n- **Total Amount:** ₹4,100\n- **Delivery:** ⚡ Guaranteed in 60 minutes across Bangalore directly to your job site.\n\nI have added these bags to your cart. Ready to dispatch!",
      cart_items: [item],
      estimation_summary: {
        project_type: "Cement Order",
        area_sqft: null,
        total_cost: 4100,
      },
    };
  }

  if (lower.includes("tiling") && (lower.includes("200") || lower.includes("bathroom"))) {
    const items: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 6,
        unit: "bag",
        unit_price: 470,
        total: 2820,
        reason: "Coverage: ~35 sqft/bag at 3mm bed thickness for 200 sqft bathroom",
      },
      {
        product_id: "til-005",
        name: "Roff Rainbow Tile Grout",
        quantity: 2,
        unit: "pack",
        unit_price: 160,
        total: 320,
        reason: "Joint filling for 200 sqft standard tile joints (1kg pack covers ~22 sqft)",
      },
    ];
    return {
      message: "Here is the material estimation for your **200 sqft bathroom tiling project**:\n\n- **6 bags Roff T01 NCA Adhesive (20 Kg)** @ ₹470 = **₹2,820**\n- **2 packs Roff Rainbow Tile Grout (1 Kg)** @ ₹160 = **₹320**\n\n💰 **Estimated Total Material Cost:** **₹3,140**\n⚡ All materials in stock at Bangalore fulfillment center and dispatched in 60 minutes!",
      cart_items: items,
      estimation_summary: {
        project_type: "Bathroom Tiling (200 sqft)",
        area_sqft: 200,
        total_cost: 3140,
      },
    };
  }

  if (lower.includes("painting") && lower.includes("3bhk")) {
    const items: CartItem[] = [
      {
        product_id: "pnt-005",
        name: "Birla White WallCare Putty",
        quantity: 4,
        unit: "bag",
        unit_price: 890,
        total: 3560,
        reason: "40 Kg Bag - 2 coats surface preparation for ~3,600 sqft wall area",
      },
      {
        product_id: "pnt-006",
        name: "Asian Paints Primer for Interior Walls",
        quantity: 2,
        unit: "bucket",
        unit_price: 2900,
        total: 5800,
        reason: "20 Litre - Base undercoat for interior masonry",
      },
      {
        product_id: "pnt-001",
        name: "Asian Paints Royale Luxury Emulsion",
        quantity: 2,
        unit: "bucket",
        unit_price: 7800,
        total: 15600,
        reason: "20 Litre - Premium luxury topcoat (2 coats)",
      },
    ];
    return {
      message: "Here is the standard contractor estimation for painting a **3BHK interior (approx 3,600 sqft paintable wall area)**:\n\n1. **Birla White WallCare Putty (40 Kg)**: 4 bags × ₹890 = **₹3,560**\n2. **Asian Paints Interior Primer (20L)**: 2 buckets × ₹2,900 = **₹5,800**\n3. **Asian Paints Royale Luxury Emulsion (20L)**: 2 buckets × ₹7,800 = **₹15,600**\n\n💰 **Total Material Cost:** **₹24,960**\n🚚 Free delivery directly to your site in Bangalore within 60 minutes.",
      cart_items: items,
      estimation_summary: {
        project_type: "Painting Estimate (3BHK)",
        area_sqft: 3600,
        total_cost: 24960,
      },
    };
  }

  if (lower.includes("electrical") && lower.includes("2bhk")) {
    const items: CartItem[] = [
      {
        product_id: "elc-001",
        name: "Polycab Maxima+ FR 1.5 sqmm Wire",
        quantity: 3,
        unit: "coil",
        unit_price: 1850,
        total: 5550,
        reason: "90m Coil - Lighting and fan circuits (250m requirement)",
      },
      {
        product_id: "elc-002",
        name: "Polycab Maxima+ FR 2.5 sqmm Wire",
        quantity: 2,
        unit: "coil",
        unit_price: 2950,
        total: 5900,
        reason: "90m Coil - Power sockets and geysers (180m requirement)",
      },
      {
        product_id: "elc-003",
        name: "Polycab Maxima+ FR 4 sqmm Wire",
        quantity: 1,
        unit: "coil",
        unit_price: 4350,
        total: 4350,
        reason: "90m Coil - AC and main distribution panel line (50m requirement)",
      },
      {
        product_id: "elc-008",
        name: "VIP PVC Conduit Pipe 25mm",
        quantity: 45,
        unit: "piece",
        unit_price: 72,
        total: 3240,
        reason: "3 Metre - Concealed internal wiring conduits (140m total)",
      },
    ];
    return {
      message: "Here is the comprehensive electrical material list for a standard **2BHK apartment wiring in Bangalore**:\n\n- **Polycab FR 1.5 sqmm (90m)**: 3 coils @ ₹1,850 = **₹5,550**\n- **Polycab FR 2.5 sqmm (90m)**: 2 coils @ ₹2,950 = **₹5,900**\n- **Polycab FR 4.0 sqmm (90m)**: 1 coil @ ₹4,350 = **₹4,350**\n- **VIP 25mm Conduit Pipe (3m)**: 45 pcs @ ₹72 = **₹3,240**\n\n⚡ **Total Electrical Material Cost:** **₹19,040**\nAll items meet IS standards. Added to your cart for instant 60-min delivery!",
      cart_items: items,
      estimation_summary: {
        project_type: "Electrical Wiring (2BHK)",
        area_sqft: 1000,
        total_cost: 19040,
      },
    };
  }

  if (lower.includes("5 bags roff") || (lower.includes("roff") && lower.includes("5"))) {
    const item: CartItem = {
      product_id: "til-001",
      name: "Roff T01 NCA Non-Ceramic Adhesive",
      quantity: 5,
      unit: "bag",
      unit_price: 470,
      total: 2350,
      reason: "Direct contractor order for 5 bags (20 Kg each)",
    };
    return {
      message: "Added **5 bags of Roff T01 NCA Non-Ceramic Adhesive (20 Kg Bag)** to your order.\n\n- **Rate:** ₹470 per bag (MRP: ₹520, Bulk: ₹450)\n- **Total:** ₹2,350\n- **Coverage:** ~175-200 sqft of tile fixing\n\n⚡ Packed and ready for 60-minute dispatch in Bangalore.",
      cart_items: [item],
      estimation_summary: {
        project_type: "Tile Adhesive Order",
        area_sqft: null,
        total_cost: 2350,
      },
    };
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        {
          message: "Please enter a valid request or question.",
          cart_items: [],
          estimation_summary: null,
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    // Dev / Offline fallback when API key is missing
    if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
      const mock = getMockDemoResponse(message);
      if (mock) {
        return Response.json(mock);
      }
      return Response.json({
        message:
          "⚠️ **Developer Notice:** `GOOGLE_GEMINI_API_KEY` is not set in `.env.local`.\n\nYou can get a free key from [Google AI Studio](https://aistudio.google.com/apikey) and paste it in `.env.local`.\n\n*In the meantime, click any of the quick action buttons above (e.g., '10 bags UltraTech PPC cement' or 'Estimate tiling for 200 sqft bathroom') to test live cart & estimation capabilities!*",
        cart_items: [],
        estimation_summary: null,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build chat history for Gemini
    const chatHistory = (history || []).slice(-10).map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // Parse JSON from response
    let parsed: ChatResponse;
    try {
      let jsonStr = responseText;
      if (jsonStr.includes("```json")) {
        jsonStr = jsonStr.split("```json")[1].split("```")[0].trim();
      } else if (jsonStr.includes("```")) {
        jsonStr = jsonStr.split("```")[1].split("```")[0].trim();
      }
      parsed = JSON.parse(jsonStr);
    } catch {
      parsed = {
        message: responseText,
        cart_items: [],
        estimation_summary: null,
      };
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    // As requested: If Gemini API fails, show a friendly error
    return Response.json(
      {
        message: "Oops, our AI is taking a break. Try again in a moment.",
        cart_items: [],
        estimation_summary: null,
      },
      { status: 200 }
    );
  }
}
