export interface BusinessAssessment {
  businessName: string;
  category: string;

  village: string;
  block: string;
  district: string;
  state: string;

  marginCapital: number;

  // Market viability
  marketDemand: number;
  competition: number;
  budgetFit: number;
  localResources: number;
  seasonalRisk: number;
  profitPotential: number;

  // Financial sustainability
monthlyRevenue?: number;
operatingExpenses?: number;
}