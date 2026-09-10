"use client";

import Card from "@/components/common/Card";
import {
  FileText,
  Target,
  Users,
  Wallet,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface BusinessPlanProps {
  businessName: string;
  category: string;
  village?: string;
  district?: string;
  projectCost: number;
  loanAmount: number;
  recommendation?: string;
  nextSteps?: string[];
}

export default function BusinessPlan({
  businessName,
  category,
  village,
  district,
  projectCost,
  loanAmount,
  recommendation,
  nextSteps = [],
}: BusinessPlanProps) {
  const { t } = useLanguage();
  const currency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card
      title={t("businessPlanOverview")}
      description={t("businessPlanSub")}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Info
          icon={<FileText size={18} />}
          title={t("businessName")}
          value={businessName}
          description={category}
        />

        <Info
          icon={<Target size={18} />}
          title={t("targetCustomers")}
          value={village || "Local market"}
          description={district || "Hyper-local area"}
        />

        <Info
          icon={<Wallet size={18} />}
          title={t("projectCost")}
          value={currency(projectCost)}
          description={`${t("loanAmount")}: ${currency(loanAmount)}`}
        />

        <Info
          icon={<Users size={18} />}
          title={t("operations")}
          value="Start locally"
          description="Validate demand before scaling."
        />
      </div>

      {recommendation && (
        <div className="mt-6 rounded-xl bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-900">
            {t("recommendation")}
          </p>
          <p className="mt-1 text-sm text-indigo-800">
            {recommendation}
          </p>
        </div>
      )}

      {nextSteps.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            {t("actionPlan")}
          </h3>

          <div className="mt-3 space-y-3">
            {nextSteps.map((step, index) => (
              <div key={`${step}-${index}`} className="flex gap-3">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-green-600"
                />
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function Info({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-sm">{title}</span>
      </div>

      <p className="mt-2 font-semibold text-gray-900">{value}</p>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}