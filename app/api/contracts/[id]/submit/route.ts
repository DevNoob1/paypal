// app/api/contracts/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { getContractById, updateContract } from "@/lib/store";
import { evaluateMilestone } from "@/lib/gemini";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contract = getContractById(id);

  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  try {
    const body = await req.json();

    const submission = {
      submittedAt: new Date().toISOString(),
      notes: body.notes || "No notes provided.",
      url: body.url || "",
      screenshotUrl: body.screenshotUrl || "",
      codeSnippet: body.codeSnippet || "",
    };

    // Auto-run AI deliverable verification on submission
    const auditReport = await evaluateMilestone({
      title: contract.title,
      description: contract.description,
      criteria: contract.criteria,
      deliverableText: submission.notes,
      deliverableUrl: submission.url,
      screenshotUrl: submission.screenshotUrl,
      codeSnippet: submission.codeSnippet,
    });

    const newStatus =
      auditReport.verdict === "APPROVE" ? "AI_VERIFIED" : "PENDING_REVIEW";

    const updated = updateContract(id, {
      submission,
      auditReport,
      status: newStatus,
    });

    return NextResponse.json({ success: true, contract: updated, auditReport });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Submission failed";
    console.error("Submission error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

