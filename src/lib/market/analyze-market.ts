export interface MarketPlace {
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

export interface MarketAnalysis {
  totalPlaces: number;
  totalBusinesses: number;
  competitorCount: number;

  competitionLevel: "LOW" | "MEDIUM" | "HIGH";

  marketDensity: number;
  businessTypeDistribution: Record<string, number>;

  underservedCategories: string[];

  opportunities: string[];

  risks: string[];

  distributionSuggestions: string[];

  dataQuality: "LOW" | "MEDIUM" | "HIGH";

  confidence: number;
}

export function analyzeMarket(
  places: MarketPlace[],
  businessType: string,
  radiusKm: number = 5
): MarketAnalysis {
  const safePlaces = Array.isArray(places) ? places : [];

  const normalizedBusinessType =
    businessType?.trim().toLowerCase() || "";

  const competitorCount = safePlaces.filter((place) => {
    const type = place.type?.toLowerCase() || "";
    const name = place.name?.toLowerCase() || "";

    return (
      type.includes(normalizedBusinessType) ||
      name.includes(normalizedBusinessType)
    );
  }).length;

  let competitionLevel: "LOW" | "MEDIUM" | "HIGH";

  if (competitorCount <= 3) {
    competitionLevel = "LOW";
  } else if (competitorCount <= 10) {
    competitionLevel = "MEDIUM";
  } else {
    competitionLevel = "HIGH";
  }

  const safeRadius =
    Number.isFinite(radiusKm) && radiusKm > 0
      ? radiusKm
      : 5;

  const marketDensity =
    Number((safePlaces.length / safeRadius).toFixed(2));

  const categoryCounts: Record<string, number> = {};

  for (const place of safePlaces) {
    const category =
      place.type?.trim().toLowerCase() || "other";

    categoryCounts[category] =
      (categoryCounts[category] || 0) + 1;
  }

  const underservedCategories = Object.entries(categoryCounts)
    .filter(([, count]) => count <= 2)
    .map(([category]) => category)
    .slice(0, 5);

  const opportunities: string[] = [];

  if (competitionLevel === "LOW") {
    opportunities.push(
      `Low direct competition detected for ${businessType}.`
    );
  }

  if (competitionLevel === "MEDIUM") {
    opportunities.push(
      "Moderate competition means differentiation and pricing strategy will be important."
    );
  }

  if (competitionLevel === "HIGH") {
    opportunities.push(
      "Consider a differentiated product, service or delivery model because direct competition is relatively high."
    );
  }

  if (underservedCategories.length > 0) {
    opportunities.push(
      `Potentially underserved categories detected: ${underservedCategories.join(", ")}.`
    );
  }

  opportunities.push(
    "Explore home delivery, local partnerships and digital promotion to increase market reach."
  );

  const risks: string[] = [];

  if (competitionLevel === "HIGH") {
    risks.push(
      "High competitor density may increase customer acquisition difficulty."
    );
  }

  if (safePlaces.length < 5) {
    risks.push(
      "Limited nearby market data was found, so the analysis has lower confidence."
    );
  }

  risks.push(
    "Actual demand should be validated through local customer interviews and small-scale testing."
  );

  let dataQuality: "LOW" | "MEDIUM" | "HIGH";
  let confidence: number;

  if (safePlaces.length < 5) {
    dataQuality = "LOW";
    confidence = 45;
  } else if (safePlaces.length < 15) {
    dataQuality = "MEDIUM";
    confidence = 65;
  } else {
    dataQuality = "HIGH";
    confidence = 80;
  }

  const distributionSuggestions = [
    "Local retail shops",
    "Weekly markets and haats",
    "Direct-to-customer sales",
    "WhatsApp and social-media promotion",
    "Local distributors or resellers",
  ];

  return {
    totalPlaces: safePlaces.length,
    totalBusinesses: safePlaces.length,
    competitorCount,
    competitionLevel,
    marketDensity,
    businessTypeDistribution: categoryCounts,
    underservedCategories,
    opportunities,
    risks,
    distributionSuggestions,
    dataQuality,
    confidence,
  };
}