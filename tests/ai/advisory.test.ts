import { describe, it, expect } from "vitest";
import {
  generateAdvisory,
  generateDeterministicAdvisory,
} from "@/lib/ai/advisory";
import { cleanJsonOutput } from "@/lib/ai/ibm";

describe("AI Layer & IBM Granite utilities", () => {
  it("cleanJsonOutput correctly strips markdown code fences", () => {
    const rawWithFence = "```json\n{\"headline\": \"Test\"}\n```";
    expect(cleanJsonOutput(rawWithFence)).toBe("{\"headline\": \"Test\"}");

    const rawSimpleFence = "```\n{\"headline\": \"Test2\"}\n```";
    expect(cleanJsonOutput(rawSimpleFence)).toBe("{\"headline\": \"Test2\"}");

    const plain = "{\"headline\": \"Plain\"}";
    expect(cleanJsonOutput(plain)).toBe(plain);
  });

  it("generateDeterministicAdvisory generates full structured advisory in English", () => {
    const advisory = generateDeterministicAdvisory({
      assessment: {
        businessName: "Kisan Kirana",
        category: "Grocery / Retail",
      },
      finance: {
        projectCost: 150000,
        loanAmount: 120000,
        monthlyEMI: 3200,
        scheme: { name: "Mudra Shishu", suitable: true },
      },
      market: {
        competitorCount: 2,
      },
      language: "en",
    });

    expect(advisory.headline).toContain("Kisan Kirana");
    expect(advisory.recommendation).toBe("START");
    expect(advisory.confidence).toBeGreaterThanOrEqual(70);
    expect(advisory.keyReasons.length).toBeGreaterThan(0);
    expect(advisory.actions.length).toBeGreaterThan(0);
    expect(advisory.swot.strengths.length).toBeGreaterThan(0);
    expect(advisory.swot.weaknesses.length).toBeGreaterThan(0);
    expect(advisory.pricingInsight.strategy).toBeTruthy();
    expect(advisory.businessPlan.targetCustomers).toBeTruthy();
  });

  it("generateDeterministicAdvisory generates localized advisory in Hindi", () => {
    const advisory = generateDeterministicAdvisory({
      assessment: {
        businessName: "श्री गणेश किराना",
        category: "किराना दुकान",
      },
      finance: {
        projectCost: 100000,
        loanAmount: 80000,
        monthlyEMI: 2200,
        scheme: { name: "मुद्रा योजना", suitable: true },
      },
      market: {
        competitorCount: 1,
      },
      language: "hi",
    });

    expect(advisory.headline).toContain("श्री गणेश किराना");
    expect(advisory.recommendation).toBe("START");
    expect(advisory.actions.some((a) => a.includes("बैंक"))).toBe(true);
  });

  it("generateAdvisory falls back gracefully without crashing when cloud keys are unconfigured", async () => {
    const originalWatsonKey = process.env.WATSONX_API_KEY;
    const originalOpenAIKey = process.env.OPENAI_API_KEY;
    const originalGeminiKey = process.env.GEMINI_API_KEY;

    delete process.env.WATSONX_API_KEY;
    delete process.env.OPENAI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    try {
      const result = await generateAdvisory({
        assessment: {
          businessName: "Gram Flour Mill",
          category: "Food Processing",
        },
        finance: {
          projectCost: 450000,
          loanAmount: 380000,
          monthlyEMI: 8500,
          scheme: { name: "PMEGP", suitable: true },
        },
        market: {
          competitorCount: 4,
        },
        language: "en",
      });

      expect(result.provider).toBe("deterministic");
      expect(result.advisory.headline).toContain("Gram Flour Mill");
      expect(result.advisory.recommendation).toBeTruthy();
    } finally {
      if (originalWatsonKey) process.env.WATSONX_API_KEY = originalWatsonKey;
      if (originalOpenAIKey) process.env.OPENAI_API_KEY = originalOpenAIKey;
      if (originalGeminiKey) process.env.GEMINI_API_KEY = originalGeminiKey;
    }
  });
});
