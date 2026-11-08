// app/api/contracts/[id]/route.ts
import { NextResponse } from "next/server";
import { getContractById, updateContract } from "@/lib/store";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contract = getContractById(id);

  if (!contract) {
    return NextResponse.json({ error: "Contract not found" }, { status: 404 });
  }

  return NextResponse.json({ contract });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = updateContract(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Contract not found" }, { status: 404 });
    }
    return NextResponse.json({ contract: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

