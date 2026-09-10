export type SchemeType =
  | "MICRO_FINANCE"
  | "TERM_LOAN"
  | "NOT_ELIGIBLE";

export interface SchemeRule {
  id: SchemeType;
  name: string;

  minProjectCost: number;
  maxProjectCost: number;

  agencyPercentage: number;
  maxLoanAmount: number;

  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;

  description: string;
}

export interface SchemeResult {
  scheme: SchemeType;
  name: string;
  suitable: boolean;

  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;

  maxProjectCost: number;

  reason: string;
  guidance: string[];
}