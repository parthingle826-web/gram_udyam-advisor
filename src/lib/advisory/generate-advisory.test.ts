import { describe, expect, test } from "vitest";

import { generateAdvisory } from "@/lib/advisory/generate-advisory";

const strongInput = {
  businessName: "Dairy Farm",
  category: "Dairy",

  village: "Example Village",
  district: "Example District",
  state: "Maharashtra",

  viabilityScore: 85,
  viabilityRating: "HIGH",

  projectCost: 1000000,
  loanAmount: 900000,

  schemeName: "Term Loan Scheme",
  schemeSuitable: true,

  monthlyEMI: 14000,

  competitorCount: 2,
  competitionLevel: "LOW",

  marketOpportunities: [
    "Low competitor presence.",
  ],

  marketRisks: [],

  strengths: [
    "Strong local demand.",
  ],

  risks: [],

  opportunities: [
    "Growing local market.",
  ],
};

describe("AI Advisory Engine", () => {
  test("recommends starting a strong business", () => {
    const result = generateAdvisory(strongInput);

    expect(result.recommendation).toBe("START");
  });

  test("generates a useful headline", () => {
    const result = generateAdvisory(strongInput);

    expect(result.headline.length).toBeGreaterThan(10);
  });

  test("generates financial advice", () => {
    const result = generateAdvisory(strongInput);

    expect(result.financialAdvice.length).toBeGreaterThan(0);
  });

  test("generates action plan", () => {
    const result = generateAdvisory(strongInput);

    expect(result.actionPlan.length).toBeGreaterThan(0);
  });

  test("handles unavailable financing scheme", () => {
    const result = generateAdvisory({
      ...strongInput,
      viabilityScore: 80,
      schemeSuitable: false,
      schemeName: "No Suitable Configured Scheme",
      projectCost: 6000000,
      loanAmount: 5400000,
      monthlyEMI: 0,
    });

    expect(result.recommendation).toBe("REVIEW");

    expect(
      result.financialAdvice.some((item) =>
        item.toLowerCase().includes("project size")
      )
    ).toBe(true);
  });

  test("handles high competition", () => {
    const result = generateAdvisory({
      ...strongInput,
      competitorCount: 20,
      competitionLevel: "HIGH",
    });

    expect(
      result.marketAdvice.length
    ).toBeGreaterThan(0);

    expect(
      result.riskMitigation.length
    ).toBeGreaterThan(0);
  });
});