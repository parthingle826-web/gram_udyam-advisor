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

  const projectCost = marginCapital / (marginPercentage / 100);

  const loanAmount = projectCost - marginCapital;

  return {
    marginCapital,
    projectCost,
    loanAmount,
    marginPercentage,
  };
}