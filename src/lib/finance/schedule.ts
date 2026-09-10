export type MoratoriumRule = "INTEREST_ONLY" | "FULLY_DEFERRED";

export interface RepaymentQuarter {
  quarter: number;
  year: number;
  isMoratorium: boolean;
  openingPrincipal: number;
  principalPaid: number;
  interestPaid: number;
  totalInstallment: number;
  closingPrincipal: number;
  statusNote: string;
}

export interface AmortizationScheduleResult {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
  totalQuarters: number;
  moratoriumMonths: number;
  moratoriumQuarters: number;
  moratoriumRule: MoratoriumRule;
  regularQuarterlyInstallment: number;
  totalInterestPaid: number;
  totalPrincipalPaid: number;
  totalRepayment: number;
  quarters: RepaymentQuarter[];
}

/**
 * Deterministic Quarter-by-Quarter Repayment Amortization Schedule
 *
 * Handles:
 * 1. "INTEREST_ONLY" rule (standard rural finance default: borrower pays only interest during setup)
 * 2. "FULLY_DEFERRED" rule (₹0 payment during moratorium, accrued interest is capitalized into principal)
 */
export function generateQuarterlySchedule(
  principal: number,
  annualInterestRate: number,
  tenureYears: number,
  moratoriumMonths: number = 0,
  moratoriumRule: MoratoriumRule = "INTEREST_ONLY"
): AmortizationScheduleResult {
  if (!Number.isFinite(principal) || principal <= 0) {
    throw new Error("Principal must be greater than zero.");
  }
  if (!Number.isFinite(annualInterestRate) || annualInterestRate < 0) {
    throw new Error("Annual interest rate must be non-negative.");
  }
  if (!Number.isFinite(tenureYears) || tenureYears <= 0) {
    throw new Error("Tenure in years must be positive.");
  }

  const totalQuarters = Math.round(tenureYears * 4);
  const moratoriumQuarters = Math.min(
    Math.floor(Math.max(0, moratoriumMonths) / 3),
    totalQuarters - 1
  );
  const repaymentQuarters = totalQuarters - moratoriumQuarters;

  const quarterlyRate = annualInterestRate / 100 / 4;
  const quarters: RepaymentQuarter[] = [];

  let currentBalance = principal;
  let totalInterest = 0;
  let totalPrincipal = 0;

  // Process Moratorium Quarters
  for (let q = 1; q <= moratoriumQuarters; q++) {
    const year = Math.ceil(q / 4);
    const opening = currentBalance;
    const interest = Number((opening * quarterlyRate).toFixed(2));

    if (moratoriumRule === "INTEREST_ONLY") {
      const installment = interest;
      const principalPaid = 0;
      const closing = opening;

      totalInterest += interest;
      quarters.push({
        quarter: q,
        year,
        isMoratorium: true,
        openingPrincipal: Math.round(opening),
        principalPaid: 0,
        interestPaid: Math.round(interest),
        totalInstallment: Math.round(installment),
        closingPrincipal: Math.round(closing),
        statusNote: "Moratorium: Interest-only payment (setup period)",
      });
      currentBalance = closing;
    } else {
      // FULLY_DEFERRED
      const installment = 0;
      const principalPaid = 0;
      const closing = opening + interest; // Capitalized

      totalInterest += interest;
      quarters.push({
        quarter: q,
        year,
        isMoratorium: true,
        openingPrincipal: Math.round(opening),
        principalPaid: 0,
        interestPaid: Math.round(interest),
        totalInstallment: 0,
        closingPrincipal: Math.round(closing),
        statusNote: "Moratorium: Payment deferred (interest capitalized)",
      });
      currentBalance = closing;
    }
  }

  // Calculate regular quarterly installment for post-moratorium period
  let regularQuarterlyInstallment = 0;
  if (repaymentQuarters > 0 && currentBalance > 0) {
    if (quarterlyRate === 0) {
      regularQuarterlyInstallment = currentBalance / repaymentQuarters;
    } else {
      const factor = Math.pow(1 + quarterlyRate, repaymentQuarters);
      regularQuarterlyInstallment =
        (currentBalance * (quarterlyRate * factor)) / (factor - 1);
    }
  }

  // Process Repayment Quarters
  for (let r = 1; r <= repaymentQuarters; r++) {
    const q = moratoriumQuarters + r;
    const year = Math.ceil(q / 4);
    const opening = currentBalance;
    const interest = Number((opening * quarterlyRate).toFixed(2));

    let principalPaid: number;
    let installment: number;

    if (r === repaymentQuarters) {
      // Final quarter: exact balance clearance
      principalPaid = opening;
      installment = principalPaid + interest;
    } else {
      installment = regularQuarterlyInstallment;
      principalPaid = Math.min(opening, installment - interest);
    }

    const closing = Math.max(0, opening - principalPaid);
    totalInterest += interest;
    totalPrincipal += principalPaid;
    currentBalance = closing;

    quarters.push({
      quarter: q,
      year,
      isMoratorium: false,
      openingPrincipal: Math.round(opening),
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest),
      totalInstallment: Math.round(installment),
      closingPrincipal: Math.round(closing),
      statusNote: "Regular Amortization",
    });
  }

  const roundedTotalInterest = Math.round(totalInterest);
  const roundedTotalPrincipal = Math.round(totalPrincipal);
  const roundedTotalRepayment = roundedTotalPrincipal + roundedTotalInterest;

  return {
    principal: Math.round(principal),
    annualInterestRate,
    tenureYears,
    totalQuarters,
    moratoriumMonths,
    moratoriumQuarters,
    moratoriumRule,
    regularQuarterlyInstallment: Math.round(regularQuarterlyInstallment),
    totalInterestPaid: roundedTotalInterest,
    totalPrincipalPaid: roundedTotalPrincipal,
    totalRepayment: roundedTotalRepayment,
    quarters,
  };
}
