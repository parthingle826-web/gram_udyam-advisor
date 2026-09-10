export type GeocodePrecision =
  | "village"
  | "block"
  | "district"
  | "state"
  | "estimate";

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  displayName?: string;
  precision: GeocodePrecision;
  precisionLabel: string;
}

export type PlaceCategory =
  | "competitor"
  | "supplier"
  | "market"
  | "bank"
  | "general";

export interface NearbyPlace {
  id: string;
  name: string;
  type: string;
  category?: PlaceCategory;
  latitude: number;
  longitude: number;
  distanceKm: number;
}