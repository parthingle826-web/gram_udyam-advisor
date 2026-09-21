import OpenAI from "openai";
import type { AIAdvisory } from "@/types/advisory";
import { cleanJsonOutput } from "./ibm";

export async function generateOpenAIAdvisory(
  prompt: string
): Promise<AIAdvisory> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in environment.");
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content:
          "You are Gram Udyam Advisor, a pragmatic rural micro-enterprise business advisor in India. Always respond with valid JSON matching the user's requested schema.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.25,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty completion.");
  }

  const cleaned = cleanJsonOutput(content);
  return JSON.parse(cleaned) as AIAdvisory;
}

export async function callOpenAIChatText(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in environment.");
  }

  const openai = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.3,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty completion.");
  }

  return content.trim();
}
