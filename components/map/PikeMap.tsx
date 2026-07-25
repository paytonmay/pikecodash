"use client";

import { useEffect, useRef, useState } from "react";
import {
  Map as MLMap,
  Marker,
  Popup,
  NavigationControl,
  setWorkerUrl,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  county,
  mapMarkers,
  markerCategories,
  schools,
  medicalFacilities,
  communityPops,
  communityCentroids,
  forkColors,
  type MapMarker,
  type MarkerCategory,
} from "@/lib/data";

const ALL_CATEGORIES = Object.keys(markerCategories) as MarkerCategory[];

// Real NCES/OSM coordinates — schools and medical join the curated markers.
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

const communityGeoJSON = {
  type: "FeatureCollection" as const,
  features: communityPops
    .filter((c) => communityCentroids[c.zip])
    .map((c) => ({
      type: "Feature" as const,
      properties: {
        name: c.name,
        pop: c.pop,
        // sqrt scaling so area tracks population
        r: Math.max(4, Math.sqrt(c.pop) / 9),
      },
      geometry: {
        type: "Point" as const,
        coordinates: [
          communityCentroids[c.zip].lng,
          communityCentroids[c.zip].lat,
        ],
      },
    })),
};

/** Dashboard rows call this to fly the map to a location. */
export function focusMap(detail: {
  lng: number;
  lat: number;
  name: string;
  blurb?: string;
}) {
  document
    .getElementById("map")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
  window.dispatchEvent(new CustomEvent("pike:focus", { detail }));
}

function styleUrl(dark: boolean) {
  return dark
    ? "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    : "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
}

function isDarkTheme() {
  return document.documentElement.dataset.theme === "dark";
}

