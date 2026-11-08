// app/api/paypal/capture-order/route.ts
import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId in request body" }, { status: 400 });
    }

    const captureData = await capturePayPalOrder(orderId);
    return NextResponse.json({ success: true, capture: captureData });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to capture order";
    console.error("PayPal Capture Order API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

