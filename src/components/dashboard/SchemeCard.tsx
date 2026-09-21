"use client";

import NoFitGuidance from "./NoFitGuidance";
import type { SchemeAlternative } from "@/lib/finance/scheme-router";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface SchemeCardProps {
  scheme: {
    name: string;
    suitable: boolean;
    interestRate: number;
    tenureYears: number;
    moratoriumMonths: number;
    maxLoanAmount?: number;
    reason: string;
    guidance: string[];
    alternatives?: SchemeAlternative[];
  };
  projectCost?: number;
}

export default function SchemeCard({ scheme, projectCost }: SchemeCardProps) {
  const { t } = useLanguage();

  if (!scheme.suitable) {
    return (
      <NoFitGuidance
        title={t("noFitTitle")}
        reason={scheme.reason}
        guidance={scheme.guidance}
        alternatives={scheme.alternatives}
        projectCost={projectCost}
      />
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldCheck size={16} />
            {t("recommendedScheme") || "Scheme Recommended"}: {scheme.name}
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
            {scheme.name}
          </h2>
        </div>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
          <CheckCircle2 size={13} />
          {t("schemeSuitable")}
        </span>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {scheme.reason}
      </p>

      <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 sm:grid-cols-3">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("interestRate")}</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {scheme.interestRate}% p.a.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{t("concessionalRateDesc")}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("tenure")}</p>
          <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">
            {scheme.tenureYears} {t("tenure")}
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{scheme.tenureYears * 4} {t("quarterlyEmis")}</p>
        </div>

        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("moratorium")}</p>
          <p className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-400">
            {scheme.moratoriumMonths} Months
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">{t("moratoriumDesc")}</p>
        </div>
      </div>

      {scheme.guidance?.length > 0 && (
        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {t("applicationInstructions")}
          </p>

          <ul className="mt-2.5 space-y-2">
            {scheme.guidance.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}