export function PikeMap({ heightClass = "h-[560px]" }: { heightClass?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MLMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const boundaryRef = useRef<unknown>(null);
  const watershedsRef = useRef<unknown>(null);
  const [active, setActive] = useState<Set<MarkerCategory>>(
    new Set(ALL_CATEGORIES)
  );
  const [showBasins, setShowBasins] = useState(false);
  const [showCommunities, setShowCommunities] = useState(true);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

    const map = new MLMap({
      container: containerRef.current,
      style: styleUrl(isDarkTheme()),
      bounds: county.bounds,
      fitBoundsOptions: { padding: 40 },
      attributionControl: { compact: true },
    });
    mapRef.current = map;
    map.on("error", (e) => {
      console.error("[PikeMap] maplibre error:", e.error?.message ?? e);
    });
    map.addControl(new NavigationControl(), "top-right");

    const applyOverlays = async () => {
      const dark = isDarkTheme();
      // Recolor the basemap's built-in water (fills, streams, name labels).
      const paint = (id: string, prop: string, value: unknown) => {
        if (map.getLayer(id))
          map.setPaintProperty(id, prop as never, value as never);
      };
      paint("water", "fill-color", dark ? "#1c3a5e" : "#a5d5f2");
      paint("waterway", "line-color", dark ? "#3b7fc4" : "#3f9ad8");
      paint("waterway", "line-width", [
        "interpolate", ["linear"], ["zoom"],
        8, 0.6, 11, 1.6, 14, 3, 16, 5,
      ]);
      for (const id of ["waterway_label", "watername_lake", "watername_lake_line"]) {
        paint(id, "text-color", dark ? "#7fb3e8" : "#1c5cab");
        paint(id, "text-halo-color", dark ? "#0d1524" : "#ffffff");
        paint(id, "text-halo-width", 1.2);
      }
      if (map.getLayer("waterway_label")) {
        map.setLayoutProperty("waterway_label", "text-size", [
          "interpolate", ["linear"], ["zoom"], 9, 10, 13, 13, 16, 16,
        ]);
      }

      if (!boundaryRef.current) {
        boundaryRef.current = await fetch("/data/pike-boundary.json").then((r) => r.json());
      }
      if (!watershedsRef.current) {
        watershedsRef.current = await fetch("/data/watersheds.json").then((r) => r.json());
      }

      if (!map.getSource("basins")) {
        map.addSource("basins", {
          type: "geojson",
          data: watershedsRef.current as never,
        });
        map.addLayer({
          id: "basins-fill",
          type: "fill",
          source: "basins",
          layout: { visibility: showBasins ? "visible" : "none" },
          paint: {
            "fill-color": [
              "match", ["get", "fork"],
              "levisa", forkColors.levisa.color,
              "russell", forkColors.russell.color,
              "tug", forkColors.tug.color,
              "#888888",
            ],
            "fill-opacity": 0.16,
          },
        });
        map.addLayer({
          id: "basins-line",
          type: "line",
          source: "basins",
          layout: { visibility: showBasins ? "visible" : "none" },
          paint: {
            "line-color": [
              "match", ["get", "fork"],
              "levisa", forkColors.levisa.color,
              "russell", forkColors.russell.color,
              "tug", forkColors.tug.color,
              "#888888",
            ],
            "line-width": 1,
            "line-opacity": 0.5,
          },
        });
      }

      if (!map.getSource("pike")) {
        map.addSource("pike", {
          type: "geojson",
          data: boundaryRef.current as never,
        });
        map.addLayer({
          id: "pike-fill",
          type: "fill",
          source: "pike",
          paint: { "fill-color": "#0b9444", "fill-opacity": dark ? 0.08 : 0.05 },
        });
        map.addLayer({
          id: "pike-line",
          type: "line",
          source: "pike",
          paint: { "line-color": dark ? "#2fd47a" : "#0b9444", "line-width": 2 },
        });
      }

      if (!map.getSource("communities")) {
        map.addSource("communities", {
          type: "geojson",
          data: communityGeoJSON as never,
        });
        map.addLayer({
          id: "community-dots",
          type: "circle",
          source: "communities",
          layout: {
            visibility: showCommunities ? "visible" : "none",
          },
          paint: {
            "circle-radius": ["get", "r"],
            "circle-color": "#0b9444",
            "circle-opacity": 0.25,
            "circle-stroke-color": "#0b9444",
            "circle-stroke-width": 1.2,
          },
        });
        map.on("click", "community-dots", (e) => {
          const f = e.features?.[0];
          if (!f) return;
          new Popup({ offset: 8 })
            .setLngLat(e.lngLat)
            .setHTML(
              `<div><div style="font-weight:600">${f.properties.name}</div>
               <div style="font-size:12px;color:var(--text-secondary)">${(+f.properties.pop).toLocaleString()} people · ZIP-area (ACS 2020–24)</div></div>`
            )
            .addTo(map);
        });
        map.on("mouseenter", "community-dots", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "community-dots", () => {
          map.getCanvas().style.cursor = "";
        });
      }
    };

    // Fires on initial load and again whenever the base style is swapped
    // (theme change); overlay setup is idempotent via getSource guards.
    map.on("style.load", () => {
      applyOverlays();
    });

    for (const m of allMarkers) {
      const el = document.createElement("div");
      el.className = "map-dot";
      el.style.background = markerCategories[m.category].color;

      const popup = new Popup({ offset: 14 }).setHTML(
        `<div style="max-width:220px">
           <div style="font-weight:600;margin-bottom:2px">${m.name}</div>
           <div style="font-size:12px;color:var(--text-secondary)">${m.blurb}</div>
           ${m.approx ? '<div style="font-size:10px;color:#fab219;margin-top:4px;text-transform:uppercase;letter-spacing:0.05em">approximate location</div>' : ""}
         </div>`
      );

      markersRef.current[m.id] = new Marker({ element: el })
        .setLngLat([m.lng, m.lat])
        .setPopup(popup)
        .addTo(map);
    }

    // Cross-link: dashboard rows fly the map to a named location.
    const onFocus = (e: Event) => {
      const { lng, lat, name, blurb } = (e as CustomEvent).detail;
      map.flyTo({ center: [lng, lat], zoom: 13, duration: 1400 });
      const existing = Object.values(markersRef.current).find(
        (mk) => {
          const p = mk.getLngLat();
          return Math.abs(p.lng - lng) < 1e-4 && Math.abs(p.lat - lat) < 1e-4;
        }
      );
      if (existing) {
        if (!existing.getPopup().isOpen()) existing.togglePopup();
      } else {
        new Popup({ offset: 10 })
          .setLngLat([lng, lat])
          .setHTML(
            `<div><div style="font-weight:600">${name}</div>${blurb ? `<div style="font-size:12px;color:var(--text-secondary)">${blurb}</div>` : ""}</div>`
          )
          .addTo(map);
      }
    };
    window.addEventListener("pike:focus", onFocus);

    // Theme swap: change basemap, overlays re-apply on style.load.
    const observer = new MutationObserver(() => {
      map.setStyle(styleUrl(isDarkTheme()));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => {
      window.removeEventListener("pike:focus", onFocus);
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const m of allMarkers) {
      const marker = markersRef.current[m.id];
      if (!marker) continue;
      marker.getElement().style.display = active.has(m.category) ? "" : "none";
    }
  }, [active]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const vis = (id: string, on: boolean) => {
      if (map.getLayer(id))
        map.setLayoutProperty(id, "visibility", on ? "visible" : "none");
    };
    vis("basins-fill", showBasins);
    vis("basins-line", showBasins);
    vis("community-dots", showCommunities);
  }, [showBasins, showCommunities]);

  function toggle(cat: MarkerCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const toggleCls = (on: boolean) =>
    `flex items-center gap-2 rounded-sm border px-3 py-1.5 text-xs transition ${
      on
        ? "border-hairline-strong bg-surface-2 text-ink"
        : "border-hairline text-ink-3 opacity-60"
    }`;

  return (
    <div className="overflow-hidden rounded-sm border border-hairline-strong">
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline bg-surface-1 p-3">
        {ALL_CATEGORIES.map((cat) => {
          const on = active.has(cat);
          const { label, color } = markerCategories[cat];
          return (
            <button
              key={cat}
              onClick={() => toggle(cat)}
              aria-pressed={on}
              className={toggleCls(on)}
            >
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: color, opacity: on ? 1 : 0.4 }}
              />
              {label}
            </button>
          );
        })}
        <button
          onClick={() => setShowCommunities((v) => !v)}
          aria-pressed={showCommunities}
          className={toggleCls(showCommunities)}
        >
          <span
            className="h-2.5 w-2.5 rounded-full border border-[#0b9444]"
            style={{ background: "rgba(11,148,68,0.25)", opacity: showCommunities ? 1 : 0.4 }}
          />
          Population dots
        </button>
        <button
          onClick={() => setShowBasins((v) => !v)}
          aria-pressed={showBasins}
          className={toggleCls(showBasins)}
        >
          <span className="flex gap-0.5">
            {Object.values(forkColors).map((f) => (
              <span
                key={f.label}
                className="h-2.5 w-1 rounded-sm"
                style={{ background: f.color, opacity: showBasins ? 0.8 : 0.4 }}
              />
            ))}
          </span>
          Watersheds
        </button>
        {showBasins && (
          <span className="flex items-center gap-3 pl-1 text-[10px] text-ink-3">
            {Object.values(forkColors).map((f) => (
              <span key={f.label} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-sm"
                  style={{ background: f.color, opacity: 0.6 }}
                />
                {f.label}
              </span>
            ))}
          </span>
        )}
      </div>
      <div ref={containerRef} className={`w-full ${heightClass}`} />
    </div>
  );
}
