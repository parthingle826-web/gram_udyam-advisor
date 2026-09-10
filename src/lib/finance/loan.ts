export interface LoanInput {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
}

export interface LoanResult {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  totalMonths: number;
  monthlyEMI: number;
  quarterlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
}

export function calculateLoan(
  input: LoanInput
): LoanResult {
  const {
    principal,
    annualInterestRate,
    tenureYears,
  } = input;

  if (
    !Number.isFinite(principal) ||
    !Number.isFinite(annualInterestRate) ||
    !Number.isFinite(tenureYears)
  ) {
    throw new Error("Loan values must be valid numbers.");
  }

  if (principal <= 0) {
    throw new Error("Loan principal must be greater than zero.");
  }

  if (annualInterestRate < 0) {
    throw new Error("Interest rate cannot be negative.");
  }

  if (tenureYears <= 0) {
    throw new Error("Loan tenure must be greater than zero.");
  }

  const totalMonths = Math.round(tenureYears * 12);

  const monthlyRate =
    annualInterestRate / 100 / 12;

  let monthlyEMI: number;

  if (monthlyRate === 0) {
    monthlyEMI = principal / totalMonths;
  } else {
    const factor = Math.pow(
      1 + monthlyRate,
      totalMonths
    );

    monthlyEMI =
      (principal * monthlyRate * factor) /
      (factor - 1);
  }

  const totalRepayment =
    monthlyEMI * totalMonths;

  const totalInterest =
    totalRepayment - principal;

  return {
    principal,
    annualInterestRate,
    tenureYears,
    totalMonths,

    monthlyEMI,
    quarterlyPayment: monthlyEMI * 3,

    totalInterest,
    totalRepayment,
  };
}