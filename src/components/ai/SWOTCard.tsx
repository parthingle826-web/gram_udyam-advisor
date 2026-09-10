"use client";

import Card from "@/components/common/Card";
import { useLanguage } from "@/components/i18n/LanguageProvider";

interface SWOTCardProps {
  strengths: string[];
  weaknesses?: string[];
  opportunities: string[];
  threats?: string[];
}

export default function SWOTCard({
  strengths,
  weaknesses = [],
  opportunities,
  threats = [],
}: SWOTCardProps) {
  const { t } = useLanguage();

  return (
    <Card
      title={t("swotAnalysis")}
      description="A quick strategic view of the proposed business."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SWOTSection
          title={t("strengths")}
          items={strengths}
          type="strength"
        />

        <SWOTSection
          title={t("weaknesses")}
          items={weaknesses}
          type="weakness"
        />

        <SWOTSection
          title={t("opportunitiesLabel")}
          items={opportunities}
          type="opportunity"
        />

        <SWOTSection
          title={t("threats")}
          items={threats}
          type="threat"
        />
      </div>
    </Card>
  );
}

function SWOTSection({
  title,
  items,
  type,
}: {
  title: string;
  items: string[];
  type: "strength" | "weakness" | "opportunity" | "threat";
}) {
  const styles = {
    strength: "border-green-200 bg-green-50",
    weakness: "border-orange-200 bg-orange-50",
    opportunity: "border-blue-200 bg-blue-50",
    threat: "border-red-200 bg-red-50",
  };

  const bullets = {
    strength: "text-green-700",
    weakness: "text-orange-700",
    opportunity: "text-blue-700",
    threat: "text-red-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${styles[type]}`}>
      <h3 className="font-semibold text-gray-900">{title}</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-gray-500">
          No items identified.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className={`text-sm ${bullets[type]}`}
            >
              • {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}