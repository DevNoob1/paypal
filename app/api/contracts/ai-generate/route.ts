// app/api/contracts/ai-generate/route.ts
import { NextResponse } from "next/server";
import { generateMilestoneBreakdown } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await generateMilestoneBreakdown({
      category: body.category || "Software & Engineering",
      title: body.title || "Deliverable Milestone Project",
      description: body.description || "Project deliverables agreed between client and contractor.",
      totalBudget: parseFloat(body.totalBudget) || 600,
      currency: body.currency || "USD",
    });

    return NextResponse.json({
      success: true,
      milestones: result.milestones,
      reasoning: result.reasoning,
      totalAllocated: result.totalAllocated,
    });
  } catch (err: unknown) {
    console.error("AI milestone generation error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate milestones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
