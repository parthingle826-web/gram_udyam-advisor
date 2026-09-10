import { describe, expect, test } from "vitest";

import { analyzeBusiness } from "@/lib/business/analyze-business";

const strongBusiness = {
  businessName: "Dairy Farm",
  category: "Agriculture",
  village: "Example Village",
  block: "Example Block",
  district: "Example District",
  state: "Maharashtra",

  marginCapital: 100000,

  marketDemand: 90,
  competition: 10,
  budgetFit: 90,
  localResources: 90,
  seasonalRisk: 10,
  profitPotential: 90,
};

describe("Business Analysis", () => {
  test("recommends a highly viable business", () => {
    const result = analyzeBusiness(strongBusiness);

    expect(result.viability.score).toBeGreaterThanOrEqual(75);
    expect(result.decision).toBe("RECOMMENDED");
  });

  test("includes financial analysis", () => {
    const result = analyzeBusiness(strongBusiness);

    expect(result.finance.projectCost).toBe(1000000);
    expect(result.finance.loanAmount).toBe(900000);
  });

  test("generates strengths", () => {
    const result = analyzeBusiness(strongBusiness);

    expect(result.strengths.length).toBeGreaterThan(0);
  });

  test("generates next steps", () => {
    const result = analyzeBusiness(strongBusiness);

    expect(result.nextSteps.length).toBeGreaterThan(0);
  });

  test("handles project above scheme limit", () => {
    const result = analyzeBusiness({
      ...strongBusiness,
      marginCapital: 600000,
    });

    expect(result.finance.scheme.suitable).toBe(false);
    expect(result.decision).toBe("REVIEW");
    expect(result.nextSteps.length).toBeGreaterThan(0);
  });
});