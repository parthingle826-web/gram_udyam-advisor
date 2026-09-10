import { describe, expect, test } from "vitest";

import { analyzeMarket } from "@/lib/market/analyze-market";

const places = [
  {
    id: "1",
    name: "Local Dairy",
    type: "dairy",
    latitude: 18.5,
    longitude: 73.8,
    distanceKm: 1,
  },
  {
    id: "2",
    name: "Village Grocery",
    type: "supermarket",
    latitude: 18.51,
    longitude: 73.81,
    distanceKm: 2,
  },
  {
    id: "3",
    name: "Food Shop",
    type: "restaurant",
    latitude: 18.52,
    longitude: 73.82,
    distanceKm: 3,
  },
];

describe("Market Intelligence", () => {
  test("counts nearby businesses", () => {
    const result = analyzeMarket(
      places,
      "dairy"
    );

    expect(result.totalBusinesses).toBe(3);
  });

  test("identifies competitors", () => {
    const result = analyzeMarket(
      places,
      "dairy"
    );

    expect(result.competitorCount).toBe(1);
  });

  test("detects low competition", () => {
    const result = analyzeMarket(
      places,
      "dairy"
    );

    expect(result.competitionLevel).toBe("LOW");
  });

  test("creates business type distribution", () => {
    const result = analyzeMarket(
      places,
      "dairy"
    );

    expect(
      result.businessTypeDistribution.dairy
    ).toBe(1);
  });

  test("generates opportunities", () => {
    const result = analyzeMarket(
      places,
      "dairy"
    );

    expect(
      result.opportunities.length
    ).toBeGreaterThan(0);
  });
});