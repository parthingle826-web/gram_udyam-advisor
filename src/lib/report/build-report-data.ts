export interface ReportData {
  generatedAt: string;

  business: {
    name: string;
    category: string;
    village: string;
    block: string;
    district: string;
    state: string;
  };

  viability: {
    score: number;
    rating: string;
    decision: string;
  };

  finance: {
    marginCapital: number;
    projectCost: number;
    loanAmount: number;
    schemeName: string;
    interestRate: number;
    tenureYears: number;
    moratoriumMonths: number;
    monthlyEMI: number;
    quarterlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  };

  market: {
    totalBusinesses: number;
    competitorCount: number;
    competitionLevel: string;
    marketDensity: number;
    underservedCategories: string[];
    opportunities: string[];
    risks: string[];
  };

  sustainability?: {
    monthlyRevenue: number;
    operatingExpenses: number;
    netProfit: number;
    dscr: number;
    breakEvenMonths: number;
    score: number;
    level: string;
  };
}

export function buildReportData(
  assessment: any,
  result: any,
  market: any = {}
): ReportData {
  const finance = result?.finance ?? {};

  const sustainability =
    finance?.sustainability;

  return {
    generatedAt:
      new Date().toLocaleString("en-IN"),

    business: {
      name:
        assessment?.businessName ||
        "Business",

      category:
        assessment?.category ||
        "General",

      village:
        assessment?.village || "",

      block:
        assessment?.block || "",

      district:
        assessment?.district || "",

      state:
        assessment?.state || "",
    },

    viability: {
      score:
        Number(
          result?.viability?.score
        ) || 0,

      rating:
        result?.viability?.rating ||
        "Not Available",

      decision:
        result?.decision ||
        "REVIEW",
    },

    finance: {
      marginCapital:
        Number(
          finance.marginCapital
        ) || 0,

      projectCost:
        Number(
          finance.projectCost
        ) || 0,

      loanAmount:
        Number(
          finance.loanAmount
        ) || 0,

      schemeName:
        finance?.scheme?.name ||
        "No suitable scheme",

      interestRate:
        Number(
          finance?.scheme?.interestRate
        ) || 0,

      tenureYears:
        Number(
          finance?.scheme?.tenureYears
        ) || 0,

      moratoriumMonths:
        Number(
          finance?.scheme
            ?.moratoriumMonths
        ) || 0,

      monthlyEMI:
        Number(
          finance.monthlyEMI
        ) || 0,

      quarterlyPayment:
        Number(
          finance.quarterlyPayment
        ) || 0,

      totalInterest:
        Number(
          finance.totalInterest
        ) || 0,

      totalRepayment:
        Number(
          finance.totalRepayment
        ) || 0,
    },

    market: {
      totalBusinesses:
        Number(
          market?.totalBusinesses
        ) || 0,

      competitorCount:
        Number(
          market?.competitorCount
        ) || 0,

      competitionLevel:
        market?.competitionLevel ||
        "UNKNOWN",

      marketDensity:
        Number(
          market?.marketDensity
        ) || 0,

      underservedCategories:
        Array.isArray(
          market?.underservedCategories
        )
          ? market.underservedCategories
          : [],

      opportunities:
        Array.isArray(
          market?.opportunities
        )
          ? market.opportunities
          : [],

      risks:
        Array.isArray(
          market?.risks
        )
          ? market.risks
          : [],
    },

    sustainability:
      sustainability
        ? {
            monthlyRevenue:
              Number(
                sustainability.monthlyRevenue
              ) || 0,

            operatingExpenses:
              Number(
                sustainability.operatingExpenses
              ) || 0,

            netProfit:
              Number(
                sustainability.netProfit
              ) || 0,

            dscr:
              Number(
                sustainability.dscr
              ) || 0,

            breakEvenMonths:
              Number(
                sustainability.breakEvenMonths
              ) || 0,

            score:
              Number(
                sustainability.sustainabilityScore
              ) || 0,

            level:
              sustainability
                .sustainabilityLevel ||
              "UNKNOWN",
          }
        : undefined,
  };
}