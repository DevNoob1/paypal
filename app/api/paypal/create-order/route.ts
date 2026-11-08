// app/api/paypal/create-order/route.ts
import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const amount = parseFloat(body.amount) || 100.0;
    const description = body.description || "ResolvAI Escrow Milestone";
    const referenceId = body.referenceId || `ref_${Date.now()}`;
    const currency = body.currency || "USD";

    const order = await createPayPalOrder({
      amount,
      currency,
      description,
      referenceId,
    });

    return NextResponse.json({ id: order.id, order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create order";
    console.error("PayPal Create Order API Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

