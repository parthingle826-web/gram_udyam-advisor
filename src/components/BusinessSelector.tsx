"use client";

import { BUSINESS_CATEGORIES } from "@/data/business-categories";
import { ChevronDown, BriefcaseBusiness } from "lucide-react";
import { useLanguage } from "./i18n/LanguageProvider";

interface BusinessSelectorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function BusinessSelector({
  value,
  onChange,
  error,
}: BusinessSelectorProps) {
  const { t } = useLanguage();
  const selected = BUSINESS_CATEGORIES.find(
    (business) => business.id === value
  );

  return (
    <div className="space-y-2">
      <label
        htmlFor="business-category"
        className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        {t("category")} <span className="text-red-500 font-bold">*</span>
      </label>

      <div className="relative">
        <BriefcaseBusiness
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />

        <select
          id="business-category"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`w-full appearance-none rounded-xl border bg-white dark:bg-slate-800 py-3 pl-10 pr-10 text-sm text-slate-900 dark:text-white outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
              : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
          }`}
        >
          <option value="" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
            {t("selectBusinessPlaceholder")}
          </option>

          {BUSINESS_CATEGORIES.map((business) => (
            <option
              key={business.id}
              value={business.id}
              className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              {business.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      </div>

      {selected && (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            {selected.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t("capitalLabel")}: ₹
              {selected.requiredCapital.min.toLocaleString(
                "en-IN"
              )}
              {" – ₹"}
              {selected.requiredCapital.max.toLocaleString(
                "en-IN"
              )}
            </span>

            <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t("revenueLabel")}: {selected.revenuePotential}
            </span>

            <span className="rounded-full bg-white dark:bg-slate-800 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {t("seasonalRiskLabel")}: {selected.seasonalRisk}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}