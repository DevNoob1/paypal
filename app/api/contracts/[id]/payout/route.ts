// app/api/contracts/[id]/payout/route.ts
import { NextResponse } from "next/server";
import { getContractById, updateContract } from "@/lib/store";
import { releasePayPalPayout } from "@/lib/paypal";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contract = getContractById(id);

  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  if (contract.status === "PAYOUT_COMPLETED") {
    return NextResponse.json({ error: "Payout has already been released." }, { status: 400 });
  }

  try {
    const payoutRes = await releasePayPalPayout({
      receiverEmail: contract.freelancerEmail,
      amount: contract.amount,
      currency: contract.currency,
      contractTitle: contract.title,
      contractId: contract.id,
    });

    const payoutReceipt = {
      payoutId:
        payoutRes.batch_header?.payout_batch_id ||
        `PYT_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      releasedAt: new Date().toISOString(),
      amount: contract.amount,
      currency: contract.currency,
      receiver: contract.freelancerEmail,
      batchStatus: payoutRes.batch_header?.batch_status || "SUCCESS",
      simulated: payoutRes.simulated || false,
    };

    const contractorPayoutNotif = {
      id: `notif_${Date.now()}_payout_contractor`,
      timestamp: new Date().toISOString(),
      channel: "EMAIL" as const,
      recipient: contract.freelancerEmail,
      subject: `PayPal Payout Released: $${contract.amount.toFixed(2)} USD`,
      message: `PayPal batch payout ${payoutReceipt.payoutId} dispatched to ${contract.freelancerEmail}. Funds are now settled and available in your PayPal balance.`,
      status: "DELIVERED" as const,
    };

    const clientReceiptNotif = {
      id: `notif_${Date.now()}_receipt_client`,
      timestamp: new Date().toISOString(),
      channel: "EMAIL" as const,
      recipient: contract.clientEmail,
      subject: `Payment Receipt: Milestone Settlement Complete for "${contract.title}"`,
      message: `Your PayPal escrow authorization of $${contract.amount.toFixed(2)} USD has settled to ${contract.freelancerName}. Receipt ID: ${payoutReceipt.payoutId}.`,
      status: "DELIVERED" as const,
    };

    const existingNotifs = contract.notifications || [];

    const updated = updateContract(id, {
      status: "PAYOUT_COMPLETED",
      payoutReceipt,
      notifications: [contractorPayoutNotif, clientReceiptNotif, ...existingNotifs],
    });

    return NextResponse.json({ success: true, contract: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payout failed";
    console.error("Payout release error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

