# Pike County Dashboard

An open civic dashboard for Pike County, Kentucky: an attempt to see the whole
county at once, including its people, schools, health, watersheds, economy,
and current initiatives.

**Live:** https://pikecodash.vercel.app

## What is on it

- `/`: the dashboard. Live weather, air quality, and Levisa Fork river stage
  at the top, then population, schools, health, land, waste, and current
  regional and county initiatives.
- `/map`: an interactive map of the county with schools, medical facilities,
  rivers and lakes, and the three fork watersheds.
- `/about`: where every number comes from, and the list of local datasets
  still wanted.

## How the data is labeled

Every figure in `lib/data.ts` carries a provenance flag, and the site shows it
as a badge next to the number:

| Badge | Meaning |
|---|---|
| `census` | Verified against an official federal dataset (Census, NCES, USGS/NWS). |
| `estimate` | Real public data not yet re-verified against the latest release, or a figure taken from news reporting. |
| `approx` | Approximate, usually a map location awaiting surveyed coordinates. |
| `needed` | A structural placeholder. The panel exists; the local data does not yet. |

The rule behind all four: the site never silently presents an estimate as
fact. Several operations panels (business counts, capital deployed,
absenteeism, graduation and proficiency rates) are still `needed`
placeholders and are badged that way on the page.

## Sources

U.S. Census (decennial, TIGER, ACS via Census Reporter), NCES Common Core of
Data, USGS and the National Weather Service, the USGS Watershed Boundary
Dataset, Open-Meteo, OpenStreetMap, CDC PLACES and County Health Rankings, and
dated news and government records for current initiatives and landfill
figures. The full list, with what each source is used for, is on `/about`.

## Contributing data

The `/about` page lists the local datasets that would replace placeholders,
such as PVA assessed values, KDE School Report Card exports, solid waste
tonnage, and county and city budgets. If you hold one of these, open an issue.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

Built with Next.js 16, React 19, Tailwind CSS 4, and MapLibre GL. Charts are
hand-written SVG components in `components/charts/`. Map data is static
GeoJSON in `public/data/`. The live readings are fetched in the browser from
public APIs, so there is no backend and no API keys.
