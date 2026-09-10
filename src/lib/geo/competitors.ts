import { searchNearbyBusinesses } from "./osm";

export interface Competitor {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
}

function calculateDistance(
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
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

export async function findCompetitors(
  latitude: number,
  longitude: number,
  businessType: string,
  radiusMeters = 5000
): Promise<Competitor[]> {
  const businesses =
    await searchNearbyBusinesses(
      latitude,
      longitude,
      radiusMeters
    );

  const searchText =
    businessType.toLowerCase();

  return businesses
    .filter((business) => {
      const text =
        `${business.name} ${business.type}`
          .toLowerCase();

      return (
        text.includes(searchText) ||
        searchText.includes(business.type.toLowerCase())
      );
    })
    .map((business) => ({
      ...business,
      distanceKm: Number(
        calculateDistance(
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