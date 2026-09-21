"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Sparkles, AlertCircle, User } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/components/i18n/LanguageProvider";
import MarketAnalysis from "@/components/market/MarketAnalysis";
import AdvisoryPanel from "@/components/advisory/AdvisoryPanel";
import AIAdvisor from "@/components/ai/AIAdvisor";
import BusinessSummary from "@/components/dashboard/BusinessSummary";
import LoanSummary from "@/components/dashboard/LoanSummary";
import RepaymentTable from "@/components/dashboard/RepaymentTable";
import SchemeCard from "@/components/dashboard/SchemeCard";
import ViabilityScore from "@/components/dashboard/ViabilityScore";
import NoFitGuidance from "@/components/dashboard/NoFitGuidance";
import ConversationalAgent from "@/components/chat/ConversationalAgent";

import BusinessPlan from "@/components/ai/BusinessPlan";
import OpportunityCard from "@/components/ai/OpportunityCard";
import RiskCard from "@/components/ai/RiskCard";
import SWOTCard from "@/components/ai/SWOTCard";

import { generateAdvisory } from "@/lib/advisory/generate-advisory";
import { analyzeBusiness } from "@/lib/business/analyze-business";
import {
  MIN_APPLICANT_AGE,
  DEFAULT_MAX_APPLICANT_AGE,
} from "@/lib/utils/constants";

interface MarketResult {
  totalBusinesses?: number;
  competitorCount?: number;
  competitionLevel?: string;
  marketDensity?: number;
  businessTypeDistribution?: Record<string, number>;
  underservedCategories?: string[];
  opportunities?: string[];
  risks?: string[];
  places?: any[];
  competitors?: any[];
  suppliers?: any[];
  latitude?: number;
  longitude?: number;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();

  const [assessment, setAssessment] = useState<any | null>(null);
  const [market, setMarket] = useState<MarketResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedAssessment =
        sessionStorage.getItem("assessment") ||
        sessionStorage.getItem("gram-udyam-assessment");

      if (storedAssessment) {
        setAssessment(
          JSON.parse(storedAssessment)
        );
        setLoading(false);
        return;
      }

      const params = new URLSearchParams(
        window.location.search
      );

      const fallbackAssessment = {
        fullName: params.get("fullName") || undefined,
        age: params.get("age") ? Number(params.get("age")) : undefined,
        mobileNumber: params.get("mobileNumber") || undefined,
        address: params.get("address") || undefined,

        businessName:
          params.get("businessName") ||
          "Your Business",

        category:
          params.get("category") ||
          "General",

        village:
          params.get("village") || "",

        block:
          params.get("block") || "",

        district:
          params.get("district") || "",

        state:
          params.get("state") || "",

        marginCapital: Number(
          params.get("marginCapital") || 0
        ),

        marketDemand: Number(
          params.get("marketDemand") || 50
        ),

        competition: Number(
          params.get("competition") || 50
        ),

        budgetFit: Number(
          params.get("budgetFit") || 50
        ),

        localResources: Number(
          params.get("localResources") || 50
        ),

        seasonalRisk: Number(
          params.get("seasonalRisk") || 50
        ),

        profitPotential: Number(
          params.get("profitPotential") || 50
        ),

        experienceYears: Number(
          params.get("experienceYears") || 1
        ),

        hasLandOrShop:
          params.get("hasLandOrShop") !== "false",

        monthlyRevenue: Number(
          params.get("monthlyRevenue") || 0
        ),

        operatingExpenses: Number(
          params.get("operatingExpenses") || 0
        ),
      };

