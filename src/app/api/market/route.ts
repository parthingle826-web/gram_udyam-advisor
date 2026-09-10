import { NextRequest, NextResponse } from "next/server";

import { geocodeLocation } from "@/lib/location/geocode";
import { findNearbyBusinesses } from "@/lib/location/nearby-places";
import { analyzeMarket } from "@/lib/market/analyze-market";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      village,
      block,
      district,
      state,
      businessType,
      radiusKm,
    } = body;

    if (!district && !state && !village && !block) {
      return NextResponse.json(
        {
          error: "At least village, block, district, or state is required.",
        },
        { status: 400 }
      );
    }

    const radius = Math.min(Math.max(Number(radiusKm) || 5, 1), 10);

    const location = await geocodeLocation(
      village,
      block,
      district,
      state
    );

    const places = await findNearbyBusinesses(
      location.latitude,
      location.longitude,
      radius,
      businessType
    );

    const market = analyzeMarket(
      places,
      businessType || "general",
      radius
    );

    const competitors = places.filter((p) => p.category === "competitor");
    const suppliers = places.filter((p) => p.category === "supplier");
    const markets = places.filter((p) => p.category === "market");
    const banks = places.filter((p) => p.category === "bank");

    return NextResponse.json({
      success: true,
      location,
      radiusKm: radius,
      market: {
        ...market,
        totalBusinesses: places.length,
        competitorCount: competitors.length,
      },
      places,
      competitors,
      suppliers,
      markets,
      banks,
    });
  } catch (error) {
    console.error("Market analysis error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Market analysis failed.",
      },
      { status: 500 }
    );
  }
}