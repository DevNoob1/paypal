// app/api/contracts/route.ts
import { NextResponse } from "next/server";
import { getAllContracts, saveContract, Contract } from "@/lib/store";

export async function GET() {
  const contracts = getAllContracts();

  // Compute aggregate stats
  const totalEscrow = contracts
    .filter((c) => c.status === "FUNDED_ESCROW" || c.status === "PENDING_REVIEW" || c.status === "AI_VERIFIED")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaidOut = contracts
    .filter((c) => c.status === "PAYOUT_COMPLETED")
    .reduce((sum, c) => sum + c.amount, 0);

  const disputedCount = contracts.filter((c) => c.status === "DISPUTED").length;
  const verifiedCount = contracts.filter((c) => c.status === "AI_VERIFIED" || c.status === "PAYOUT_COMPLETED").length;

  return NextResponse.json({
    contracts,
    stats: {
      totalEscrow,
      totalPaidOut,
      activeCount: contracts.length,
      disputedCount,
      verifiedCount,
      approvalRate: contracts.length > 0 ? Math.round((verifiedCount / contracts.length) * 100) : 100,
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const newContract: Contract = {
      id: `cnt_${Math.random().toString(36).substring(2, 8)}_${Date.now().toString().slice(-4)}`,
      title: body.title || "Untitled Milestone",
      description: body.description || "",
      amount: parseFloat(body.amount) || 100.0,
      currency: body.currency || "USD",
      clientName: body.clientName || "Sandbox Client",
      clientEmail: body.clientEmail || "sb-client@business.example.com",
      freelancerName: body.freelancerName || "Sandbox Contractor",
      freelancerEmail: body.freelancerEmail || "sb-contractor@personal.example.com",
      createdAt: new Date().toISOString(),
      deadline: body.deadline || new Date(Date.now() + 7 * 86400000).toISOString(),
      status: body.paypalOrderId ? "FUNDED_ESCROW" : "DRAFT",
      criteria: Array.isArray(body.criteria) && body.criteria.length > 0
        ? body.criteria
        : ["Core deliverables implemented", "Automated tests pass"],
      paypalOrderId: body.paypalOrderId,
      escrowCapturedAt: body.paypalOrderId ? new Date().toISOString() : undefined,
    };

    const saved = saveContract(newContract);
    return NextResponse.json({ success: true, contract: saved }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create contract";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
