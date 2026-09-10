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
        className="block text-sm font-semibold text-slate-800"
      >
        {t("marginCapital")}
      </label>

      <div className="relative">
        <IndianRupee
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="margin-capital"
          type="number"
          min="1"
          step="1000"
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
          className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:ring-2 ${
            error
              ? "border-red-400 focus:ring-red-100"
              : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
          }`}
        />
      </div>

      <p className="text-xs leading-5 text-slate-500">
        {t("marginCapitalDesc")}
      </p>

      {typeof value === "number" && value > 0 && (
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs text-slate-500">
            {t("estimatedProjectSize")}
          </p>

          <p className="mt-1 text-lg font-bold text-slate-900">
            ₹
            {(value * 10).toLocaleString(
              "en-IN"
            )}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {t("estimatedAgencyFinance")}: ₹
            {(value * 9).toLocaleString(
              "en-IN"
            )}
          </p>
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