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
    <section className="rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {t("enterpriseAssessment")}
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {t("viabilityScore")}
          </h2>
        </div>

        <div className={`rounded-xl p-3 ${config.bg} dark:bg-opacity-20`}>
          <Icon className={config.text} size={24} />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
          {safeScore}
        </span>
        <span className="mb-2 text-lg font-medium text-gray-400 dark:text-slate-500">
          / 100
        </span>
      </div>

      
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${config.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${config.bg} dark:bg-opacity-20 ${config.text} border ${config.border} dark:border-opacity-30`}
        >
          <Icon size={14} />
          {config.label}
        </div>

        <span className="text-xs text-gray-400 dark:text-slate-500">
          {t("fivePillarsSub")}
        </span>
      </div>

      {recommendation && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
          {recommendation}
        </p>
      )}

      
      {factorItems.length > 0 && (
        <div className="mt-8 border-t border-gray-100 dark:border-slate-800 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-indigo-600 dark:text-indigo-400" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                {t("pillarBreakdownTitle")}
              </h3>
            </div>
            <span className="text-xs font-medium text-gray-400 dark:text-slate-500">
              {t("totalWeight")}
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {factorItems.map((factor) => {
              const ratingStyle =
                factor.rating === "POSITIVE"
                  ? {
                      badgeBg: "bg-emerald-50 dark:bg-emerald-950/50",
                      badgeText: "text-emerald-700 dark:text-emerald-300",
                      badgeBorder: "border-emerald-200 dark:border-emerald-800/50",
                      barColor: "bg-emerald-500",
                      label: t("ratingPositive"),
                    }
                  : factor.rating === "NEUTRAL"
                  ? {
                      badgeBg: "bg-amber-50 dark:bg-amber-950/50",
                      badgeText: "text-amber-700 dark:text-amber-300",
                      badgeBorder: "border-amber-200 dark:border-amber-800/50",
                      barColor: "bg-amber-500",
                      label: t("ratingModerate"),
                    }
                  : {
                      badgeBg: "bg-rose-50 dark:bg-rose-950/50",
                      badgeText: "text-rose-700 dark:text-rose-300",
                      badgeBorder: "border-rose-200 dark:border-rose-800/50",
                      barColor: "bg-rose-500",
                      label: t("ratingRisk"),
                    };

              return (
                <div
                  key={factor.name}
                  className="rounded-xl border border-gray-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:shadow-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {factor.name}
                      </h4>
                      <span className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md mt-1 inline-block border border-indigo-100 dark:border-indigo-800/40">
                        {t("weightLabel")}: {factor.weight}%
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {factor.score}
                        <span className="text-xs font-normal text-gray-400 dark:text-slate-500">/100</span>
                      </span>
                      <span
                        className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold border ${ratingStyle.badgeBg} ${ratingStyle.badgeText} ${ratingStyle.badgeBorder}`}
                      >
                        {ratingStyle.label}
                      </span>
                    </div>
                  </div>

                  
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${ratingStyle.barColor}`}
                      style={{ width: `${Math.max(5, factor.score)}%` }}
                    />
                  </div>

                  
                  <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-slate-300">
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