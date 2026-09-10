import type { SchemeRule } from "@/types/scheme";

export const SCHEME_RULES: SchemeRule[] = [
  {
    id: "MICRO_FINANCE",

    name: "Micro Finance Scheme",

    minProjectCost: 0,
    maxProjectCost: 140000,

    agencyPercentage: 90,
    maxLoanAmount: 125000,

    interestRate: 6.5,
    tenureYears: 3,
    moratoriumMonths: 3,

    description:
      "Suitable for small income-generating projects with project cost up to ₹1.40 lakh.",
  },

  {
    id: "TERM_LOAN",

    name: "Term Loan Scheme",

    minProjectCost: 140001,
    maxProjectCost: 5000000,

    agencyPercentage: 90,
    maxLoanAmount: 4500000,

    interestRate: 8,
    tenureYears: 7,
    moratoriumMonths: 6,

    description:
      "Suitable for larger income-generating projects with project cost up to ₹50 lakh.",
  },
];

export function getSchemeRule(
  schemeId: string
): SchemeRule | undefined {
  return SCHEME_RULES.find((scheme) => scheme.id === schemeId);
}

export function findSchemeForProject(
  projectCost: number
): SchemeRule | undefined {
  if (!Number.isFinite(projectCost) || projectCost <= 0) {
    return undefined;
  }

  return SCHEME_RULES.find(
    (scheme) =>
      projectCost >= scheme.minProjectCost &&
      projectCost <= scheme.maxProjectCost
  );
}