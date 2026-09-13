import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id, item } = body;

    if (!session_id || !item) {
      return NextResponse.json({ success: false, error: "Missing session_id or item" }, { status: 400 });
    }

    const key = `cart:${session_id}`;
    
    // Read the existing cart
    const rawCart = await redis.get(key);
    let cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];

    // Merge item
    const existingIndex = cart.findIndex(
      (c) => c.product_id === item.product_id || c.name === item.name
    );
    
    if (existingIndex > -1) {
      const current = cart[existingIndex];
      const combinedQty = current.quantity + item.quantity;
      cart[existingIndex] = {
        ...current,
        quantity: combinedQty,
        total: combinedQty * current.unit_price,
      };
    } else {
      cart.push({
        ...item,
        product_id: item.product_id || `web-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      });
    }

    // Write back to KV
    await redis.set(key, JSON.stringify(cart), "EX", 86400);

    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error("[cart/add] Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
