"use client";

import { useEffect, useRef, useState } from "react";
import { county, riverGauge, landfill } from "@/lib/data";
import { Meter } from "@/components/charts/Meter";
import { ProvenanceBadge } from "@/components/ui";

/*
 * Top status row — live feeds with context scales, refreshed every 10 min:
 *  · Air: current US AQI on the EPA band scale (Open-Meteo)
 *  · River: stage vs NWS flood stages + 7-day sparkline + crest ghosts
 *  · Weather: current temp vs the 10-year average for this date
 *  · Landfill: news-derived intake + remaining-life meter
 * Live cards degrade to an explicit "offline" state — never a fake number.
 */

const REFRESH_MS = 10 * 60 * 1000;

type Level = "good" | "caution" | "alert";

const levelStyle: Record<Level, { dot: string; label: string }> = {
  good: { dot: "var(--status-good)", label: "text-[var(--good-text)]" },
  caution: { dot: "var(--status-warning)", label: "text-[var(--warn-text)]" },
  alert: { dot: "var(--status-critical)", label: "text-[var(--alert-text)]" },
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

/* AQI scale: EPA bands 0–200+, marker at current value. */
function AqiScale({ aqi }: { aqi: number }) {
  const max = 200;
  const pct = Math.min(aqi, max) / max;
  const bands = [
    "var(--status-good)",
    "var(--status-warning)",
    "var(--status-serious)",
    "var(--status-critical)",
  ];
  return (
    <div>
      <div className="relative mt-2 flex h-1.5 overflow-hidden rounded-[3px]">
        {bands.map((color, i) => (
          <div
            key={color}
            className="h-full"
            style={{
              width: "25%",
              background: color,
              opacity: 0.35,
              borderLeft: i > 0 ? "1px solid var(--surface-1)" : undefined,
            }}
          />
        ))}
        <div
          className="absolute top-0 h-full w-[3px] rounded-sm bg-ink"
          style={{ left: `calc(${(pct * 100).toFixed(1)}% - 1.5px)` }}
        />
      </div>
      <div className="mt-0.5 flex justify-between text-[9px] text-ink-3">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200+</span>
      </div>
    </div>
  );
}

/*
 * River stage on a grey scale spanning 0 → the 1957 flood of record.
 * Hovering reveals the flood-memory ghosts: Feb 2025 and 1957 crests.
 */
const CRESTS = [
  { ft: 46.68, label: "Feb 2025 · 46.7 ft" },
  { ft: 52.72, label: "1957 record · 52.7 ft" },
];

function StageScale({ stageFt }: { stageFt: number }) {
  const max = Math.ceil(riverGauge.recordCrestFt);
  const pct = Math.min(stageFt / max, 1) * 100;
  const marks = [
    { ft: riverGauge.stages.action, label: "action" },
    { ft: riverGauge.stages.minor, label: "flood" },
    { ft: riverGauge.stages.major, label: "major" },
  ];
  return (
    <div className="group/scale">
      <div className="relative mt-2 h-1.5 rounded-[3px] bg-[var(--track)]">
        <div
          className="h-full rounded-[3px]"
          style={{ width: `${pct}%`, background: "#3f9ad8" }}
        />
        {marks.map((m) => (
          <div
            key={m.label}
            className="absolute top-[-2px] h-2.5 w-px bg-ink-3"
            style={{ left: `${(m.ft / max) * 100}%` }}
          />
        ))}
        {CRESTS.map((c) => (
          <div key={c.ft}>
            <div
              className="absolute top-[-3px] h-3 w-[2px] rounded-sm opacity-40 group-hover/scale:opacity-100"
              style={{
                left: `${(c.ft / max) * 100}%`,
                background: "var(--status-critical)",
                transition: "opacity 150ms",
              }}
            />
            <span
              className="absolute bottom-full mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-sm border border-hairline-strong bg-surface-2 px-1.5 py-0.5 text-[9px] text-ink group-hover/scale:block"
              style={{ left: `${(c.ft / max) * 100}%` }}
            >
              {c.label}
            </span>
          </div>
        ))}
      </div>
      <div className="relative mt-0.5 h-3 text-[9px] text-ink-3">
        <span className="absolute left-0">0</span>
        {marks.map((m) => (
          <span
            key={m.label}
            className="absolute -translate-x-1/2"
            style={{ left: `${(m.ft / max) * 100}%` }}
          >
            {m.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 7-day stage sparkline. */
function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const W = 120, H = 22;
  const min = Math.min(...values), maxV = Math.max(...values);
  const span = maxV - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * W},${H - 3 - ((v - min) / span) * (H - 6)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-[22px] w-[120px]" aria-label="7-day river stage trend">
      <polyline points={pts} fill="none" stroke="#3f9ad8" strokeWidth={1.5} />
      <circle
        cx={W}
        cy={H - 3 - ((values[values.length - 1] - min) / span) * (H - 6)}
        r={2}
        fill="#3f9ad8"
      />
    </svg>
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

const describeWeather = (code: number) =>
  WEATHER_CODES.find(([codes]) => codes.includes(code))?.[1] ?? "—";

function aqiStatus(aqi: number): { level: Level; text: string } {
  if (aqi <= 50) return { level: "good", text: "Good" };
  if (aqi <= 100) return { level: "caution", text: "Moderate" };
  if (aqi <= 150) return { level: "caution", text: "Sensitive" };
  return { level: "alert", text: "Unhealthy" };
}

interface AirState { aqi: number; pm25: number }
interface RiverState { stageFt: number | null; flowCfs: number | null; history: number[] }
interface WeatherState { temp: number; code: number; wind: number; todayHigh: number | null }

export function SystemsStrip() {
  const [air, setAir] = useState<AirState | null | "offline">(null);
  const [river, setRiver] = useState<RiverState | null | "offline">(null);
  const [weather, setWeather] = useState<WeatherState | null | "offline">(null);
  const [histAvgHigh, setHistAvgHigh] = useState<number | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [, forceTick] = useState(0);
  const histFetched = useRef(false);

  useEffect(() => {
    const { lat, lng } = county.center;

    const refreshLive = () => {
      fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=us_aqi,pm2_5`
      )
        .then((r) => r.json())
        .then((d) =>
          setAir({ aqi: Math.round(d.current.us_aqi), pm25: d.current.pm2_5 })
        )
        .catch(() => setAir((a) => (a && a !== "offline" ? a : "offline")));

      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m&daily=temperature_2m_max&forecast_days=1&temperature_unit=fahrenheit&wind_speed_unit=mph`
      )
        .then((r) => r.json())
        .then((d) =>
          setWeather({
            temp: d.current.temperature_2m,
            code: d.current.weather_code,
            wind: d.current.wind_speed_10m,
            todayHigh: d.daily?.temperature_2m_max?.[0] ?? null,
          })
        )
        .catch(() => setWeather((w) => (w && w !== "offline" ? w : "offline")));

      fetch(
        `https://waterservices.usgs.gov/nwis/iv/?format=json&sites=${riverGauge.station}&parameterCd=00060,00065&period=P7D`
      )
        .then((r) => r.json())
        .then((d) => {
          interface Series {
            variable: { variableCode: { value: string }[] };
            values: { value: { value: string }[] }[];
          }
          const series: Series[] = d.value.timeSeries;
          const seriesFor = (code: string) =>
            series.find((t) =>
              t.variable.variableCode.some((v) => v.value === code)
            )?.values[0]?.value ?? [];
          const stages = seriesFor("00065").map((v) => parseFloat(v.value));
          const flows = seriesFor("00060").map((v) => parseFloat(v.value));
          if (!stages.length && !flows.length) throw new Error("no data");
          const step = Math.max(1, Math.floor(stages.length / 90));
          setRiver({
            stageFt: stages.length ? stages[stages.length - 1] : null,
            flowCfs: flows.length ? flows[flows.length - 1] : null,
            history: stages.filter((_, i) => i % step === 0),
          });
        })
        .catch(() => setRiver((r) => (r && r !== "offline" ? r : "offline")));

      setUpdatedAt(new Date());
    };

    // 10-yr average high for this date — fetched once, not on refresh.
    const fetchHistorical = async () => {
      if (histFetched.current) return;
      histFetched.current = true;
      try {
        const now = new Date();
        const years = Array.from({ length: 10 }, (_, i) => now.getFullYear() - 1 - i);
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        const temps = await Promise.all(
          years.map(async (y) => {
            const mid = new Date(Date.UTC(y, now.getMonth(), now.getDate()));
            const a = new Date(mid); a.setUTCDate(a.getUTCDate() - 3);
            const b = new Date(mid); b.setUTCDate(b.getUTCDate() + 3);
            const d = await fetch(
              `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fmt(a)}&end_date=${fmt(b)}&daily=temperature_2m_max&temperature_unit=fahrenheit`
            ).then((r) => r.json());
            return (d.daily?.temperature_2m_max ?? []).filter(
              (t: number | null) => t != null
            ) as number[];
          })
        );
        const all = temps.flat();
        if (all.length)
          setHistAvgHigh(all.reduce((t, v) => t + v, 0) / all.length);
      } catch {
        /* the delta line just stays hidden */
      }
    };

    refreshLive();
    fetchHistorical();
    const refreshTimer = setInterval(refreshLive, REFRESH_MS);
    const tickTimer = setInterval(() => forceTick((t) => t + 1), 60_000);
    return () => {
      clearInterval(refreshTimer);
      clearInterval(tickTimer);
    };
  }, []);

  const allLive =
    air !== null && air !== "offline" &&
    river !== null && river !== "offline" &&
    weather !== null && weather !== "offline";

  const riverStatus = (() => {
    if (river === null || river === "offline" || river.stageFt === null)
      return { level: "caution" as Level, text: "Offline" };
    const s = river.stageFt;
    if (s >= riverGauge.stages.minor) return { level: "alert" as Level, text: "Flooding" };
    if (s >= riverGauge.stages.action) return { level: "alert" as Level, text: "Action stage" };
    return { level: "good" as Level, text: "Normal" };
  })();

  const tempDelta =
    weather !== null && weather !== "offline" &&
    weather.todayHigh !== null && histAvgHigh !== null
      ? Math.round((weather.todayHigh - histAvgHigh) * 10) / 10
      : null;

  const agoMin = updatedAt
    ? Math.max(0, Math.round((Date.now() - updatedAt.getTime()) / 60000))
    : null;

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
        {agoMin !== null && (
          <p className="text-[11px] text-ink-3">
            updated {agoMin === 0 ? "just now" : `${agoMin} min ago`} ·
            refreshes every 10 min
          </p>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {/* Air quality */}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              Air quality
            </p>
            {air === "offline" ? (
              <StatusChip level="caution" text="Offline" />
            ) : air ? (
              <StatusChip
                level={aqiStatus(air.aqi).level}
                text={aqiStatus(air.aqi).text}
              />
            ) : (
              <StatusChip level="good" text="Connecting" />
            )}
          </div>
          <p className="mt-1.5 font-display text-2xl font-semibold">
            {air === "offline" ? "—" : air ? `AQI ${air.aqi}` : "…"}
          </p>
          {air !== null && air !== "offline" && <AqiScale aqi={air.aqi} />}
          <p className="mt-1 truncate text-[11px] text-ink-3">
            {air === "offline"
              ? "Feed unreachable — retries automatically"
              : air
                ? `PM2.5 ${air.pm25} µg/m³ · EPA scale · Open-Meteo`
                : "Connecting to feed"}
          </p>
        </div>

        {/* River */}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              River — Levisa Fork
            </p>
            <StatusChip level={riverStatus.level} text={riverStatus.text} />
          </div>
          <div className="mt-1.5 flex items-end justify-between gap-2">
            <p className="font-display text-2xl font-semibold">
              {river === "offline"
                ? "—"
                : river
                  ? river.stageFt !== null
                    ? `${river.stageFt.toFixed(1)} ft`
                    : `${river.flowCfs} cfs`
                  : "…"}
            </p>
            {river !== null && river !== "offline" && (
              <Sparkline values={river.history} />
            )}
          </div>
          {river !== null && river !== "offline" && river.stageFt !== null && (
            <StageScale stageFt={river.stageFt} />
          )}
          <p className="mt-1 truncate text-[11px] text-ink-3">
            {river === "offline"
              ? "Feed unreachable — retries automatically"
              : river
                ? `7-day trend · hover scale for flood memory · USGS/NWS`
                : "Connecting to feed"}
          </p>
        </div>

        {/* Weather */}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              Weather — Pikeville
            </p>
            {weather === "offline" ? (
              <StatusChip level="caution" text="Offline" />
            ) : weather ? (
              <StatusChip
                level={weather.code >= 95 ? "caution" : "good"}
                text={weather.code >= 95 ? "Storms" : describeWeather(weather.code)}
              />
            ) : (
              <StatusChip level="good" text="Connecting" />
            )}
          </div>
          <p className="mt-1.5 font-display text-2xl font-semibold">
            {weather === "offline"
              ? "—"
              : weather
                ? `${Math.round(weather.temp)}°F`
                : "…"}
          </p>
          {weather !== null && weather !== "offline" && (
            <p className="mt-1 text-xs">
              {tempDelta === null ? (
                <span className="text-ink-3">vs 10-yr average: computing…</span>
              ) : (
                <span
                  className={
                    Math.abs(tempDelta) <= 2
                      ? "text-[var(--good-text)]"
                      : "text-[var(--warn-text)]"
                  }
                >
                  {Math.abs(tempDelta) <= 2
                    ? "≈ normal for this date"
                    : `${tempDelta > 0 ? "+" : ""}${tempDelta}°F vs 10-yr avg high`}
                  {histAvgHigh !== null && ` (avg ${Math.round(histAvgHigh)}°)`}
                </span>
              )}
            </p>
          )}
          <p className="mt-1 truncate text-[11px] text-ink-3">
            {weather === "offline"
              ? "Feed unreachable — retries automatically"
              : weather
                ? `wind ${Math.round(weather.wind)} mph · Open-Meteo`
                : "Connecting to feed"}
          </p>
        </div>

        {/* Landfill */}
        <div className="panel p-4">
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] uppercase tracking-wider text-ink-3">
              Landfill — Ford Branch
            </p>
            <ProvenanceBadge p={landfill.provenance} />
          </div>
          <p className="mt-1.5 font-display text-2xl font-semibold">
            ≈{landfill.weeklyIntakeTons.toLocaleString()}
            <span className="ml-1.5 text-sm font-normal text-ink-3">t/wk in</span>
          </p>
          <div className="mt-2">
            <Meter
              pct={landfill.runwayElapsedPct}
              label="3-yr runway used"
              compact
            />
          </div>
          <p className="mt-1 truncate text-[11px] text-ink-3">
            {landfill.remainingNote}
          </p>
        </div>
      </div>
    </div>
  );
}
