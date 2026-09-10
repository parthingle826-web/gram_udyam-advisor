import { searchNearbyBusinesses } from "./osm";

export interface LocalMarket {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export async function findLocalMarkets(
  latitude: number,
  longitude: number,
  radiusMeters = 10000
): Promise<LocalMarket[]> {
  const businesses =
    await searchNearbyBusinesses(
      latitude,
      longitude,
      radiusMeters
    );

  const marketKeywords = [
    "market",
    "supermarket",
    "mall",
    "bazaar",
    "mandi",
    "shopping",
  ];

  return businesses.filter((business) => {
    const text =
      `${business.name} ${business.type}`
        .toLowerCase();

    return marketKeywords.some((keyword) =>
      text.includes(keyword)
    );
  });
}