export type AdvisoryRecommendation =
  | "START"
  | "START_SMALL"
  | "REVIEW"
  | "AVOID";

export interface SWOTAnalysis {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface PricingInsight {
  strategy: string;
  factors: string[];
}

export interface BusinessPlan {
  targetCustomers: string;
  productsOrServices: string;
  marketingStrategy: string;
  operations: string;
}

export interface AIAdvisory {
  headline: string;
  summary: string;

  recommendation: AdvisoryRecommendation;
  confidence: number;

  keyReasons: string[];
  actions: string[];
  warnings: string[];

  swot: SWOTAnalysis;

  pricingInsight: PricingInsight;

  businessPlan: BusinessPlan;
}