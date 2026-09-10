"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapPlace } from "./MarketMap";
import { RefreshCw, Layers } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

// Lazy-load MarketMap with ssr: false so SSR does not evaluate window/Leaflet
const MarketMap = dynamic(() => import("./MarketMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[440px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        Loading hyper-local map view...
      </div>
    </div>
  ),
});

interface MarketProps {
  village: string;
  block?: string;
  district: string;
  state: string;
  businessType: string;
  onAnalysis?: (analysis: any) => void;
}

export default function MarketAnalysis({
  village,
  block,
  district,
  state,
  businessType,
  onAnalysis,
}: MarketProps) {
  const { t } = useLanguage();
  const [radius, setRadius] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [places, setPlaces] = useState<MapPlace[]>([]);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    precision: string;
    precisionLabel: string;
  } | null>(null);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          village,
          block,
          district,
          state,
          businessType,
          radiusKm: radius,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Market analysis failed.");
      }

      setResult(data.market);
      setPlaces(data.places || []);
      if (data.location) {
        setLocation(data.location);
      }

      onAnalysis?.({
        ...data.market,
        places: data.places,
        competitors: data.competitors,
        suppliers: data.suppliers,
        markets: data.markets,
        banks: data.banks,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        precision: data.location?.precision,
        precisionLabel: data.location?.precisionLabel,
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to retrieve local market analysis."
      );
    } finally {
      setLoading(false);
    }
  }

  // Auto-analyze on initial mount if location props exist
  useEffect(() => {
    if (district || state || village || block) {
      analyze();
    }
  }, [village, block, district, state, businessType]);

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Layers size={14} />
              {t("marketIntelligenceBadge")}
            </div>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {t("marketAreaHeading")}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              PostGIS & OpenStreetMap radius query centered on{" "}
              <strong className="text-slate-700">
                {[village, block, district, state].filter(Boolean).join(", ") || "your location"}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <label htmlFor="radius-select" className="text-xs font-medium text-slate-500">
                {t("radiusLabel")}:
              </label>
              <select
                id="radius-select"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:border-indigo-500"
              >
                <option value={2}>{t("radius2km")}</option>
                <option value={5}>{t("radius5km")}</option>
                <option value={10}>{t("radius10km")}</option>
              </select>
            </div>

            <button
              type="button"
              onClick={analyze}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-60"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              {loading ? t("scanningMarket") : t("updateAnalysis")}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </section>

      {/* Embedded Leaflet Map */}
      {location && (
        <section>
          <MarketMap
            latitude={location.latitude}
            longitude={location.longitude}
            precisionLabel={location.precisionLabel}
            places={places}
            activeRadiusKm={radius}
          />
        </section>
      )}

      {/* Market Metrics & Findings */}
      {result && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {t("nearbyBusinesses")}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.totalBusinesses ?? places.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Identified within {radius}km radius
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {t("directCompetitors")}
              </p>
              <p className="mt-2 text-3xl font-bold text-rose-600">
                {result.competitorCount ?? 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                In {businessType || "same category"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                {t("competitionLevelLabel")}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {result.competitionLevel}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Density: {result.marketDensity ?? 0} businesses/km
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Opportunities */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-950">
                {t("localMarketOpportunities")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {result.opportunities?.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm leading-6 text-emerald-900">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risks */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-amber-950">
                {t("marketRiskAssessment")}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {result.risks?.length === 0 ? (
                  <li className="text-sm text-slate-500">{t("noMarketRisksIdentified")}</li>
                ) : (
                  result.risks?.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm leading-6 text-amber-900">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                      <span>{item}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {result.underservedCategories?.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">
                {t("underservedCategoriesTitle")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {result.underservedCategories.map((cat: string) => (
                  <span
                    key={cat}
                    className="rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800"
                  >
                    + {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}