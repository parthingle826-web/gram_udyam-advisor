import { NextRequest, NextResponse } from "next/server";
import {
  generateChatResponse,
  generateDeterministicChatResponse,
  ChatMessage,
  ChatContext,
} from "@/lib/ai/chat";

export async function POST(req: NextRequest) {
  let cleanMessages: ChatMessage[] = [];
  let cleanContext: ChatContext = { assessment: {}, result: {} };
  let chosenLanguage = "en";

  try {
    const body = await req.json();
    const { messages, context, language = "en" } = body;
    chosenLanguage = ["en", "hi", "mr"].includes(language) ? language : "en";

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "A non-empty messages array is required." },
        { status: 400 }
      );
    }

    cleanMessages = messages
      .filter((m: any) => m && typeof m.content === "string")
      .map((m: any) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content).slice(0, 2000), // sanitize length
      }));

    cleanContext = {
      assessment: context?.assessment || {},
      result: context?.result || {},
    };

    const response = await generateChatResponse({
      messages: cleanMessages,
      context: cleanContext,
      language: chosenLanguage,
    });

    return NextResponse.json({
      success: true,
      message: response.message,
      provider: response.provider,
    });
  } catch (err: any) {
    console.error("[API /api/chat] error:", err);
    try {
      const fallbackMessage = generateDeterministicChatResponse({
        messages:
          cleanMessages.length > 0
            ? cleanMessages
            : [{ role: "user", content: "loan and viability" }],
        context: cleanContext,
        language: chosenLanguage,
      });

      return NextResponse.json(
        {
          success: true,
          message: fallbackMessage,
          provider: "deterministic",
        },
        { status: 200 }
      );
    } catch (fallbackErr) {
      console.error("[API /api/chat] deterministic fallback error:", fallbackErr);
      return NextResponse.json(
        {
          success: true,
          message:
            "Your enterprise feasibility report indicates that your business parameters have been generated. Please refer to your downloaded report or consult your local bank branch manager.",
          provider: "error_fallback",
        },
        { status: 200 }
      );
    }
  }
}
