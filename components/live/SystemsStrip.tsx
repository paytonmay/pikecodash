"use client";

import { useEffect, useState } from "react";
import { county, riverGauge, landfill } from "@/lib/data";
import { Meter } from "@/components/charts/Meter";

/*
 * Top status row: air quality, river, weather (live feeds) + landfill
 * capacity (placeholder until Solid Waste reports). Live cards degrade to
 * an explicit "offline" state — never a fake number.
 * Air + weather: Open-Meteo (no key). River: USGS instantaneous values.
 */

type Level = "good" | "caution" | "alert";

const levelStyle: Record<Level, { dot: string; label: string }> = {
  good: { dot: "var(--status-good)", label: "text-[#006300]" },
  caution: { dot: "var(--status-warning)", label: "text-[#9a6b00]" },
  alert: { dot: "var(--status-critical)", label: "text-[#b32d0f]" },
};

function StatusChip({ level, text }: { level: Level; text: string }) {
  const s = levelStyle[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${s.label}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: s.dot }}
        aria-hidden
      />
      {text}
    </span>
  );
}

const WEATHER_CODES: [number[], string][] = [
  [[0], "Clear"],
  [[1, 2], "Partly cloudy"],
  [[3], "Overcast"],
  [[45, 48], "Fog"],
  [[51, 53, 55, 56, 57], "Drizzle"],
  [[61, 63, 65, 66, 67], "Rain"],
  [[71, 73, 75, 77], "Snow"],
  [[80, 81, 82], "Showers"],
  [[85, 86], "Snow showers"],
  [[95, 96, 99], "Thunderstorms"],
];

function describeWeather(code: number): string {
  return WEATHER_CODES.find(([codes]) => codes.includes(code))?.[1] ?? "—";
}

function aqiLevel(aqi: number): { level: Level; text: string } {
  if (aqi <= 50) return { level: "good", text: "Good" };
  if (aqi <= 100) return { level: "caution", text: "Moderate" };
  if (aqi <= 150) return { level: "caution", text: "Unhealthy (sens.)" };
  return { level: "alert", text: "Unhealthy" };
}

interface CardState {
  value: string;
  sub: string;
  level: Level;
  status: string;
  live: boolean;
}

const OFFLINE: CardState = {
  value: "—",
  sub: "Feed unreachable — retry on refresh",
  level: "caution",
  status: "Offline",
  live: false,
};

const LOADING: CardState = {
  value: "…",
  sub: "Connecting to feed",
  level: "good",
  status: "Connecting",
  live: false,
};

export function SystemsStrip() {
  const [air, setAir] = useState<CardState>(LOADING);
  const [river, setRiver] = useState<CardState>(LOADING);
  const [weather, setWeather] = useState<CardState>(LOADING);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const { lat, lng } = county.center;

    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5`
    )
      .then((r) => r.json())
      .then((d) => {
        const aqi = Math.round(d.current.us_aqi);
        const { level, text } = aqiLevel(aqi);
        setAir({
          value: `AQI ${aqi}`,
          sub: `PM2.5 ${d.current.pm2_5} µg/m³ · Open-Meteo`,
          level,
          status: text,
          live: true,
        });
      })
      .catch(() => setAir(OFFLINE));

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,precipitation&temperature_unit=fahrenheit&wind_speed_unit=mph`
    )
      .then((r) => r.json())
      .then((d) => {
        const c = d.current;
        const desc = describeWeather(c.weather_code);
        const stormy = c.weather_code >= 95;
        setWeather({
          value: `${Math.round(c.temperature_2m)}°F`,
          sub: `${desc} · wind ${Math.round(c.wind_speed_10m)} mph · Open-Meteo`,
          level: stormy ? "caution" : "good",
          status: stormy ? "Storms" : desc,
          live: true,
        });
      })
      .catch(() => setWeather(OFFLINE));

    fetch(
      `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${riverGauge.station}&parameterCd=00060,00065`
    )
      .then((r) => r.json())
      .then((d) => {
        interface Series {
          variable: { variableCode: { value: string }[] };
          values: { value: { value: string }[] }[];
        }
        const series: Series[] = d.value.timeSeries;
        const read = (code: string) => {
          const s = series.find((t) =>
            t.variable.variableCode.some((v) => v.value === code)
          );
          const v = s?.values[0]?.value[0]?.value;
          return v ? parseFloat(v) : null;
        };
        const stageFt = read("00065");
        const flowCfs = read("00060");
        if (stageFt === null && flowCfs === null) throw new Error("no data");
        const nearFlood =
          stageFt !== null && stageFt >= riverGauge.floodStageFt * 0.75;
        setRiver({
          value: stageFt !== null ? `${stageFt.toFixed(1)} ft` : `${flowCfs} cfs`,
          sub: `${riverGauge.name}${flowCfs !== null ? ` · ${Math.round(flowCfs).toLocaleString()} cfs` : ""} · USGS`,
          level: nearFlood ? "alert" : "good",
          status: nearFlood ? "Elevated" : "Normal",
          live: true,
        });
      })
      .catch(() => setRiver(OFFLINE));

    setUpdatedAt(
      new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    );
  }, []);

  const liveCards = [
    { title: "Air quality", state: air },
    { title: "River — Levisa Fork", state: river },
    { title: "Weather — Pikeville", state: weather },
  ];

  const allLive = liveCards.every((c) => c.state.live);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-3">
          <span
            className={`h-2 w-2 rounded-full ${allLive ? "animate-pulse" : ""}`}
            style={{
              background: allLive ? "var(--status-good)" : "var(--status-warning)",
            }}
          />
          County systems {allLive ? "· all feeds live" : "· connecting"}
        </p>
        {updatedAt && <p className="text-[11px] text-ink-3">as of {updatedAt}</p>}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {liveCards.map(({ title, state }) => (
          <div key={title} className="panel p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[11px] uppercase tracking-wider text-ink-3">
                {title}
              </p>
              <StatusChip level={state.level} text={state.status} />
            </div>
            <p className="mt-1.5 font-display text-2xl font-semibold">
              {state.value}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-ink-3">{state.sub}</p>
          </div>
        ))}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              Landfill
            </p>
            <StatusChip
              level={landfill.capacityUsedPct >= 90 ? "alert" : landfill.capacityUsedPct >= 70 ? "caution" : "caution"}
              text="Placeholder"
            />
          </div>
          <p className="mt-1.5 font-display text-2xl font-semibold">
            {landfill.weeklyIntakeTons.toLocaleString()}
            <span className="ml-1.5 text-sm font-normal text-ink-3">t/wk in</span>
          </p>
          <div className="mt-2">
            <Meter
              pct={landfill.capacityUsedPct}
              label="Capacity used"
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
