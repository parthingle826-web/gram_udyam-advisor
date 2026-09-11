import type {
  AdvisoryInput,
  AdvisoryResult,
} from "./types";

export function generateAdvisory(
  input: AdvisoryInput
): AdvisoryResult {
  const keyReasons: string[] = [];
  const financialAdvice: string[] = [];
  const marketAdvice: string[] = [];
  const riskMitigation: string[] = [];
  const actionPlan: string[] = [];
  const alternativeIdeas: string[] = [];

  let recommendation:
    | "START"
    | "START_SMALL"
    | "REVIEW"
    | "AVOID";

 
  if (
    input.viabilityScore >= 75 &&
    input.schemeSuitable
  ) {
    recommendation = "START";
  } else if (
    input.viabilityScore >= 60 &&
    input.schemeSuitable
  ) {
    recommendation = "START_SMALL";
  } else if (
    input.viabilityScore >= 40 ||
    !input.schemeSuitable
  ) {
    recommendation = "REVIEW";
  } else {
    recommendation = "AVOID";
  }

 

  if (input.viabilityScore >= 75) {
    keyReasons.push(
      "The business has a strong overall viability score."
    );
  } else if (input.viabilityScore >= 50) {
    keyReasons.push(
      "The business has moderate viability and requires careful planning."
    );
  } else {
    keyReasons.push(
      "The current business model has low viability."
    );
  }

  

  if (input.competitionLevel === "LOW") {
    keyReasons.push(
      "Competition in the selected local area appears relatively low."
    );

    marketAdvice.push(
      "Use the current low competition to establish an early customer base."
    );
  }

  if (input.competitionLevel === "MEDIUM") {
    keyReasons.push(
      "There is moderate competition in the local market."
    );

    marketAdvice.push(
      "Differentiate through pricing, quality, convenience or customer service."
    );
  }

  if (input.competitionLevel === "HIGH") {
    keyReasons.push(
      "The selected business faces strong local competition."
    );

    marketAdvice.push(
      "Identify an underserved customer segment before investing heavily."
    );

    riskMitigation.push(
      "Start with a small pilot before committing the full project cost."
    );
  }

 
  if (input.schemeSuitable) {
    financialAdvice.push(
      `Estimated project cost: ₹${formatNumber(
        input.projectCost
      )}.`
    );

    financialAdvice.push(
      `Estimated loan requirement: ₹${formatNumber(
        input.loanAmount
      )}.`
    );

    financialAdvice.push(
      `Estimated monthly repayment: ₹${formatNumber(
        input.monthlyEMI
      )}.`
    );

    financialAdvice.push(
      `Configured financing option: ${input.schemeName}.`
    );

    financialAdvice.push(
      "Keep sufficient working capital for the first few months of operations."
    );
  } else {
    

    financialAdvice.push(
      "The current project size does not match the configured financing schemes."
    );

    financialAdvice.push(
      "Consider reducing the initial project size."
    );

    financialAdvice.push(
      "Consider implementing the business in multiple phases."
    );

    financialAdvice.push(
      "Explore additional legitimate financing sources for the remaining requirement."
    );

    riskMitigation.push(
      "Avoid taking on the entire investment requirement at the beginning."
    );

    actionPlan.push(
      "Create a smaller pilot project that fits the available financing."
    );
  }

  

  for (const opportunity of input.marketOpportunities.slice(
    0,
    4
  )) {
    marketAdvice.push(opportunity);
  }

 

  for (const risk of input.marketRisks.slice(0, 4)) {
    riskMitigation.push(risk);
  }

 

  for (const risk of input.risks.slice(0, 3)) {
    riskMitigation.push(risk);
  }

  

  actionPlan.push(
    "Validate the business idea with potential local customers."
  );

  actionPlan.push(
    "Compare prices and offerings of nearby competitors."
  );

  actionPlan.push(
    "Prepare a detailed project cost and operating expense estimate."
  );

  actionPlan.push(
    "Calculate expected monthly revenue and break-even point."
  );

  actionPlan.push(
    "Verify final eligibility and documentation requirements with the relevant authority."
  );

 

  if (
    input.competitionLevel === "HIGH" ||
    input.viabilityScore < 60
  ) {
    alternativeIdeas.push(
      "Consider a related service with lower competition."
    );

    alternativeIdeas.push(
      "Explore an underserved product category in the same local market."
    );

    alternativeIdeas.push(
      "Start with a smaller version of the proposed business."
    );
  }

 

  const confidence = Math.min(
    95,
    Math.max(
      50,
      Math.round(
        50 +
          input.viabilityScore * 0.35 +
          (input.competitorCount <= 10 ? 10 : 0)
      )
    )
  );

  let headline = "";

  switch (recommendation) {
    case "START":
      headline =
        "This business shows strong potential for your local area.";

      break;

    case "START_SMALL":
      headline =
        "This business may work, but starting at a smaller scale is safer.";

      break;

    case "REVIEW":
      headline =
        "Review the business model before making a major investment.";

      break;

    case "AVOID":
      headline =
        "The current business model carries significant viability risks.";

      break;
  }

  const summary =
    recommendation === "START"
      ? "The available indicators support starting the business, provided that local demand and final financing eligibility are verified."
      : recommendation === "START_SMALL"
      ? "The business has potential, but a pilot or smaller initial investment can reduce financial risk."
      : recommendation === "REVIEW"
      ? "The business should be reviewed carefully, particularly its market demand, competition and financing structure."
      : "The current indicators suggest that starting this business without significant changes could expose the entrepreneur to unnecessary risk.";

  return {
    headline,
    summary,
    recommendation,
    confidence,
    keyReasons: unique(keyReasons),
    financialAdvice: unique(financialAdvice),
    marketAdvice: unique(marketAdvice),
    riskMitigation: unique(riskMitigation),
    actionPlan: unique(actionPlan),
    alternativeIdeas: unique(alternativeIdeas),
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value);
}