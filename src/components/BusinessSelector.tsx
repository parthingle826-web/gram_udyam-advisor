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
        className="block text-sm font-semibold text-slate-800"
      >
        {t("category")}
      </label>

      <div className="relative">
        <BriefcaseBusiness
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <select
          id="business-category"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className={`w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
          }`}
        >
          <option value="">
            {t("selectBusinessPlaceholder")}
          </option>

          {BUSINESS_CATEGORIES.map((business) => (
            <option
              key={business.id}
              value={business.id}
            >
              {business.name}
            </option>
          ))}
        </select>

        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>

      {selected && (
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            {selected.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 border border-slate-200">
              {t("capitalLabel")}: ₹
              {selected.requiredCapital.min.toLocaleString(
                "en-IN"
              )}
              {" – ₹"}
              {selected.requiredCapital.max.toLocaleString(
                "en-IN"
              )}
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 border border-slate-200">
              {t("revenueLabel")}: {selected.revenuePotential}
            </span>

            <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 border border-slate-200">
              {t("seasonalRiskLabel")}: {selected.seasonalRisk}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}