export interface BusinessAssessment {
  fullName?: string;
  age?: number;
  mobileNumber?: string;
  address?: string;

  businessName: string;
  category: string;

  village: string;
  block: string;
  district: string;
  state: string;

  marginCapital: number;

  marketDemand: number;
  competition: number;
  budgetFit: number;
  localResources: number;
  seasonalRisk: number;
  profitPotential: number;

  monthlyRevenue?: number;
  operatingExpenses?: number;

  experienceYears?: number;
  hasLandOrShop?: boolean;
}

export interface BusinessViability {
  score: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  strengths: string[];
  risks: string[];
  opportunities: string[];
  recommendation: string;
}

export interface BusinessAnalysis {
  assessment: BusinessAssessment;
  viability: BusinessViability;
  finance: unknown;
  decision: "RECOMMENDED" | "REVIEW" | "NOT_RECOMMENDED";
  strengths: string[];
  risks: string[];
  opportunities: string[];
  nextSteps: string[];
}