      setAssessment(fallbackAssessment);
    } catch (error) {
      console.error(
        "Unable to load assessment:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

          <p className="mt-4 text-sm text-gray-500">
            {t("loading")}
          </p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            {t("noAssessmentFound")}
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {t("completeAssessmentFirst")}
          </p>

          <a
            href="/assessment"
            className="mt-5 inline-block rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            {t("startAssessment")}
          </a>
        </div>
      </div>
    );
  }

  // Age Gate: Applicants under 18 cannot independently access loan schemes
  if (assessment.age !== undefined && assessment.age < MIN_APPLICANT_AGE) {
    return (
      <main className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="mx-auto max-w-2xl px-6 py-16">
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
              <AlertCircle size={28} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Age Eligibility Gate: Under 18 Years
            </h1>
            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              {t("errAgeUnder18")}
            </p>
            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-xs text-slate-600 space-y-1.5">
              <p className="font-semibold text-slate-800">Application Notice:</p>
              <p>• Minimum applicant age required by concessional loan guidelines: 18 years</p>
              <p>• Applicant age entered: {assessment.age} years</p>
              <p>• Minors cannot independently enter credit contracts under Indian banking laws. Please apply with an adult family member as the primary applicant.</p>
            </div>
            <div className="mt-8">
              <a
                href="/assessment"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
              >
                Return to Assessment Form
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const result = analyzeBusiness(assessment);

  const advisory = generateAdvisory({
    businessName: assessment.businessName,
    category: assessment.category,
    village: assessment.village,
    district: assessment.district,
    state: assessment.state,

    viabilityScore: result.viability.score,
    viabilityRating: result.viability.rating,

    projectCost: result.finance.projectCost,
    loanAmount: result.finance.loanAmount,

    schemeName: result.finance.scheme.name,
    schemeSuitable: result.finance.scheme.suitable,

    monthlyEMI: result.finance.monthlyEMI,

    competitorCount:
      market?.competitorCount ?? 0,

    competitionLevel:
      market?.competitionLevel ?? "UNKNOWN",

    marketOpportunities:
      market?.opportunities ?? [],

    marketRisks:
      market?.risks ?? [],

    strengths: result.strengths,
    risks: result.risks,
    opportunities: result.opportunities,
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

     
      <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">
                <Sparkles size={16} />
                Gram Udyam Advisor
              </div>

              <h1 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {assessment.businessName}
              </h1>

              <p className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                <MapPin size={16} />

                {[
                  assessment.village,
                  assessment.block,
                  assessment.district,
                  assessment.state,
                ]
                  .filter(Boolean)
                  .join(", ") ||
                  "Local business assessment"}
              </p>

              {assessment.fullName && (
                <p className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <User size={14} className="text-slate-400 dark:text-slate-500" />
                  <span>
                    Applicant: <strong className="text-slate-900 dark:text-white">{assessment.fullName}</strong>
                  </span>
                  {assessment.age ? <span>• {assessment.age} yrs</span> : null}
                  {assessment.mobileNumber ? <span>• {assessment.mobileNumber}</span> : null}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* <Link
                href={`/report?business=${encodeURIComponent(assessment.businessName)}`}
                className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 inline-flex items-center gap-2"
              >
                📄 {t("viewReport")}
              </Link> */}
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 px-5 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  {t("category")}
                </p>

                <p className="mt-1 font-semibold uppercase text-indigo-950 dark:text-indigo-200">
                  {assessment.category}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-8 px-6 py-8">
        {/* Senior Applicant Guidance Note */}
        {assessment.age !== undefined && assessment.age > DEFAULT_MAX_APPLICANT_AGE && (
          <div className="rounded-2xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-5 text-amber-900 dark:text-amber-200 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={22} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-base text-amber-950 dark:text-amber-200">
                  Senior Citizen Applicant Guidance Note (Age: {assessment.age} years)
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-300">
                  {t("seniorNoticeBanner")}
                </p>
              </div>
            </div>
          </div>
        )}
      
        <section className="rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200 dark:border-slate-800">
          <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
            {t("overallRecommendation")}
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {result.decision.replaceAll("_", " ")}
          </h2>

          <p className="mt-2 text-gray-600 dark:text-slate-300">
            {result.viability.recommendation}
          </p>
        </section>

       
        <div className="grid gap-6 md:grid-cols-4">
          <MetricCard
            title={t("viabilityScore")}
            value={`${result.viability.score}/100`}
          />

          <MetricCard
            title={t("projectCost")}
            value={formatCurrency(
              result.finance.projectCost
            )}
          />

          <MetricCard
            title={t("loanAmount")}
            value={formatCurrency(
              result.finance.loanAmount
            )}
          />

          <MetricCard
            title={t("competitors")}
            value={
              market
                ? String(
                    market.competitorCount ?? 0
                  )
                : t("loading")
            }
          />
        </div>

      
        <ViabilityScore
          score={result.viability.score}
          rating={result.viability.rating}
          recommendation={result.viability.recommendation}
          factors={result.viability.factors}
        />

        
        <BusinessSummary
          business={assessment}
        />

        
        <LoanSummary
          finance={result.finance}
        />

      
        <SchemeCard
          scheme={result.finance.scheme}
          projectCost={result.finance.projectCost}
        />

       
        <AIAdvisor
          assessment={assessment}
          result={result}
          market={market}
          language={language}
        />

       
        <BusinessPlan
          businessName={assessment.businessName}
          category={assessment.category}
          village={assessment.village}
          district={assessment.district}
          projectCost={
            result.finance.projectCost
          }
          loanAmount={
            result.finance.loanAmount
          }
          recommendation={
            result.viability.recommendation
          }
          nextSteps={result.nextSteps}
        />

       
        {result.finance.scheme.suitable && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {t("repaymentEstimate")}
            </h2>

            <RepaymentTable
              loanAmount={
                result.finance.loanAmount
              }
              interestRate={
                result.finance.scheme.interestRate
              }
              tenureYears={
                result.finance.scheme.tenureYears
              }
              moratoriumMonths={
                result.finance.scheme.moratoriumMonths
              }
            />
          </section>
        )}

        <section>
          <MarketAnalysis
            village={assessment.village}
            block={assessment.block}
            district={assessment.district}
            state={assessment.state}
            businessType={assessment.category}
            onAnalysis={(analysis: MarketResult) => {
              setMarket(analysis);

              try {
                sessionStorage.setItem(
                  "marketAnalysis",
                  JSON.stringify(analysis)
                );
              } catch (error) {
                console.error(
                  "Unable to save market analysis:",
                  error
                );
              }
            }}
          />
        </section>

        
        {market && market.totalBusinesses === 0 && (
          <NoFitGuidance
            title="Market Intelligence: Zero Commercial Listings Detected"
            reason="No existing commercial entities or competitors were detected in OpenStreetMap or PostGIS records within your selected radius."
            guidance={[
              "First-mover advantage: You may be the primary or sole provider for this category in this village cluster.",
              "Conduct 10–15 direct field interviews at weekly village haats or gram panchayat meetings before investing capital.",
              "Verify availability of grid power, reliable road transport, and raw material access from the nearest block/district mandi.",
              "Map out the nearest town supply routes to calculate logistics and fuel costs.",
            ]}
            alternatives={[
              {
                title: "Village Haat Customer Validation",
                description: "Set up a temporary stall or display at the weekly village haat to test consumer price sensitivity and direct product demand.",
                action: "Interview local customers during the upcoming village market day.",
              },
              {
                title: "Block Mandi Logistics Mapping",
                description: "Confirm whether wholesale delivery vans service your village or if you will need to arrange your own vehicle.",
                action: "Inquire with wholesale stockists at the nearest block headquarter.",
              },
            ]}
            isZeroData={true}
          />
        )}

       
        {market && (
          <section className="grid gap-6 md:grid-cols-3">
            <MetricCard
              title={t("nearbyBusinesses")}
              value={String(
                market.totalBusinesses ?? 0
              )}
            />

            <MetricCard
              title={t("competitionLevelLabel")}
              value={
                market.competitionLevel ||
                "UNKNOWN"
              }
            />

            <MetricCard
              title={t("marketDensity")}
              value={`${market.marketDensity ?? 0}`}
            />
          </section>
        )}

       
        <SWOTCard
          strengths={result.strengths}
          weaknesses={result.risks}
          opportunities={
            market?.opportunities?.length
              ? [
                  ...result.opportunities,
                  ...market.opportunities,
                ]
              : result.opportunities
          }
          threats={
            market?.risks?.length
              ? [
                  ...result.risks,
                  ...market.risks,
                ]
              : result.risks
          }
        />

      
        <div className="grid gap-6 lg:grid-cols-2">
          <OpportunityCard
            opportunities={
              market?.opportunities?.length
                ? [
                    ...result.opportunities,
                    ...market.opportunities,
                  ]
                : result.opportunities
            }
          />

          <RiskCard
            risks={
              market?.risks?.length
                ? [
                    ...result.risks,
                    ...market.risks,
                  ]
                : result.risks
            }
            mitigation={
              advisory.riskMitigation
            }
          />
        </div>

        
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-gray-900">
            {t("recommendedNextSteps")}
          </h2>

          <div className="mt-5 space-y-3">
            {result.nextSteps.map(
              (step, index) => (
                <div
                  key={`${step}-${index}`}
                  className="flex gap-3 rounded-xl border p-4 bg-slate-50/50"
                >
                  <span className="font-bold text-indigo-600">
                    {index + 1}
                  </span>

                  <span className="text-sm text-gray-700">
                    {step}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        
        <AdvisoryPanel
          advisory={advisory}
          viabilityScore={
            result.viability.score
          }
        />

        {/* Persistent Conversational AI Agent */}
        <ConversationalAgent assessment={assessment} result={result} />
      </div>
    </main>
  );
}

function MetricCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-400" />
            <p className="mt-4 text-sm text-gray-500 dark:text-slate-400">
              Loading dashboard...
            </p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}