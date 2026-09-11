import { describe, expect, test } from "vitest";

import {
  analyzeFinance,
} from "@/lib/finance/analyze-finance";

describe("Complete Financial Analysis", () => {

  test("₹1 lakh margin produces ₹10 lakh project", () => {

    const result =
      analyzeFinance(100000);

    expect(result.projectCost)
      .toBe(1000000);

    expect(result.loanAmount)
      .toBe(900000);

  });

  test("₹1 lakh margin routes to Term Loan", () => {

    const result =
      analyzeFinance(100000);

    expect(result.scheme.scheme)
      .toBe("TERM_LOAN");

  });

  test("calculates EMI", () => {

    const result =
      analyzeFinance(100000);

    expect(result.monthlyEMI)
      .toBeGreaterThan(0);

  });

  test("calculates quarterly payment", () => {

    const result =
      analyzeFinance(100000);

    expect(result.quarterlyPayment)
      .toBeGreaterThan(0);

  });

  test("project above ₹50 lakh receives guidance", () => {

    
    const result =
      analyzeFinance(600000);

    expect(result.scheme.scheme)
      .toBe("NOT_ELIGIBLE");

    expect(result.scheme.guidance.length)
      .toBeGreaterThan(0);

    expect(result.monthlyEMI)
      .toBe(0);

  });

});