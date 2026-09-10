import { NextResponse } from "next/server";
import { analyzeBusiness } from "@/lib/business/analyze-business";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid assessment data.",
        },
        { status: 400 }
      );
    }

    const assessment = body.assessment ?? body;

    if (!assessment.businessName) {
      return NextResponse.json(
        {
          success: false,
          error: "Business name is required.",
        },
        { status: 400 }
      );
    }

    if (!assessment.category) {
      return NextResponse.json(
        {
          success: false,
          error: "Business category is required.",
        },
        { status: 400 }
      );
    }

    const normalizedAssessment = {
      businessName: String(assessment.businessName),
      category: String(assessment.category),

      village: String(assessment.village ?? ""),
      block: String(assessment.block ?? ""),
      district: String(assessment.district ?? ""),
      state: String(assessment.state ?? ""),

      marginCapital: Number(assessment.marginCapital ?? 0),

      marketDemand: Number(assessment.marketDemand ?? 0),
      competition: Number(assessment.competition ?? 0),
      budgetFit: Number(assessment.budgetFit ?? 0),
      localResources: Number(assessment.localResources ?? 0),
      seasonalRisk: Number(assessment.seasonalRisk ?? 0),
      profitPotential: Number(assessment.profitPotential ?? 0),

      monthlyRevenue:
        assessment.monthlyRevenue !== undefined
          ? Number(assessment.monthlyRevenue)
          : undefined,

      operatingExpenses:
        assessment.operatingExpenses !== undefined
          ? Number(assessment.operatingExpenses)
          : undefined,

      experienceYears:
        assessment.experienceYears !== undefined
          ? Number(assessment.experienceYears)
          : 1,

      hasLandOrShop:
        assessment.hasLandOrShop !== undefined
          ? Boolean(assessment.hasLandOrShop)
          : true,
    };

    const result = analyzeBusiness(normalizedAssessment);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Assessment API error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to analyze the assessment.",
      },
      { status: 500 }
    );
  }
}