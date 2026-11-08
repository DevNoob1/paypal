// app/api/contracts/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { getContractById, updateContract } from "@/lib/store";

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
      codeSnippet: body.codeSnippet || "",
    };

    const updated = updateContract(id, {
      submission,
      status: "PENDING_REVIEW",
    });

    return NextResponse.json({ success: true, contract: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
