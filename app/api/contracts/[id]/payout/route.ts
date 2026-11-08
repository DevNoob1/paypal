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

    const updated = updateContract(id, {
      status: "PAYOUT_COMPLETED",
      payoutReceipt,
    });

    return NextResponse.json({ success: true, contract: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Payout failed";
    console.error("Payout release error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

