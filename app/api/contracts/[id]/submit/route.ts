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

    const emailNotif = {
      id: `notif_${Date.now()}_email`,
      timestamp: new Date().toISOString(),
      channel: "EMAIL" as const,
      recipient: contract.clientEmail,
      subject: `Action Required: Deliverable submitted for "${contract.title}"`,
      message: `${contract.freelancerName} has submitted deliverable artifacts. ResolvAI verified the criteria with score ${auditReport.overallScore}/100. 48-hour client review window engaged.`,
      status: "DELIVERED" as const,
    };

    const smsNotif = {
      id: `notif_${Date.now()}_sms`,
      timestamp: new Date().toISOString(),
      channel: "SMS" as const,
      recipient: "+1 (555) 019-2834",
      subject: "ResolvAI Payment Alert",
      message: `ResolvAI: Deliverable submitted for ${contract.title.slice(0, 30)}... Review & authorize payment release in portal.`,
      status: "DELIVERED" as const,
    };

    const existingNotifs = contract.notifications || [];

    const updated = updateContract(id, {
      submission,
      auditReport,
      status: newStatus,
      notifications: [emailNotif, smsNotif, ...existingNotifs],
    });

    return NextResponse.json({ success: true, contract: updated, auditReport });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Submission failed";
    console.error("Submission error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

