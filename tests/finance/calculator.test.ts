import { describe, expect, test } from "vitest";
import { calculateFinancialStructure } from "@/lib/finance/calculator";

describe("Financial Calculator", () => {
  test("calculates project cost from 10% margin", () => {
    const result = calculateFinancialStructure(100000);

    expect(result.marginCapital).toBe(100000);
    expect(result.projectCost).toBe(1000000);
  });

  test("calculates 90% loan amount", () => {
    const result = calculateFinancialStructure(100000);

    expect(result.loanAmount).toBe(900000);
  });

  test("returns 10% margin percentage", () => {
    const result = calculateFinancialStructure(100000);

    expect(result.marginPercentage).toBe(10);
  });

  test("rejects zero margin", () => {
    expect(() => calculateFinancialStructure(0)).toThrow();
  });

  test("rejects negative margin", () => {
    expect(() => calculateFinancialStructure(-50000)).toThrow();
  });
});