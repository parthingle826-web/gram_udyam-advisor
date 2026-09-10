export const APP_NAME = "Gram Udyam Advisor";

export const APP_DESCRIPTION =
  "AI-driven business advisory and financial planning assistant for rural micro-entrepreneurs.";

export const MARGIN_PERCENTAGE = 10;

export const AGENCY_FINANCE_PERCENTAGE = 90;

export const MICRO_FINANCE = {
  name: "Micro Finance Scheme",
  maxProjectCost: 140000,
  maxLoanAmount: 125000,
  interestRate: 6.5,
  tenureYears: 3,
  moratoriumMonths: 3,
} as const;

export const TERM_LOAN = {
  name: "Term Loan Scheme",
  maxProjectCost: 5000000,
  maxLoanAmount: 4500000,
  interestRate: 8,
  tenureYears: 7,
  moratoriumMonths: 6,
} as const;

export const MARKET_SEARCH_RADIUS_KM = 10;

export const DEFAULT_MARKET_DEMAND = 50;

export const DEFAULT_COMPETITION = 50;

export const DEFAULT_BUDGET_FIT = 50;

export const DEFAULT_LOCAL_RESOURCES = 50;

export const DEFAULT_SEASONAL_RISK = 50;

export const DEFAULT_PROFIT_POTENTIAL = 50;

export const SUPPORTED_LANGUAGES = [
  "en",
  "hi",
  "mr",
] as const;

export type SupportedLanguage =
  (typeof SUPPORTED_LANGUAGES)[number];