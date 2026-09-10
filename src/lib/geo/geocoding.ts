import { geocodeLocation as geocodeEngine } from "@/lib/location/geocode";

export interface GeoLocation {
  latitude: number;
  longitude: number;
  displayName?: string;
  precision?: string;
  precisionLabel?: string;
}

export async function geocodeLocation(
  village: string,
  district: string,
  state: string,
  block?: string
): Promise<GeoLocation | null> {
  try {
    const res = await geocodeEngine(village, block, district, state);
    return {
      latitude: res.latitude,
      longitude: res.longitude,
      displayName: res.displayName,
      precision: res.precision,
      precisionLabel: res.precisionLabel,
    };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return null;
  }
}