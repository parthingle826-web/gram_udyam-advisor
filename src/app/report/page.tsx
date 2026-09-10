"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  FileText,
  CheckCircle2,
  Coins,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PDFDownloadButton from "@/components/report/PDFDownloadButton";
import { analyzeBusiness } from "@/lib/business/analyze-business";
import { generateQuarterlySchedule } from "@/lib/finance/schedule";
import { formatCurrency } from "@/lib/utils/currency";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import type { BusinessAssessment } from "@/types/business";

function ReportContent() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [assessment, setAssessment] = useState<BusinessAssessment | null>(null);

  useEffect(() => {
    try {
      const stored =
        sessionStorage.getItem("gram-udyam-assessment") ||
        sessionStorage.getItem("assessment");

      if (stored) {
        setAssessment(JSON.parse(stored));
        return;
      }

      // Fallback to URL params if sessionStorage is empty
      const name = searchParams.get("business") || "Rural Micro Enterprise";
      const fallback: BusinessAssessment = {
        businessName: name,
        category: searchParams.get("category") || "Retail / General Store",
        village: searchParams.get("village") || "",
        block: searchParams.get("block") || "",
        district: searchParams.get("district") || "",
        state: searchParams.get("state") || "",
        marginCapital: Number(searchParams.get("marginCapital") || 50000),
        marketDemand: Number(searchParams.get("marketDemand") || 65),
        competition: Number(searchParams.get("competition") || 35),
        budgetFit: Number(searchParams.get("budgetFit") || 70),
        localResources: Number(searchParams.get("localResources") || 50),
        seasonalRisk: Number(searchParams.get("seasonalRisk") || 30),
        profitPotential: Number(searchParams.get("profitPotential") || 50),
        experienceYears: Number(searchParams.get("experienceYears") || 2),
        hasLandOrShop: searchParams.get("hasLandOrShop") !== "false",
        monthlyRevenue: Number(searchParams.get("monthlyRevenue") || 25000),
        operatingExpenses: Number(searchParams.get("operatingExpenses") || 12000),
      };
      setAssessment(fallback);
    } catch (err) {
      console.error("Failed to load assessment for report:", err);
    }
  }, [searchParams]);

  if (!assessment) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-gray-500">{t("loading")}</p>
          </div>
        </div>
      </main>
    );
  }

  const result = analyzeBusiness(assessment);
  const schedule = generateQuarterlySchedule(
    result.finance.loanAmount,
    result.finance.scheme.interestRate,
    result.finance.scheme.tenureYears,
    result.finance.scheme.moratoriumMonths,
    "INTEREST_ONLY"
  );

  const reportData = {
    assessment,
    viability: {
      score: result.viability.score,
      rating: result.viability.rating,
      recommendation: result.viability.recommendation,
      factors: result.viability.factors,
    },
    finance: {
      projectCost: result.finance.projectCost,
      loanAmount: result.finance.loanAmount,
      marginCapital: result.finance.marginCapital,
      monthlyEMI: result.finance.monthlyEMI,
      scheme: result.finance.scheme,
    },
    schedule: schedule.quarters,
    aiAdvisory: {
      headline: `${assessment.businessName} Feasibility Report`,
      summary: result.viability.recommendation,
      actions: result.nextSteps,
    },
  };

  const locationStr = [
    assessment.village,
    assessment.block,
    assessment.district,
    assessment.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Top bar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              {t("back")}
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-900">
              {assessment.businessName}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {locationStr || "Rural Enterprise Feasibility & Credit Advisory"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Printer size={16} />
              {t("print")}
            </button>

            <PDFDownloadButton data={reportData} />
          </div>
        </div>

        {/* Report Cards */}
        <div className="space-y-6">
          {/* Header Overview Banner */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-900">
                    {t("comprehensiveAppraisal")}
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    {t("verifiedAnalysis")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {t("reportSummaryIntro")} {assessment.businessName}.
                </p>
              </div>
            </div>
          </section>

          {/* Profile & Viability Metrics */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("viabilityScore")}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">
                  {result.viability.score}
                </span>
                <span className="text-sm text-slate-400">/100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                <CheckCircle2 size={13} />
                {result.viability.rating}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("projectCost")} & {t("marginAmount")}
              </p>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {formatCurrency(result.finance.projectCost)}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {t("borrowerEquity")}: {formatCurrency(result.finance.marginCapital)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {t("loanAmount")}
              </p>
              <div className="mt-3 text-3xl font-extrabold text-slate-900">
                {formatCurrency(result.finance.loanAmount)}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {t("monthlyEMI")}: ~{formatCurrency(result.finance.monthlyEMI)}
              </p>
            </div>
          </div>

          {/* 5-Factor Breakdown Table */}
          {result.viability.factors && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {t("viabilityPillarsTitle")}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  result.viability.factors.marketSaturation,
                  result.viability.factors.competitorDensity,
                  result.viability.factors.incomeToEmiRatio,
                  result.viability.factors.seasonalityRisk,
                  result.viability.factors.founderExperience,
                ].map((factor) => (
                  <div key={factor.name} className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">{factor.name}</span>
                      <span className="text-xs font-bold text-slate-900">{factor.score}/100</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 leading-normal">{factor.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Scheme Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Coins className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-slate-900">
                {t("financingSchemeTerms")}: {result.finance.scheme.name}
              </h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-xs text-slate-500">{t("interestRate")}</span>
                <p className="text-base font-bold text-slate-900">{result.finance.scheme.interestRate}% p.a.</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-xs text-slate-500">{t("tenure")}</span>
                <p className="text-base font-bold text-slate-900">{result.finance.scheme.tenureYears} {t("tenure")}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-xs text-slate-500">{t("moratorium")}</span>
                <p className="text-base font-bold text-slate-900">{result.finance.scheme.moratoriumMonths} Months</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <span className="text-xs text-slate-500">{t("monthlyEMI")}</span>
                <p className="text-base font-bold text-slate-900">{formatCurrency(result.finance.monthlyEMI)}</p>
              </div>
            </div>
          </section>

          {/* Repayment Schedule (First 8 quarters) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-indigo-600" size={20} />
              <h3 className="text-base font-bold text-slate-900">
                {t("quarterlyAmortizationSchedule")}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b">
                  <tr>
                    <th className="py-2.5 px-3">{t("thQuarter")}</th>
                    <th className="py-2.5 px-3 text-right">{t("thOpeningBal")}</th>
                    <th className="py-2.5 px-3 text-right">{t("thPrincipalPaid")}</th>
                    <th className="py-2.5 px-3 text-right">{t("thInterestPaid")}</th>
                    <th className="py-2.5 px-3 text-right">{t("thClosingBal")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedule.quarters.slice(0, 8).map((q) => (
                    <tr key={q.quarter} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900">{t("thQuarter")} {q.quarter}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(q.openingPrincipal)}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(q.principalPaid)}</td>
                      <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(q.interestPaid)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-slate-900">{formatCurrency(q.closingPrincipal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h3 className="font-semibold text-amber-900 text-sm">
              {t("officialNoteTitle")}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-800">
              {t("officialNoteParagraph")}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="rounded-xl bg-white px-6 py-4 shadow-sm">
            Loading report...
          </div>
        </main>
      }
    >
      <ReportContent />
    </Suspense>
  );
}