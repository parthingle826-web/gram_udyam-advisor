import { analyzeFinance } from "../finance/analyze-finance";
import { calculateViabilityScore } from "../viability/score";
import type { BusinessAssessment } from "./types";

export interface BusinessAnalysis {
  assessment: BusinessAssessment;

  viability: ReturnType<typeof calculateViabilityScore>;

  finance: ReturnType<typeof analyzeFinance>;

  decision:
    | "RECOMMENDED"
    | "REVIEW"
    | "NOT_RECOMMENDED";

  strengths: string[];
  risks: string[];
  opportunities: string[];
  nextSteps: string[];
}

export function analyzeBusiness(
  assessment: BusinessAssessment
): BusinessAnalysis {
  // -----------------------------------------
  // 1. Calculate business viability
  // -----------------------------------------

  const viability = calculateViabilityScore({
    marketDemand: assessment.marketDemand,
    competition: assessment.competition,
    budgetFit: assessment.budgetFit,
    localResources: assessment.localResources,
    seasonalRisk: assessment.seasonalRisk,
    profitPotential: assessment.profitPotential,
  });

  // -----------------------------------------
  // 2. Calculate financial structure
  // -----------------------------------------

 const finance = analyzeFinance(
  assessment.marginCapital,
  assessment.monthlyRevenue ?? 0,
  assessment.operatingExpenses ?? 0
);

  // -----------------------------------------
  // 3. Business decision
  // -----------------------------------------

  let decision:
    | "RECOMMENDED"
    | "REVIEW"
    | "NOT_RECOMMENDED";

  const hasSustainabilityData =
  (assessment.monthlyRevenue ?? 0) > 0 ||
  (assessment.operatingExpenses ?? 0) > 0;

if (
  viability.score >= 75 &&
  finance.scheme.suitable &&
  (
    !hasSustainabilityData ||
    finance.sustainability.sustainabilityLevel !== "LOW"
  )
) {
  decision = "RECOMMENDED";
} else if (
  viability.score >= 50 ||
  !finance.scheme.suitable ||
  finance.sustainability.sustainabilityLevel === "MEDIUM"
) {
  decision = "REVIEW";
} else {
  decision = "NOT_RECOMMENDED";
}

  // -----------------------------------------
  // 4. Strengths
  // -----------------------------------------

  const strengths: string[] = [];

  if (assessment.marketDemand >= 70) {
    strengths.push(
      "Strong expected demand in the selected market."
    );
  }

  if (assessment.budgetFit >= 70) {
    strengths.push(
      "The proposed business fits well within the available budget."
    );
  }

  if (assessment.localResources >= 70) {
    strengths.push(
      "Good availability of local resources and inputs."
    );
  }

  if (assessment.profitPotential >= 70) {
    strengths.push(
      "The business has good expected profit potential."
    );
  }

  if (finance.sustainability.netProfit > 0) {
    strengths.push(
      "The estimated business model generates positive monthly cash flow after EMI."
    );
  }

  if (finance.sustainability.dscr >= 1.5) {
    strengths.push(
      "Debt repayment capacity is strong based on the estimated DSCR."
    );
  }

  if (strengths.length === 0) {
    strengths.push(
      "The business has some potential but requires further validation."
    );
  }

  // -----------------------------------------
  // 5. Risks
  // -----------------------------------------

  const risks: string[] = [];

  if (assessment.competition >= 70) {
    risks.push(
      "Competition in the local market may be high."
    );
  }

  if (assessment.seasonalRisk >= 60) {
    risks.push(
      "Seasonal demand may affect business income."
    );
  }

  if (assessment.marketDemand < 50) {
    risks.push(
      "Expected local market demand is relatively weak."
    );
  }

  if (finance.sustainability.netProfit <= 0) {
    risks.push(
      "Estimated monthly cash flow is insufficient after operating expenses and EMI."
    );
  }

  if (
    finance.sustainability.dscr > 0 &&
    finance.sustainability.dscr < 1.2
  ) {
    risks.push(
      "Debt repayment capacity is weak because the DSCR is below the recommended level."
    );
  }

  if (!finance.scheme.suitable) {
    risks.push(
      "The calculated project cost does not fit the currently configured loan schemes."
    );
  }

  // -----------------------------------------
  // 6. Opportunities
  // -----------------------------------------

  const opportunities: string[] = [];

  if (assessment.marketDemand >= 60) {
    opportunities.push(
      "Use local demand to develop a focused product or service offering."
    );
  }

  if (assessment.competition <= 40) {
    opportunities.push(
      "Lower competition may provide an opportunity to establish a local customer base."
    );
  }

  if (assessment.localResources >= 60) {
    opportunities.push(
      "Local resources can potentially reduce procurement and operating costs."
    );
  }

  if (finance.sustainability.netProfit > 0) {
    opportunities.push(
      "Positive projected cash flow can support gradual business expansion."
    );
  }

  if (!finance.scheme.suitable) {
    opportunities.push(
      "A smaller pilot or phased investment can reduce initial financial pressure."
    );
  }

  // -----------------------------------------
  // 7. Next steps
  // -----------------------------------------

  const nextSteps: string[] = [];

  if (!finance.scheme.suitable) {
    nextSteps.push(
      "Consider starting with a smaller project that fits the available financing schemes."
    );

    nextSteps.push(
      "Consider implementing the business in multiple phases."
    );
  }

  if (finance.sustainability.sustainabilityLevel === "LOW") {
    nextSteps.push(
      "Review expected revenue and operating costs before taking the loan."
    );
  }

  if (finance.sustainability.sustainabilityLevel === "MEDIUM") {
    nextSteps.push(
      "Validate customer demand and operating expenses before final investment."
    );
  }

  if (viability.score < 75) {
    nextSteps.push(
      "Conduct additional local market validation before investing."
    );
  }

  nextSteps.push(
    "Verify beneficiary and scheme eligibility with the relevant authority."
  );


  nextSteps.push(
    "Prepare a detailed project cost and monthly cash-flow estimate."
  );

  nextSteps.push(
    "Start with a controlled pilot wherever possible."
  );

  return {
    assessment,
    viability,
    finance,
    decision,
    strengths,
    risks,
    opportunities,
    nextSteps,
  };
}