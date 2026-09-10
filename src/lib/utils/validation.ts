export function isValidNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value)
  );
}

export function isPositiveNumber(
  value: unknown
): value is number {
  return (
    isValidNumber(value) &&
    value > 0
  );
}

export function isValidScore(
  value: unknown
): value is number {
  return (
    isValidNumber(value) &&
    value >= 0 &&
    value <= 100
  );
}

export function requirePositiveNumber(
  value: unknown,
  fieldName: string
): number {
  const number = Number(value);

  if (
    !Number.isFinite(number) ||
    number <= 0
  ) {
    throw new Error(
      `${fieldName} must be greater than zero.`
    );
  }

  return number;
}

export function validateAssessmentInput(
  input: Record<string, unknown>
): string[] {
  const errors: string[] = [];

  if (!String(input.businessName ?? "").trim()) {
    errors.push("Business name is required.");
  }

  if (!String(input.category ?? "").trim()) {
    errors.push("Business category is required.");
  }

  if (
    !isPositiveNumber(
      Number(input.marginCapital)
    )
  ) {
    errors.push(
      "Available margin capital must be greater than zero."
    );
  }

  const scoreFields = [
    "marketDemand",
    "competition",
    "budgetFit",
    "localResources",
    "seasonalRisk",
    "profitPotential",
  ];

  for (const field of scoreFields) {
    if (
      input[field] !== undefined &&
      !isValidScore(Number(input[field]))
    ) {
      errors.push(
        `${field} must be between 0 and 100.`
      );
    }
  }

  return errors;
}