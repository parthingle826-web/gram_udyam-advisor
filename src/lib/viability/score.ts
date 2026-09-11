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
    hasLandOrShop = true,
    monthlyRevenue,
    operatingExpenses = 0,
    monthlyEMI,
  } = input;

 
  const saturationScore = clamp(marketDemand);
  const marketSaturation: FactorDetail = {
    name: "Market Saturation & Demand",
    score: saturationScore,
    weight: 20,
    rating: saturationScore >= 70 ? "POSITIVE" : saturationScore >= 45 ? "NEUTRAL" : "RISK",
    description:
      saturationScore >= 70
        ? "Strong consumer demand headroom in the local trade area."
        : saturationScore >= 45
        ? "Moderate market depth; marketing required to capture share."
        : "Market near saturation or demand is sluggish in this cluster.",
  };

  
  const densityScore = clamp(100 - competition);
  const competitorDensity: FactorDetail = {
    name: "Competitor Density",
    score: densityScore,
    weight: 20,
    rating: densityScore >= 65 ? "POSITIVE" : densityScore >= 40 ? "NEUTRAL" : "RISK",
    description:
      densityScore >= 65
        ? "Low competitor density in immediate 2-5km radius."
        : densityScore >= 40
        ? "Moderate competition; differentiation on quality/service advised."
        : "High competitor cluster; requires distinct pricing/product offering.",
  };


  let incomeEmiScore = clamp(budgetFit);
  let incomeEmiDesc = "Capital budget aligns well with setup requirements.";

  if (monthlyRevenue && monthlyRevenue > 0 && monthlyEMI && monthlyEMI > 0) {
    const netIncome = monthlyRevenue - operatingExpenses;
    const ratio = netIncome / monthlyEMI;
    if (ratio >= 2.0) {
      incomeEmiScore = 95;
      incomeEmiDesc = `Strong debt-service capacity (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.5) {
      incomeEmiScore = 80;
      incomeEmiDesc = `Adequate debt-service coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.2) {
      incomeEmiScore = 65;
      incomeEmiDesc = `Tight repayment coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else if (ratio >= 1.0) {
      incomeEmiScore = 50;
      incomeEmiDesc = `Borderline cash flow coverage (Income-to-EMI ~${ratio.toFixed(1)}x).`;
    } else {
      incomeEmiScore = 25;
      incomeEmiDesc = `Net operating income is insufficient to service estimated EMI.`;
    }
  }

  const incomeToEmiRatio: FactorDetail = {
    name: "Income-to-EMI & Budget Capacity",
    score: incomeEmiScore,
    weight: 25,
    rating: incomeEmiScore >= 70 ? "POSITIVE" : incomeEmiScore >= 45 ? "NEUTRAL" : "RISK",
    description: incomeEmiDesc,
  };

  
  const seasonScore = clamp(100 - seasonalRisk);
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

  
  let expBase = 45;
  if (experienceYears >= 5) expBase = 90;
  else if (experienceYears >= 3) expBase = 80;
  else if (experienceYears >= 1) expBase = 65;
  if (hasLandOrShop) expBase = Math.min(100, expBase + 10);

  const expScore = clamp(expBase);
  const founderExperience: FactorDetail = {
    name: "Founder Experience & Asset Readiness",
    score: expScore,
    weight: 20,
    rating: expScore >= 70 ? "POSITIVE" : expScore >= 45 ? "NEUTRAL" : "RISK",
    description:
      expScore >= 70
        ? `${experienceYears} yr${experienceYears > 1 ? "s" : ""} sector experience${hasLandOrShop ? " + land/premises ready" : ""}.`
        : expScore >= 45
        ? `Foundational experience (${experienceYears} yr${experienceYears > 1 ? "s" : ""}); apprenticeship or training helpful.`
        : "First-time entrepreneur; recommended to take RSETI skill orientation.",
  };

  
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