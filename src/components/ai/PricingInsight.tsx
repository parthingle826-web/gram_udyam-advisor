"use client";

import Card from "@/components/common/Card";
import { IndianRupee, Info } from "lucide-react";

interface PricingInsightProps {
  businessName?: string;
  suggestedPrice?: number;
  localPurchasingPower?: string;
  pricingAdvice?: string[];
}

export default function PricingInsight({
  businessName = "Your Business",
  suggestedPrice,
  localPurchasingPower = "Moderate",
  pricingAdvice = [],
}: PricingInsightProps) {
  const currency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Card
      title="Pricing Insight"
      description={`Pricing guidance for ${businessName}.`}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <IndianRupee size={18} />
            <span className="text-sm">Suggested Price</span>
          </div>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {suggestedPrice !== undefined
              ? currency(suggestedPrice)
              : "Not available"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Indicative estimate, not a fixed market price.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-gray-500">
            <Info size={18} />
            <span className="text-sm">Local Purchasing Power</span>
          </div>

          <p className="mt-2 font-semibold text-gray-900">
            {localPurchasingPower}
          </p>
        </div>
      </div>

      {pricingAdvice.length > 0 && (
        <div className="mt-5 space-y-2">
          {pricingAdvice.map((advice, index) => (
            <p
              key={`${advice}-${index}`}
              className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700"
            >
              • {advice}
            </p>
          ))}
        </div>
      )}
    </Card>
  );
}