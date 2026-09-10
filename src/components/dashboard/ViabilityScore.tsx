"use client";

import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
} from "lucide-react";
import type { ViabilityFactorBreakdown } from "@/lib/viability/score";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface ViabilityScoreProps {
  score: number;
  rating: "HIGH" | "MEDIUM" | "LOW" | string;
  recommendation?: string;
  factors?: ViabilityFactorBreakdown;
}

export default function ViabilityScore({
  score,
  rating,
  recommendation,
  factors,
}: ViabilityScoreProps) {
  const { t } = useLanguage();
  const safeScore = Math.max(0, Math.min(100, score));

  const config =
    rating === "HIGH"
      ? {
          label: t("highViability"),
          icon: CheckCircle2,
          text: "text-emerald-700",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          bar: "bg-emerald-600",
        }
      : rating === "MEDIUM"
      ? {
          label: t("mediumViability"),
          icon: AlertTriangle,
          text: "text-amber-700",
          bg: "bg-amber-50",
          border: "border-amber-200",
          bar: "bg-amber-500",
        }
      : {
          label: t("lowViability"),
          icon: XCircle,
          text: "text-rose-700",
          bg: "bg-rose-50",
          border: "border-rose-200",
          bar: "bg-rose-600",
        };

  const Icon = config.icon;

  const factorItems = factors
    ? [
        factors.marketSaturation,
        factors.competitorDensity,
        factors.incomeToEmiRatio,
        factors.seasonalityRisk,
        factors.founderExperience,
      ].filter(Boolean)
    : [];

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {/* Overall Score Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            {t("enterpriseAssessment")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900">
            {t("viabilityScore")}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${config.bg}`}>
          <Icon className={config.text} size={24} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-extrabold text-gray-900">
          {safeScore}
        </span>
        <span className="mb-2 text-lg font-medium text-gray-400">
          / 100
        </span>
      </div>

      {/* Main Bar */}
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ${config.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}
        >
          <Icon size={14} />
          {config.label}
        </div>

        <span className="text-xs text-gray-400">
          {t("fivePillarsSub")}
        </span>
      </div>

      {recommendation && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600 bg-slate-50 rounded-xl p-4 border border-slate-100">
          {recommendation}
        </p>
      )}

      {/* Factor Breakdown (5 Pillars) */}
      {factorItems.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-indigo-600" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                {t("pillarBreakdownTitle")}
              </h3>
            </div>
            <span className="text-xs font-medium text-gray-400">
              {t("totalWeight")}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {factorItems.map((factor) => {
              const ratingStyle =
                factor.rating === "POSITIVE"
                  ? {
                      badgeBg: "bg-emerald-50",
                      badgeText: "text-emerald-700",
                      badgeBorder: "border-emerald-200",
                      barColor: "bg-emerald-500",
                      label: t("ratingPositive"),
                    }
                  : factor.rating === "NEUTRAL"
                  ? {
                      badgeBg: "bg-amber-50",
                      badgeText: "text-amber-700",
                      badgeBorder: "border-amber-200",
                      barColor: "bg-amber-500",
                      label: t("ratingModerate"),
                    }
                  : {
                      badgeBg: "bg-rose-50",
                      badgeText: "text-rose-700",
                      badgeBorder: "border-rose-200",
                      barColor: "bg-rose-500",
                      label: t("ratingRisk"),
                    };

              return (
                <div
                  key={factor.name}
                  className="rounded-xl border border-gray-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {factor.name}
                      </h4>
                      <span className="text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        {t("weightLabel")}: {factor.weight}%
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900">
                        {factor.score}
                        <span className="text-xs font-normal text-gray-400">/100</span>
                      </span>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${ratingStyle.badgeBg} ${ratingStyle.badgeText} ${ratingStyle.badgeBorder}`}
                      >
                        {ratingStyle.label}
                      </span>
                    </div>
                  </div>

                  {/* Factor Score Bar */}
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${ratingStyle.barColor}`}
                      style={{ width: `${Math.max(5, factor.score)}%` }}
                    />
                  </div>

                  {/* Factor Description */}
                  <p className="mt-2 text-xs leading-relaxed text-gray-600">
                    {factor.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}