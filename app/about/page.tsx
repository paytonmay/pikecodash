import Link from "next/link";
import { SectionHeader, ProvenanceBadge } from "@/components/ui";

export const metadata = {
  title: "About — Pike County Dashboard",
  description:
    "What this dashboard is, where every number comes from, and how to contribute data.",
};

const sources = [
  { name: "U.S. Census (decennial + TIGER)", used: "Population history, city populations, county boundary geometry" },
  { name: "Census Reporter (ACS 2024 5-year)", used: "Community populations by ZIP tabulation area" },
  { name: "NCES Common Core of Data 2023–24 (via Urban Institute)", used: "Every public school: enrollment, grades, coordinates" },
  { name: "USGS + National Weather Service", used: "Live Levisa Fork stage & flow (gauge 03209500 / PKYK2), flood stages, historic crests" },
  { name: "Open-Meteo", used: "Live weather, air quality (US AQI), and the 10-year temperature archive" },
  { name: "USGS Watershed Boundary Dataset", used: "The three fork basins shaded on the map" },
  { name: "OpenStreetMap", used: "Medical facilities, basemap, rivers and lake geometry (© OSM contributors, © CARTO)" },
  { name: "CDC PLACES / County Health Rankings", used: "Chronic-condition prevalence (flagged estimates pending verification)" },
  { name: "News & government records (WYMT, Team Kentucky, ARC, halrogers.house.gov)", used: "Current initiatives, landfill figures — dated snapshots, flagged" },
];

const wanted = [
  "Pike County PVA — assessed values by property class & district",
  "KDE School Report Card exports — scores, attendance, climate survey",
  "Pike County Solid Waste — landfill tonnage & permitted capacity, recycling diversion",
  "County & city budgets — tax bases and rates",
  "Fiscal court — active grants, applications, and capital projects",
  "Registered voters by precinct (KY State Board of Elections)",
  "Health department — syndromic surveillance (flu / COVID / RSV)",
  "Current officeholders for every county & city office",
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 pb-24 sm:px-6">
      <header className="sticky top-0 z-20 -mx-4 mb-8 border-b border-hairline bg-page/85 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold tracking-[0.2em] text-accent">
            PIKE·CO<span className="text-ink-3">/ABOUT</span>
          </span>
          <Link
            href="/"
            className="rounded-sm border border-hairline-strong px-2.5 py-1 text-[11px] text-accent hover:bg-accent-dim"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <SectionHeader
        kicker="About"
        title="What this is"
        blurb="An open civic dashboard for Pike County, Kentucky — an attempt to see the whole county at once: its people, schools, health, watersheds, economy, and forward motion. Built in the open, sourced in the open, aiming to make Pike the most transparent county in the country."
      />

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold">
          How to read the badges
        </h2>
        <div className="panel space-y-3 p-5 text-sm text-ink-2">
          <p className="flex items-center gap-3">
            <ProvenanceBadge p="census" />
            Verified against an official federal dataset (Census, NCES, USGS/NWS).
          </p>
          <p className="flex items-center gap-3">
            <ProvenanceBadge p="estimate" />
            Real public data that hasn&apos;t been re-verified against the latest release, or news-derived figures.
          </p>
          <p className="flex items-center gap-3">
            <ProvenanceBadge p="approx" />
            Approximate — usually a map location awaiting surveyed coordinates.
          </p>
          <p className="flex items-center gap-3">
            <ProvenanceBadge p="needed" />
            A structural placeholder: the panel exists, the local data doesn&apos;t yet.
          </p>
          <p className="border-t border-hairline pt-3">
            The rule behind all four: <strong className="text-ink">the site never
            silently presents an estimate as fact.</strong>
          </p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold">Sources</h2>
        <div className="overflow-hidden rounded-sm border border-hairline-strong">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-hairline bg-surface-1">
              {sources.map((s) => (
                <tr key={s.name} className="align-top">
                  <td className="px-4 py-2.5 font-medium">{s.name}</td>
                  <td className="px-4 py-2.5 text-ink-2">{s.used}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-ink-3">
          Live feeds (river, weather, air) refresh every 10 minutes in your
          browser — nothing is stored or tracked.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 font-display text-lg font-semibold">
          Have data we&apos;re missing?
        </h2>
        <div className="panel p-5">
          <p className="text-sm text-ink-2">
            The fastest way to make this dashboard better is to send data. If
            you work for — or know someone at — any of these offices, we&apos;d
            love an export in any format:
          </p>
          <ul className="mt-3 grid gap-1.5 text-sm text-ink-2 sm:grid-cols-2">
            {wanted.map((w) => (
              <li key={w} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {w}
              </li>
            ))}
          </ul>
          <a
            href="mailto:may.payton@bitsourceky.com?subject=Pike%20County%20Dashboard%20data"
            className="mt-4 inline-block rounded-sm border border-hairline-strong px-3 py-1.5 text-sm text-accent hover:bg-accent-dim"
          >
            Send data or corrections →
          </a>
        </div>
      </section>

      <footer className="mt-12 border-t border-hairline pt-4 text-center text-xs text-ink-3">
        Open source ·{" "}
        <a
          href="https://github.com/paytonmay/pikecodash"
          className="text-accent hover:underline"
        >
          github.com/paytonmay/pikecodash
        </a>{" "}
        · Map data © OpenStreetMap contributors © CARTO
      </footer>
    </main>
  );
}
