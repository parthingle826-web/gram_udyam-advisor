"use client";

import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Wallet,
  MapPin,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

interface AdvisoryResult {
  headline: string;
  summary: string;
  recommendation: "START" | "START_SMALL" | "REVIEW" | "AVOID";
  confidence: number;
  keyReasons: string[];
  financialAdvice: string[];
  marketAdvice: string[];
  riskMitigation: string[];
  actionPlan: string[];
  alternativeIdeas: string[];
}

interface AdvisoryPanelProps {
  advisory: AdvisoryResult;
  viabilityScore?: number;
}

const recommendationConfig = {
  START: {
    label: "Recommended to Start",
    icon: CheckCircle2,
  },
  START_SMALL: {
    label: "Start Small",
    icon: TrendingUp,
  },
  REVIEW: {
    label: "Needs Review",
    icon: AlertTriangle,
  },
  AVOID: {
    label: "Not Recommended",
    icon: ShieldAlert,
  },
};

export default function AdvisoryPanel({
  advisory,
  viabilityScore,
}: AdvisoryPanelProps) {
  const config = recommendationConfig[advisory.recommendation];
  const RecommendationIcon = config.icon;

  return (
    <section className="mt-8 space-y-6">

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-3">
            <Brain size={28} />
          </div>

          <div>
            <p className="text-sm font-medium text-indigo-100">
              AI Business Advisory
            </p>

            <h2 className="text-2xl font-bold">
              {advisory.headline}
            </h2>
          </div>
        </div>

        <p className="mt-4 max-w-3xl text-indigo-50">
          {advisory.summary}
        </p>
      </div>

      {/* Recommendation + confidence */}
      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            AI Recommendation
          </p>

          <div className="mt-3 flex items-center gap-3">
            <RecommendationIcon
              size={28}
              className="text-indigo-600"
            />

            <span className="text-lg font-bold text-gray-900">
              {config.label}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            AI Confidence
          </p>

          <div className="mt-3">
            <div className="flex justify-between">
              <span className="text-2xl font-bold">
                {advisory.confidence}%
              </span>
              <span className="text-sm text-gray-500">
                confidence
              </span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-gray-200">
              <div
                className="h-2 rounded-full bg-indigo-600"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, advisory.confidence)
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {viabilityScore !== undefined && (
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Business Viability
            </p>

            <div className="mt-3 flex items-end gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {viabilityScore}
              </span>

              <span className="mb-1 text-gray-500">
                / 100
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Key Reasons */}
      <AdvisoryCard
        title="Why this recommendation?"
        icon={<Lightbulb size={22} />}
      >
        <ul className="space-y-3">
          {advisory.keyReasons.map((reason, index) => (
            <li
              key={index}
              className="flex gap-3 text-gray-700"
            >
              <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
                {index + 1}
              </span>

              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </AdvisoryCard>

      {/* Financial + Market */}
      <div className="grid gap-6 md:grid-cols-2">

        <AdvisoryCard
          title="Financial Advice"
          icon={<Wallet size={22} />}
        >
          <AdviceList items={advisory.financialAdvice} />
        </AdvisoryCard>

        <AdvisoryCard
          title="Local Market Advice"
          icon={<MapPin size={22} />}
        >
          <AdviceList items={advisory.marketAdvice} />
        </AdvisoryCard>

      </div>

      {/* Risk Mitigation */}
      <AdvisoryCard
        title="Risk Mitigation"
        icon={<ShieldAlert size={22} />}
      >
        <AdviceList items={advisory.riskMitigation} />
      </AdvisoryCard>

      {/* Action Plan */}
      <AdvisoryCard
        title="Recommended Action Plan"
        icon={<CheckCircle2 size={22} />}
      >
        <div className="space-y-3">

          {advisory.actionPlan.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 rounded-xl border bg-gray-50 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-bold text-white">
                {index + 1}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-800">
                  {step}
                </p>
              </div>

              <ArrowRight
                size={18}
                className="mt-1 text-gray-400"
              />
            </div>
          ))}

        </div>
      </AdvisoryCard>

      {/* Alternatives */}
      {advisory.alternativeIdeas.length > 0 && (
        <AdvisoryCard
          title="Alternative Business Ideas"
          icon={<Lightbulb size={22} />}
        >
          <div className="grid gap-3 md:grid-cols-2">
            {advisory.alternativeIdeas.map((idea, index) => (
              <div
                key={index}
                className="rounded-xl border bg-gray-50 p-4"
              >
                <p className="font-medium text-gray-800">
                  {idea}
                </p>
              </div>
            ))}
          </div>
        </AdvisoryCard>
      )}

      {/* Responsible AI note */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> This advisory is an AI-assisted
          decision-support tool. Financial eligibility, loan approval,
          and scheme availability should be verified with the relevant
          government authority or financial institution.
        </p>
      </div>

    </section>
  );
}


/* -----------------------------
   Reusable Components
------------------------------ */

function AdvisoryCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-600">
          {icon}
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>
      </div>

      {children}

    </div>
  );
}


function AdviceList({
  items,
}: {
  items: string[];
}) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No specific advice available.
      </p>
    );
  }

  return (
    <ul className="space-y-3">

      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-start gap-3"
        >
          <CheckCircle2
            size={19}
            className="mt-0.5 shrink-0 text-indigo-600"
          />

          <span className="text-gray-700">
            {item}
          </span>
        </li>
      ))}

    </ul>
  );
}