"use client";

interface Supplier {
  id: string;
  name: string;
  type: string;
  distanceKm: number;
}

interface Props {
  suppliers?: Supplier[];
}

export default function SupplierList({
  suppliers = [],
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">
        Nearby Suppliers
      </h3>

      {suppliers.length === 0 ? (
        <p className="text-sm text-gray-500">
          No suitable suppliers found nearby.
        </p>
      ) : (
        <div className="space-y-3">
          {suppliers
            .slice(0, 8)
            .map((supplier) => (
              <div
                key={supplier.id}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <div>
                  <p className="font-medium">
                    {supplier.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {supplier.type}
                  </p>
                </div>

                <span className="text-sm">
                  {supplier.distanceKm} km
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}