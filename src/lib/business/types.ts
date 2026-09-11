export interface BusinessAssessment {
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
}