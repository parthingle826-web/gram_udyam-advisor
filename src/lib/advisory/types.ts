export interface AdvisoryInput {
  businessName: string;
  category: string;

  village: string;
  district: string;
  state: string;

  viabilityScore: number;
  viabilityRating: string;

  projectCost: number;
  loanAmount: number;

  schemeName: string;
  schemeSuitable: boolean;

  monthlyEMI: number;

  competitorCount: number;
  competitionLevel: string;

  marketOpportunities: string[];
  marketRisks: string[];

  strengths: string[];
  risks: string[];
  opportunities: string[];
}

export interface AdvisoryResult {
  headline: string;
  summary: string;

  recommendation:
    | "START"
    | "START_SMALL"
    | "REVIEW"
    | "AVOID";

  confidence: number;

  keyReasons: string[];

  financialAdvice: string[];

  marketAdvice: string[];

  riskMitigation: string[];

  actionPlan: string[];

  alternativeIdeas: string[];
}