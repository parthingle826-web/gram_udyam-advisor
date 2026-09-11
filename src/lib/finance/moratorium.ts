export interface MoratoriumInput {
  principal: number;
  annualInterestRate: number;
  moratoriumMonths: number;
  repaymentEMI: number;
}

export interface MoratoriumResult {
  moratoriumMonths: number;
  monthlyInterest: number;
  interestDuringMoratorium: number;
  principalAfterMoratorium: number;
  repaymentEMI: number;
}

export function calculateMoratorium(
  input: MoratoriumInput
): MoratoriumResult {
  const {
    principal,
    annualInterestRate,
    moratoriumMonths,
    repaymentEMI,
  } = input;

  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("Principal must be greater than zero.");
  }

  if (
    !Number.isFinite(annualInterestRate) ||
    annualInterestRate < 0
  ) {
    throw new Error("Invalid interest rate.");
  }

  if (
    !Number.isFinite(moratoriumMonths) ||
    moratoriumMonths < 0
  ) {
    throw new Error("Invalid moratorium period.");
  }

  if (!Number.isFinite(repaymentEMI) || repaymentEMI < 0) {
    throw new Error("Invalid repayment amount.");
  }

  const monthlyRate =
    annualInterestRate / 100 / 12;

  const monthlyInterest =
    principal * monthlyRate;

  const interestDuringMoratorium =
    monthlyInterest * moratoriumMonths;

 
  const principalAfterMoratorium =
    principal + interestDuringMoratorium;

  return {
    moratoriumMonths,
    monthlyInterest,
    interestDuringMoratorium,
    principalAfterMoratorium,
    repaymentEMI,
  };
}