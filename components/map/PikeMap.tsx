"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as MLMap,
  Marker,
  Popup,
  NavigationControl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  county,
  mapMarkers,
  markerCategories,
  schools,
  medicalFacilities,
  type MapMarker,
  type MarkerCategory,
} from "@/lib/data";

const ALL_CATEGORIES = Object.keys(markerCategories) as MarkerCategory[];

// Real NCES coordinates — schools join the hand-curated markers.
const allMarkers: MapMarker[] = [
  ...mapMarkers,
  ...schools.map((s, i) => ({
    id: `school-${i}`,
    name: s.name,
    category: "school" as MarkerCategory,
    lng: s.lng,
    lat: s.lat,
    blurb: `${s.district} · grades ${s.grades}${s.enrollment > 0 ? ` · ${s.enrollment.toLocaleString()} students` : ""} · NCES 2023–24`,
  })),
  ...medicalFacilities.map((f, i) => ({
    id: `medical-${i}`,
    name: f.name,
    category: "medical" as MarkerCategory,
    lng: f.lng,
    lat: f.lat,
    blurb: `${f.kind} · OpenStreetMap`,
  })),
];

export function PikeMap({ heightClass = "h-[560px]" }: { heightClass?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [active, setActive] = useState<Set<MarkerCategory>>(
    new Set(ALL_CATEGORIES)
  );

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new MLMap({
      container: containerRef.current,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      bounds: county.bounds,
      fitBoundsOptions: { padding: 40 },
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.addControl(new NavigationControl(), "top-right");

    map.on("load", async () => {
      const boundary = await fetch("/data/pike-boundary.json").then((r) =>
        r.json()
      );
      map.addSource("pike", { type: "geojson", data: boundary });
      map.addLayer({
        id: "pike-fill",
        type: "fill",
        source: "pike",
        paint: { "fill-color": "#0b9444", "fill-opacity": 0.05 },
      });
      map.addLayer({
        id: "pike-line",
        type: "line",
        source: "pike",
        paint: { "line-color": "#0b9444", "line-width": 2 },
      });
    });

    for (const m of allMarkers) {
      const el = document.createElement("div");
      el.className = "map-dot";
      el.style.background = markerCategories[m.category].color;

      const popup = new Popup({ offset: 14 }).setHTML(
        `<div style="max-width:220px">
           <div style="font-weight:600;margin-bottom:2px">${m.name}</div>
           <div style="font-size:12px;color:#45544c">${m.blurb}</div>
           ${m.approx ? '<div style="font-size:10px;color:#fab219;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em">approximate location</div>' : ""}
         </div>`
      );

      markersRef.current[m.id] = new Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(map);
    }

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of allMarkers) {
      const marker = markersRef.current[m.id];
      if (!marker) continue;
      const shown = active.has(m.category);
      const el = marker.getElement();
      el.style.display = shown ? "" : "none";
    }
  }, [active]);

  function toggle(cat: MarkerCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  return (
    <div className="overflow-hidden rounded-sm border border-hairline-strong">
      <div className="flex flex-wrap gap-2 border-b border-hairline bg-surface-1 p-3">
        {ALL_CATEGORIES.map((cat) => {
          const on = active.has(cat);
          const { label, color } = markerCategories[cat];
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              aria-pressed={on}
              className={`flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs transition ${
                on
                  ? "border-hairline-strong bg-surface-2 text-ink"
                  : "border-hairline text-ink-3 opacity-60"
              }`}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: color, opacity: on ? 1 : 0.4 }}
              />
              {label}
            </button>
          );
        })}
      </div>
      <div ref={containerRef} className={`w-full ${heightClass}`} />
    </div>
  );
}
