"use client";

import Card from "@/components/common/Card";
import { Lightbulb, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface OpportunityCardProps {
  opportunities: string[];
}

export default function OpportunityCard({
  opportunities,
}: OpportunityCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      title={t("businessOpportunities")}
      description={t("businessOpportunitiesSub")}
    >
      {opportunities.length === 0 ? (
        <p className="text-sm text-gray-500">
          No specific opportunities identified yet.
        </p>
      ) : (
        <div className="space-y-3">
          {opportunities.map((opportunity, index) => (
            <div
              key={`${opportunity}-${index}`}
              className="flex gap-3 rounded-xl border border-gray-200 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600">
                <Lightbulb size={18} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {opportunity}
                </p>

                <div className="mt-2 flex items-center gap-1 text-xs text-indigo-600 font-medium">
                  {t("exploreOpportunity")}
                  <ArrowUpRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}