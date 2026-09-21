import { NextResponse } from "next/server";
import { calculateViabilityScore } from "@/lib/viability/score";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = calculateViabilityScore({
      marketDemand: Number(body?.marketDemand ?? 0),
      competition: Number(body?.competition ?? 0),
      budgetFit: Number(body?.budgetFit ?? 0),
      localResources:
        body?.localResources !== undefined
          ? Number(body.localResources)
          : undefined,
      seasonalRisk: Number(body?.seasonalRisk ?? 0),
      profitPotential: Number(body?.profitPotential ?? 0),
      experienceYears:
        body?.experienceYears !== undefined
          ? Number(body.experienceYears)
          : undefined,
      hasLandOrShop:
        body?.hasLandOrShop !== undefined
          ? Boolean(body.hasLandOrShop)
          : undefined,
      monthlyRevenue:
        body?.monthlyRevenue !== undefined
          ? Number(body.monthlyRevenue)
          : undefined,
      operatingExpenses:
        body?.operatingExpenses !== undefined
          ? Number(body.operatingExpenses)
          : undefined,
      monthlyEMI:
        body?.monthlyEMI !== undefined
          ? Number(body.monthlyEMI)
          : undefined,
      category: body?.category ? String(body.category) : undefined,
      marginCapital:
        body?.marginCapital !== undefined
          ? Number(body.marginCapital)
          : undefined,
      projectCost:
        body?.projectCost !== undefined
          ? Number(body.projectCost)
          : undefined,
      competitorCount:
        body?.competitorCount !== undefined
          ? Number(body.competitorCount)
          : undefined,
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
        error: error instanceof Error ? error.message : "Unable to calculate business viability.",
      },
      { status: 500 }
    );
  }
}