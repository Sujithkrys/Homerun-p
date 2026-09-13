import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, product_id, quantity } = body;

    if (!session_id || !product_id || quantity === undefined) {
      return NextResponse.json({ success: false, error: "Missing session_id, product_id, or quantity" }, { status: 400 });
    }

    const key = `cart:${session_id}`;
    
    // Read the existing cart
    const rawCart = await redis.get(key);
    let cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];

    // Find item
    const existingIndex = cart.findIndex((c) => c.product_id === product_id);
    
    if (existingIndex > -1) {
      if (quantity <= 0) {
        cart.splice(existingIndex, 1);
      } else {
        const current = cart[existingIndex];
        cart[existingIndex] = {
          ...current,
          quantity,
          total: quantity * current.unit_price,
        };
      }
    }

    // Write back to KV
    await redis.set(key, JSON.stringify(cart), "EX", 86400);

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("[cart/update] Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
