import type { GeocodePrecision, LocationCoordinates } from "./types";
import { getSupabaseClient } from "@/lib/supabase/client";

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}


const memoryGeocodeCache = new Map<string, LocationCoordinates>();


const STATE_CENTROIDS: Record<string, { lat: number; lon: number }> = {
  maharashtra: { lat: 19.7515, lon: 75.7139 },
  "madhya pradesh": { lat: 22.9734, lon: 78.6569 },
  "uttar pradesh": { lat: 26.8467, lon: 80.9462 },
  rajasthan: { lat: 27.0238, lon: 74.2179 },
  gujarat: { lat: 22.2587, lon: 71.1924 },
  bihar: { lat: 25.0961, lon: 85.3131 },
  karnataka: { lat: 15.3173, lon: 75.7139 },
  "tamil nadu": { lat: 11.1271, lon: 78.6569 },
  "andhra pradesh": { lat: 15.9129, lon: 79.74 },
  telangana: { lat: 18.1124, lon: 79.0193 },
  odisha: { lat: 20.9517, lon: 85.0985 },
  "west bengal": { lat: 22.9868, lon: 87.855 },
  punjab: { lat: 31.1471, lon: 75.3412 },
  haryana: { lat: 29.0588, lon: 76.0856 },
  chhattisgarh: { lat: 21.2787, lon: 81.8661 },
  jharkhand: { lat: 23.6102, lon: 85.2799 },
  assam: { lat: 26.2006, lon: 92.9376 },
  kerala: { lat: 10.8505, lon: 76.2711 },
  delhi: { lat: 28.7041, lon: 77.1025 },
};


let lastRequestTime = 0;
async function enforceRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLast = now - lastRequestTime;
  const minInterval = 1050; 

  if (timeSinceLast < minInterval) {
    const delay = minInterval - timeSinceLast;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lastRequestTime = Date.now();
}

async function queryNominatim(query: string): Promise<NominatimResult | null> {
  try {
    await enforceRateLimit();

    const url =
      "https://nominatim.openstreetmap.org/search?" +
      new URLSearchParams({
        q: query,
        format: "json",
        limit: "1",
        countrycodes: "in",
      }).toString();

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Gram-Udyam-Advisor/1.0 (contact@gramudyam.in)",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as NominatimResult[];
    if (Array.isArray(data) && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (err) {
    console.warn(`Geocoding query failed for "${query}":`, err);
    return null;
  }
}

function getPrecisionLabel(precision: GeocodePrecision): string {
  switch (precision) {
    case "village":
      return "Showing village-level location";
    case "block":
      return "Showing block-level estimate";
    case "district":
      return "Showing district-level estimate";
    case "state":
      return "Showing state-level estimate";
    case "estimate":
    default:
      return "Showing regional estimate";
  }
}


export async function geocodeLocation(
  village?: string,
  block?: string,
  district?: string,
  state?: string
): Promise<LocationCoordinates> {
  const cleanVillage = (village || "").trim();
  const cleanBlock = (block || "").trim();
  const cleanDistrict = (district || "").trim();
  const cleanState = (state || "").trim();

  const cacheKey = `${cleanVillage.toLowerCase()}|${cleanBlock.toLowerCase()}|${cleanDistrict.toLowerCase()}|${cleanState.toLowerCase()}`;

 
  if (memoryGeocodeCache.has(cacheKey)) {
    return memoryGeocodeCache.get(cacheKey)!;
  }


  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from("geocode_cache")
        .select("latitude, longitude, display_name, precision, precision_label")
        .eq("query_key", cacheKey)
        .maybeSingle();

      if (data) {
        const cached: LocationCoordinates = {
          latitude: Number(data.latitude),
          longitude: Number(data.longitude),
          displayName: data.display_name,
          precision: data.precision as GeocodePrecision,
          precisionLabel: data.precision_label || getPrecisionLabel(data.precision),
        };
        memoryGeocodeCache.set(cacheKey, cached);
        return cached;
      }
    }
  } catch {
  
  }

 
  const ladderSteps: Array<{
    query: string;
    precision: GeocodePrecision;
    condition: boolean;
  }> = [
    {
      query: [cleanVillage, cleanBlock, cleanDistrict, cleanState, "India"]
        .filter(Boolean)
        .join(", "),
      precision: "village",
      condition: Boolean(cleanVillage),
    },
    {
      query: [cleanBlock, cleanDistrict, cleanState, "India"]
        .filter(Boolean)
        .join(", "),
      precision: "block",
      condition: Boolean(cleanBlock),
    },
    {
      query: [cleanDistrict, cleanState, "India"]
        .filter(Boolean)
        .join(", "),
      precision: "district",
      condition: Boolean(cleanDistrict),
    },
    {
      query: [cleanState, "India"].filter(Boolean).join(", "),
      precision: "state",
      condition: Boolean(cleanState),
    },
  ];

  for (const step of ladderSteps) {
    if (!step.condition) continue;

    const result = await queryNominatim(step.query);
    if (result && result.lat && result.lon) {
      const coords: LocationCoordinates = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        displayName: result.display_name,
        precision: step.precision,
        precisionLabel: getPrecisionLabel(step.precision),
      };

      
      memoryGeocodeCache.set(cacheKey, coords);

     
      try {
        const supabase = getSupabaseClient();
        if (supabase) {
          supabase
            .from("geocode_cache")
            .upsert({
              query_key: cacheKey,
              latitude: coords.latitude,
              longitude: coords.longitude,
              display_name: coords.displayName,
              precision: coords.precision,
              precision_label: coords.precisionLabel,
              updated_at: new Date().toISOString(),
            })
            .then();
        }
      } catch {
        // Ignore background cache write failures
      }

      return coords;
    }
  }

 
  const stateKey = cleanState.toLowerCase();
  const centroid = STATE_CENTROIDS[stateKey] || { lat: 20.5937, lon: 78.9629 }; // India center

  const fallbackCoords: LocationCoordinates = {
    latitude: centroid.lat,
    longitude: centroid.lon,
    displayName: [cleanDistrict, cleanState, "India"].filter(Boolean).join(", ") || "India",
    precision: "estimate",
    precisionLabel: cleanState
      ? `Showing ${cleanState} regional estimate`
      : "Showing regional estimate",
  };

  memoryGeocodeCache.set(cacheKey, fallbackCoords);
  return fallbackCoords;
}