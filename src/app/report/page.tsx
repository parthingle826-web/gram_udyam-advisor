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
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import PDFDownloadButton from "@/components/report/PDFDownloadButton";
import ConversationalAgent from "@/components/chat/ConversationalAgent";
import { analyzeBusiness } from "@/lib/business/analyze-business";
import { safeGenerateQuarterlySchedule } from "@/lib/finance/schedule";
import { formatCurrency } from "@/lib/utils/currency";
import { MIN_APPLICANT_AGE } from "@/lib/utils/constants";
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
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t("loading")}</p>
          </div>
        </div>
      </main>
    );
  }

  // Age Eligibility Gate: Minors (< 18) cannot independently take institutional loans
  if (assessment.age !== undefined && assessment.age < MIN_APPLICANT_AGE) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-slate-900 p-8 shadow-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mb-4">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Age Eligibility Gate: Under 18 Years
            </h1>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("errAgeUnder18")}
            </p>
            <div className="mt-6 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 text-left text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <p className="font-semibold text-slate-800 dark:text-slate-200">Application Notice:</p>
              <p>• Minimum applicant age required by concessional loan guidelines: 18 years</p>
              <p>• Applicant age entered: {assessment.age} years</p>
              <p>• Minors cannot independently enter credit contracts under Indian banking laws. Please apply with an adult family member as the primary applicant.</p>
            </div>
            <div className="mt-8">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-indigo-700 transition"
              >
                Return to Assessment Form
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const result = analyzeBusiness(assessment);
  const scheduleResult = safeGenerateQuarterlySchedule(
    result.finance.loanAmount,
    result.finance.scheme.interestRate,
    result.finance.scheme.tenureYears,
    result.finance.scheme.moratoriumMonths,
    "INTEREST_ONLY"
  );
  const scheduleQuarters = scheduleResult?.quarters ?? [];

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
    schedule: scheduleQuarters,
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
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-8">
     
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              {t("back")}
            </Link>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {assessment.businessName}
            </h1>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {locationStr || "Rural Enterprise Feasibility & Credit Advisory"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              <Printer size={16} />
              {t("print")}
            </button>

            <PDFDownloadButton data={reportData} />
          </div>
        </div>

       
        <div className="space-y-6">
        
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/60 p-3 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                <FileText size={24} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {t("comprehensiveAppraisal")}
                  </h2>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                    {t("verifiedAnalysis")}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {t("reportSummaryIntro")} {assessment.businessName}.
                </p>
              </div>
            </div>
          </section>

         
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("viabilityScore")}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {result.viability.score}
                </span>
                <span className="text-sm text-slate-400 dark:text-slate-500">/100</span>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <CheckCircle2 size={13} />
                {result.viability.rating}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("projectCost")} & {t("marginAmount")}
              </p>
              <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(result.finance.projectCost)}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t("borrowerEquity")}: {formatCurrency(result.finance.marginCapital)}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t("loanAmount")}
              </p>
              <div className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
                {formatCurrency(result.finance.loanAmount)}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {t("monthlyEMI")}: ~{formatCurrency(result.finance.monthlyEMI)}
              </p>
            </div>
          </div>

         
          {result.viability.factors && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
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
                  <div key={factor.name} className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{factor.name}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{factor.score}/100</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{factor.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          
          {/* Scheme Breakdown or Ineligible Advisory Card */}
          {result.finance.scheme.suitable !== false ? (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Coins className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t("recommendedScheme") || "Scheme Recommended"}: {result.finance.scheme.name}
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("interestRate")}</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{result.finance.scheme.interestRate}% p.a.</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("tenure")}</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{result.finance.scheme.tenureYears} {t("tenure")}</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("moratorium")}</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{result.finance.scheme.moratoriumMonths} Months</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t("monthlyEMI")}</span>
                  <p className="text-base font-bold text-slate-900 dark:text-white">{formatCurrency(result.finance.monthlyEMI)}</p>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/30 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-amber-600 dark:text-amber-400" size={20} />
                <h3 className="text-base font-bold text-amber-900 dark:text-amber-200">
                  {result.finance.scheme.name}
                </h3>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                {result.finance.scheme.reason}
              </p>
              {result.finance.scheme.guidance && result.finance.scheme.guidance.length > 0 && (
                <ul className="mt-3 space-y-1 text-xs text-amber-800 dark:text-amber-300 list-disc list-inside">
                  {result.finance.scheme.guidance.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Quarterly Schedule Table (Rendered only when an active schedule exists) */}
          {scheduleQuarters.length > 0 && (
            <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="text-indigo-600 dark:text-indigo-400" size={20} />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t("quarterlyAmortizationSchedule")}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">{t("thQuarter")}</th>
                      <th className="py-2.5 px-3 text-right">{t("thOpeningBal")}</th>
                      <th className="py-2.5 px-3 text-right">{t("thPrincipalPaid")}</th>
                      <th className="py-2.5 px-3 text-right">{t("thInterestPaid")}</th>
                      <th className="py-2.5 px-3 text-right">{t("thClosingBal")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {scheduleQuarters.slice(0, 8).map((q) => (
                      <tr key={q.quarter} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-semibold text-slate-900 dark:text-white">{t("thQuarter")} {q.quarter}</td>
                        <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(q.openingPrincipal)}</td>
                        <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(q.principalPaid)}</td>
                        <td className="py-2 px-3 text-right text-slate-600 dark:text-slate-300">{formatCurrency(q.interestPaid)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-900 dark:text-white">{formatCurrency(q.closingPrincipal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          
          <section className="rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-5">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">
              {t("officialNoteTitle")}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              {t("officialNoteParagraph")}
            </p>
          </section>
        </div>

        {/* Persistent Conversational AI Agent */}
        <ConversationalAgent assessment={assessment} result={result} />
      </div>
    </main>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="rounded-xl bg-white dark:bg-slate-900 px-6 py-4 shadow-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
            Loading report...
          </div>
        </main>
      }
    >
      <ReportContent />
    </Suspense>
  );
}