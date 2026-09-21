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
  User,
  AlertCircle,
} from "lucide-react";

import BusinessSelector from "./BusinessSelector";
import CapitalInput from "./CapitalInput";
import LocationSelector, {
  LocationValue,
} from "./LocationSelector";
import { useLanguage } from "./i18n/LanguageProvider";
import {
  MIN_APPLICANT_AGE,
  DEFAULT_MAX_APPLICANT_AGE,
} from "@/lib/utils/constants";
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

  const [fullName, setFullName] = useState(
    initialData?.fullName ?? ""
  );

  const [age, setAge] = useState<number | "">(
    initialData?.age ?? ""
  );

  const [address, setAddress] = useState(
    initialData?.address ?? ""
  );

  const [mobileNumber, setMobileNumber] = useState(
    initialData?.mobileNumber ?? ""
  );

  const [businessName, setBusinessName] = useState(
    initialData?.businessName ?? ""
  );

  const [category, setCategory] = useState(
    initialData?.category ?? ""
  );

  const [location, setLocation] = useState<LocationValue>({
    village: initialData?.village ?? "",
    block: initialData?.block ?? "",
    district: initialData?.district ?? "",
    state: initialData?.state ?? "",
  });

  const [marginCapital, setMarginCapital] = useState<number | "">(
    initialData?.marginCapital ?? ""
  );

  const [marketDemand, setMarketDemand] = useState(
    initialData?.marketDemand ?? 50
  );

  const [competition, setCompetition] = useState(
    initialData?.competition ?? 50
  );

  const [budgetFit, setBudgetFit] = useState(
    initialData?.budgetFit ?? 50
  );

  const [localResources, setLocalResources] = useState(
    initialData?.localResources ?? 50
  );

  const [seasonalRisk, setSeasonalRisk] = useState(
    initialData?.seasonalRisk ?? 50
  );

  const [profitPotential, setProfitPotential] = useState(
    initialData?.profitPotential ?? 50
  );

  const [monthlyRevenue, setMonthlyRevenue] = useState<number | "">(
    initialData?.monthlyRevenue ?? ""
  );

  const [operatingExpenses, setOperatingExpenses] = useState<number | "">(
    initialData?.operatingExpenses ?? ""
  );

  const [experienceYears, setExperienceYears] = useState<number>(
    initialData?.experienceYears ?? 1
  );

  const [hasLandOrShop, setHasLandOrShop] = useState<boolean>(
    initialData?.hasLandOrShop ?? true
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const isMinor = typeof age === "number" && age < MIN_APPLICANT_AGE;
  const isSenior = typeof age === "number" && age > DEFAULT_MAX_APPLICANT_AGE;

  function validateField(field: string, val?: any): string | undefined {
    if (field === "fullName") {
      const v = val !== undefined ? val : fullName;
      if (!String(v).trim()) return t("errFullNameRequired");
    }
    if (field === "age") {
      const v = val !== undefined ? val : age;
      if (v === "" || v === undefined) return t("errAgeRequired");
      const num = Number(v);
      if (isNaN(num) || num < 1 || num > 120) return t("errAgeInvalid");
      if (num < MIN_APPLICANT_AGE) return t("errAgeUnder18");
    }
    if (field === "address") {
      const v = val !== undefined ? val : address;
      if (!String(v).trim()) return t("errAddressRequired");
    }
    if (field === "mobileNumber") {
      const v = val !== undefined ? val : mobileNumber;
      if (!String(v).trim()) return t("errMobileRequired");
      if (!/^[6-9]\d{9}$/.test(String(v).trim())) return t("errMobileInvalid");
    }
    if (field === "businessName") {
      const v = val !== undefined ? val : businessName;
      if (!String(v).trim()) return t("errBusinessNameRequired");
    }
    if (field === "category") {
      const v = val !== undefined ? val : category;
      if (!v) return t("errCategoryRequired");
    }
    if (field === "marginCapital") {
      const v = val !== undefined ? val : marginCapital;
      if (v === "" || Number(v) <= 0) return t("errMarginRequired");
    }
    if (field === "village") {
      const v = val !== undefined ? val : location.village;
      if (!String(v).trim()) return t("errVillageRequired");
    }
    if (field === "block") {
      const v = val !== undefined ? val : location.block;
      if (!String(v).trim()) return t("errBlockRequired");
    }
    if (field === "district") {
      const v = val !== undefined ? val : location.district;
      if (!String(v).trim()) return t("errDistrictRequired");
    }
    if (field === "state") {
      const v = val !== undefined ? val : location.state;
      if (!String(v).trim()) return t("errStateRequired");
    }
    return undefined;
  }

  function handleBlur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field);
    setErrors((prev) => {
      const copy = { ...prev };
      if (err) {
        copy[field] = err;
      } else {
        delete copy[field];
      }
      return copy;
    });
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    const fields = [
      "fullName",
      "age",
      "address",
      "mobileNumber",
      "businessName",
      "category",
      "marginCapital",
      "village",
      "block",
      "district",
      "state",
    ];

    for (const f of fields) {
      const err = validateField(f);
      if (err) nextErrors[f] = err;
    }

    setErrors(nextErrors);
    setTouched(
      fields.reduce((acc, f) => ({ ...acc, [f]: true }), {})
    );

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (isMinor) {
      return;
    }

    const assessment: BusinessAssessment = {
      fullName: fullName.trim(),
      age: Number(age),
      mobileNumber: mobileNumber.trim(),
      address: address.trim(),

      businessName: businessName.trim(),
      category,

      village: location.village.trim(),
      block: location.block.trim(),
      district: location.district.trim(),
      state: location.state.trim(),

      marginCapital: Number(marginCapital),

      marketDemand,
      competition,
      budgetFit,
      localResources,
      seasonalRisk,
      profitPotential,

      experienceYears,
      hasLandOrShop,

      monthlyRevenue:
        monthlyRevenue === "" ? undefined : Number(monthlyRevenue),

      operatingExpenses:
        operatingExpenses === "" ? undefined : Number(operatingExpenses),
    };

    try {
      setSubmitting(true);

      if (onSubmit) {
        await onSubmit(assessment);
      } else {
        const response = await fetch("/api/assessment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assessment,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || t("somethingWentWrong"));
        }

        sessionStorage.setItem(
          "gram-udyam-assessment",
          JSON.stringify(assessment)
        );

        sessionStorage.setItem("assessment", JSON.stringify(assessment));

        sessionStorage.setItem(
          "gram-udyam-analysis",
          JSON.stringify(data.result)
        );

        const params = new URLSearchParams();
        params.set("fullName", assessment.fullName || "");
        params.set("age", String(assessment.age || ""));
        params.set("mobileNumber", assessment.mobileNumber || "");
        params.set("address", assessment.address || "");
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
      console.error("Assessment submission failed:", error);

      setErrors({
        submit:
          error instanceof Error ? error.message : t("somethingWentWrong"),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Applicant Personal Information */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-slate-700 dark:text-slate-300">
            <User size={21} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("personalInformation")}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t("personalInfoDesc")}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label
              htmlFor="full-name"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("applicantFullName")}{" "}
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="full-name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (touched.fullName) {
                  const err = validateField("fullName", e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: err || "" }));
                }
              }}
              onBlur={() => handleBlur("fullName")}
              placeholder={t("applicantFullNamePlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.fullName
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.fullName}</p>
            )}
          </div>

          {/* Age */}
          <div>
            <label
              htmlFor="applicant-age"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("applicantAge")}{" "}
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="applicant-age"
              type="number"
              min={1}
              max={120}
              value={age}
              onChange={(e) => {
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setAge(val);
                if (touched.age) {
                  const err = validateField("age", val);
                  setErrors((prev) => ({ ...prev, age: err || "" }));
                }
              }}
              onBlur={() => handleBlur("age")}
              placeholder={t("applicantAgePlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.age
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.age}</p>
            )}

            {/* Age > 60 Senior Notice */}
            {isSenior && (
              <div className="mt-2.5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-semibold flex items-center gap-1.5 mb-1 text-amber-800 dark:text-amber-300">
                  <AlertCircle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  Senior Applicant Guidance Note
                </p>
                <p className="leading-relaxed">{t("seniorNoticeBanner")}</p>
              </div>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="applicant-mobile"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("applicantMobile")}{" "}
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="applicant-mobile"
              type="tel"
              maxLength={10}
              value={mobileNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "");
                setMobileNumber(digits);
                if (touched.mobileNumber) {
                  const err = validateField("mobileNumber", digits);
                  setErrors((prev) => ({ ...prev, mobileNumber: err || "" }));
                }
              }}
              onBlur={() => handleBlur("mobileNumber")}
              placeholder={t("applicantMobilePlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.mobileNumber
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.mobileNumber}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="applicant-address"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("applicantAddress")}{" "}
              <span className="text-red-500 font-bold">*</span>
            </label>
            <input
              id="applicant-address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (touched.address) {
                  const err = validateField("address", e.target.value);
                  setErrors((prev) => ({ ...prev, address: err || "" }));
                }
              }}
              onBlur={() => handleBlur("address")}
              placeholder={t("applicantAddressPlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.address
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.address}</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Business Information */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t("businessInformation")}
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("businessInfoDesc")}
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <label
              htmlFor="business-name"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("businessName")}{" "}
              <span className="text-red-500 font-bold">*</span>
            </label>

            <input
              id="business-name"
              value={businessName}
              onChange={(event) => {
                setBusinessName(event.target.value);
                if (touched.businessName) {
                  const err = validateField("businessName", event.target.value);
                  setErrors((prev) => ({ ...prev, businessName: err || "" }));
                }
              }}
              onBlur={() => handleBlur("businessName")}
              placeholder={t("businessNamePlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:ring-2 ${
                errors.businessName
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />

            {errors.businessName && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.businessName}
              </p>
            )}
          </div>

          <BusinessSelector
            value={category}
            onChange={(cat) => {
              setCategory(cat);
              if (touched.category) {
                const err = validateField("category", cat);
                setErrors((prev) => ({ ...prev, category: err || "" }));
              }
            }}
            error={errors.category}
          />

          <LocationSelector
            value={location}
            onChange={(loc) => {
              setLocation(loc);
              setErrors((prev) => {
                const next = { ...prev };
                if (loc.village.trim()) delete next.village;
                if (loc.block.trim()) delete next.block;
                if (loc.district.trim()) delete next.district;
                if (loc.state.trim()) delete next.state;
                return next;
              });
            }}
            errors={{
              village: errors.village,
              block: errors.block,
              district: errors.district,
              state: errors.state,
            }}
            onBlur={handleBlur}
          />
        </div>
      </section>

     
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 p-3 text-slate-700 dark:text-slate-300">
            <Wallet size={21} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("financialInformation")}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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

      
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t("businessFactorsTitle")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
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

      
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t("optionalEstimatesTitle")}
          </h2>

          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {t("optionalEstimatesDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <NumberInput
            label={`${t("monthlyRevenue")} (${t("optionalBadge")})`}
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
            placeholder={t("revenuePlaceholder")}
          />

          <NumberInput
            label={`${t("operatingExpenses")} (${t("optionalBadge")})`}
            value={operatingExpenses}
            onChange={setOperatingExpenses}
            placeholder={t("expensesPlaceholder")}
          />
        </div>
      </section>

      {/* Founder Profile & Readiness */}
      <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t("founderProfileTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {t("founderProfileDesc")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="experience-years"
              className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200"
            >
              {t("experienceYearsLabel")}{" "}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({t("optionalBadge")})
              </span>
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
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-800"
            />
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {t("experienceYearsHelp")}
            </p>
          </div>

          <div className="flex flex-col justify-start">
            <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
              {t("premisesAvailabilityLabel")}{" "}
              <span className="text-xs text-slate-400 font-normal ml-1">
                ({t("optionalBadge")})
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
              <input
                type="checkbox"
                checked={hasLandOrShop}
                onChange={(e) => setHasLandOrShop(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 focus:ring-slate-500"
              />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {t("hasLandCheckboxText")}
              </span>
            </label>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              {t("hasLandHelp")}
            </p>
          </div>
        </div>
      </section>

      {/* Submission Section */}
      <section>
        {isMinor && (
          <div className="mb-4 rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-800 dark:text-red-300 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-900 dark:text-red-200 mb-1">
                  Age Eligibility Gate: Under 18 Years
                </p>
                <p className="text-xs leading-relaxed text-red-800 dark:text-red-300">
                  {t("errAgeUnder18")}
                </p>
              </div>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-4 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 p-4 text-sm text-red-700 dark:text-red-300">
            {errors.submit}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || isMinor}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
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

        <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
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
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400">
            {icon}
          </span>

          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {label}
          </span>
        </div>

        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
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
        className="w-full accent-emerald-600 dark:accent-emerald-500"
      />

      <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
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
      <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
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
        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 py-3 text-sm outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-2 focus:ring-slate-100 dark:focus:ring-slate-800"
      />
    </div>
  );
}