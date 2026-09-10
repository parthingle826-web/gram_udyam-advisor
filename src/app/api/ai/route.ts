import { NextResponse } from "next/server";
import { generateAdvisory } from "@/lib/ai/advisory";

const allowedLanguages = new Set(["en", "hi", "mr"]);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const assessment = body?.assessment ?? {};
    const finance = body?.finance ?? {};
    const market = body?.market ?? {};

    const language = allowedLanguages.has(body?.language)
      ? body.language
      : "en";

    const { advisory, provider } = await generateAdvisory({
      assessment,
      finance,
      market,
      language,
    });

    return NextResponse.json({
      success: true,
      advisory,
      provider,
    });
  } catch (error) {
    console.error("AI advisory endpoint error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "AI advisory processing encountered an unexpected issue.",
      },
      { status: 500 }
    );
  }
}