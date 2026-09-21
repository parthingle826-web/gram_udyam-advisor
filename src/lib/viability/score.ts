import { BUSINESS_CATEGORIES } from "../../data/business-categories";

export interface ViabilityInput {
  marketDemand: number;
  competition: number;
  budgetFit: number;
  localResources?: number;
  seasonalRisk: number;
  profitPotential?: number;

  experienceYears?: number;
  hasLandOrShop?: boolean;
  monthlyRevenue?: number;
  operatingExpenses?: number;
  monthlyEMI?: number;
  category?: string;
  marginCapital?: number;
  projectCost?: number;
  competitorCount?: number;
}

export interface FactorDetail {
  score: number;
  weight: number;
  rating: "POSITIVE" | "NEUTRAL" | "RISK";
  name: string;
  description: string;
}

export interface ViabilityFactorBreakdown {
  marketSaturation: FactorDetail;
  competitorDensity: FactorDetail;
  incomeToEmiRatio: FactorDetail;
  seasonalityRisk: FactorDetail;
  founderExperience: FactorDetail;
}

export interface ViabilityResult {
  score: number;
  rating: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
  factors: ViabilityFactorBreakdown;
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

export function calculateViabilityScore(
  input: ViabilityInput
): ViabilityResult {
  const {
    marketDemand,
    competition,
    budgetFit,
    seasonalRisk,
    experienceYears = 1,
    hasLandOrShop,
    monthlyRevenue,
    operatingExpenses = 0,
    monthlyEMI,
    category,
    projectCost,
    competitorCount,
    localResources,
  } = input;

  // Resolve category benchmark if available
  const catBenchmark = category
    ? BUSINESS_CATEGORIES.find(
        (c) =>
          c.id.toLowerCase() === category.toLowerCase() ||
          c.name.toLowerCase() === category.toLowerCase()
      )
    : undefined;

  // 1. Market Saturation & Demand (weight 20%)
  let baseDemand = marketDemand;
  if (catBenchmark?.revenuePotential === "HIGH") {
    baseDemand += 6;
  } else if (catBenchmark?.revenuePotential === "LOW") {
    baseDemand -= 6;
  }
  if (localResources !== undefined) {
    baseDemand += Math.round((localResources - 50) * 0.1);
  }
  const saturationScore = clamp(baseDemand);

  const marketSaturation: FactorDetail = {
    name: "Market Saturation & Demand",
    score: saturationScore,
    weight: 20,
    rating: saturationScore >= 70 ? "POSITIVE" : saturationScore >= 45 ? "NEUTRAL" : "RISK",
    description:
      saturationScore >= 70
        ? "Strong consumer demand headroom in the local trade area."
        : saturationScore >= 45
        ? "Moderate market depth; targeted promotion advised to capture share."
        : "Market near saturation or demand is sluggish in this cluster.",
  };

  // 2. Competitor Density (weight 20%)
  let densityScore: number;
  let densityDesc: string;

  if (competitorCount !== undefined && competitorCount >= 0) {
    let countBase = 70;
    if (competitorCount <= 1) {
      countBase = 95;
    } else if (competitorCount <= 3) {
      countBase = 85;
    } else if (competitorCount <= 6) {
      countBase = 68;
    } else if (competitorCount <= 10) {
      countBase = 50;
    } else if (competitorCount <= 15) {
      countBase = 35;
    } else {
      countBase = 20;
    }
    // Blend with slider input
    densityScore = clamp(countBase * 0.6 + (100 - competition) * 0.4);
    densityDesc =
      competitorCount <= 2
        ? `Low competitor presence (${competitorCount} rival${competitorCount === 1 ? "" : "s"} in local area).`
        : competitorCount <= 7
        ? `Moderate competitor density (${competitorCount} active alternatives). Differentiation recommended.`
        : `High competitive cluster (${competitorCount} direct competitors nearby). Distinct positioning required.`;
  } else {
    densityScore = clamp(100 - competition);
    densityDesc =
      densityScore >= 65
        ? "Low competitor density in immediate 2-5km radius."
        : densityScore >= 40
        ? "Moderate competition; differentiation on quality or service advised."
        : "High competitor cluster; requires distinct pricing or product offering.";
  }

  const competitorDensity: FactorDetail = {
    name: "Competitor Density",
    score: densityScore,
    weight: 20,
    rating: densityScore >= 65 ? "POSITIVE" : densityScore >= 40 ? "NEUTRAL" : "RISK",
    description: densityDesc,
  };

  // 3. Income-to-EMI & Budget Capacity (weight 25%)
  let incomeEmiScore = clamp(budgetFit);
  let incomeEmiDesc = "Capital budget aligns well with setup requirements.";

  if (monthlyRevenue !== undefined && monthlyRevenue > 0 && monthlyEMI !== undefined && monthlyEMI > 0) {
    const netIncome = monthlyRevenue - operatingExpenses;
    const ratio = netIncome / monthlyEMI;
    if (ratio >= 2.5) {
      incomeEmiScore = 95;
      incomeEmiDesc = `Strong debt-service capacity (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 2.0) {
      incomeEmiScore = 88;
      incomeEmiDesc = `Robust debt-service capacity (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.5) {
      incomeEmiScore = 78;
      incomeEmiDesc = `Adequate debt-service coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.2) {
      incomeEmiScore = 65;
      incomeEmiDesc = `Tight repayment coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.0) {
      incomeEmiScore = 50;
      incomeEmiDesc = `Borderline cash flow coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio > 0) {
      incomeEmiScore = 32;
      incomeEmiDesc = `Net operating income is insufficient to cover estimated EMI (~${ratio.toFixed(1)}x).`;
    } else {
      incomeEmiScore = 15;
      incomeEmiDesc = "Operating at a deficit; cannot service debt without restructuring.";
    }
  } else if (projectCost !== undefined && catBenchmark) {
    if (
      projectCost >= catBenchmark.requiredCapital.min &&
      projectCost <= catBenchmark.requiredCapital.max
    ) {
      incomeEmiScore = 82;
      incomeEmiDesc = `Project cost (₹${projectCost.toLocaleString("en-IN")}) matches typical ${catBenchmark.name} requirements.`;
    } else if (projectCost < catBenchmark.requiredCapital.min) {
      incomeEmiScore = 55;
      incomeEmiDesc = `Capital is below typical setup threshold (₹${catBenchmark.requiredCapital.min.toLocaleString("en-IN")}) for ${catBenchmark.name}.`;
    } else {
      incomeEmiScore = 62;
      incomeEmiDesc = `Capital exceeds standard scale for ${catBenchmark.name}; verify asset allocations.`;
    }
  }

  const incomeToEmiRatio: FactorDetail = {
    name: "Income-to-EMI & Budget Capacity",
    score: incomeEmiScore,
    weight: 25,
    rating: incomeEmiScore >= 70 ? "POSITIVE" : incomeEmiScore >= 45 ? "NEUTRAL" : "RISK",
    description: incomeEmiDesc,
  };

  // 4. Seasonality & Cash Flow Stability (weight 15%)
  let baseSeason = 100 - seasonalRisk;
  if (catBenchmark?.seasonalRisk === "HIGH") {
    baseSeason -= 10;
  } else if (catBenchmark?.seasonalRisk === "LOW") {
    baseSeason += 6;
  }
  const seasonScore = clamp(baseSeason);

  const seasonalityRisk: FactorDetail = {
    name: "Seasonality & Cash Flow Stability",
    score: seasonScore,
    weight: 15,
    rating: seasonScore >= 65 ? "POSITIVE" : seasonScore >= 40 ? "NEUTRAL" : "RISK",
    description:
      seasonScore >= 65
        ? "Consistent round-the-year demand with low seasonal fluctuation."
        : seasonScore >= 40
        ? "Moderate seasonal swing; recommend 2 months working capital buffer."
        : "Significant seasonal volatility; require off-season revenue diversification.",
  };

  // 5. Founder Experience & Asset Readiness (weight 20%)
  let expBase = 45;
  if (experienceYears >= 5) {
    expBase = 90;
  } else if (experienceYears >= 3) {
    expBase = 80;
  } else if (experienceYears >= 1) {
    expBase = 65;
  } else if (experienceYears > 0) {
    expBase = 52;
  } else {
    expBase = 38;
  }

  if (hasLandOrShop === true) {
    expBase = Math.min(100, expBase + 10);
  } else if (hasLandOrShop === false) {
    expBase = Math.max(20, expBase - 8);
  }

  const expScore = clamp(expBase);
  const founderExperience: FactorDetail = {
    name: "Founder Experience & Asset Readiness",
    score: expScore,
    weight: 20,
    rating: expScore >= 70 ? "POSITIVE" : expScore >= 45 ? "NEUTRAL" : "RISK",
    description:
      expScore >= 70
        ? `${experienceYears} yr${experienceYears > 1 ? "s" : ""} sector experience${hasLandOrShop ? " + premises ready" : ""}.`
        : expScore >= 45
        ? `Foundational experience (${experienceYears} yr${experienceYears > 1 ? "s" : ""}); apprenticeship or training helpful.`
        : "First-time entrepreneur; recommended to take RSETI or local skill orientation.",
  };

  // Composite Viability Score
  const compositeScore = clamp(
    marketSaturation.score * 0.20 +
      competitorDensity.score * 0.20 +
      incomeToEmiRatio.score * 0.25 +
      seasonalityRisk.score * 0.15 +
      founderExperience.score * 0.20
  );

  let rating: "HIGH" | "MEDIUM" | "LOW";
  let recommendation: string;

  if (compositeScore >= 75) {
    rating = "HIGH";
    recommendation =
      "This business displays strong overall viability with healthy market headroom and manageable operational risk.";
  } else if (compositeScore >= 50) {
    rating = "MEDIUM";
    recommendation =
      "This enterprise shows moderate feasibility. Pay close attention to competitor pricing and maintain working capital.";
  } else {
    rating = "LOW";
    recommendation =
      "High viability risk detected. Consider reducing scale, testing customer demand in stages, or exploring lower-risk alternatives.";
  }

  return {
    score: compositeScore,
    rating,
    recommendation,
    factors: {
      marketSaturation,
      competitorDensity,
      incomeToEmiRatio,
      seasonalityRisk,
      founderExperience,
    },
  };
}