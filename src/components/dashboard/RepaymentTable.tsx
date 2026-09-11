"use client";

import { useState } from "react";
import {
  generateQuarterlySchedule,
  MoratoriumRule,
} from "@/lib/finance/schedule";
import { Calendar, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface RepaymentTableProps {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  moratoriumMonths?: number;
}

function formatCurrency(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export default function RepaymentTable({
  loanAmount,
  interestRate,
  tenureYears,
  moratoriumMonths = 6,
}: RepaymentTableProps) {
  const { t } = useLanguage();
  const [rule, setRule] = useState<MoratoriumRule>("INTEREST_ONLY");
  const [expanded, setExpanded] = useState(false);

  if (!loanAmount || loanAmount <= 0) {
    return null;
  }

  const schedule = generateQuarterlySchedule(
    loanAmount,
    interestRate,
    tenureYears,
    moratoriumMonths,
    rule
  );

  const displayQuarters = expanded
    ? schedule.quarters
    : schedule.quarters.slice(0, 6);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
     
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <Calendar size={14} />
            {t("amortizationScheduleTitle")}
          </div>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">
            {t("quarterlyScheduleHeading")}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {schedule.totalQuarters} {t("thQuarter")} ({tenureYears} {t("tenure")}) • {t("interestRate")}: {interestRate}% p.a.
          </p>
        </div>

       
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1 text-xs">
          <button
            type="button"
            onClick={() => setRule("INTEREST_ONLY")}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              rule === "INTEREST_ONLY"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("interestOnlyBtn")}
          </button>
          <button
            type="button"
            onClick={() => setRule("FULLY_DEFERRED")}
            className={`rounded-lg px-3 py-1.5 font-semibold transition ${
              rule === "FULLY_DEFERRED"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {t("fullyDeferredBtn")}
          </button>
        </div>
      </div>

      
      <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 text-xs leading-5 text-indigo-950">
        <div className="flex items-start gap-2.5">
          <Clock size={16} className="mt-0.5 shrink-0 text-indigo-600" />
          <div>
            <span className="font-bold">
              {rule === "INTEREST_ONLY"
                ? `${t("statusMoratorium")}: ${moratoriumMonths} Months (${t("interestOnlyBtn")})`
                : `${t("statusMoratorium")}: ${moratoriumMonths} Months (${t("fullyDeferredBtn")})`}
            </span>
            <p className="mt-0.5 text-slate-600">
              {rule === "INTEREST_ONLY"
                ? `During the initial ${moratoriumMonths} months (${schedule.moratoriumQuarters} quarter${
                    schedule.moratoriumQuarters > 1 ? "s" : ""
                  }), you only pay the quarterly interest accrued. The principal remains intact, protecting your cash flow during early business gestation.`
                : `During the initial ${moratoriumMonths} months, you pay ₹0. Accrued interest is added to the principal balance, and full repayment begins in Quarter ${
                    schedule.moratoriumQuarters + 1
                  }.`}
            </p>
          </div>
        </div>
      </div>

      
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase">{t("sanctionedLoan")}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(schedule.principal)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">{t("principalDisbursed")}</p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase">{t("regularQuarterlyEmi")}</p>
          <p className="mt-1 text-2xl font-bold text-indigo-600">
            {formatCurrency(schedule.regularQuarterlyInstallment)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            ~{formatCurrency(schedule.regularQuarterlyInstallment / 3)}/month
          </p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase">{t("totalInterest")}</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {formatCurrency(schedule.totalInterestPaid)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">{t("overFullTenure")}</p>
        </div>

        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500 uppercase">{t("totalOutlay")}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(schedule.totalRepayment)}
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">{t("principalPlusInterest")}</p>
        </div>
      </div>

     
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-3.5 py-3">{t("thQuarter")}</th>
              <th className="px-3.5 py-3">{t("thOpeningBal")}</th>
              <th className="px-3.5 py-3">{t("thPrincipalPaid")}</th>
              <th className="px-3.5 py-3">{t("thInterestPaid")}</th>
              <th className="px-3.5 py-3">{t("thTotalInstallment")}</th>
              <th className="px-3.5 py-3">{t("thClosingBal")}</th>
              <th className="px-3.5 py-3">{t("thStatus")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayQuarters.map((row) => (
              <tr
                key={row.quarter}
                className={
                  row.isMoratorium
                    ? "bg-amber-50/40 font-medium"
                    : "hover:bg-slate-50/70"
                }
              >
                <td className="px-3.5 py-2.5 font-bold text-slate-900">
                  Q{row.quarter} (Yr {row.year})
                </td>
                <td className="px-3.5 py-2.5 text-slate-700">
                  {formatCurrency(row.openingPrincipal)}
                </td>
                <td className="px-3.5 py-2.5 font-semibold text-emerald-700">
                  {formatCurrency(row.principalPaid)}
                </td>
                <td className="px-3.5 py-2.5 text-amber-700">
                  {formatCurrency(row.interestPaid)}
                </td>
                <td className="px-3.5 py-2.5 font-bold text-slate-900">
                  {formatCurrency(row.totalInstallment)}
                </td>
                <td className="px-3.5 py-2.5 text-slate-700">
                  {formatCurrency(row.closingPrincipal)}
                </td>
                <td className="px-3.5 py-2.5">
                  {row.isMoratorium ? (
                    <span className="inline-flex items-center rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      {t("statusMoratorium")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {t("statusAmortizing")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      {schedule.quarters.length > 6 && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            {expanded ? (
              <>
                <ChevronUp size={15} />
                {t("showInitialQuarters")}
              </>
            ) : (
              <>
                <ChevronDown size={15} />
                {t("viewFullSchedule")} ({schedule.totalQuarters} {t("thQuarter")})
              </>
            )}
          </button>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-4 text-slate-500">
        {t("repaymentFootnote")}
      </p>
    </div>
  );
}