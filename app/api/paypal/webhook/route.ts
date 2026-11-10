// app/api/paypal/webhook/route.ts
import { NextResponse } from "next/server";
import { getPayPalWebhookEvents, recordPayPalWebhookEvent } from "@/lib/paypal";

export async function GET() {
  const events = getPayPalWebhookEvents();
  return NextResponse.json({
    success: true,
    count: events.length,
    events,
  });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // PayPal Webhook event notification payload
    const eventType = payload.event_type || "PAYMENT.CAPTURE.COMPLETED";
    const resourceType = payload.resource_type || "capture";
    const summary = payload.summary || `PayPal notification: ${eventType}`;
    const resource = payload.resource || {};

    const recorded = recordPayPalWebhookEvent({
      id: payload.id,
      event_type: eventType,
      resource_type: resourceType,
      summary,
      status: "SUCCESS",
      resource,
      create_time: payload.create_time || new Date().toISOString(),
    });

    return NextResponse.json({
      status: "SUCCESS",
      message: "Webhook event recorded",
      event: recorded,
    });
  } catch (err: any) {
    console.error("Error processing PayPal webhook:", err);
    return NextResponse.json(
      { error: "Webhook processing failed", details: err.message },
      { status: 400 }
    );
  }
}

