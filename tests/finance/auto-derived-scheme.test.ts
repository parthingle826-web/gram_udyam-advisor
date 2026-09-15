import { describe, expect, test } from "vitest";
import { calculateFinancialStructure } from "@/lib/finance/calculator";
import { routeScheme } from "@/lib/finance/scheme-router";
import { analyzeFinance } from "@/lib/finance/analyze-finance";

describe("Auto-Derived Scheme Routing Spec (6 Required Test Cases)", () => {
  // Case 1: ₹10,000 -> ₹1,00,000 -> Micro Finance Scheme
  test("Case 1: ₹10,000 margin capital derives ₹1,00,000 project cost and Micro Finance Scheme", () => {
    const marginCapital = 10000;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(100000);
    expect(financial.loanAmount).toBe(90000);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("MICRO_FINANCE");
    expect(scheme.name).toBe("Micro Finance Scheme");
    expect(scheme.suitable).toBe(true);
    expect(scheme.interestRate).toBe(6.5);
    expect(scheme.tenureYears).toBe(3);
    expect(scheme.moratoriumMonths).toBe(3);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(100000);
    expect(analysis.scheme.name).toBe("Micro Finance Scheme");
  });

  // Case 2: ₹14,000 -> ₹1,40,000 -> Micro Finance Scheme (boundary, inclusive)
  test("Case 2: ₹14,000 margin capital derives ₹1,40,000 project cost and Micro Finance Scheme (boundary, inclusive)", () => {
    const marginCapital = 14000;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(140000);
    expect(financial.loanAmount).toBe(126000);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("MICRO_FINANCE");
    expect(scheme.name).toBe("Micro Finance Scheme");
    expect(scheme.suitable).toBe(true);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(140000);
    expect(analysis.scheme.name).toBe("Micro Finance Scheme");
    // Loan capped at ₹1,25,000 for Micro Finance Scheme
    expect(analysis.loanAmount).toBe(125000);
  });

  // Case 3: ₹14,001 -> ₹1,40,010 -> Term Loan Scheme
  test("Case 3: ₹14,001 margin capital derives ₹1,40,010 project cost and Term Loan Scheme", () => {
    const marginCapital = 14001;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(140010);
    expect(financial.loanAmount).toBe(126009);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("TERM_LOAN");
    expect(scheme.name).toBe("Term Loan Scheme");
    expect(scheme.suitable).toBe(true);
    expect(scheme.interestRate).toBe(8.0);
    expect(scheme.tenureYears).toBe(7);
    expect(scheme.moratoriumMonths).toBe(6);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(140010);
    expect(analysis.scheme.name).toBe("Term Loan Scheme");
    expect(analysis.loanAmount).toBe(126009);
  });

  // Case 4: ₹1,00,000 -> ₹10,00,000 -> Term Loan Scheme
  test("Case 4: ₹1,00,000 margin capital derives ₹10,00,000 project cost and Term Loan Scheme", () => {
    const marginCapital = 100000;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(1000000);
    expect(financial.loanAmount).toBe(900000);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("TERM_LOAN");
    expect(scheme.name).toBe("Term Loan Scheme");
    expect(scheme.suitable).toBe(true);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(1000000);
    expect(analysis.scheme.name).toBe("Term Loan Scheme");
    expect(analysis.loanAmount).toBe(900000);
  });

  // Case 5: ₹5,00,000 -> ₹50,00,000 -> Term Loan Scheme (boundary, inclusive)
  test("Case 5: ₹5,00,000 margin capital derives ₹50,00,000 project cost and Term Loan Scheme (boundary, inclusive)", () => {
    const marginCapital = 500000;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(5000000);
    expect(financial.loanAmount).toBe(4500000);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("TERM_LOAN");
    expect(scheme.name).toBe("Term Loan Scheme");
    expect(scheme.suitable).toBe(true);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(5000000);
    expect(analysis.scheme.name).toBe("Term Loan Scheme");
    // Loan capped at ₹45,00,000 for Term Loan Scheme
    expect(analysis.loanAmount).toBe(4500000);
  });

  // Case 6: ₹5,00,001 -> ₹50,00,010 -> No-Fit Guidance Engine triggers
  test("Case 6: ₹5,00,001 margin capital derives ₹50,00,010 project cost and triggers No-Fit Guidance Engine", () => {
    const marginCapital = 500001;
    const financial = calculateFinancialStructure(marginCapital);
    expect(financial.projectCost).toBe(5000010);
    expect(financial.loanAmount).toBe(4500009);

    const scheme = routeScheme(financial.projectCost);
    expect(scheme.scheme).toBe("NOT_ELIGIBLE");
    expect(scheme.suitable).toBe(false);
    expect(scheme.guidance.length).toBeGreaterThan(0);
    expect(scheme.alternatives?.length).toBeGreaterThan(0);

    const analysis = analyzeFinance(marginCapital);
    expect(analysis.projectCost).toBe(5000010);
    expect(analysis.scheme.suitable).toBe(false);
    expect(analysis.scheme.scheme).toBe("NOT_ELIGIBLE");
  });
});
