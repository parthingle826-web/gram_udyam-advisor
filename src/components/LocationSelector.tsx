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
}

export default function LocationSelector({
  value,
  onChange,
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
        <label className="mb-2 block text-sm font-semibold text-slate-800">
          {t("businessLocation")}
        </label>

        <p className="text-xs leading-5 text-slate-500">
          {t("businessLocationDesc")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Village */}
        <div>
          <label
            htmlFor="village"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            {t("village")}
          </label>

          <div className="relative">
            <MapPin
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
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
              placeholder={t("villagePlaceholder")}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>
        </div>

        {/* Block */}
        <div>
          <label
            htmlFor="block"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            {t("block")}
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
            placeholder={t("blockPlaceholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* District */}
        <div>
          <label
            htmlFor="district"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            {t("district")}
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
            placeholder={t("districtPlaceholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>

        {/* State */}
        <div>
          <label
            htmlFor="state"
            className="mb-1.5 block text-xs font-medium text-slate-600"
          >
            {t("state")}
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
            placeholder={t("statePlaceholder")}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>
    </div>
  );
}