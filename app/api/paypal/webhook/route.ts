// app/api/paypal/webhook/route.ts - PayPal Webhook Event Receiver & Stream
import { NextResponse } from "next/server";
import { getAllContracts, updateContract } from "@/lib/store";

interface WebhookLog {
  id: string;
  timestamp: string;
  eventType: string;
  summary: string;
  resourceId?: string;
  status: "PROCESSED" | "IGNORED";
}

let webhookLogs: WebhookLog[] = [
  {
    id: "wh_ev_01",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    eventType: "CHECKOUT.ORDER.APPROVED",
    summary: "PayPal Order approved and locked in escrow vault",
    resourceId: "PP-ORD-8FG98231AA098",
    status: "PROCESSED",
  },
  {
    id: "wh_ev_02",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    eventType: "PAYMENT.CAPTURE.COMPLETED",
    summary: "Escrow funds held securely under agreement conditions",
    resourceId: "PP-CAP-491024",
    status: "PROCESSED",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: webhookLogs.length,
    events: webhookLogs,
  });
}

export async function POST(req: Request) {
  try {
    const payload = await req.json().catch(() => ({}));
    const eventType = payload.event_type || payload.eventType || "PAYMENT.PAYOUTSBATCH.SUCCESS";
    const resource = payload.resource || {};
    const contractId = resource.custom_id || resource.reference_id || payload.contractId;

    const newLog: WebhookLog = {
      id: `wh_${Date.now()}`,
      timestamp: new Date().toISOString(),
      eventType,
      summary: payload.summary || `Received PayPal webhook event ${eventType}`,
      resourceId: resource.id || payload.resourceId,
      status: "PROCESSED",
    };

    webhookLogs.unshift(newLog);
    if (webhookLogs.length > 50) webhookLogs.pop();

    if (contractId) {
      const contract = getAllContracts().find((c) => c.id === contractId);
      if (contract) {
        if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
          updateContract(contractId, { status: "FUNDED_ESCROW" });
        } else if (eventType === "PAYMENT.PAYOUTSBATCH.SUCCESS") {
          updateContract(contractId, { status: "PAYOUT_COMPLETED" });
        }
      }
    }

    return NextResponse.json({ success: true, event: newLog });
  } catch (err: unknown) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
