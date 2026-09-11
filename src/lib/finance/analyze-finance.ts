import { calculateFinancialStructure } from "./calculator";
import { calculateSustainability } from "./sustainability";
import { routeScheme } from "./scheme-router";
import { calculateEMI } from "./emi";

export interface FinancialAnalysis {
  marginCapital: number;
  projectCost: number;
  loanAmount: number;
  scheme: ReturnType<typeof routeScheme>;

  monthlyEMI: number;
  quarterlyPayment: number;
  totalInterest: number;
  totalRepayment: number;

  sustainability: ReturnType<typeof calculateSustainability>;
}

export function analyzeFinance(
  marginCapital: number,
  monthlyRevenue: number = 0,
  operatingExpenses: number = 0
): FinancialAnalysis {

  const financial =
    calculateFinancialStructure(marginCapital);


  const scheme =
    routeScheme(financial.projectCost);

  
  if (!scheme.suitable) {
    const sustainability = calculateSustainability({
      monthlyRevenue,
      operatingExpenses,
      monthlyEMI: 0,
      initialInvestment: financial.projectCost,
    });

    return {
      marginCapital: financial.marginCapital,
      projectCost: financial.projectCost,
      loanAmount: financial.loanAmount,
      scheme,

      monthlyEMI: 0,
      quarterlyPayment: 0,
      totalInterest: 0,
      totalRepayment: 0,

      sustainability,
    };
  }

  const approvedLoanAmount = Math.min(
    financial.loanAmount,
    scheme.maxLoanAmount > 0 ? scheme.maxLoanAmount : financial.loanAmount
  );

  const emi = calculateEMI(
    approvedLoanAmount,
    scheme.interestRate,
    scheme.tenureYears
  );


  const totalMonths =
    scheme.tenureYears * 12;

  const totalRepayment =
    emi.monthlyEMI * totalMonths;


  const totalInterest =
    totalRepayment - approvedLoanAmount;

 
  const sustainability =
    calculateSustainability({
      monthlyRevenue,
      operatingExpenses,
      monthlyEMI: emi.monthlyEMI,
      initialInvestment: financial.projectCost,
    });


  return {
    marginCapital: financial.marginCapital,
    projectCost: financial.projectCost,
    loanAmount: approvedLoanAmount,
    scheme,

    monthlyEMI: emi.monthlyEMI,
    quarterlyPayment: emi.quarterlyPayment,
    totalInterest,
    totalRepayment,

    sustainability,
  };
}