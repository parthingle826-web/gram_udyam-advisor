"use client";

interface BusinessSummaryProps {
  business: {
    businessName: string;
    category: string;
    village: string;
    district: string;
    state: string;
  };
}

export default function BusinessSummary({
  business,
}: BusinessSummaryProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Business
      </p>

      <h3 className="mt-2 text-lg font-bold text-gray-900">
        {business.businessName}
      </h3>

      <p className="mt-1 text-sm text-indigo-600">
        {business.category}
      </p>

      <p className="mt-4 text-sm text-gray-600">
        {[
          business.village,
          business.district,
          business.state,
        ]
          .filter(Boolean)
          .join(", ") || "Location not provided"}
      </p>
    </div>
  );
}