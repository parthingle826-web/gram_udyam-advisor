"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

interface MarketConfidenceProps {
  totalPlaces: number;
  competitorCount: number;
  dataQuality: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
}

export default function MarketConfidence({
  totalPlaces,
  competitorCount,
  dataQuality,
  confidence,
}: MarketConfidenceProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-500">
          {t("marketDataConfidence")}
        </p>

        <div className="mt-1 flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            {confidence}%
          </h3>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
            {dataQuality}
          </span>
        </div>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-green-600"
          style={{ width: `${confidence}%` }}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            {t("nearbyBusinesses")}
          </p>

          <p className="text-lg font-bold">
            {totalPlaces}
          </p>
        </div>

        <div className="rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">
            {t("directCompetitors")}
          </p>

          <p className="text-lg font-bold">
            {competitorCount}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-gray-500">
        {t("confidenceExplainer")}
      </p>
    </div>
  );
}