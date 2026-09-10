import { NextResponse } from "next/server";
import { routeScheme } from "@/lib/finance/scheme-router";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const projectCost = Number(body?.projectCost);

    if (!Number.isFinite(projectCost) || projectCost <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid project cost is required.",
        },
        { status: 400 }
      );
    }

    const result = routeScheme(projectCost);

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Scheme API error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Unable to calculate the suitable scheme.",
      },
      { status: 500 }
    );
  }
}