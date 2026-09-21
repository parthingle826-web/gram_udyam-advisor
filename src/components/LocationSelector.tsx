"use client";

import { MapPin } from "lucide-react";
import { useLanguage } from "./i18n/LanguageProvider";

export interface LocationValue {
  village: string;
  block: string;
  district: string;
  state: string;
}

interface LocationSelectorProps {
  value: LocationValue;
  onChange: (
    value: LocationValue
  ) => void;
  errors?: {
    village?: string;
    block?: string;
    district?: string;
    state?: string;
  };
  onBlur?: (field: string) => void;
}

export default function LocationSelector({
  value,
  onChange,
  errors = {},
  onBlur,
}: LocationSelectorProps) {
  const { t } = useLanguage();

  function update(
    field: keyof LocationValue,
    fieldValue: string
  ) {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-200">
          {t("businessLocation")}
        </label>

        <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
          {t("businessLocationDesc")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Village */}
        <div>
          <label
            htmlFor="village"
            className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            {t("village")} <span className="text-red-500 font-bold">*</span>
          </label>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />

            <input
              id="village"
              value={value.village}
              onChange={(event) =>
                update(
                  "village",
                  event.target.value
                )
              }
              onBlur={() => onBlur?.("village")}
              placeholder={t("villagePlaceholder")}
              className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 py-3 pl-9 pr-3 text-sm outline-none focus:ring-2 ${
                errors.village
                  ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                  : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
              }`}
            />
          </div>
          {errors.village && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.village}</p>
          )}
        </div>

        {/* Block */}
        <div>
          <label
            htmlFor="block"
            className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            {t("block")} <span className="text-red-500 font-bold">*</span>
          </label>

          <input
            id="block"
            value={value.block}
            onChange={(event) =>
              update(
                "block",
                event.target.value
              )
            }
            onBlur={() => onBlur?.("block")}
            placeholder={t("blockPlaceholder")}
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm outline-none focus:ring-2 ${
              errors.block
                ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
            }`}
          />
          {errors.block && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.block}</p>
          )}
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district"
            className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            {t("district")} <span className="text-red-500 font-bold">*</span>
          </label>

          <input
            id="district"
            value={value.district}
            onChange={(event) =>
              update(
                "district",
                event.target.value
              )
            }
            onBlur={() => onBlur?.("district")}
            placeholder={t("districtPlaceholder")}
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm outline-none focus:ring-2 ${
              errors.district
                ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
            }`}
          />
          {errors.district && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.district}</p>
          )}
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-1.5 block text-xs font-medium text-slate-600 dark:text-slate-300"
          >
            {t("state")} <span className="text-red-500 font-bold">*</span>
          </label>

          <input
            id="state"
            value={value.state}
            onChange={(event) =>
              update(
                "state",
                event.target.value
              )
            }
            onBlur={() => onBlur?.("state")}
            placeholder={t("statePlaceholder")}
            className={`w-full rounded-xl border bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 py-3 text-sm outline-none focus:ring-2 ${
              errors.state
                ? "border-red-400 focus:ring-red-100 dark:focus:ring-red-950/40"
                : "border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 focus:ring-slate-100 dark:focus:ring-slate-800"
            }`}
          />
          {errors.state && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors.state}</p>
          )}
        </div>
      </div>
    </div>
  );
}