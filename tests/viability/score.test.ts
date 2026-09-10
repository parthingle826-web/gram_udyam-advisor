import { describe, expect, test } from "vitest";
import { calculateViabilityScore } from "@/lib/viability/score";

describe("Business Viability Score", () => {
  test("calculates a high viability score", () => {
    const result = calculateViabilityScore({
      marketDemand: 90,
      competition: 10,
      budgetFit: 90,
      localResources: 90,
      seasonalRisk: 10,
      profitPotential: 90,
    });

    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.rating).toBe("HIGH");
  });

  test("calculates a medium viability score", () => {
    const result = calculateViabilityScore({
      marketDemand: 60,
      competition: 40,
      budgetFit: 60,
      localResources: 60,
      seasonalRisk: 40,
      profitPotential: 60,
    });

    expect(result.score).toBeGreaterThanOrEqual(50);
    expect(result.score).toBeLessThan(75);
    expect(result.rating).toBe("MEDIUM");
  });

  test("calculates a low viability score", () => {
    const result = calculateViabilityScore({
      marketDemand: 20,
      competition: 90,
      budgetFit: 20,
      localResources: 20,
      seasonalRisk: 90,
      profitPotential: 20,
    });

    expect(result.score).toBeLessThan(50);
    expect(result.rating).toBe("LOW");
  });

  test("score remains between 0 and 100", () => {
    const result = calculateViabilityScore({
      marketDemand: 100,
      competition: 0,
      budgetFit: 100,
      localResources: 100,
      seasonalRisk: 0,
      profitPotential: 100,
    });

    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  test("returns a recommendation", () => {
    const result = calculateViabilityScore({
      marketDemand: 80,
      competition: 20,
      budgetFit: 80,
      localResources: 80,
      seasonalRisk: 20,
      profitPotential: 80,
    });

    expect(result.recommendation).toBeTruthy();
  });
});