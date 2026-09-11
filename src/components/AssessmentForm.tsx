"use client";

import { useState } from "react";
import {
  ArrowRight,
  Loader2,
  TrendingUp,
  Users,
  Wallet,
  Leaf,
  CloudSun,
} from "lucide-react";

import BusinessSelector from "./BusinessSelector";
import CapitalInput from "./CapitalInput";
import LocationSelector, {
  LocationValue,
} from "./LocationSelector";
import { useLanguage } from "./i18n/LanguageProvider";

import type { BusinessAssessment } from "@/types/business";

interface AssessmentFormProps {
  initialData?: Partial<BusinessAssessment>;

  onSubmit?: (
    assessment: BusinessAssessment
  ) => Promise<void> | void;
}

const defaultLocation: LocationValue = {
  village: "",
  block: "",
  district: "",
  state: "",
};

export default function AssessmentForm({
  initialData,
  onSubmit,
}: AssessmentFormProps) {
  const { t } = useLanguage();

  const [businessName, setBusinessName] =
    useState(
      initialData?.businessName ?? ""
    );

  const [category, setCategory] =
    useState(
      initialData?.category ?? ""
    );

  const [location, setLocation] =
    useState<LocationValue>({
      village:
        initialData?.village ?? "",
      block:
        initialData?.block ?? "",
      district:
        initialData?.district ?? "",
      state:
        initialData?.state ?? "",
    });

  const [marginCapital, setMarginCapital] =
    useState<number | "">(
      initialData?.marginCapital ?? ""
    );

  const [marketDemand, setMarketDemand] =
    useState(
      initialData?.marketDemand ?? 50
    );

  const [competition, setCompetition] =
    useState(
      initialData?.competition ?? 50
    );

  const [budgetFit, setBudgetFit] =
    useState(
      initialData?.budgetFit ?? 50
    );

  const [localResources, setLocalResources] =
    useState(
      initialData?.localResources ?? 50
    );

  const [seasonalRisk, setSeasonalRisk] =
    useState(
      initialData?.seasonalRisk ?? 50
    );

  const [profitPotential, setProfitPotential] =
    useState(
      initialData?.profitPotential ?? 50
    );

  const [monthlyRevenue, setMonthlyRevenue] =
    useState<number | "">(
      initialData?.monthlyRevenue ?? ""
    );

  const [operatingExpenses, setOperatingExpenses] =
    useState<number | "">(
      initialData?.operatingExpenses ?? ""
    );

  const [experienceYears, setExperienceYears] =
    useState<number>(
      initialData?.experienceYears ?? 1
    );

  const [hasLandOrShop, setHasLandOrShop] =
    useState<boolean>(
      initialData?.hasLandOrShop ?? true
    );

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [submitting, setSubmitting] =
    useState(false);

  function validate() {
    const nextErrors: Record<
      string,
      string
    > = {};

    if (!businessName.trim()) {
      nextErrors.businessName =
        t("errBusinessNameRequired");
    }

    if (!category) {
      nextErrors.category =
        t("errCategoryRequired");
    }

    if (
      marginCapital === "" ||
      marginCapital <= 0
    ) {
      nextErrors.marginCapital =
        t("errMarginRequired");
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const assessment: BusinessAssessment = {
      businessName: businessName.trim(),
      category,

      village: location.village.trim(),
      block: location.block.trim(),
      district: location.district.trim(),
      state: location.state.trim(),

      marginCapital:
        Number(marginCapital),

      marketDemand,
      competition,
      budgetFit,
      localResources,
      seasonalRisk,
      profitPotential,

      experienceYears,
      hasLandOrShop,

      monthlyRevenue:
        monthlyRevenue === ""
          ? undefined
          : Number(monthlyRevenue),

      operatingExpenses:
        operatingExpenses === ""
          ? undefined
          : Number(operatingExpenses),
    };

    try {
      setSubmitting(true);

      if (onSubmit) {
        await onSubmit(assessment);
      } else {
        const response = await fetch(
          "/api/assessment",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              assessment,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ||
              t("somethingWentWrong")
          );
        }

        sessionStorage.setItem(
          "gram-udyam-assessment",
          JSON.stringify(assessment)
        );

        sessionStorage.setItem(
          "assessment",
          JSON.stringify(assessment)
        );

        sessionStorage.setItem(
          "gram-udyam-analysis",
          JSON.stringify(data.result)
        );

        const params = new URLSearchParams();
        params.set("businessName", assessment.businessName);
        params.set("category", assessment.category);
        params.set("village", assessment.village);
        params.set("block", assessment.block);
        params.set("district", assessment.district);
        params.set("state", assessment.state);
        params.set("marginCapital", String(assessment.marginCapital));
        params.set("marketDemand", String(assessment.marketDemand));
        params.set("competition", String(assessment.competition));
        params.set("budgetFit", String(assessment.budgetFit));
        params.set("localResources", String(assessment.localResources));
        params.set("seasonalRisk", String(assessment.seasonalRisk));
        params.set("profitPotential", String(assessment.profitPotential));
        params.set("experienceYears", String(experienceYears));
        params.set("hasLandOrShop", String(hasLandOrShop));
        if (assessment.monthlyRevenue) {
          params.set("monthlyRevenue", String(assessment.monthlyRevenue));
        }
        if (assessment.operatingExpenses) {
          params.set("operatingExpenses", String(assessment.operatingExpenses));
        }

        window.location.href = `/dashboard?${params.toString()}`;
      }
    } catch (error) {
      console.error(
        "Assessment submission failed:",
        error
      );

      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : t("somethingWentWrong"),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8"
    >
    
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {t("businessInformation")}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {t("businessInfoDesc")}
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <label
              htmlFor="business-name"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {t("businessName")}
            </label>

            <input
              id="business-name"
              value={businessName}
              onChange={(event) =>
                setBusinessName(
                  event.target.value
                )
              }
              placeholder={t("businessNamePlaceholder")}
              className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.businessName
                  ? "border-red-400 focus:ring-red-100"
                  : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
              }`}
            />

            {errors.businessName && (
              <p className="mt-1 text-xs text-red-600">
                {errors.businessName}
              </p>
            )}
          </div>

          <BusinessSelector
            value={category}
            onChange={setCategory}
            error={errors.category}
          />

          <LocationSelector
            value={location}
            onChange={setLocation}
          />
        </div>
      </section>

     
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-slate-100 p-3">
            <Wallet size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {t("financialInformation")}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {t("marginCapitalDesc")}
            </p>
          </div>
        </div>

        <CapitalInput
          value={marginCapital}
          onChange={setMarginCapital}
          error={errors.marginCapital}
        />
      </section>

      
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {t("businessFactorsTitle")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {t("businessFactorsDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ScoreInput
            label={t("marketDemand")}
            value={marketDemand}
            onChange={setMarketDemand}
            icon={<TrendingUp size={18} />}
            help={t("helpMarketDemand")}
          />

          <ScoreInput
            label={t("competition")}
            value={competition}
            onChange={setCompetition}
            icon={<Users size={18} />}
            help={t("helpCompetition")}
          />

          <ScoreInput
            label={t("budgetFit")}
            value={budgetFit}
            onChange={setBudgetFit}
            icon={<Wallet size={18} />}
            help={t("helpBudgetFit")}
          />

          <ScoreInput
            label={t("localResources")}
            value={localResources}
            onChange={setLocalResources}
            icon={<Leaf size={18} />}
            help={t("helpLocalResources")}
          />

          <ScoreInput
            label={t("seasonalRisk")}
            value={seasonalRisk}
            onChange={setSeasonalRisk}
            icon={<CloudSun size={18} />}
            help={t("helpSeasonalRisk")}
          />

          <ScoreInput
            label={t("profitPotential")}
            value={profitPotential}
            onChange={setProfitPotential}
            icon={<TrendingUp size={18} />}
            help={t("helpProfitPotential")}
          />
        </div>
      </section>

      
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {t("optionalEstimatesTitle")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500">
            {t("optionalEstimatesDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NumberInput
            label={t("monthlyRevenue")}
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
            placeholder={t("revenuePlaceholder")}
          />

          <NumberInput
            label={t("operatingExpenses")}
            value={operatingExpenses}
            onChange={setOperatingExpenses}
            placeholder={t("expensesPlaceholder")}
          />
        </div>
      </section>

    
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">
            {t("founderProfileTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {t("founderProfileDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="experience-years"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              {t("experienceYearsLabel")}
            </label>
            <input
              id="experience-years"
              type="number"
              min="0"
              max="40"
              value={experienceYears}
              onChange={(e) =>
                setExperienceYears(
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              placeholder="e.g. 2"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
            <p className="mt-1.5 text-xs text-slate-500">
              {t("experienceYearsHelp")}
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              {t("premisesAvailabilityLabel")}
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 cursor-pointer hover:bg-slate-50 transition">
              <input
                type="checkbox"
                checked={hasLandOrShop}
                onChange={(e) => setHasLandOrShop(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <span className="text-sm font-medium text-slate-800">
                {t("hasLandCheckboxText")}
              </span>
            </label>
            <p className="mt-1.5 text-xs text-slate-500">
              {t("hasLandHelp")}
            </p>
          </div>
        </div>
      </section>

   
      <section>
        {errors.submit && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2
                size={18}
                className="animate-spin"
              />
              {t("analyzingBusiness")}
            </>
          ) : (
            <>
              {t("analyzeMyBusiness")}
              <ArrowRight size={18} />
            </>
          )}
        </button>

        <p className="mt-3 text-center text-xs text-slate-500">
          {t("formDisclaimer")}
        </p>
      </section>
    </form>
  );
}

function ScoreInput({
  label,
  value,
  onChange,
  icon,
  help,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  help: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">
            {icon}
          </span>

          <span className="text-sm font-semibold text-slate-800">
            {label}
          </span>
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
          {value}/100
        </span>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) =>
          onChange(
            Number(event.target.value)
          )
        }
        className="w-full"
      />

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {help}
      </p>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        placeholder={placeholder}
        onChange={(event) => {
          const raw = event.target.value;

          onChange(
            raw === ""
              ? ""
              : Number(raw)
          );
        }}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
      />
    </div>
  );
}