import { searchNearbyBusinesses } from "./osm";

export interface Supplier {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLon =
    ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return (
    R *
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export async function findSuppliers(
  latitude: number,
  longitude: number,
  radiusMeters = 10000
): Promise<Supplier[]> {
  const businesses =
    await searchNearbyBusinesses(
      latitude,
      longitude,
      radiusMeters
    );

  const supplierTypes = [
    "wholesale",
    "hardware",
    "farm",
    "building_materials",
    "electronics",
    "food",
    "marketplace",
  ];

  return businesses
    .filter((business) => {
      const text =
        `${business.name} ${business.type}`
          .toLowerCase();

      return supplierTypes.some((type) =>
        text.includes(type)
      );
    })
    .map((business) => ({
      ...business,
      distanceKm: Number(
        distance(
          latitude,
          longitude,
          business.latitude,
          business.longitude
        ).toFixed(2)
      ),
    }))
    .sort(
      (a, b) =>
        a.distanceKm - b.distanceKm
    );
}