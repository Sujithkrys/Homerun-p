import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { CartItem } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { session_id } = body;

    if (!session_id) {
      return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
    }

    const key = `cart:${session_id}`;
    
    // Read the existing cart array, default to empty array
    const rawCart = await redis.get(key);
    const cart: CartItem[] = rawCart ? JSON.parse(rawCart) : [];

    // Compute total cost
    const total = cart.reduce((sum, item) => sum + (item.total || 0), 0);

    return NextResponse.json({ success: true, cart, total });
  } catch (error: any) {
    console.error("[cart/sync] Error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
