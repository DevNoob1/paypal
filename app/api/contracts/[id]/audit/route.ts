// app/api/contracts/[id]/audit/route.ts
import { NextResponse } from "next/server";
import { getContractById, updateContract } from "@/lib/store";
import { evaluateMilestone } from "@/lib/gemini";
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

  if (!contract.submission) {
    return NextResponse.json(
      { error: "No deliverable submitted for this milestone yet." },
      { status: 400 }
    );
  }

  try {
    const body = await req.json().catch(() => ({}));
    const autoRelease = body.autoReleasePayout ?? true;

    // 1. Run Gemini AI Evaluation
    const auditReport = await evaluateMilestone({
      title: contract.title,
      description: contract.description,
      criteria: contract.criteria,
      deliverableText: contract.submission.notes,
      deliverableUrl: contract.submission.url,
      codeSnippet: contract.submission.codeSnippet,
    });

    let newStatus = contract.status;
    let payoutReceipt = contract.payoutReceipt;

    if (auditReport.verdict === "APPROVE") {
      newStatus = "AI_VERIFIED";

      // 2. If approved and autoRelease is enabled, trigger PayPal Payouts API
      if (autoRelease) {
        try {
          const payoutRes = await releasePayPalPayout({
            receiverEmail: contract.freelancerEmail,
            amount: contract.amount,
            currency: contract.currency,
            contractTitle: contract.title,
            contractId: contract.id,
          });

          payoutReceipt = {
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

          newStatus = "PAYOUT_COMPLETED";
        } catch (payoutErr) {
          console.error("Payout attempt error during auto-release:", payoutErr);
          // Keep as AI_VERIFIED so manual release can be retried
          newStatus = "AI_VERIFIED";
        }
      }
    } else if (auditReport.verdict === "DISPUTE") {
      newStatus = "DISPUTED";
    } else {
      newStatus = "PENDING_REVIEW";
    }

    const updated = updateContract(id, {
      auditReport,
      status: newStatus,
      payoutReceipt,
    });

    return NextResponse.json({
      success: true,
      auditReport,
      contract: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Audit failed";
    console.error("Audit error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
