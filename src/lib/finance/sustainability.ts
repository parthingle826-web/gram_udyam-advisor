export interface SustainabilityInput {
  monthlyRevenue: number;
  operatingExpenses: number;
  monthlyEMI: number;
  initialInvestment: number;
}

export interface SustainabilityResult {
  monthlyRevenue: number;
  operatingExpenses: number;
  monthlyEMI: number;
  netProfit: number;
  dscr: number;
  breakEvenMonths: number;
  sustainabilityScore: number;
  sustainabilityLevel: "HIGH" | "MEDIUM" | "LOW";
  recommendation: string;
}

export function calculateSustainability(
  input: SustainabilityInput
): SustainabilityResult {
  const {
    monthlyRevenue,
    operatingExpenses,
    monthlyEMI,
    initialInvestment,
  } = input;

  if (
    !Number.isFinite(monthlyRevenue) ||
    !Number.isFinite(operatingExpenses) ||
    !Number.isFinite(monthlyEMI) ||
    !Number.isFinite(initialInvestment)
  ) {
    throw new Error("All financial values must be valid numbers.");
  }

  if (
    monthlyRevenue < 0 ||
    operatingExpenses < 0 ||
    monthlyEMI < 0 ||
    initialInvestment <= 0
  ) {
    throw new Error("Financial values cannot be negative.");
  }

  const netProfit =
    monthlyRevenue - operatingExpenses - monthlyEMI;

  const cashAvailableForDebt =
    monthlyRevenue - operatingExpenses;

  const dscr =
    monthlyEMI > 0
      ? cashAvailableForDebt / monthlyEMI
      : 0;

  const monthlyOperatingProfit =
    monthlyRevenue - operatingExpenses;

  const breakEvenMonths =
    monthlyOperatingProfit > 0
      ? initialInvestment / monthlyOperatingProfit
      : Infinity;

  let score = 0;

  
  if (monthlyRevenue > operatingExpenses) {
    score += 25;
  }

 
  if (dscr >= 1.5) {
    score += 30;
  } else if (dscr >= 1.2) {
    score += 20;
  } else if (dscr >= 1) {
    score += 10;
  }

  
  if (netProfit > 0) {
    score += 25;
  }

  
  if (breakEvenMonths <= 24) {
    score += 20;
  } else if (breakEvenMonths <= 36) {
    score += 10;
  }

  score = Math.min(100, score);

  let sustainabilityLevel: "HIGH" | "MEDIUM" | "LOW";
  let recommendation: string;

  if (score >= 75) {
    sustainabilityLevel = "HIGH";
    recommendation =
      "The business shows strong financial sustainability under the provided assumptions.";
  } else if (score >= 50) {
    sustainabilityLevel = "MEDIUM";
    recommendation =
      "The business may be financially sustainable, but revenue, expenses and repayment capacity should be reviewed carefully.";
  } else {
    sustainabilityLevel = "LOW";
    recommendation =
      "The business may face financial pressure. Consider reducing costs, increasing revenue potential or starting with a smaller project.";
  }

  return {
    monthlyRevenue,
    operatingExpenses,
    monthlyEMI,
    netProfit,
    dscr: Number(dscr.toFixed(2)),
    breakEvenMonths:
      Number.isFinite(breakEvenMonths)
        ? Number(breakEvenMonths.toFixed(1))
        : Infinity,
    sustainabilityScore: score,
    sustainabilityLevel,
    recommendation,
  };
}