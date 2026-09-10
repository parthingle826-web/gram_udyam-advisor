import { NextResponse } from "next/server";
import { calculateViabilityScore } from "@/lib/viability/score";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = calculateViabilityScore({
      marketDemand: Number(body?.marketDemand ?? 0),
      competition: Number(body?.competition ?? 0),
      budgetFit: Number(body?.budgetFit ?? 0),
      localResources: Number(body?.localResources ?? 0),
      seasonalRisk: Number(body?.seasonalRisk ?? 0),
      profitPotential: Number(body?.profitPotential ?? 0),
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Viability API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to calculate business viability.",
      },
      { status: 500 }
    );
  }
}