import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { CartItem, ChatResponse, EstimationSummary } from "@/lib/types";

// Local fallback responses for the 5 demo quick actions if API key is not configured yet
function getMockDemoResponse(message: string): ChatResponse | null {
  const lower = message.toLowerCase();

  if (lower.includes("10 bags ultratech ppc") || (lower.includes("ultratech") && lower.includes("10"))) {
    const item: CartItem = {
      product_id: "cem-ultratech-ppc",
      name: "UltraTech PPC Cement (50kg)",
      quantity: 10,
      unit: "bags",
      unit_price: 410,
      total: 4100,
      reason: "Direct contractor bulk order for plastering/masonry",
    };
    return {
      message: "Here is your order breakdown for **10 bags of UltraTech PPC Cement (50kg)**.\n\n- **Unit Price:** ₹410 / bag\n- **Total Amount:** ₹4,100\n- **Delivery:** ⚡ Guaranteed in 60 minutes across Bangalore directly to your job site.\n\nI have added these bags to your cart. Ready to dispatch!",
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
        product_id: "adh-roff-t01-20kg",
        name: "Pidilite Roff T01 Tile Adhesive (20kg)",
        quantity: 6,
        unit: "bags",
        unit_price: 470,
        total: 2820,
        reason: "Standard 3mm bed coverage (approx 35 sqft/bag for 200 sqft bathroom)",
      },
      {
        product_id: "adh-roff-rainbow-grout-1kg",
        name: "Roff Rainbow Tile Grout (1kg)",
        quantity: 2,
        unit: "packs",
        unit_price: 85,
        total: 170,
        reason: "Joint filling for 200 sqft ceramic wall/floor tiles",
      },
      {
        product_id: "adh-tile-spacers-3mm",
        name: "Cross Tile Spacers 3mm (Pack of 100)",
        quantity: 1,
        unit: "pack",
        unit_price: 90,
        total: 90,
        reason: "For uniform, precision tile joints",
      },
    ];
    return {
      message: "Here is the material estimation for your **200 sqft bathroom tiling project**:\n\n- **6 bags Pidilite Roff T01 (20kg)** @ ₹470 = **₹2,820** (for high bonding bed)\n- **2 packs Roff Rainbow Grout (1kg)** @ ₹85 = **₹170** (for joint sealing)\n- **1 pack 3mm Cross Spacers** @ ₹90 = **₹90**\n\n💰 **Estimated Total Material Cost:** **₹3,080**\n⚡ All materials in stock at Bangalore hub and delivered in 60 minutes!",
      cart_items: items,
      estimation_summary: {
        project_type: "Bathroom Tiling (200 sqft)",
        area_sqft: 200,
        total_cost: 3080,
      },
    };
  }

  if (lower.includes("painting") && lower.includes("3bhk")) {
    const items: CartItem[] = [
      {
        product_id: "pnt-asian-primer-decoprime-20l",
        name: "Asian Paints Decoprime WT Wall Primer (20 Litre)",
        quantity: 2,
        unit: "cans",
        unit_price: 1850,
        total: 3700,
        reason: "Base masonry undercoat for ~3600 sqft paintable surface",
      },
      {
        product_id: "pnt-birla-white-putty-40kg",
        name: "Birla White WallSeal Waterproof Putty (40kg)",
        quantity: 4,
        unit: "bags",
        unit_price: 940,
        total: 3760,
        reason: "2-coat surface leveling and pinhole filling",
      },
      {
        product_id: "pnt-asian-tractor-emulsion-20l",
        name: "Asian Paints Tractor Emulsion (20 Litre)",
        quantity: 2,
        unit: "cans",
        unit_price: 2450,
        total: 4900,
        reason: "2 coats smooth interior matte wall finish",
      },
    ];
    return {
      message: "Here is the standard Bangalore contractor estimation for painting a **3BHK interior (approx 3,600 sqft wall & ceiling area)**:\n\n1. **Birla White Putty (40kg)**: 4 bags × ₹940 = **₹3,760**\n2. **Asian Paints Decoprime Primer (20L)**: 2 cans × ₹1,850 = **₹3,700**\n3. **Asian Paints Tractor Emulsion (20L)**: 2 cans × ₹2,450 = **₹4,900**\n\n💰 **Total Material Cost:** **₹12,360**\n🚚 Free express delivery to your doorstep within 60 minutes.",
      cart_items: items,
      estimation_summary: {
        project_type: "Painting Estimate (3BHK)",
        area_sqft: 3600,
        total_cost: 12360,
      },
    };
  }

  if (lower.includes("electrical") && lower.includes("2bhk")) {
    const items: CartItem[] = [
      {
        product_id: "elec-finolex-fr-1-5sqmm",
        name: "Finolex 1.5 sq mm Flame Retardant PVC Wire (90m)",
        quantity: 2,
        unit: "rolls",
        unit_price: 1780,
        total: 3560,
        reason: "Lighting & ceiling fan internal loops",
      },
      {
        product_id: "elec-finolex-fr-2-5sqmm",
        name: "Finolex 2.5 sq mm Flame Retardant PVC Wire (90m)",
        quantity: 2,
        unit: "rolls",
        unit_price: 2850,
        total: 5700,
        reason: "16A power points, kitchen appliances, and geysers",
      },
      {
        product_id: "elec-finolex-fr-4-0sqmm",
        name: "Finolex 4.0 sq mm Flame Retardant PVC Wire (90m)",
        quantity: 1,
        unit: "roll",
        unit_price: 4350,
        total: 4350,
        reason: "Air conditioner line and main distribution board input",
      },
      {
        product_id: "elec-vip-conduit-pipe-25mm",
        name: "VIP 25mm Heavy Duty PVC Electrical Conduit (Bundle of 10)",
        quantity: 3,
        unit: "bundles",
        unit_price: 720,
        total: 2160,
        reason: "Concealed wall chased conduits",
      },
    ];
    return {
      message: "Here is the comprehensive electrical material list for a standard **2BHK apartment wiring in Bangalore**:\n\n- **Finolex 1.5 sq mm FR (90m)**: 2 rolls @ ₹1,780 = **₹3,560**\n- **Finolex 2.5 sq mm FR (90m)**: 2 rolls @ ₹2,850 = **₹5,700**\n- **Finolex 4.0 sq mm FR (90m)**: 1 roll @ ₹4,350 = **₹4,350**\n- **VIP 25mm Conduit Bundle (10 pcs)**: 3 bundles @ ₹720 = **₹2,160**\n\n⚡ **Total Electrical Material Cost:** **₹15,770**\nAll items meet IS 694 standards. Added to your cart for instant 60-min delivery!",
      cart_items: items,
      estimation_summary: {
        project_type: "Electrical Wiring (2BHK)",
        area_sqft: 1000,
        total_cost: 15770,
      },
    };
  }

  if (lower.includes("5 bags roff") || (lower.includes("roff") && lower.includes("5"))) {
    const item: CartItem = {
      product_id: "adh-roff-t01-20kg",
      name: "Pidilite Roff T01 Tile Adhesive (20kg)",
      quantity: 5,
      unit: "bags",
      unit_price: 470,
      total: 2350,
      reason: "Direct contractor order for 5 bags",
    };
    return {
      message: "Added **5 bags of Pidilite Roff T01 Tile Adhesive (20kg)** to your order.\n\n- **Rate:** ₹470 per bag\n- **Total:** ₹2,350\n- **Coverage:** ~160-175 sqft of tile fixing\n\n⚡ Packed and ready for 60-minute dispatch in Bangalore.",
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
