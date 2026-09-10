import { describe, expect, it } from "vitest";
import { calculateSustainability } from "@/lib/finance/sustainability";

describe("calculateSustainability", () => {
  it("calculates profit correctly", () => {
    const result = calculateSustainability({
      monthlyRevenue: 50000,
      operatingExpenses: 25000,
      monthlyEMI: 10000,
      initialInvestment: 200000,
    });

    expect(result.netProfit).toBe(15000);
  });

  it("calculates DSCR correctly", () => {
    const result = calculateSustainability({
      monthlyRevenue: 50000,
      operatingExpenses: 20000,
      monthlyEMI: 10000,
      initialInvestment: 200000,
    });

    expect(result.dscr).toBe(3);
  });

  it("identifies a highly sustainable business", () => {
    const result = calculateSustainability({
      monthlyRevenue: 100000,
      operatingExpenses: 40000,
      monthlyEMI: 10000,
      initialInvestment: 300000,
    });

    expect(result.sustainabilityLevel).toBe("HIGH");
    expect(result.sustainabilityScore).toBeGreaterThanOrEqual(75);
  });

  it("handles a business with no profit", () => {
    const result = calculateSustainability({
      monthlyRevenue: 30000,
      operatingExpenses: 25000,
      monthlyEMI: 10000,
      initialInvestment: 200000,
    });

    expect(result.netProfit).toBeLessThan(0);
    expect(result.sustainabilityLevel).toBe("LOW");
  });
});