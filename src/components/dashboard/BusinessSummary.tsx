"use client";

import { useLanguage } from "@/components/i18n/LanguageProvider";

interface BusinessSummaryProps {
  business: {
    businessName: string;
    category: string;
    village: string;
    block: string;
    district: string;
    state: string;
  };
}

export default function BusinessSummary({
  business,
}: BusinessSummaryProps) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-gray-900">
        {t("businessSummary")}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">{t("businessName")}</p>
          <p className="font-medium text-slate-900">{business.businessName}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("category")}</p>
          <p className="font-medium text-slate-900">{business.category}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("village")}</p>
          <p className="font-medium text-slate-900">{business.village || t("notProvided")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("block")}</p>
          <p className="font-medium text-slate-900">{business.block || t("notProvided")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("district")}</p>
          <p className="font-medium text-slate-900">{business.district || t("notProvided")}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">{t("state")}</p>
          <p className="font-medium text-slate-900">{business.state || t("notProvided")}</p>
        </div>
      </div>
    </div>
  );
}