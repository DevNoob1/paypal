// app/api/contracts/ai-generate/route.ts
import { NextResponse } from "next/server";
import { generateContractMilestones } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, budget, category } = body;

    const parsedBudget = typeof budget === "number" ? budget : parseFloat(budget) || 1200;

    const result = await generateContractMilestones({
      title: title || "Milestone Contract",
      description: description || "Deliverables agreed between client and contractor.",
      budget: parsedBudget,
      category: category || "general",
    });

    return NextResponse.json({
      success: true,
      milestones: result.milestones,
    });
  } catch (err: any) {
    console.error("AI Milestone generation route error:", err);
    return NextResponse.json(
      {
        error: "Failed to generate milestones",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

