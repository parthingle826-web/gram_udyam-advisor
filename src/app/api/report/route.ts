import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        {
          success: false,
          error: "Report data is required.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      report: {
        ...body,
        generatedAt:
          new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error(
      "Report generation error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Unable to generate report.",
      },
      { status: 500 }
    );
  }
}