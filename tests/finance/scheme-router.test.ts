import { describe, expect, test } from "vitest";
import { routeScheme } from "@/lib/finance/scheme-router";

describe("Scheme Router", () => {
  test("routes project up to ₹1.40 lakh to Micro Finance Scheme", () => {
    const result = routeScheme(140000);

    expect(result.scheme).toBe("MICRO_FINANCE");
    expect(result.suitable).toBe(true);
  });

  test("routes project above ₹1.40 lakh to Term Loan Scheme", () => {
    const result = routeScheme(1000000);

    expect(result.scheme).toBe("TERM_LOAN");
    expect(result.suitable).toBe(true);
  });

  test("routes ₹50 lakh project to Term Loan Scheme", () => {
    const result = routeScheme(5000000);

    expect(result.scheme).toBe("TERM_LOAN");
    expect(result.suitable).toBe(true);
  });

  test("rejects project above ₹50 lakh", () => {
    const result = routeScheme(6000000);

    expect(result.scheme).toBe("NOT_ELIGIBLE");
    expect(result.suitable).toBe(false);
  });

  test("returns guidance when no scheme is suitable", () => {
    const result = routeScheme(6000000);

    expect(result.guidance.length).toBeGreaterThan(0);
    expect(result.alternatives?.length).toBeGreaterThan(0);
  });

  test("flags project below ₹10,000 as below minimum viable scale", () => {
    const result = routeScheme(5000);

    expect(result.scheme).toBe("NOT_ELIGIBLE");
    expect(result.suitable).toBe(false);
    expect(result.reason).toContain("below the ₹10,000 threshold");
    expect(result.alternatives?.some((a) => a.title.includes("PM SVANidhi"))).toBe(true);
  });
});