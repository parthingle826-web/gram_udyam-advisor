export interface ViabilityFactors {
  marketDemand: number;
  competition: number;
  budgetFit: number;
  localResources: number;
  seasonalRisk: number;
  profitPotential: number;
}

export interface ViabilityFactorResult {
  marketDemand: number;
  competition: number;
  budgetFit: number;
  localResources: number;
  seasonalRisk: number;
  profitPotential: number;
}

export const VIABILITY_WEIGHTS = {
  marketDemand: 0.25,
  competition: 0.15,
  budgetFit: 0.15,
  localResources: 0.15,
  seasonalRisk: 0.10,
  profitPotential: 0.20,
} as const;

function normalize(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

export function normalizeViabilityFactors(
  factors: ViabilityFactors
): ViabilityFactorResult {
  return {
    marketDemand: normalize(factors.marketDemand),
    competition: normalize(factors.competition),
    budgetFit: normalize(factors.budgetFit),
    localResources: normalize(factors.localResources),
    seasonalRisk: normalize(factors.seasonalRisk),
    profitPotential: normalize(factors.profitPotential),
  };
}

export function calculateWeightedViability(
  factors: ViabilityFactors
): number {
  const normalized =
    normalizeViabilityFactors(factors);

  /*
   * Higher competition and seasonal risk reduce viability.
   */
  const competitionScore =
    100 - normalized.competition;

  const seasonalRiskScore =
    100 - normalized.seasonalRisk;

  const score =
    normalized.marketDemand *
      VIABILITY_WEIGHTS.marketDemand +

    competitionScore *
      VIABILITY_WEIGHTS.competition +

    normalized.budgetFit *
      VIABILITY_WEIGHTS.budgetFit +

    normalized.localResources *
      VIABILITY_WEIGHTS.localResources +

    seasonalRiskScore *
      VIABILITY_WEIGHTS.seasonalRisk +

    normalized.profitPotential *
      VIABILITY_WEIGHTS.profitPotential;

  return Math.round(
    Math.max(0, Math.min(100, score))
  );
}