"use client";

interface Competitor {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
}

interface Props {
  competitors?: Competitor[];
}

export default function CompetitorList({
  competitors = [],
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Nearby Competitors
      </h3>

      {competitors.length === 0 ? (
        <p className="text-sm text-gray-500">
          No nearby competitors were found.
        </p>
      ) : (
        <div className="space-y-3">
          {competitors
            .slice(0, 8)
            .map((competitor) => (
              <div
                key={competitor.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">
                    {competitor.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {competitor.type}
                  </p>
                </div>

                <span className="text-sm font-medium">
                  {competitor.distanceKm} km
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}