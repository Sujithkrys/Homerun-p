import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_name, brand, quantity, unit_price, session_id } = body;

    if (!session_id) {
      return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
    }

    if (!product_name || typeof quantity !== "number" || typeof unit_price !== "number") {
      return NextResponse.json({ success: false, error: "Invalid product data" }, { status: 400 });
    }

    const key = `cart:${session_id}`;
    
    // Read the existing cart array, default to empty array
    let cart: CartItem[] = (await kv.get<CartItem[]>(key)) || [];

    // Append the new item
    const newItem: CartItem = {
      product_id: `voice-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: `${brand ? brand + ' ' : ''}${product_name}`,
      quantity,
      unit: "unit",
      unit_price,
      total: quantity * unit_price,
      reason: "Added via Voice Assistant",
    };
    
    cart.push(newItem);

    // Write back to KV
    await kv.set(key, cart);

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("[add-to-cart] Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
