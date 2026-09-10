export interface OSMBusiness {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
}

export async function searchNearbyBusinesses(
  latitude: number,
  longitude: number,
  radiusMeters = 5000
): Promise<OSMBusiness[]> {
  const query = `
[out:json];
(
  node["shop"](around:${radiusMeters},${latitude},${longitude});
  node["amenity"](around:${radiusMeters},${latitude},${longitude});
  way["shop"](around:${radiusMeters},${latitude},${longitude});
  way["amenity"](around:${radiusMeters},${latitude},${longitude});
);
out center tags;
`;

  const response = await fetch(
    "https://overpass-api.de/api/interpreter",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    }
  );

  if (!response.ok) {
    throw new Error("Unable to fetch local market data.");
  }

  const data = await response.json();

  if (!data?.elements) {
    return [];
  }

  return data.elements
    .map((item: any) => {
      const latitudeValue =
        item.lat ?? item.center?.lat;

      const longitudeValue =
        item.lon ?? item.center?.lon;

      if (
        typeof latitudeValue !== "number" ||
        typeof longitudeValue !== "number"
      ) {
        return null;
      }

      return {
        id: String(item.id),
        name:
          item.tags?.name ||
          item.tags?.["name:en"] ||
          "Unnamed business",
        type:
          item.tags?.shop ||
          item.tags?.amenity ||
          "other",
        latitude: latitudeValue,
        longitude: longitudeValue,
      };
    })
    .filter(Boolean);
}