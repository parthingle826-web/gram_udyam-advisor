
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface RecommendationProps {
  decision:
    | "RECOMMENDED"
    | "REVIEW"
    | "NOT_RECOMMENDED"
    | string;

  recommendation: string;
}

export default function Recommendation({
  decision,
  recommendation,
}: RecommendationProps) {
  const isRecommended = decision === "RECOMMENDED";
  const isReview = decision === "REVIEW";

  const config = isRecommended
    ? {
        icon: CheckCircle2,
        title: "Business Recommended",
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-800",
        iconText: "text-green-600",
      }
    : isReview
    ? {
        icon: AlertTriangle,
        title: "Business Needs Review",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
        text: "text-yellow-800",
        iconText: "text-yellow-600",
      }
    : {
        icon: XCircle,
        title: "Business Not Recommended",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-800",
        iconText: "text-red-600",
      };

  const Icon = config.icon;

  return (
    <section
      className={`rounded-2xl border p-6 ${config.bg} ${config.border}`}
    >

      <div className="flex items-start gap-4">

        <Icon
          size={30}
          className={`mt-1 ${config.iconText}`}
        />

        <div>
          <p className="text-sm font-medium opacity-70">
            Overall Assessment
          </p>

          <h2
            className={`mt-1 text-2xl font-bold ${config.text}`}
          >
            {config.title}
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-700">
            {recommendation}
          </p>
        </div>

      </div>

    </section>
  );
}