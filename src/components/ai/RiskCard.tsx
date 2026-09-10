"use client";

import Card from "@/components/common/Card";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface RiskCardProps {
  risks: string[];
  mitigation?: string[];
}

export default function RiskCard({
  risks,
  mitigation = [],
}: RiskCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      title={t("businessRisksTitle")}
      description={t("businessRisksSub")}
    >
      {risks.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl bg-green-50 p-4">
          <ShieldCheck className="text-green-600" size={20} />
          <p className="text-sm text-green-800">
            {t("noMajorRisks")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {risks.map((risk, index) => (
            <div
              key={`${risk}-${index}`}
              className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4"
            >
              <AlertTriangle
                size={19}
                className="mt-0.5 shrink-0 text-red-600"
              />

              <p className="text-sm text-red-900">{risk}</p>
            </div>
          ))}
        </div>
      )}

      {mitigation.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-900">
            {t("riskMitigation")}
          </h3>

          <div className="mt-3 space-y-2">
            {mitigation.map((item, index) => (
              <p
                key={`${item}-${index}`}
                className="text-sm text-gray-700"
              >
                ✓ {item}
              </p>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}