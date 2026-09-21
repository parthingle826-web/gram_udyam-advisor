"use client";

import { IndianRupee } from "lucide-react";
import { useLanguage } from "./i18n/LanguageProvider";

interface CapitalInputProps {
  value: number | "";
  onChange: (value: number | "") => void;
  error?: string;
}

export default function CapitalInput({
  value,
  onChange,
  error,
}: CapitalInputProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <label
        htmlFor="margin-capital"
        className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
      >
        {t("marginCapital")} <span className="text-red-500 font-bold">*</span>
      </label>

      <div className="relative">
        <IndianRupee
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />

        <input
          id="margin-capital"
          type="number"
          step="any"
          value={value}
          onChange={(event) => {
            const raw = event.target.value;

            if (raw === "") {
              onChange("");
              return;
            }

            const number = Number(raw);

            onChange(
              Number.isFinite(number)
                ? number
                : ""
            );
          }}
          placeholder="Example: 100000"
          className={`w-full rounded-xl border bg-white dark:bg-slate-800 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
              : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
          }`}
        />
      </div>

      <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
        {t("marginCapitalDesc")}
      </p>

      {typeof value === "number" && value > 0 && (() => {
        const estProjectCost = Math.round(value / 0.10);
        const estAgencyFinance = Math.round(estProjectCost * 0.90);
        const derivedSchemeLabel =
          estProjectCost <= 140000
            ? t("microFinance") || "Micro Finance Scheme"
            : estProjectCost <= 5000000
            ? t("termLoan") || "Term Loan Scheme"
            : t("noSuitableScheme") || "No-Fit Guidance Engine";

        return (
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("estimatedProjectSize")}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                ₹{estProjectCost.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {t("estimatedAgencyFinance")}
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ₹{estAgencyFinance.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                {t("recommendedScheme") || "Scheme Recommended"}:
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                {derivedSchemeLabel}
              </span>
            </div>
          </div>
        );
      })()}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}