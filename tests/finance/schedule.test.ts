import { describe, expect, test } from "vitest";
import { generateQuarterlySchedule } from "@/lib/finance/schedule";

describe("Quarter-by-Quarter Amortization Schedule", () => {
  test("generates 12 quarters for Micro Finance (3 years)", () => {
    const schedule = generateQuarterlySchedule(
      100000,
      6.5,
      3,
      3,
      "INTEREST_ONLY"
    );

    expect(schedule.totalQuarters).toBe(12);
    expect(schedule.moratoriumQuarters).toBe(1);
    expect(schedule.quarters.length).toBe(12);
    expect(schedule.quarters[0].isMoratorium).toBe(true);
    expect(schedule.quarters[0].principalPaid).toBe(0);
    expect(schedule.quarters[0].interestPaid).toBeGreaterThan(0);
    expect(schedule.quarters[11].closingPrincipal).toBe(0);
  });

  test("generates 28 quarters for Term Loan (7 years)", () => {
    const schedule = generateQuarterlySchedule(
      1000000,
      8.0,
      7,
      6,
      "INTEREST_ONLY"
    );

    expect(schedule.totalQuarters).toBe(28);
    expect(schedule.moratoriumQuarters).toBe(2);
    expect(schedule.quarters.length).toBe(28);
    expect(schedule.quarters[0].isMoratorium).toBe(true);
    expect(schedule.quarters[1].isMoratorium).toBe(true);
    expect(schedule.quarters[2].isMoratorium).toBe(false);
    expect(schedule.quarters[27].closingPrincipal).toBe(0);
  });

  test("correctly calculates interest-only moratorium vs fully deferred", () => {
    const principal = 200000;
    const interestOnly = generateQuarterlySchedule(
      principal,
      8.0,
      5,
      6,
      "INTEREST_ONLY"
    );

    const fullyDeferred = generateQuarterlySchedule(
      principal,
      8.0,
      5,
      6,
      "FULLY_DEFERRED"
    );

   
    expect(interestOnly.quarters[1].closingPrincipal).toBe(principal);
    expect(interestOnly.quarters[0].totalInstallment).toBeGreaterThan(0);

   
    expect(fullyDeferred.quarters[1].closingPrincipal).toBeGreaterThan(principal);
    expect(fullyDeferred.quarters[0].totalInstallment).toBe(0);

   
    expect(fullyDeferred.totalRepayment).toBeGreaterThan(interestOnly.totalRepayment);
  });

  test("clears principal to 0 at end of tenure", () => {
    const schedule = generateQuarterlySchedule(450000, 8.0, 7, 6);
    const lastQuarter = schedule.quarters[schedule.quarters.length - 1];
    expect(lastQuarter.closingPrincipal).toBe(0);
  });

  test("rejects non-positive inputs", () => {
    expect(() => generateQuarterlySchedule(0, 8.0, 7)).toThrow();
    expect(() => generateQuarterlySchedule(100000, -2, 7)).toThrow();
    expect(() => generateQuarterlySchedule(100000, 8.0, 0)).toThrow();
  });
});
