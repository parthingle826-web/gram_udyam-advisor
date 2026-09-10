export interface EMIResult {
  monthlyEMI: number;
  quarterlyPayment: number;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): EMIResult {

  const monthlyRate = annualRate / 100 / 12;

  const totalMonths = tenureYears * 12;

  if (monthlyRate === 0) {

    const monthlyEMI = principal / totalMonths;

    return {
      monthlyEMI,
      quarterlyPayment: monthlyEMI * 3,
    };

  }

  const monthlyEMI =
    (principal *
      monthlyRate *
      Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return {
    monthlyEMI,
    quarterlyPayment: monthlyEMI * 3,
  };
}