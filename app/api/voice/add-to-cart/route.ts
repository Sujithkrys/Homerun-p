import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[add-to-cart] Raw request body:", JSON.stringify(body));
    const { product_name, brand, session_id } = body;
    const quantity = Number(body.quantity);
    const unit_price = Number(body.unit_price);

    if (!session_id) {
      return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
    }

    if (!product_name || isNaN(quantity) || isNaN(unit_price)) {
      return NextResponse.json({ success: false, error: "Invalid product data" }, { status: 400 });
    }

    const key = `cart:${session_id}`;
    
    // Read the existing cart array, default to empty array
    const rawCart = await redis.get(key);
    let cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];

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

    // Write back to KV with 24 hour expiry
    await redis.set(key, JSON.stringify(cart), "EX", 86400);

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("[add-to-cart] Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
