"use client";

import { useState } from "react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface AIAdvisorProps {
  assessment: any;
  result: any;
  market?: any;
  language?: "en" | "hi" | "mr";
}

interface Advisory {
  headline?: string;
  summary?: string;
  recommendation?: string;
  confidence?: number;

  keyReasons?: string[];

  financialAdvice?: string[];
  marketAdvice?: string[];
  riskMitigation?: string[];
  actionPlan?: string[];
  alternativeIdeas?: string[];

  swot?: {
    strengths?: string[];
    weaknesses?: string[];
    opportunities?: string[];
    threats?: string[];
  };

  pricingInsight?: string | {
    strategy?: string;
    factors?: string[];
  };

  businessPlan?: string | {
    targetCustomers?: string;
    productsOrServices?: string;
    marketingStrategy?: string;
    operations?: string;
  };
}

export default function AIAdvisor({
  assessment,
  result,
  market,
  language = "en",
}: AIAdvisorProps) {
  const { t } = useLanguage();

  const [advisory, setAdvisory] =
    useState<Advisory | null>(null);

  const [provider, setProvider] =
    useState<string>("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const generateAdvice = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/ai",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            assessment,

            finance:
              result?.finance,

            market,

            language,
          }),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.error ||
            t("somethingWentWrong")
        );
      }

      setAdvisory(data.advisory);
      if (data.provider) {
        setProvider(data.provider);
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : t("somethingWentWrong")
      );
    } finally {
      setLoading(false);
    }
  };

  const formatRecommendation = (
    recommendation?: string
  ) => {
    if (!recommendation) {
      return t("review");
    }

    const norm = recommendation.toUpperCase();
    if (norm === "START") return t("start");
    if (norm === "START_SMALL") return t("startSmall");
    if (norm === "REVIEW") return t("review");
    if (norm === "AVOID") return t("avoid");

    return recommendation
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  };

  const recommendationClass = (
    recommendation?: string
  ) => {
    switch (recommendation) {
      case "START":
        return "bg-green-100 text-green-800 border-green-200";

      case "START_SMALL":
        return "bg-blue-100 text-blue-800 border-blue-200";

      case "REVIEW":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";

      case "AVOID":
        return "bg-red-100 text-red-800 border-red-200";

      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const ListSection = ({
    title,
    items,
  }: {
    title: string;
    items?: string[];
  }) => {
    if (
      !items ||
      items.length === 0
    ) {
      return null;
    }

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <ul className="space-y-2">
          {items.map(
            (item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm leading-6 text-gray-700"
              >
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                <span>
                  {item}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    );
  };

  const renderBusinessPlan =
    () => {
      if (!advisory?.businessPlan) {
        return null;
      }

      if (
        typeof advisory.businessPlan ===
        "string"
      ) {
        return (
          <div className="whitespace-pre-line text-sm leading-7 text-gray-700">
            {advisory.businessPlan}
          </div>
        );
      }

      const plan =
        advisory.businessPlan;

      return (
        <div className="grid gap-4 md:grid-cols-2">
          <PlanItem
            title={t("targetCustomers")}
            value={
              plan.targetCustomers
            }
          />

          <PlanItem
            title={t("productsServices")}
            value={
              plan.productsOrServices
            }
          />

          <PlanItem
            title={t("marketingStrategy")}
            value={
              plan.marketingStrategy
            }
          />

          <PlanItem
            title={t("operations")}
            value={
              plan.operations
            }
          />
        </div>
      );
    };

  const renderPricing =
    () => {
      if (
        !advisory?.pricingInsight
      ) {
        return null;
      }

      if (
        typeof advisory.pricingInsight ===
        "string"
      ) {
        return (
          <p className="text-sm leading-6 text-gray-700">
            {advisory.pricingInsight}
          </p>
        );
      }

      return (
        <div>
          {advisory.pricingInsight
            .strategy && (
            <p className="text-sm leading-6 text-gray-700">
              <strong>
                {t("pricingInsight")}:
              </strong>{" "}
              {
                advisory
                  .pricingInsight
                  .strategy
              }
            </p>
          )}

          {advisory.pricingInsight
            .factors
            ?.length ? (
            <ul className="mt-3 space-y-2">
              {advisory.pricingInsight.factors.map(
                (factor, index) => (
                  <li
                    key={index}
                    className="text-sm text-gray-700"
                  >
                    • {factor}
                  </li>
                )
              )}
            </ul>
          ) : null}
        </div>
      );
    };

  return (
    <section className="mt-8 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-2xl">
                🤖
              </span>

              <h2 className="text-2xl font-bold text-gray-900">
                {t("aiAdvisor")}
              </h2>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-gray-600">
              {t("aiAdvisorSubtitle")}
            </p>
          </div>

          <button
            onClick={
              generateAdvice
            }
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? t("aiAnalyzingBtn")
              : t("generateAiAdvice")}
          </button>
        </div>
      </div>

      {/* Market information */}
      {market && (
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
          <h3 className="font-semibold text-indigo-900">
            📍 {t("aiMarketInputHeading")}
          </h3>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <MarketMetric
              label={t("nearbyBusinesses")}
              value={
                market.totalBusinesses ??
                0
              }
            />

            <MarketMetric
              label={t("competitors")}
              value={
                market.competitorCount ??
                0
              }
            />

            <MarketMetric
              label={t("competition")}
              value={
                market.competitionLevel ||
                "UNKNOWN"
              }
            />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <strong>
            AI Error:
          </strong>{" "}
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <h3 className="font-semibold text-gray-900">
            {t("aiAnalyzingHeading")}
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            {t("aiAnalyzingSub")}
          </p>
        </div>
      )}

      {/* Result */}
      {advisory &&
        !loading && (
          <div className="space-y-6">
            {/* Main Recommendation */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="text-sm font-medium text-blue-600">
                      {t("aiRecommendationHeading")}
                    </p>
                    {provider && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                        {provider === "watsonx"
                          ? "⚡ IBM watsonx Granite"
                          : provider === "openai"
                          ? "⚡ OpenAI"
                          : provider === "gemini"
                          ? "⚡ Google Gemini"
                          : "⚡ Gram Udyam Engine"}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900">
                    {advisory.headline ||
                      t("analysisComplete")}
                  </h3>

                  {advisory.summary && (
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-600">
                      {advisory.summary}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end">
                  <span
                    className={`rounded-full border px-4 py-2 text-sm font-semibold ${recommendationClass(
                      advisory.recommendation
                    )}`}
                  >
                    {formatRecommendation(
                      advisory.recommendation
                    )}
                  </span>

                  {typeof advisory.confidence ===
                    "number" && (
                    <span className="text-sm text-gray-500">
                      {t("confidence")}:{" "}
                      <strong className="text-gray-800">
                        {
                          advisory.confidence
                        }
                        %
                      </strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reasons */}
            <ListSection
              title={t("whyAiRecommends")}
              items={
                advisory.keyReasons
              }
            />

            {/* Financial */}
            <ListSection
              title={`💰 ${t("financialAdvice")}`}
              items={
                advisory.financialAdvice
              }
            />

            {/* Market */}
            <ListSection
              title={`📍 ${t("marketAdvice")}`}
              items={
                advisory.marketAdvice
              }
            />

            {/* Risk */}
            <ListSection
              title={`⚠️ ${t("riskMitigation")}`}
              items={
                advisory.riskMitigation
              }
            />

            {/* Action Plan */}
            <ListSection
              title={`🚀 ${t("recommendedActionPlan")}`}
              items={
                advisory.actionPlan
              }
            />

            {/* Alternatives */}
            <ListSection
              title={`💡 ${t("alternativeBusinessIdeas")}`}
              items={
                advisory.alternativeIdeas
              }
            />

            {/* SWOT */}
            {advisory.swot && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-5 text-xl font-bold text-gray-900">
                  {t("aiSwotTitle")}
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <SwotBox
                    title={t("strengths")}
                    items={
                      advisory.swot
                        .strengths
                    }
                    className="border-green-200 bg-green-50"
                    titleClass="text-green-800"
                  />

                  <SwotBox
                    title={t("weaknesses")}
                    items={
                      advisory.swot
                        .weaknesses
                    }
                    className="border-yellow-200 bg-yellow-50"
                    titleClass="text-yellow-800"
                  />

                  <SwotBox
                    title={t("opportunitiesLabel")}
                    items={
                      advisory.swot
                        .opportunities
                    }
                    className="border-blue-200 bg-blue-50"
                    titleClass="text-blue-800"
                  />

                  <SwotBox
                    title={t("threats")}
                    items={
                      advisory.swot
                        .threats
                    }
                    className="border-red-200 bg-red-50"
                    titleClass="text-red-800"
                  />
                </div>
              </div>
            )}

            {/* Pricing */}
            {advisory.pricingInsight && (
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6">
                <h3 className="mb-3 text-xl font-bold text-purple-900">
                  💵 {t("pricingInsight")}
                </h3>

                {renderPricing()}
              </div>
            )}

            {/* Business Plan */}
            {advisory.businessPlan && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6">
                <h3 className="mb-5 text-xl font-bold text-indigo-900">
                  📋 {t("businessPlan")}
                </h3>

                {renderBusinessPlan()}
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs leading-5 text-gray-500">
                {t("aiDisclaimer")}
              </p>
            </div>
          </div>
        )}
    </section>
  );
}

function MarketMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl bg-white p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function PlanItem({
  title,
  value,
}: {
  title: string;
  value?: string;
}) {
  if (!value) return null;

  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-4">
      <h4 className="font-semibold text-indigo-900">
        {title}
      </h4>

      <p className="mt-2 text-sm leading-6 text-gray-700">
        {value}
      </p>
    </div>
  );
}

function SwotBox({
  title,
  items,
  className,
  titleClass,
}: {
  title: string;
  items?: string[];
  className: string;
  titleClass: string;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${className}`}
    >
      <h4
        className={`mb-3 font-semibold ${titleClass}`}
      >
        {title}
      </h4>

      <ul className="space-y-2">
        {(items || []).map(
          (item, index) => (
            <li
              key={index}
              className="text-sm leading-6 text-gray-700"
            >
              • {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}