import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";
import { CartItem, ChatResponse, EstimationSummary, ProjectEstimate, Suggestion } from "@/lib/types";

// Local fallback responses for demo quick actions if API key is not configured yet
function getMockDemoResponse(message: string): ChatResponse | null {
  const lower = message.toLowerCase();

  // 1. Full Renovation for 2BHK Flat (Project Tracker Multi-Room)
  if (
    lower.includes("renovation") ||
    lower.includes("full renovation") ||
    (lower.includes("2bhk") && (lower.includes("estimate") || lower.includes("flat")))
  ) {
    const masterBathroomItems: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 4,
        unit: "bag",
        unit_price: 430,
        total: 1720,
        reason: "Master bathroom floor & wall tile fixing (48 sqft)",
      },
      {
        product_id: "til-011",
        name: "MYK Laticrete 315 Plus Grey Tile Adhesive",
        quantity: 3,
        unit: "bag",
        unit_price: 625,
        total: 1875,
        reason: "Heavy-duty wall tile bonding",
      },
      {
        product_id: "til-006",
        name: "Roff T34 Starlike Epoxy Grout",
        quantity: 2,
        unit: "pack",
        unit_price: 810,
        total: 1620,
        reason: "Waterproof stain-resistant joints",
      },
      {
        product_id: "san-010",
        name: "Jaquar Continental Rimless Wall Hung WC",
        quantity: 1,
        unit: "piece",
        unit_price: 7920,
        total: 7920,
        reason: "Master bathroom toilet suite",
      },
    ];

    const guestBathroomItems: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 3,
        unit: "bag",
        unit_price: 430,
        total: 1290,
        reason: "Guest bathroom tiling (40 sqft)",
      },
      {
        product_id: "til-006",
        name: "Roff T34 Starlike Epoxy Grout",
        quantity: 1,
        unit: "pack",
        unit_price: 810,
        total: 810,
        reason: "Joint filling",
      },
      {
        product_id: "san-017",
        name: "Parryware Cardiff Wall Hung WC",
        quantity: 1,
        unit: "piece",
        unit_price: 6700,
        total: 6700,
        reason: "Guest bathroom toilet suite",
      },
    ];

    const paintingItems: CartItem[] = [
      {
        product_id: "pnt-020",
        name: "Birla White WallCare Putty",
        quantity: 3,
        unit: "bag",
        unit_price: 850,
        total: 2550,
        reason: "40 Kg Bag - 2 coats surface prep for ~2,500 sqft",
      },
      {
        product_id: "pnt-021",
        name: "Asian Paints Primer for Interior Walls",
        quantity: 1,
        unit: "bucket",
        unit_price: 2900,
        total: 2900,
        reason: "20 Litre - Undercoat for masonry",
      },
      {
        product_id: "pnt-003",
        name: "Asian Paints Premium Emulsion Base White",
        quantity: 12,
        unit: "can",
        unit_price: 353,
        total: 4236,
        reason: "Living room & 2 bedrooms topcoat (2 coats)",
      },
    ];

    const electricalItems: CartItem[] = [
      {
        product_id: "elc-001",
        name: "Polycab Maxima+ FR 1.5 sqmm Wire",
        quantity: 3,
        unit: "coil",
        unit_price: 1850,
        total: 5550,
        reason: "Lighting & fan circuits",
      },
      {
        product_id: "elc-002",
        name: "Polycab Maxima+ FR 2.5 sqmm Wire",
        quantity: 2,
        unit: "coil",
        unit_price: 2950,
        total: 5900,
        reason: "Power sockets & geysers",
      },
      {
        product_id: "elc-003",
        name: "Polycab Maxima+ FR 4 sqmm Wire",
        quantity: 1,
        unit: "coil",
        unit_price: 4350,
        total: 4350,
        reason: "AC circuits",
      },
      {
        product_id: "elc-009",
        name: "VIP PVC Conduit Pipe 25mm",
        quantity: 30,
        unit: "piece",
        unit_price: 72,
        total: 2160,
        reason: "Concealed wall conduits",
      },
    ];

    const masterBathTotal = masterBathroomItems.reduce((s, i) => s + i.total, 0);
    const guestBathTotal = guestBathroomItems.reduce((s, i) => s + i.total, 0);
    const paintingTotal = paintingItems.reduce((s, i) => s + i.total, 0);
    const electricalTotal = electricalItems.reduce((s, i) => s + i.total, 0);

    const projectEstimate: ProjectEstimate = {
      project_name: "2BHK Full Renovation",
      rooms: [
        {
          room_name: "Master Bathroom",
          task_type: "tiling & sanitary",
          area_sqft: 48,
          cart_items: masterBathroomItems,
          room_total: masterBathTotal,
        },
        {
          room_name: "Guest Bathroom",
          task_type: "tiling & sanitary",
          area_sqft: 40,
          cart_items: guestBathroomItems,
          room_total: guestBathTotal,
        },
        {
          room_name: "Living Room + Bedrooms",
          task_type: "painting",
          area_sqft: 650,
          cart_items: paintingItems,
          room_total: paintingTotal,
        },
        {
          room_name: "Entire Apartment",
          task_type: "electrical wiring",
          area_sqft: 950,
          cart_items: electricalItems,
          room_total: electricalTotal,
        },
      ],
      grand_total: masterBathTotal + guestBathTotal + paintingTotal + electricalTotal,
      savings_on_bulk: 3450,
    };

    // Merged cart items
    const mergedMap = new Map<string, CartItem>();
    [
      ...masterBathroomItems,
      ...guestBathroomItems,
      ...paintingItems,
      ...electricalItems,
    ].forEach((item) => {
      if (mergedMap.has(item.product_id)) {
        const exist = mergedMap.get(item.product_id)!;
        const newQty = exist.quantity + item.quantity;
        mergedMap.set(item.product_id, {
          ...exist,
          quantity: newQty,
          total: newQty * exist.unit_price,
        });
      } else {
        mergedMap.set(item.product_id, { ...item });
      }
    });

    const suggestions: Suggestion[] = [
      {
        product_id: "til-007",
        name: "Roff Tiles Spacer 100pcs",
        reason: "Ensures uniform joints between bathroom tiles",
        estimated_qty: 2,
        unit: "pack",
        unit_price: 60,
      },
      {
        product_id: "san-007",
        name: "Jaquar Concealed Cistern S-Type",
        reason: "Required for wall hung WC installation in bathrooms",
        estimated_qty: 2,
        unit: "piece",
        unit_price: 7210,
      },
      {
        product_id: "elc-011",
        name: "Havells MCB Single Pole 16A",
        reason: "Circuit breaker for electrical distribution box",
        estimated_qty: 4,
        unit: "piece",
        unit_price: 275,
      },
    ];

    return {
      message:
        "I've prepared a comprehensive **2BHK Full Renovation bill of materials** broken down room-by-room.\n\n" +
        "• **Master Bathroom (48 sqft):** ₹" +
        masterBathTotal.toLocaleString("en-IN") +
        " (Adhesive, epoxy grout, and wall hung WC)\n" +
        "• **Guest Bathroom (40 sqft):** ₹" +
        guestBathTotal.toLocaleString("en-IN") +
        "\n• **Living + Bedrooms Painting:** ₹" +
        paintingTotal.toLocaleString("en-IN") +
        " (Birla Putty, Primer & Asian Paints Emulsion)\n" +
        "• **Full House Electrical:** ₹" +
        electricalTotal.toLocaleString("en-IN") +
        " (Polycab FR wires & VIP conduits)\n\n" +
        "🎉 **Bulk Savings Applied:** You save ₹" +
        projectEstimate.savings_on_bulk.toLocaleString("en-IN") +
        " on combined wholesale quantities!\n" +
        "⚡ All materials staged for 60-minute delivery across Bangalore.",
      cart_items: Array.from(mergedMap.values()),
      estimation_summary: {
        project_type: "2BHK Full Renovation",
        area_sqft: 950,
        total_cost: projectEstimate.grand_total,
      },
      project_estimate: projectEstimate,
      suggestions: suggestions,
    };
  }

  // 2. Tile my 2 bathrooms + paint all rooms (Multi-room prompt)
  if (
    lower.includes("2 bathrooms") ||
    (lower.includes("bathrooms") && lower.includes("paint"))
  ) {
    const bath1Items: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 4,
        unit: "bag",
        unit_price: 430,
        total: 1720,
        reason: "Bathroom 1 floor & wall tiling (45 sqft)",
      },
      {
        product_id: "til-006",
        name: "Roff T34 Starlike Epoxy Grout",
        quantity: 2,
        unit: "pack",
        unit_price: 810,
        total: 1620,
        reason: "Waterproof joint sealant",
      },
    ];

    const bath2Items: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 4,
        unit: "bag",
        unit_price: 430,
        total: 1720,
        reason: "Bathroom 2 floor & wall tiling (45 sqft)",
      },
      {
        product_id: "til-006",
        name: "Roff T34 Starlike Epoxy Grout",
        quantity: 2,
        unit: "pack",
        unit_price: 810,
        total: 1620,
        reason: "Waterproof joint sealant",
      },
    ];

    const paintItems: CartItem[] = [
      {
        product_id: "pnt-020",
        name: "Birla White WallCare Putty",
        quantity: 3,
        unit: "bag",
        unit_price: 850,
        total: 2550,
        reason: "Surface leveling (2 coats)",
      },
      {
        product_id: "pnt-021",
        name: "Asian Paints Primer for Interior Walls",
        quantity: 1,
        unit: "bucket",
        unit_price: 2900,
        total: 2900,
        reason: "20 Litre undercoat",
      },
      {
        product_id: "pnt-003",
        name: "Asian Paints Premium Emulsion Base White",
        quantity: 8,
        unit: "can",
        unit_price: 353,
        total: 2824,
        reason: "Topcoat interior walls",
      },
    ];

    const b1Total = bath1Items.reduce((s, i) => s + i.total, 0);
    const b2Total = bath2Items.reduce((s, i) => s + i.total, 0);
    const pTotal = paintItems.reduce((s, i) => s + i.total, 0);

    const projectEstimate: ProjectEstimate = {
      project_name: "2 Bathrooms Tiling + All Rooms Painting",
      rooms: [
        {
          room_name: "Bathroom 1 (Master)",
          task_type: "tiling",
          area_sqft: 45,
          cart_items: bath1Items,
          room_total: b1Total,
        },
        {
          room_name: "Bathroom 2 (Common)",
          task_type: "tiling",
          area_sqft: 45,
          cart_items: bath2Items,
          room_total: b2Total,
        },
        {
          room_name: "All Bedrooms & Living Room",
          task_type: "painting",
          area_sqft: 700,
          cart_items: paintItems,
          room_total: pTotal,
        },
      ],
      grand_total: b1Total + b2Total + pTotal,
      savings_on_bulk: 950,
    };

    return {
      message:
        "Here is your room-by-room breakdown for **tiling 2 bathrooms + painting all rooms**:\n\n" +
        "• **Bathroom 1 Tiling:** ₹" +
        b1Total.toLocaleString("en-IN") +
        "\n• **Bathroom 2 Tiling:** ₹" +
        b2Total.toLocaleString("en-IN") +
        "\n• **All Rooms Painting:** ₹" +
        pTotal.toLocaleString("en-IN") +
        "\n\n💰 **Grand Total:** ₹" +
        projectEstimate.grand_total.toLocaleString("en-IN") +
        " (Bulk savings: ₹" +
        projectEstimate.savings_on_bulk.toLocaleString("en-IN") +
        ")\n⚡ Staged for 60-minute delivery to your site.",
      cart_items: [...bath1Items, ...bath2Items, ...paintItems],
      estimation_summary: {
        project_type: "Bathrooms Tiling + Painting",
        area_sqft: 790,
        total_cost: projectEstimate.grand_total,
      },
      project_estimate: projectEstimate,
      suggestions: [
        {
          product_id: "til-007",
          name: "Roff Tiles Spacer 100pcs",
          reason: "Needed for even spacing between wall & floor tiles",
          estimated_qty: 2,
          unit: "pack",
          unit_price: 60,
        },
        {
          product_id: "til-008",
          name: "Roff T16 Cera Cleaner",
          reason: "Post-installation cleanup of adhesive and grout residue",
          estimated_qty: 1,
          unit: "bottle",
          unit_price: 140,
        },
      ],
    };
  }

  // 3. 10 bags UltraTech PPC cement
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
      message:
        "Here is your order breakdown for **10 bags of UltraTech PPC Cement (50 Kg Bag)**.\n\n" +
        "- **Unit Price:** ₹410 / bag (MRP: ₹440, Bulk Rate: ₹390)\n" +
        "- **Total Amount:** ₹4,100\n" +
        "- **Delivery:** ⚡ Guaranteed in 60 minutes across Bangalore directly to your job site.\n\n" +
        "I have added these bags to your cart. Ready to dispatch!",
      cart_items: [item],
      estimation_summary: {
        project_type: "Cement Order",
        area_sqft: null,
        total_cost: 4100,
      },
      project_estimate: null,
      suggestions: [
        {
          product_id: "cem-008",
          name: "JSW Enduro Plast Ready Mix Plaster",
          reason: "Ready-mix plaster reduces sand mixing time on site",
          estimated_qty: 5,
          unit: "bag",
          unit_price: 305,
        },
      ],
    };
  }

  // 4. Estimate tiling for 200 sqft bathroom
  if (lower.includes("tiling") && (lower.includes("200") || lower.includes("bathroom"))) {
    const items: CartItem[] = [
      {
        product_id: "til-001",
        name: "Roff T01 NCA Non-Ceramic Adhesive",
        quantity: 6,
        unit: "bag",
        unit_price: 430,
        total: 2580,
        reason: "Coverage: ~35 sqft/bag at 3mm bed thickness for 200 sqft bathroom",
      },
      {
        product_id: "til-006",
        name: "Roff T34 Starlike Epoxy Grout",
        quantity: 2,
        unit: "pack",
        unit_price: 810,
        total: 1620,
        reason: "Joint filling for 200 sqft standard tile joints (1kg pack covers ~22 sqft)",
      },
    ];
    return {
      message:
        "Here is the material estimation for your **200 sqft bathroom tiling project**:\n\n" +
        "- **6 bags Roff T01 NCA Adhesive (30 Kg)** @ ₹430 = **₹2,580**\n" +
        "- **2 packs Roff T34 Epoxy Grout (1 Kg)** @ ₹810 = **₹1,620**\n\n" +
        "💰 **Estimated Total Material Cost:** **₹4,200**\n" +
        "⚡ All materials in stock at Bangalore fulfillment center and dispatched in 60 minutes!",
      cart_items: items,
      estimation_summary: {
        project_type: "Bathroom Tiling (200 sqft)",
        area_sqft: 200,
        total_cost: 4200,
      },
      project_estimate: null,
      suggestions: [
        {
          product_id: "til-007",
          name: "Roff Tiles Spacer 100pcs",
          reason: "Needed for even 2mm spacing between tiles",
          estimated_qty: 2,
          unit: "pack",
          unit_price: 60,
        },
        {
          product_id: "til-008",
          name: "Roff T16 Cera Cleaner",
          reason: "Removes adhesive haze and grout stains after curing",
          estimated_qty: 1,
          unit: "bottle",
          unit_price: 140,
        },
        {
          product_id: "wtp-006",
          name: "Dr. Fixit 112 Pidifin 2K",
          reason: "Integral bathroom waterproofing coat before tile fixing",
          estimated_qty: 1,
          unit: "kit",
          unit_price: 439,
        },
      ],
    };
  }

  // 5. 5 bags Roff tile adhesive
  if (lower.includes("5 bags roff") || (lower.includes("roff") && lower.includes("5"))) {
    const item: CartItem = {
      product_id: "til-001",
      name: "Roff T01 NCA Non-Ceramic Adhesive",
      quantity: 5,
      unit: "bag",
      unit_price: 430,
      total: 2150,
      reason: "Direct contractor order for 5 bags (30 Kg each)",
    };
    return {
      message:
        "Added **5 bags of Roff T01 NCA Non-Ceramic Adhesive (30 Kg Bag)** to your order.\n\n" +
        "- **Rate:** ₹430 per bag (MRP: ₹460, Bulk: ₹410)\n" +
        "- **Total:** ₹2,150\n" +
        "- **Coverage:** ~175-200 sqft of tile fixing\n\n" +
        "⚡ Packed and ready for 60-minute dispatch in Bangalore.",
      cart_items: [item],
      estimation_summary: {
        project_type: "Tile Adhesive Order",
        area_sqft: null,
        total_cost: 2150,
      },
      project_estimate: null,
      suggestions: [
        {
          product_id: "til-007",
          name: "Roff Tiles Spacer 100pcs",
          reason: "For even joint alignment during tile laying",
          estimated_qty: 1,
          unit: "pack",
          unit_price: 60,
        },
        {
          product_id: "til-006",
          name: "Roff T34 Starlike Epoxy Grout",
          reason: "Required for filling joints once tiles are set",
          estimated_qty: 2,
          unit: "pack",
          unit_price: 810,
        },
      ],
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
          project_estimate: null,
          suggestions: [],
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
          "⚠️ **Developer Notice:** `GOOGLE_GEMINI_API_KEY` is not set in `.env.local`.\n\nYou can get a free key from [Google AI Studio](https://aistudio.google.com/apikey) and paste it in `.env.local`.\n\n*In the meantime, click any of the quick action buttons above (e.g., 'Estimate full renovation for 2BHK flat' or 'Estimate tiling for 200 sqft bathroom') to test live multi-room tracking, PDF download, and smart cross-sell chips!*",
        cart_items: [],
        estimation_summary: null,
        project_estimate: null,
        suggestions: [],
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
      // Ensure all fields are present
      parsed.cart_items = parsed.cart_items || [];
      parsed.estimation_summary = parsed.estimation_summary || null;
      parsed.project_estimate = parsed.project_estimate || null;
      parsed.suggestions = parsed.suggestions || [];
    } catch {
      parsed = {
        message: responseText,
        cart_items: [],
        estimation_summary: null,
        project_estimate: null,
        suggestions: [],
      };
    }

    return Response.json(parsed);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return Response.json(
      {
        message: "Oops, our AI is taking a break. Try again in a moment.",
        cart_items: [],
        estimation_summary: null,
        project_estimate: null,
        suggestions: [],
      },
      { status: 200 }
    );
  }
}
