// app/api/contracts/[id]/preflight/route.ts
import { NextResponse } from "next/server";
import { getContractById } from "@/lib/store";
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

    const auditReport = await evaluateMilestone({
      title: contract.title,
      description: contract.description,
      criteria: contract.criteria,
      deliverableText: body.notes || "Deliverable submission notes provided.",
      deliverableUrl: body.url || "",
      screenshotUrl: body.screenshotUrl || "",
      codeSnippet: body.codeSnippet || "",
    });

    const isReady =
      auditReport.verdict === "APPROVE" || (auditReport.overallScore ?? 0) >= 75;

    return NextResponse.json({
      success: true,
      ready: isReady,
      auditReport,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Pre-flight check failed";
    console.error("Preflight error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
