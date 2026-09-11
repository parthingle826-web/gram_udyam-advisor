"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlaceCategory } from "@/lib/location/types";
import { Layers, MapPin, Building2, Store, Landmark, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/components/i18n/LanguageProvider";

export interface MapPlace {
  id: string;
  name: string;
  type: string;
  category?: PlaceCategory;
  latitude: number;
  longitude: number;
  distanceKm?: number;
}

interface Props {
  latitude: number;
  longitude: number;
  precisionLabel?: string;
  places?: MapPlace[];
  activeRadiusKm?: number;
}

function MapController({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    
    map.dragging.enable();
    map.scrollWheelZoom.enable();
    map.doubleClickZoom.enable();
    if (map.touchZoom) {
      map.touchZoom.enable();
    }
  }, [map]);

  useEffect(() => {
    map.setView([lat, lng], map.getZoom() || 12);
  }, [lat, lng, map]);

  return null;
}


function createPinIcon(category: PlaceCategory | "center") {
  let bgColor = "#4f46e5";
  let iconSvg = "📍";

  if (category === "center") {
    bgColor = "#059669"; 
    iconSvg = "⭐";
  } else if (category === "competitor") {
    bgColor = "#e11d48"; 
    iconSvg = "⚔️";
  } else if (category === "supplier") {
    bgColor = "#0284c7"; 
    iconSvg = "📦";
  } else if (category === "market") {
    bgColor = "#7c3aed"; 
    iconSvg = "🛒";
  } else if (category === "bank") {
    bgColor = "#d97706"; 
    iconSvg = "🏦";
  }

  const html = `
    <div style="
      background-color: ${bgColor};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2), 0 2px 4px -2px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      color: white;
      cursor: pointer;
    ">
      ${iconSvg}
    </div>
  `;

  return L.divIcon({
    className: "custom-map-pin",
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

export default function MarketMap({
  latitude,
  longitude,
  precisionLabel = "Showing resolved location",
  places = [],
  activeRadiusKm = 5,
}: Props) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<"all" | PlaceCategory>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[460px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          {t("loadingMap")}
        </div>
      </div>
    );
  }

  const filteredPlaces = places.filter((p) => {
    if (filter === "all") return true;
    return p.category === filter;
  });

  const competitorCount = places.filter((p) => p.category === "competitor").length;
  const supplierCount = places.filter((p) => p.category === "supplier").length;
  const marketCount = places.filter((p) => p.category === "market").length;
  const bankCount = places.filter((p) => p.category === "bank").length;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Map Control Bar */}
      <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <MapPin size={13} />
              {precisionLabel}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs text-slate-700">
              <Layers size={12} />
              {t("ringsBadge")}
            </span>
          </div>

        
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`rounded-lg px-2.5 py-1.5 font-medium transition ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {t("filterAll")} ({places.length})
            </button>

            <button
              type="button"
              onClick={() => setFilter("competitor")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium transition ${
                filter === "competitor"
                  ? "bg-rose-600 text-white"
                  : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
              }`}
            >
              <Building2 size={12} />
              {t("filterCompetitors")} ({competitorCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("supplier")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium transition ${
                filter === "supplier"
                  ? "bg-sky-600 text-white"
                  : "bg-white text-sky-700 hover:bg-sky-50 border border-sky-200"
              }`}
            >
              <Store size={12} />
              {t("filterSuppliers")} ({supplierCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("market")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium transition ${
                filter === "market"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-700 hover:bg-purple-50 border border-purple-200"
              }`}
            >
              <ShoppingBag size={12} />
              {t("filterMarkets")} ({marketCount})
            </button>

            <button
              type="button"
              onClick={() => setFilter("bank")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium transition ${
                filter === "bank"
                  ? "bg-amber-600 text-white"
                  : "bg-white text-amber-700 hover:bg-amber-50 border border-amber-200"
              }`}
            >
              <Landmark size={12} />
              {t("filterBanks")} ({bankCount})
            </button>
          </div>
        </div>
      </div>

     
      <div className="relative h-[440px] w-full">
        <MapContainer
          center={[latitude, longitude]}
          zoom={12}
          dragging={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
          zoomControl={true}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
          }}
        >
          <MapController lat={latitude} lng={longitude} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          
          <Circle
            center={[latitude, longitude]}
            radius={2000}
            pathOptions={{
              color: "#10b981",
              fillColor: "#10b981",
              fillOpacity: 0.08,
              dashArray: "4, 6",
              weight: 1.5,
            }}
          >
            <Popup>
              <strong>2 km Radius</strong>: Immediate village walkable trade zone.
            </Popup>
          </Circle>

         
          <Circle
            center={[latitude, longitude]}
            radius={5000}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.05,
              dashArray: "6, 8",
              weight: 1.5,
            }}
          >
            <Popup>
              <strong>5 km Radius</strong>: Primary local customer catchment and daily trade reach.
            </Popup>
          </Circle>

          
          <Circle
            center={[latitude, longitude]}
            radius={10000}
            pathOptions={{
              color: "#8b5cf6",
              fillColor: "#8b5cf6",
              fillOpacity: 0.03,
              dashArray: "8, 10",
              weight: 1.5,
            }}
          >
            <Popup>
              <strong>10 km Radius</strong>: Block/taluka regional market and wholesale supplier area.
            </Popup>
          </Circle>

         
          <Marker
            position={[latitude, longitude]}
            icon={createPinIcon("center")}
          >
            <Popup>
              <div className="p-1">
                <p className="font-bold text-emerald-800">{t("yourLocationPin")}</p>
                <p className="text-xs text-slate-600 mt-1">{precisionLabel}</p>
                <p className="text-xs text-slate-500">Center origin for 2 / 5 / 10 km radius analysis</p>
              </div>
            </Popup>
          </Marker>

         
          {filteredPlaces.map((place) => {
            const category = place.category || "general";
            return (
              <Marker
                key={place.id}
                position={[place.latitude, place.longitude]}
                icon={createPinIcon(category)}
              >
                <Popup>
                  <div className="p-1">
                    <p className="font-bold text-slate-900">{place.name}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 uppercase">
                        {category}
                      </span>
                      {place.distanceKm !== undefined && (
                        <span className="text-xs text-slate-500">
                          {place.distanceKm.toFixed(1)} {t("kmAway")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{t("typeLabel")}: {place.type}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}