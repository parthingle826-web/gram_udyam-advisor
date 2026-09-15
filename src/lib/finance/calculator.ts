export interface FinancialStructure {
  marginCapital: number;
  projectCost: number;
  loanAmount: number;
  marginPercentage: number;
}

export function calculateFinancialStructure(
  marginCapital: number
): FinancialStructure {
  if (!Number.isFinite(marginCapital) || marginCapital <= 0) {
    throw new Error("Margin capital must be greater than zero.");
  }

  const marginPercentage = 10;

  const projectCost = Math.round(marginCapital / (marginPercentage / 100));

  const loanAmount = Math.round(projectCost * 0.90);

  return {
    marginCapital,
    projectCost,
    loanAmount,
    marginPercentage,
  };
}