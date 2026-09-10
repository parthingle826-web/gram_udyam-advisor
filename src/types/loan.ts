export interface LoanInput {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;
}

export interface LoanCalculation {
  principal: number;
  annualInterestRate: number;
  tenureYears: number;

  totalMonths: number;
  monthlyEMI: number;
  quarterlyPayment: number;

  totalInterest: number;
  totalRepayment: number;
}

export interface RepaymentInstallment {
  installmentNumber: number;
  month: number;

  openingBalance: number;
  principalComponent: number;
  interestComponent: number;

  payment: number;
  closingBalance: number;
}

export interface RepaymentSchedule {
  installments: RepaymentInstallment[];
  totalInterest: number;
  totalRepayment: number;
}