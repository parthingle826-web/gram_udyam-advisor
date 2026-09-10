export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MarketPlace {
  id?: string;
  name: string;

  category?: string;

  address?: string;
  village?: string;
  district?: string;

  location?: GeoPoint;

  distanceKm?: number;
}

export interface Competitor extends MarketPlace {
  businessType?: string;
  estimatedPrice?: number;
  rating?: number;
}

export interface Supplier extends MarketPlace {
  suppliedProducts?: string[];
  contact?: string;
}

export interface Bank extends MarketPlace {
  branchName?: string;
  services?: string[];
}

export interface MarketAnalysisResult {
  marketDemand: number;
  competition: number;

  competitors: Competitor[];
  suppliers: Supplier[];
  banks: Bank[];
  markets: MarketPlace[];

  opportunities: string[];
  risks: string[];

  summary: string;
}