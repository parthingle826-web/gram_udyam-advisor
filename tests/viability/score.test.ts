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

  test("computes distinct, justified scores for different business profiles (not fixed at 85%)", () => {
    // 1. Low-capital Kirana with crowded market, beginner founder, no owned premises
    const lowCapitalRetail = calculateViabilityScore({
      category: "kirana",
      marginCapital: 10000,
      projectCost: 100000,
      competitorCount: 14,
      marketDemand: 45,
      competition: 80,
      budgetFit: 50,
      seasonalRisk: 25,
      experienceYears: 0,
      hasLandOrShop: false,
      monthlyRevenue: 25000,
      operatingExpenses: 22000,
      monthlyEMI: 2800, // net income 3000 vs EMI 2800 -> ratio ~1.07
    });

    // 2. Medium-capital Dairy with established market, low competition, experienced founder
    const mediumCapitalDairy = calculateViabilityScore({
      category: "dairy",
      marginCapital: 50000,
      projectCost: 500000,
      competitorCount: 2,
      marketDemand: 88,
      competition: 20,
      budgetFit: 85,
      seasonalRisk: 15,
      experienceYears: 4,
      hasLandOrShop: true,
      monthlyRevenue: 65000,
      operatingExpenses: 35000,
      monthlyEMI: 7000, // net income 30000 vs EMI 7000 -> ratio ~4.28x
    });

    // 3. High-capital Food Processing with moderate competition and seasonal raw materials
    const highCapitalFoodProcessing = calculateViabilityScore({
      category: "food-processing",
      marginCapital: 200000,
      projectCost: 2000000,
      competitorCount: 6,
      marketDemand: 75,
      competition: 50,
      budgetFit: 70,
      seasonalRisk: 45,
      experienceYears: 2,
      hasLandOrShop: true,
      monthlyRevenue: 150000,
      operatingExpenses: 110000,
      monthlyEMI: 26000, // net income 40000 vs EMI 26000 -> ratio ~1.53x
    });

    // Scores must be distinct and non-trivial
    expect(lowCapitalRetail.score).toBeLessThan(mediumCapitalDairy.score);
    expect(lowCapitalRetail.score).toBeLessThan(highCapitalFoodProcessing.score);
    expect(mediumCapitalDairy.score).toBeGreaterThan(highCapitalFoodProcessing.score);

    // Verify concrete divergence
    expect(lowCapitalRetail.rating).toBe("LOW");
    expect(mediumCapitalDairy.rating).toBe("HIGH");

    // Explicitly verify none of them are stuck at the hardcoded 85 bug
    expect(lowCapitalRetail.score).not.toBe(85);
    expect(mediumCapitalDairy.score).not.toBe(85);
    expect(highCapitalFoodProcessing.score).not.toBe(85);

    // Factors breakdown check
    expect(lowCapitalRetail.factors.competitorDensity.rating).toBe("RISK");
    expect(mediumCapitalDairy.factors.competitorDensity.rating).toBe("POSITIVE");
    expect(mediumCapitalDairy.factors.incomeToEmiRatio.rating).toBe("POSITIVE");
  });
});