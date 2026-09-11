export type SchemeType =
  | "MICRO_FINANCE"
  | "TERM_LOAN"
  | "NOT_ELIGIBLE";

export interface SchemeAlternative {
  title: string;
  description: string;
  action: string;
}

export interface SchemeResult {
  scheme: SchemeType;
  name: string;
  suitable: boolean;

  interestRate: number;
  tenureYears: number;
  moratoriumMonths: number;

  maxProjectCost: number;
  maxLoanAmount: number;

  reason: string;
  guidance: string[];
  alternatives?: SchemeAlternative[];
}

export function routeScheme(projectCost: number): SchemeResult {
 
  if (!Number.isFinite(projectCost) || projectCost <= 0) {
    return {
      scheme: "NOT_ELIGIBLE",
      name: "No Suitable Scheme",
      suitable: false,
      interestRate: 0,
      tenureYears: 0,
      moratoriumMonths: 0,
      maxProjectCost: 0,
      maxLoanAmount: 0,
      reason: "The project cost provided is invalid or zero.",
      guidance: [
        "Enter a valid positive margin capital amount.",
        "Ensure your initial investment estimate covers preliminary operational setup.",
      ],
      alternatives: [
        {
          title: "Verify Initial Cost Breakdown",
          description: "Re-estimate machinery, initial stock, and working capital needs.",
          action: "Re-calculate with minimum margin of ₹1,000.",
        },
      ],
    };
  }

 
  if (projectCost < 10000) {
    return {
      scheme: "NOT_ELIGIBLE",
      name: "Project Below Minimum Viable Scale",
      suitable: false,
      interestRate: 0,
      tenureYears: 0,
      moratoriumMonths: 0,
      maxProjectCost: 10000,
      maxLoanAmount: 0,
      reason: `The calculated project cost (₹${projectCost.toLocaleString("en-IN")}) is below the ₹10,000 threshold required for structured institutional bank financing.`,
      guidance: [
        "Formal bank term loans carry minimum appraisal thresholds of ₹10,000 to cover legal and documentation costs.",
        "Consider micro-grant programs, revolving funds, or local Self-Help Groups (SHGs) which cater specifically to micro-amounts.",
        "You can also consolidate your budget to include working capital reserves, raising the project size into the Micro Finance bracket.",
      ],
      alternatives: [
        {
          title: "PM SVANidhi Micro-Credit",
          description: "Collateral-free working capital loan starting at ₹10,000 with 7% interest subsidy for rural street vendors and nano-enterprises.",
          action: "Contact nearest Common Service Centre (CSC) or municipal/panchayat office.",
        },
        {
          title: "NRLM / SHG Revolving Fund",
          description: "Village-level Women SHG community investment fund providing interest-subsidized micro-loans from ₹15,000 to ₹50,000.",
          action: "Reach out to your Village Organization (VO) or Gram Panchayat office.",
        },
        {
          title: "Consolidate Working Capital",
          description: "Add 2-3 months of raw materials and inventory to bring project cost to ₹10,000–₹1.40 lakh, unlocking the 6.5% Micro Finance Scheme.",
          action: "Update Margin Capital to at least ₹1,000 on the assessment form.",
        },
      ],
    };
  }

  
  if (projectCost <= 140000) {
    return {
      scheme: "MICRO_FINANCE",
      name: "Micro Finance Scheme",
      suitable: true,
      interestRate: 6.5,
      tenureYears: 3,
      moratoriumMonths: 3,
      maxProjectCost: 140000,
      maxLoanAmount: 125000,
      reason: "Your project cost falls within the Micro Finance Scheme limit (up to ₹1.40 lakh).",
      guidance: [
        "Enjoy a low concessional interest rate of 6.5% p.a.",
        "3-year repayment tenure with a 3-month initial moratorium.",
        "Maximum loan eligibility is capped at ₹1.25 lakh (90% of project cost).",
        "Maintain clean quotation bills and submit beneficiary identity documentation.",
      ],
    };
  }

  
  if (projectCost <= 5000000) {
    return {
      scheme: "TERM_LOAN",
      name: "Term Loan Scheme",
      suitable: true,
      interestRate: 8.0,
      tenureYears: 7,
      moratoriumMonths: 6,
      maxProjectCost: 5000000,
      maxLoanAmount: 4500000,
      reason: "Your project cost falls within the Term Loan Scheme limit (₹1.40 lakh to ₹50 lakh).",
      guidance: [
        "Structured 8.0% p.a. interest rate with a 7-year long-term tenure.",
        "Includes a 6-month moratorium period during initial enterprise gestation.",
        "Maximum agency financing capped at ₹45 lakh (90% of project cost).",
        "Prepare a detailed project report (DPR) and verify site/land NOC.",
      ],
    };
  }

 
  return {
    scheme: "NOT_ELIGIBLE",
    name: "Project Exceeds Scheme Ceiling",
    suitable: false,
    interestRate: 0,
    tenureYears: 0,
    moratoriumMonths: 0,
    maxProjectCost: 5000000,
    maxLoanAmount: 4500000,
    reason: `Your calculated project cost of ₹${(projectCost / 100000).toFixed(2)} lakh exceeds the maximum configured rural scheme ceiling of ₹50 lakh.`,
    guidance: [
      "Targeted rural micro-enterprise schemes provide subsidized credit up to ₹50 lakh. Amounts above this require MSME/commercial financing channels.",
      "Large capital commitments in rural settings carry heightened liquidity risk during off-seasons.",
      "Review the concrete alternatives below to restructure or phase your investment.",
    ],
    alternatives: [
      {
        title: "Phased Pilot Implementation",
        description: "Scale down initial machinery or infrastructure to keep Phase 1 within ₹50 lakh. Expand using retained business profits in Year 2.",
        action: "Reduce initial margin capital to ₹5,00,000 or below to qualify for the 8% Term Loan Scheme.",
      },
      {
        title: "PMEGP Manufacturing Tier",
        description: "Prime Minister's Employment Generation Programme supports manufacturing projects up to ₹50 lakh with 25–35% government capital subsidy.",
        action: "Apply online at kviconline.gov.in or consult your District Industries Centre (DIC).",
      },
      {
        title: "CGTMSE Collateral-Free Credit",
        description: "Credit Guarantee Fund Trust for Micro and Small Enterprises provides collateral-free bank loans up to ₹2–5 crore through commercial banks.",
        action: "Prepare a Detailed Project Report (DPR) with a Chartered Accountant for public sector bank submission.",
      },
      {
        title: "Farmer Producer Organization (FPO) / Consortium",
        description: "Form a Producer Company with neighboring entrepreneurs to unlock equity grants up to ₹15 lakh and credit guarantees from NABARD / SFAC.",
        action: "Inquire with NABARD District Development Manager (DDM).",
      },
    ],
  };
}