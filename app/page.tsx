"use client";

import Link from "next/link";
import {
  populationHistory,
  ageDistribution,
  cities,
  communityPops,
  districts,
  educationNeeded,
  postSecondary,
  healthIndicators,
  watersheds,
  waterSystems,
  environmentNeeded,
  economyAnchors,
  propertyNeeded,
  officials,
  elections,
  futureNeeded,
  dataLedger,
  schools,
  highSchools,
  diversion,
  economyOps,
  healthOps,
  educationOps,
  initiatives,
} from "@/lib/data";
import { TrendLine } from "@/components/charts/TrendLine";
import { HBars } from "@/components/charts/HBars";
import { PikeMap, focusMap } from "@/components/map/PikeMap";
import { communityCentroids } from "@/lib/data";
import { SystemsStrip } from "@/components/live/SystemsStrip";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ClusterLabel, ProvenanceBadge, NeededList } from "@/components/ui";

const fmtPop = (v: number) => `${Math.round(v / 1000)}k`;

function CardLabel({
  children,
  badge,
}: {
  children: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <p className="text-[11px] uppercase tracking-wider text-ink-3">
        {children}
      </p>
      {badge}
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-screen-2xl px-3 pb-16 sm:px-5">
      {/* ---- Command bar ---- */}
      <header className="sticky top-0 z-20 -mx-3 mb-4 border-b border-hairline bg-page/85 px-3 py-2.5 backdrop-blur sm:-mx-5 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
          <div className="flex min-w-0 items-baseline gap-3">
            <span className="shrink-0 font-display text-sm font-semibold tracking-[0.2em] text-accent">
              PIKE·CO<span className="text-ink-3">/DASH</span>
            </span>
            <span className="hidden text-[11px] text-ink-3 lg:inline">
              Pike County, Kentucky · 787 mi² · pop. 58,669 (2020)
            </span>
          </div>
          <nav className="order-last flex w-full min-w-0 gap-4 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-wider text-ink-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:order-none sm:w-auto [&::-webkit-scrollbar]:hidden">
            <a href="#ops" className="hover:text-accent">Ops</a>
            <a href="#initiatives" className="hover:text-accent">Initiatives</a>
            <a href="#map" className="hover:text-accent">Map</a>
            <a href="#people" className="hover:text-accent">People</a>
            <a href="#education" className="hover:text-accent">Education</a>
            <a href="#health" className="hover:text-accent">Health</a>
            <a href="#water" className="hover:text-accent">Water</a>
            <a href="#civic" className="hover:text-accent">Civic</a>
            <Link href="/about" className="hover:text-accent">About</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/map"
              className="rounded-sm border border-hairline-strong px-2.5 py-1 text-[11px] text-accent hover:bg-accent-dim"
            >
              <span className="hidden sm:inline">Fullscreen map ↗</span>
              <span className="sm:hidden">Map ↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Row 1: live systems ---- */}
      <div id="ops" className="scroll-mt-16">
        <SystemsStrip />
      </div>

      {/* ---- Row 2: waste + economy ---- */}
      <ClusterLabel
        label="Waste & economy"
        note="placeholder figures carry a badge until sourced"
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p="needed" />}>
            Diverted from landfill
          </CardLabel>
          <HBars
            bars={diversion.map((d) => ({
              label: d.label,
              value: d.tonsPerMonth,
            }))}
            formatValue={(v) => `${v} t/mo`}
            color="var(--series-3)"
            max={30}
            compact
          />
          <p className="mt-2 text-[11px] text-ink-3">
            Compost + recycling — every ton here stays out of the landfill meter
          </p>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={economyOps.provenance} />}>
            Active businesses
          </CardLabel>
          <p className="font-display text-3xl font-semibold">
            {economyOps.activeBusinesses.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-3">
            {economyOps.businessesNote}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {economyOps.industries.map((i) => (
              <span
                key={i}
                className="rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] text-ink-2"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={economyOps.provenance} />}>
            Capital deployed
          </CardLabel>
          <p className="font-display text-3xl font-semibold">
            {economyOps.capitalDeployed}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-3">{economyOps.capitalNote}</p>
          <ul className="mt-2.5 space-y-1">
            {economyOps.activeProjects.map((p) => (
              <li key={p} className="flex items-start gap-1.5 text-xs text-ink-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={economyOps.provenance} />}>
            Grant applications out
          </CardLabel>
          <p className="font-display text-3xl font-semibold">
            {economyOps.grantAppsOut}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-3">
            AMLER · ARC · state — fiscal-court list will replace this
          </p>
          <a
            href="#civic"
            className="mt-3 inline-block rounded-sm border border-hairline-strong px-2 py-1 text-[11px] text-accent hover:bg-accent-dim"
          >
            Civic & future ↓
          </a>
        </div>
      </div>

      {/* ---- Current initiatives ---- */}
      <ClusterLabel
        label="Current initiatives"
        note="news-sourced snapshot · July 2026 — fiscal court & SOAR lists will make this live"
      />
      <div id="initiatives" className="grid scroll-mt-16 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {initiatives.map((init) => (
          <div key={init.name} className="panel flex flex-col p-4">
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <span
                className={`rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                  init.status === "Completed"
                    ? "border-[var(--good-text)]/40 text-[var(--good-text)]"
                    : init.status === "Exploratory"
                      ? "border-[var(--warn-text)]/50 text-[var(--warn-text)]"
                      : "border-accent/40 text-accent"
                }`}
              >
                {init.status}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-ink-3">
                {init.scope}
              </span>
            </div>
            <h3 className="text-sm font-semibold leading-snug">{init.name}</h3>
            <p className="mt-0.5 text-[11px] text-ink-3">{init.lead}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
              {init.blurb}
            </p>
          </div>
        ))}
      </div>

      {/* ---- Row 3: health + learning pulse ---- */}
      <ClusterLabel label="Health & learning pulse" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={healthOps.provenance} />}>
            Days missed to illness
          </CardLabel>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-display text-3xl font-semibold">
                {healthOps.missedSchoolDays?.toLocaleString() ?? "—"}
              </p>
              <p className="text-[11px] text-ink-3">school · this month</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">
                {healthOps.missedWorkDays?.toLocaleString() ?? "—"}
              </p>
              <p className="text-[11px] text-ink-3">work · this month</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ink-3">{healthOps.note}</p>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={healthOps.provenance} />}>
            Active cases
          </CardLabel>
          <div className="divide-y divide-hairline">
            {healthOps.activeCases.map((c) => (
              <div key={c.label} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-ink-2">{c.label}</span>
                <span className="font-display text-base">
                  {c.cases?.toLocaleString() ?? "—"}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-1.5 text-[11px] text-ink-3">{healthOps.casesNote}</p>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p="estimate" />}>
            Total K–12 enrollment
          </CardLabel>
          <p className="font-display text-3xl font-semibold">
            {educationOps.totalEnrollment.toLocaleString()}
          </p>
          <p className="mt-0.5 text-[11px] text-ink-3">
            {educationOps.enrollmentNote}
          </p>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p="needed" />}>
            Graduation & proficiency
          </CardLabel>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-display text-3xl font-semibold">
                {educationOps.gradRate}%
              </p>
              <p className="text-[11px] text-ink-3">4-yr graduation</p>
            </div>
            <div>
              <p className="font-display text-3xl font-semibold">
                {educationOps.proficiency ? `${educationOps.proficiency}%` : "—"}
              </p>
              <p className="text-[11px] text-ink-3">reading & math</p>
            </div>
          </div>
          <p className="mt-2 text-[11px] text-ink-3">
            {educationOps.proficiencyNote}
          </p>
        </div>
      </div>

      {/* ---- Map ---- */}
      <ClusterLabel
        label="Territory"
        note="amber-flagged pins are approximate locations"
      />
      <div id="map" className="scroll-mt-16">
        <PikeMap heightClass="h-[480px]" />
      </div>

      {/* ---- People ---- */}
      <ClusterLabel label="People" note="the county's central storyline" />
      <div id="people" className="grid scroll-mt-16 gap-3 xl:grid-cols-4">
        <div className="panel p-4 xl:col-span-2">
          <CardLabel>
            Population 1960–2024 · hollow point = estimate
          </CardLabel>
          <TrendLine
            points={populationHistory.map((d) => ({
              x: d.year,
              y: d.pop,
              flag: d.provenance === "estimate" ? "estimate" : undefined,
            }))}
            formatY={fmtPop}
            height={200}
          />
          <p className="mt-1 text-[11px] text-ink-3">
            Peak 81,123 (1980, coal boom) · U.S. Census decennial counts
          </p>
        </div>
        <div className="panel p-4">
          <CardLabel badge={<ProvenanceBadge p={ageDistribution.provenance} />}>
            Age distribution
          </CardLabel>
          <HBars
            bars={ageDistribution.groups.map((g) => ({
              label: g.label,
              value: g.pct,
            }))}
            formatValue={(v) => `${v}%`}
            max={30}
            compact
          />
          <p className="mt-2 text-[11px] text-ink-3">
            Median age {ageDistribution.medianAge}
          </p>
        </div>
        <div className="panel p-4">
          <CardLabel>Incorporated cities · 2020</CardLabel>
          <HBars
            bars={cities.map((c) => ({
              label: c.name,
              value: c.pop2020,
              detail: c.note,
            }))}
            formatValue={(v) => v.toLocaleString()}
            compact
          />
          <p className="mt-3 text-[11px] text-ink-3">
            Only three cities are incorporated — most of Pike County lives in
            the {communityPops.length} community areas below.
          </p>
        </div>
        <div className="panel p-4 xl:col-span-4">
          <CardLabel badge={<ProvenanceBadge p="estimate" />}>
            Communities — population by ZIP area · ACS 2020–2024
          </CardLabel>
          <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {communityPops.map((c) => {
              const cen = communityCentroids[c.zip];
              return (
                <button
                  key={c.zip}
                  onClick={() =>
                    cen &&
                    focusMap({
                      ...cen,
                      name: c.name,
                      blurb: `${c.pop.toLocaleString()} people · ZIP-area (ACS 2020–24)`,
                    })
                  }
                  className="flex items-baseline justify-between gap-2 border-b border-hairline py-1 text-left hover:bg-accent-dim"
                  title="Show on map"
                >
                  <span className="truncate text-xs text-ink-2">
                    {c.name}
                    <span className="ml-1 text-[10px] text-ink-3">{c.zip}</span>
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {c.pop.toLocaleString()}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-ink-3">
            ZIP tabulation areas overlap city limits — the Pikeville and
            Elkhorn City areas include their cities — and can cross county
            lines. Dorton, Lookout, and Myra have no ZIP area of their own.
            Source: Census Reporter, ACS 2024 5-year.
          </p>
        </div>
      </div>

      {/* ---- Education ---- */}
      <ClusterLabel label="Education" note="K through career, inside one county" />
      <div id="education" className="grid scroll-mt-16 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {districts.map((d) => (
          <div key={d.name} className="panel p-4">
            <CardLabel badge={<ProvenanceBadge p={d.provenance} />}>
              {d.name}
            </CardLabel>
            <p className="font-display text-3xl font-semibold text-accent">
              {d.students}
              <span className="ml-1.5 text-sm font-normal text-ink-3">
                students
              </span>
            </p>
            <p className="mt-1.5 text-xs text-ink-2">{d.note}</p>
          </div>
        ))}
        <div className="panel p-4 xl:col-span-2">
          <CardLabel badge={<ProvenanceBadge p="census" />}>
            High schools · enrollment · NCES 2023–24
          </CardLabel>
          <HBars
            bars={[...highSchools]
              .sort((a, b) => b.enrollment - a.enrollment)
              .map((s) => ({
                label: s.name.replace(" High School", ""),
                value: s.enrollment,
                detail: `${s.district} · grades ${s.grades}`,
              }))}
            formatValue={(v) => v.toLocaleString()}
            compact
          />
          <p className="mt-2 text-[11px] text-ink-3">
            Five county high schools + Pikeville High (independent district).
            Alt programs: Northpoint Academy (55) · Virtual Academy (103) · Day
            Treatment (17).
          </p>
        </div>
        <div className="panel p-4 sm:col-span-2 xl:col-span-4">
          <CardLabel badge={<ProvenanceBadge p="census" />}>
            Every public school — enrollment · NCES 2023–24
          </CardLabel>
          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...schools]
              .sort((a, b) => b.enrollment - a.enrollment)
              .map((s) => (
                <button
                  key={s.name}
                  onClick={() =>
                    focusMap({ lng: s.lng, lat: s.lat, name: s.name })
                  }
                  className="flex items-baseline justify-between gap-2 border-b border-hairline py-1 text-left hover:bg-accent-dim"
                  title="Show on map"
                >
                  <span className="truncate text-xs text-ink-2">
                    {s.name}
                    <span className="ml-1 text-[10px] text-ink-3">
                      {s.grades}
                    </span>
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {s.enrollment > 0 ? s.enrollment.toLocaleString() : "ATC"}
                  </span>
                </button>
              ))}
          </div>
          <p className="mt-2 text-[11px] text-ink-3">
            ATC = Area Technology Center (Belfry & Millard) — students counted
            at their home high schools. All pins on the map use these exact
            federal coordinates.
          </p>
        </div>
        <div className="panel p-4 xl:col-span-2">
          <CardLabel>Post-secondary & training</CardLabel>
          <div className="divide-y divide-hairline">
            {postSecondary.map((p) => (
              <div
                key={p.name}
                className="flex items-start justify-between gap-3 py-2"
              >
                <div>
                  <p className="text-xs font-medium">{p.name}</p>
                  <p className="text-[11px] text-ink-3">{p.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-sm">{p.students}</p>
                  <ProvenanceBadge p={p.provenance} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4 sm:col-span-2 xl:col-span-4">
          <CardLabel>To make this cluster sing</CardLabel>
          <NeededList items={educationNeeded} />
        </div>
      </div>

      {/* ---- Health ---- */}
      <ClusterLabel label="Human health" note="long-term picture under the pulse above" />
      <div id="health" className="grid scroll-mt-16 gap-3 xl:grid-cols-4">
        <div className="panel p-4 xl:col-span-3">
          <CardLabel badge={<ProvenanceBadge p={healthIndicators.provenance} />}>
            Adult prevalence (%)
          </CardLabel>
          <HBars
            bars={healthIndicators.items.map((i) => ({
              label: i.label,
              value: i.pct,
            }))}
            formatValue={(v) => `${v}%`}
            color="var(--series-red)"
            max={50}
            compact
          />
          <p className="mt-2 text-[11px] text-ink-3">{healthIndicators.source}</p>
        </div>
        <div className="panel flex flex-col justify-center p-4 text-center">
          <p className="text-[11px] uppercase tracking-wider text-ink-3">
            Life expectancy
          </p>
          <p className="mt-1 font-display text-4xl font-semibold">
            {healthIndicators.lifeExpectancy}
          </p>
          <p className="mt-1.5 text-xs text-ink-2">
            vs ≈77 nationally — the gap to close
          </p>
          <div className="mt-2 self-center">
            <ProvenanceBadge p="estimate" />
          </div>
        </div>
      </div>

      {/* ---- Water ---- */}
      <ClusterLabel
        label="Environment & water"
        note="every hollow drains to the Big Sandy"
      />
      <div id="water" className="grid scroll-mt-16 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {watersheds.map((w) => (
          <div key={w.name} className="panel p-4">
            <p className="font-display text-base font-semibold text-[var(--water-text)]">
              {w.name}
            </p>
            <p className="mt-1.5 text-xs text-ink-2">{w.blurb}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {w.tributaries.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-hairline px-1.5 py-0.5 text-[10px] text-ink-2"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-[11px] text-[var(--alert-text)]">
              Households on this fork: data needed
            </p>
          </div>
        ))}
        <div className="panel p-4">
          <CardLabel>Public water systems</CardLabel>
          <div className="space-y-2">
            {waterSystems.map((s) => (
              <div key={s.name}>
                <p className="text-xs font-medium">{s.name}</p>
                <p className="text-[11px] text-ink-3">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4 sm:col-span-2 xl:col-span-4">
          <CardLabel>Environmental gauges to wire in</CardLabel>
          <NeededList items={environmentNeeded} />
        </div>
      </div>

      {/* ---- Property & economy detail ---- */}
      <ClusterLabel label="Property & tax base" note="waiting on PVA + fiscal-court data" />
      <div className="grid gap-3 xl:grid-cols-4">
        <div className="panel p-4">
          <CardLabel>Anchor institutions</CardLabel>
          <div className="space-y-2">
            {economyAnchors.map((a) => (
              <div key={a.name}>
                <p className="text-xs font-medium">{a.name}</p>
                <p className="text-[11px] text-ink-3">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4 xl:col-span-3">
          <CardLabel>Data needed to light this up</CardLabel>
          <NeededList items={propertyNeeded} />
          <p className="mt-2 text-[11px] text-ink-3">
            Once sourced: per-acre value choropleth on the map, tax-base trends
            per city, development-direction overlay.
          </p>
        </div>
      </div>

      {/* ---- Civic ---- */}
      <ClusterLabel label="Civic & future" note="who serves, and what's next" />
      <div id="civic" className="grid scroll-mt-16 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel p-4 xl:col-span-2">
          <CardLabel>Elected officials</CardLabel>
          <div className="grid gap-x-4 sm:grid-cols-2">
            {officials.map((o) => (
              <div
                key={o.office}
                className="flex items-center justify-between gap-2 border-b border-hairline py-1.5"
              >
                <div>
                  <p className="text-[11px] text-ink-3">{o.office}</p>
                  <p className="text-xs">{o.name}</p>
                </div>
                <ProvenanceBadge p={o.provenance} />
              </div>
            ))}
          </div>
        </div>
        <div className="panel p-4">
          <CardLabel>Next election</CardLabel>
          <p className="font-display text-2xl font-semibold">Nov 3, 2026</p>
          <p className="mt-1.5 text-xs text-ink-2">{elections.detail}</p>
          <p className="mt-2 text-[11px] text-[var(--alert-text)]">
            {elections.registeredVotersNote}
          </p>
        </div>
        <div className="panel p-4">
          <CardLabel>Forward motion</CardLabel>
          <NeededList items={futureNeeded} />
        </div>
      </div>

      {/* ---- Data ledger ---- */}
      <ClusterLabel
        label="Data ledger"
        note="verified vs estimated vs needed — the sourcing checklist"
      />
      <div className="overflow-x-auto rounded-sm border border-hairline-strong">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-surface-2 text-[11px] uppercase tracking-wider text-ink-3">
            <tr>
              <th className="px-3 py-2">Domain</th>
              <th className="px-3 py-2">In hand</th>
              <th className="px-3 py-2">Needed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline bg-surface-1">
            {dataLedger.map((row) => (
              <tr key={row.domain} className="align-top">
                <td className="px-3 py-2 font-medium">{row.domain}</td>
                <td className="px-3 py-2 text-ink-2">{row.have}</td>
                <td className="px-3 py-2 text-ink-2">
                  <ul className="list-disc space-y-0.5 pl-4 marker:text-[var(--alert-text)]">
                    {row.need.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-10 border-t border-hairline pt-4 text-center text-[11px] text-ink-3">
        <p>
          Pike County Dashboard · <a href="/about" className="text-accent hover:underline">about this project</a> ·{" "}
          <span className="text-accent">
            aiming to be the most progressive county in the country
          </span>{" "}
          · Map data © OpenStreetMap contributors © CARTO · Boundary: U.S.
          Census TIGER
        </p>
      </footer>
    </main>
  );
}
