"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

interface LoanSummaryProps {
  finance: {
    marginCapital: number;
    projectCost: number;
    loanAmount: number;
  };
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

export default function LoanSummary({ finance }: LoanSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-gray-900">
        {t("financialStructure")}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-sm text-gray-500">{t("yourContribution")}</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(finance.marginCapital)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("projectCost")}</p>
          <p className="text-xl font-bold text-slate-900">
            {formatCurrency(finance.projectCost)}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("loanRequired")}</p>
          <p className="text-xl font-bold text-indigo-600">
            {formatCurrency(finance.loanAmount)}
          </p>
        </div>
      </div>
    </div>
  );
}