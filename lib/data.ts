/*
 * Pike County, Kentucky — dashboard data layer.
 *
 * Every figure carries a provenance flag so the site never silently
 * presents an estimate as fact:
 *   "census"   — decennial U.S. Census, verified
 *   "estimate" — public-data-derived estimate, verify against latest release
 *   "approx"   — approximate (esp. map coordinates), refine when sourced
 *   "needed"   — structural placeholder awaiting locally sourced data
 */

export type Provenance = "census" | "estimate" | "approx" | "needed";

export interface Stat {
  label: string;
  value: string;
  detail?: string;
  provenance: Provenance;
  source?: string;
}

export const county = {
  name: "Pike County",
  state: "Kentucky",
  seat: "Pikeville",
  founded: 1821,
  areaSqMi: 786.8, // U.S. Census — largest county in Kentucky by land area
  fips: "21195",
  center: { lng: -82.42, lat: 37.47 },
  bounds: [
    [-82.75, 37.18],
    [-81.95, 37.76],
  ] as [[number, number], [number, number]],
};

export const heroStats: Stat[] = [
  {
    label: "Population",
    value: "58,669",
    detail: "2020 Census · ≈57,000 current est.",
    provenance: "census",
    source: "U.S. Census 2020",
  },
  {
    label: "Land area",
    value: "787 mi²",
    detail: "Largest county in Kentucky",
    provenance: "census",
    source: "U.S. Census",
  },
  {
    label: "Incorporated cities",
    value: "3",
    detail: "Pikeville · Coal Run Village · Elkhorn City",
    provenance: "census",
  },
  {
    label: "Founded",
    value: "1821",
    detail: "County seat: Pikeville",
    provenance: "census",
  },
];

/* ---------------- People ---------------- */

export const populationHistory = [
  { year: 1960, pop: 68264, provenance: "census" as Provenance },
  { year: 1970, pop: 61059, provenance: "census" as Provenance },
  { year: 1980, pop: 81123, provenance: "census" as Provenance },
  { year: 1990, pop: 72583, provenance: "census" as Provenance },
  { year: 2000, pop: 68736, provenance: "census" as Provenance },
  { year: 2010, pop: 65024, provenance: "census" as Provenance },
  { year: 2020, pop: 58669, provenance: "census" as Provenance },
  { year: 2024, pop: 57000, provenance: "estimate" as Provenance },
];

export const ageDistribution = {
  provenance: "estimate" as Provenance,
  source: "ACS 5-year estimates — verify against latest release",
  medianAge: 42.7,
  groups: [
    { label: "Under 18", pct: 21 },
    { label: "18–24", pct: 7.5 },
    { label: "25–44", pct: 24 },
    { label: "45–64", pct: 27 },
    { label: "65+", pct: 20.5 },
  ],
};

export const cities = [
  {
    name: "Pikeville",
    pop2020: 7754,
    provenance: "census" as Provenance,
    note: "County seat · home of UPIKE & Pikeville Medical Center",
  },
  {
    name: "Coal Run Village",
    pop2020: 1672,
    provenance: "estimate" as Provenance,
    note: "Verify 2020 figure",
  },
  {
    name: "Elkhorn City",
    pop2020: 901,
    provenance: "estimate" as Provenance,
    note: "Gateway to the Breaks · verify 2020 figure",
  },
];

export const communities = [
  "Belfry", "Virgie", "Phelps", "Shelbiana", "Kimper", "Majestic",
  "Ransom", "Feds Creek", "McCarr", "Hardy", "Sidney", "Meta",
  "Raccoon", "Robinson Creek", "Regina", "Freeburn", "Stone", "Toler",
];

/* ---------------- Education ---------------- */

export const districts = [
  {
    name: "Pike County Schools",
    students: "7,719",
    provenance: "census" as Provenance,
    note: "20 schools · 5 high schools — NCES CCD 2023–24",
  },
  {
    name: "Pikeville Independent Schools",
    students: "1,177",
    provenance: "census" as Provenance,
    note: "Pikeville Elementary + Pikeville High (7–12) — NCES CCD 2023–24",
  },
];

export const educationNeeded = [
  "Full K-8 school roster with enrollment (KDE School Report Card)",
  "Test performance by school (KDE School Report Card — kyschoolreportcard.com)",
  "Attendance rates by school",
  "Student well-being / climate survey results (\"happiness\" metric — KDE Quality of School Climate and Safety survey)",
];

export const postSecondary = [
  {
    name: "University of Pikeville",
    kind: "Private university",
    detail:
      "Undergraduate + Elliott School of Nursing + Kentucky College of Osteopathic Medicine (KYCOM) + Kentucky College of Optometry (KYCO)",
    students: "≈2,400",
    provenance: "estimate" as Provenance,
  },
  {
    name: "Galen College of Nursing — Pikeville",
    kind: "Nursing college",
    detail:
      "LPN & ADN programs · partnership with Pikeville Medical Center · 150 Healthcare Dr",
    students: "≈120",
    provenance: "estimate" as Provenance,
  },
  {
    name: "Big Sandy Community & Technical College — Pikeville",
    kind: "Community & technical college",
    detail: "Associate degrees, nursing/allied health, workforce & technical training",
    students: "verify",
    provenance: "needed" as Provenance,
  },
  {
    name: "Belfry & Millard Area Technology Centers",
    kind: "Career & technical (secondary)",
    detail:
      "KY Tech System skilled-trades centers — students counted at home high schools; both mapped at exact locations",
    students: "—",
    provenance: "census" as Provenance,
  },
  {
    name: "Regional training (outside county)",
    kind: "Workforce access",
    detail:
      "TEKY/Interapt tech training & eKAMI advanced manufacturing (Paintsville) · TEK Center skilled trades (Magoffin Co.) — full in-county inventory still needed",
    students: "—",
    provenance: "needed" as Provenance,
  },
];

/* ---------------- Health ---------------- */

export const healthIndicators = {
  provenance: "estimate" as Provenance,
  source:
    "CDC PLACES / County Health Rankings — verify against latest release before publishing",
  items: [
    { label: "Adults with a disability", pct: 33 },
    { label: "Adult obesity", pct: 41 },
    { label: "Current smokers", pct: 28 },
    { label: "Diagnosed diabetes", pct: 16 },
    { label: "Coronary heart disease", pct: 9 },
  ],
  lifeExpectancy: "≈71 yrs",
};

/* ---------------- Environment & water ---------------- */

export const watersheds = [
  {
    name: "Levisa Fork",
    blurb:
      "The county's spine — flows through Pikeville beside the famous Cut-Through Project, one of the largest earth-moving projects in the western hemisphere.",
    tributaries: ["Johns Creek", "Shelby Creek", "Island Creek", "Raccoon Creek"],
    households: null,
  },
  {
    name: "Russell Fork",
    blurb:
      "Carves the Breaks — 'Grand Canyon of the South.' Class IV–V whitewater below the dam each October. Meets the Levisa at Millard.",
    tributaries: ["Elkhorn Creek", "Marrowbone Creek"],
    households: null,
  },
  {
    name: "Tug Fork",
    blurb:
      "Forms the WV border through Belfry, McCarr, and Freeburn — Hatfield–McCoy country. Joins the Levisa to form the Big Sandy.",
    tributaries: ["Pond Creek", "Blackberry Creek", "Peter Creek", "Grapevine Creek"],
    households: null,
  },
];

export const waterSystems = [
  {
    name: "Mountain Water District",
    detail: "Serves most of rural Pike County",
    provenance: "estimate" as Provenance,
  },
  {
    name: "Pikeville Water",
    detail: "City of Pikeville drinking water + wastewater treatment",
    provenance: "estimate" as Provenance,
  },
  {
    name: "Elkhorn City Water",
    detail: "Municipal system",
    provenance: "estimate" as Provenance,
  },
];

export const environmentNeeded = [
  "Landfill / transfer-station tonnage (weekly · annual) — Pike County Solid Waste",
  "Recycling & composting diversion tonnage",
  "Stream water-quality scores by tributary (KY Division of Water / Watershed Watch)",
  "Drinking-water & wastewater compliance gauges (EPA ECHO / KY DOW)",
  "Air-quality monitor data (nearest EPA AQS monitors)",
  "Households per tributary — computable from Census blocks + USGS NHD flowlines (I can compute this)",
];

/* ---------------- Property & economy ---------------- */

export const economyAnchors = [
  { name: "Pikeville Medical Center", detail: "Regional hospital — the county's largest employer", provenance: "estimate" as Provenance },
  { name: "University of Pikeville", detail: "Anchor institution, downtown Pikeville", provenance: "estimate" as Provenance },
  { name: "Public school districts", detail: "Among the largest employers countywide", provenance: "estimate" as Provenance },
];

export const propertyNeeded = [
  "Assessed value per acre by class (residential / commercial / industrial) — Pike County PVA",
  "City & county tax bases and rates (property + occupational)",
  "Development-direction parcels: industrial parks, AMLER reclamation sites",
  "Recent sales & valuation trends by district",
];

/* ---------------- Civic ---------------- */

export const officials = [
  { office: "County Judge/Executive", name: "Ray Jones II", provenance: "estimate" as Provenance, note: "verify current officeholder" },
  { office: "Mayor of Pikeville", name: "— verify —", provenance: "needed" as Provenance },
  { office: "Mayor of Coal Run Village", name: "— verify —", provenance: "needed" as Provenance },
  { office: "Mayor of Elkhorn City", name: "— verify —", provenance: "needed" as Provenance },
  { office: "Sheriff", name: "— verify —", provenance: "needed" as Provenance },
  { office: "County Clerk", name: "— verify —", provenance: "needed" as Provenance },
  { office: "Magistrates (6 districts)", name: "— verify —", provenance: "needed" as Provenance },
];

export const elections = {
  next: "General Election — Tuesday, November 3, 2026",
  detail:
    "County offices on the ballot: Judge/Executive, Magistrates, Sheriff, County Clerk, Jailer, County Attorney, Coroner, PVA",
  registeredVoters: null as number | null,
  registeredVotersNote:
    "Registered-voter counts by precinct — KY State Board of Elections",
  provenance: "estimate" as Provenance,
};

export const futureNeeded = [
  "Active grants (AMLER, ARC, state) with amounts and status",
  "Applied-for grants pipeline",
  "Active public & private investments",
  "Upcoming ballot items & public comment periods",
  "County & city strategic goals (fiscal court / SOAR alignment)",
];

/* ---------------- Map ---------------- */

export type MarkerCategory =
  | "city"
  | "school"
  | "postsecondary"
  | "recreation"
  | "water"
  | "medical"
  | "civic";

export interface MapMarker {
  id: string;
  name: string;
  category: MarkerCategory;
  lng: number;
  lat: number;
  blurb: string;
  approx?: boolean;
}

export const markerCategories: Record<
  MarkerCategory,
  { label: string; color: string }
> = {
  city: { label: "Cities & communities", color: "#0b9444" },
  school: { label: "K–12 schools", color: "#2a78d6" },
  postsecondary: { label: "Post-secondary", color: "#4a3aa7" },
  recreation: { label: "Recreation & culture", color: "#eda100" },
  water: { label: "Water & rivers", color: "#00acc1" },
  medical: { label: "Medical & health", color: "#e34948" },
  civic: { label: "Civic & economy", color: "#eb6834" },
};

// Coordinates are approximate (approx: true) until replaced with surveyed points.
export const mapMarkers: MapMarker[] = [
  { id: "pikeville", name: "Pikeville", category: "city", lng: -82.519, lat: 37.4793, blurb: "County seat · pop. 7,754 (2020)" },
  { id: "coalrun", name: "Coal Run Village", category: "city", lng: -82.546, lat: 37.504, blurb: "Incorporated city on US-23", approx: true },
  { id: "elkhorncity", name: "Elkhorn City", category: "city", lng: -82.349, lat: 37.304, blurb: "Gateway to the Breaks · Russell Fork", approx: true },
  { id: "belfry", name: "Belfry", category: "city", lng: -82.256, lat: 37.626, blurb: "Tug Fork valley community", approx: true },
  { id: "phelps", name: "Phelps", category: "city", lng: -82.162, lat: 37.48, blurb: "Eastern Pike community", approx: true },
  { id: "virgie", name: "Virgie", category: "city", lng: -82.586, lat: 37.332, blurb: "Shelby Valley community", approx: true },

  // K-12 school markers are generated from the NCES `schools` roster (real
  // coordinates) in PikeMap — not listed here.

  { id: "upike", name: "University of Pikeville", category: "postsecondary", lng: -82.5177, lat: 37.481, blurb: "Private university · Elliott School of Nursing · KYCOM · KYCO", approx: true },
  { id: "galen", name: "Galen College of Nursing — Pikeville", category: "postsecondary", lng: -82.53024, lat: 37.47291, blurb: "LPN & ADN nursing programs · PMC partnership · 150 Healthcare Dr" },
  { id: "bsctc", name: "Big Sandy CTC — Pikeville", category: "postsecondary", lng: -82.539, lat: 37.489, blurb: "Community & technical college · nursing/allied health & trades", approx: true },

  { id: "bobamos", name: "Bob Amos Park", category: "recreation", lng: -82.545, lat: 37.482, blurb: "Trails, sports fields, overlook", approx: true },
  { id: "arena", name: "Appalachian Wireless Arena", category: "recreation", lng: -82.518, lat: 37.478, blurb: "7,000-seat arena & expo center, downtown Pikeville", approx: true },
  { id: "heritage", name: "Big Sandy Heritage Center", category: "recreation", lng: -82.519, lat: 37.48, blurb: "Regional history museum · Hatfield–McCoy exhibits", approx: true },
  { id: "dils", name: "Dils Cemetery", category: "recreation", lng: -82.514, lat: 37.485, blurb: "Hatfield–McCoy Feud driving-tour site", approx: true },
  { id: "breaks", name: "Breaks Interstate Park", category: "recreation", lng: -82.294, lat: 37.288, blurb: "\"Grand Canyon of the South\" · KY/VA interstate park", approx: true },
  { id: "fishtrapsp", name: "Fishtrap Lake State Park", category: "recreation", lng: -82.416, lat: 37.429, blurb: "On Johns Creek arm of Fishtrap Lake", approx: true },

  { id: "fishtrapdam", name: "Fishtrap Lake & Dam", category: "water", lng: -82.42, lat: 37.435, blurb: "1,131-acre Army Corps reservoir on Johns Creek (1968)", approx: true },
  { id: "cutthrough", name: "Pikeville Cut-Through", category: "water", lng: -82.522, lat: 37.475, blurb: "Rerouted the Levisa Fork — ~18M yd³ moved, flood control + land", approx: true },
  { id: "levisagauge", name: "USGS gauge — Levisa Fork @ Pikeville", category: "water", lng: -82.518, lat: 37.4785, blurb: "Streamflow monitoring station", approx: true },
  { id: "confluence", name: "Levisa ∕ Russell Fork confluence", category: "water", lng: -82.402, lat: 37.4, blurb: "At Millard — the two forks meet", approx: true },

  { id: "courthouse", name: "Pike County Courthouse", category: "civic", lng: -82.5185, lat: 37.4795, blurb: "Fiscal court · county offices, downtown Pikeville", approx: true },
  { id: "soar", name: "SOAR headquarters", category: "civic", lng: -82.52, lat: 37.4805, blurb: "Shaping Our Appalachian Region — regional development", approx: true },
  { id: "healthdept", name: "Pike County Health Department", category: "medical", lng: -82.52, lat: 37.478, blurb: "Public health services, clinics & inspections — Pikeville", approx: true },
];

/* ---------------- Data ledger ---------------- */

export const dataLedger: {
  domain: string;
  have: string;
  need: string[];
}[] = [
  {
    domain: "People",
    have: "Decennial population 1960–2020, city populations, age structure (est.)",
    need: ["Latest ACS estimates", "Population by community/precinct"],
  },
  {
    domain: "Education",
    have: "Districts, high schools, post-secondary institutions",
    need: educationNeeded,
  },
  {
    domain: "Property & economy",
    have: "Anchor employers (qualitative)",
    need: propertyNeeded,
  },
  {
    domain: "Health",
    have: "Countywide chronic-condition estimates (CDC PLACES, unverified)",
    need: ["Verified CDC PLACES 2024 pull", "Disability % by tract", "Provider counts"],
  },
  {
    domain: "Environment & water",
    have: "Watershed structure, major tributaries, water systems, key sites",
    need: environmentNeeded,
  },
  {
    domain: "Civic & future",
    have: "Election calendar, office structure",
    need: [
      "Current officeholders (all offices)",
      "Registered voters by precinct",
      ...futureNeeded,
    ],
  },
];

/* ---------------- Operator console (live + placeholder ops data) ---------------- */

// News-derived figures (WYMT Oct 2024 / Feb 2026): the county hauls
// ~60,000 tons/yr; Ford Branch Landfill was reported ~3 years from capacity
// in Oct 2024; a private landfill agreement was signed Feb 2026.
export const landfill = {
  weeklyIntakeTons: 1150,
  yearlyTons: 60000,
  runwayElapsedPct: 60, // of the 3-yr runway reported Oct 2024
  remainingNote: "≈16 months to capacity at Ford Branch (est.)",
  note: "WYMT reporting · private landfill agreement signed Feb 2026 — official tonnage from Pike Co. Solid Waste will replace this",
  provenance: "estimate" as Provenance,
};

export const diversion = [
  { label: "Compost", tonsPerMonth: 12 },
  { label: "Plastics", tonsPerMonth: 8 },
  { label: "Metals", tonsPerMonth: 22 },
];

export const economyOps = {
  activeBusinesses: 1450,
  businessesNote: "Registered & active — KY Secretary of State (placeholder)",
  industries: [
    "Healthcare", "Education", "Energy", "Tourism & recreation",
    "Retail & food", "Construction", "Logistics", "Public sector",
  ],
  capitalDeployed: "$—M",
  capitalNote: "Active public + private investment (placeholder)",
  activeProjects: [
    "US 460 / Corridor Q completion",
    "AMLER mine-site redevelopment",
    "Downtown Pikeville housing",
  ],
  grantAppsOut: 5,
  provenance: "needed" as Provenance,
};

export const healthOps = {
  missedSchoolDays: null as number | null,
  missedWorkDays: null as number | null,
  note: "Absenteeism due to illness — districts + major employers (placeholder)",
  activeCases: [
    { label: "Influenza", cases: null as number | null },
    { label: "COVID-19", cases: null as number | null },
    { label: "RSV", cases: null as number | null },
  ],
  casesNote: "Syndromic surveillance — Pike County Health Dept (placeholder)",
  provenance: "needed" as Provenance,
};

export const educationOps = {
  totalEnrollment: 8896,
  enrollmentNote: "All 24 public schools — NCES CCD 2023–24",
  gradRate: 94,
  gradNote: "4-year cohort (placeholder)",
  proficiency: null as number | null,
  proficiencyNote: "Reading & math proficiency — KDE report card (placeholder)",
  provenance: "needed" as Provenance,
};

// USGS gauge + NWS flood stages for the river card — real values from
// api.water.noaa.gov gauge PKYK2 (Levisa Fork at Pikeville).
export const riverGauge = {
  station: "03209500",
  nwsLid: "PKYK2",
  name: "Levisa Fork at Pikeville",
  floodStageFt: 35, // NWS "minor flood" stage
  stages: { action: 28, minor: 35, moderate: 42, major: 50 },
  recordCrestFt: 52.72,
  recordCrestLabel: "record 52.7 ft — Jan 1957 flood",
};

/* ---------------- Communities by ZIP area ---------------- */

// Fetched from Census Reporter (ACS 2024 5-year, 2020–2024) — ZCTA total
// population per community post-office area. ZIP areas overlap city limits
// (Pikeville/Elkhorn City areas include their cities) and can cross county
// lines, so these read as "community area" populations, not precise counts.
// Dorton, Lookout, and Myra have no ZCTA of their own — folded into neighbors.
export const communityPops: { name: string; zip: string; pop: number }[] = [
  {
    name: "Pikeville area",
    zip: "41501",
    pop: 23754
  },
  {
    name: "Elkhorn City area",
    zip: "41522",
    pop: 4341
  },
  {
    name: "Virgie",
    zip: "41572",
    pop: 3249
  },
  {
    name: "Belfry",
    zip: "41514",
    pop: 2806
  },
  {
    name: "Phelps",
    zip: "41553",
    pop: 2269
  },
  {
    name: "Raccoon",
    zip: "41557",
    pop: 2117
  },
  {
    name: "Kimper",
    zip: "41539",
    pop: 1585
  },
  {
    name: "Shelbiana",
    zip: "41562",
    pop: 1541
  },
  {
    name: "Phyllis",
    zip: "41554",
    pop: 1156
  },
  {
    name: "Pinsonfork",
    zip: "41555",
    pop: 1039
  },
  {
    name: "Ransom",
    zip: "41558",
    pop: 978
  },
  {
    name: "Hardy",
    zip: "41531",
    pop: 902
  },
  {
    name: "Canada",
    zip: "41519",
    pop: 901
  },
  {
    name: "Mouthcard",
    zip: "41548",
    pop: 776
  },
  {
    name: "Huddy",
    zip: "41535",
    pop: 615
  },
  {
    name: "Stopover",
    zip: "41568",
    pop: 583
  },
  {
    name: "Sidney",
    zip: "41564",
    pop: 539
  },
  {
    name: "Lick Creek",
    zip: "41540",
    pop: 494
  },
  {
    name: "Shelby Gap",
    zip: "41563",
    pop: 453
  },
  {
    name: "Varney",
    zip: "41571",
    pop: 449
  },
  {
    name: "McCarr",
    zip: "41544",
    pop: 415
  },
  {
    name: "Ashcamp",
    zip: "41512",
    pop: 391
  },
  {
    name: "McAndrews",
    zip: "41543",
    pop: 370
  },
  {
    name: "Robinson Creek",
    zip: "41560",
    pop: 368
  },
  {
    name: "Freeburn",
    zip: "41528",
    pop: 331
  },
  {
    name: "Jonancy",
    zip: "41538",
    pop: 327
  },
  {
    name: "Fedscreek",
    zip: "41524",
    pop: 303
  },
  {
    name: "Majestic",
    zip: "41547",
    pop: 246
  },
  {
    name: "Regina",
    zip: "41559",
    pop: 234
  },
  {
    name: "Belcher",
    zip: "41513",
    pop: 204
  },
  {
    name: "Steele",
    zip: "41566",
    pop: 203
  },
  {
    name: "Hellier",
    zip: "41534",
    pop: 184
  },
  {
    name: "Stone",
    zip: "41567",
    pop: 78
  },
  {
    name: "Fords Branch",
    zip: "41526",
    pop: 0
  }
];

/* ---------------- Schools (NCES CCD 2023–24, federal directory) ---------------- */

// Real enrollment, grades, and coordinates for every public school in the
// county — NCES Common Core of Data via the Urban Institute API. The two
// Area Technology Centers report 0 enrollment because their students are
// counted at their home high schools.
export interface School {
  name: string;
  district: string;
  grades: string;
  enrollment: number;
  teachers: number | null;
  lat: number;
  lng: number;
}

export const schools: School[] = [
  {
    name: "Belfry Area Technology Center",
    district: "KY Tech System",
    grades: "8–12",
    enrollment: 0,
    teachers: null,
    lat: 37.624,
    lng: -82.2672
  },
  {
    name: "Millard Area Technology Center",
    district: "KY Tech System",
    grades: "8–12",
    enrollment: 0,
    teachers: null,
    lat: 37.387583,
    lng: -82.436997
  },
  {
    name: "Belfry Elementary",
    district: "Pike County Schools",
    grades: "PK–5",
    enrollment: 603,
    teachers: 35,
    lat: 37.6398,
    lng: -82.2554
  },
  {
    name: "Belfry High School",
    district: "Pike County Schools",
    grades: "9–12",
    enrollment: 477,
    teachers: 30,
    lat: 37.648169,
    lng: -82.265666
  },
  {
    name: "Belfry Middle School",
    district: "Pike County Schools",
    grades: "6–8",
    enrollment: 335,
    teachers: 22,
    lat: 37.622527,
    lng: -82.268574
  },
  {
    name: "Bevins Elementary School",
    district: "Pike County Schools",
    grades: "PK–5",
    enrollment: 236,
    teachers: 16,
    lat: 37.620939,
    lng: -82.353495
  },
  {
    name: "Dorton Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 267,
    teachers: 19,
    lat: 37.2781,
    lng: -82.5781
  },
  {
    name: "East Ridge High School",
    district: "Pike County Schools",
    grades: "9–12",
    enrollment: 419,
    teachers: 28,
    lat: 37.3625,
    lng: -82.307
  },
  {
    name: "Elkhorn City Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 424,
    teachers: 29,
    lat: 37.2983,
    lng: -82.3567
  },
  {
    name: "Feds Creek Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 157,
    teachers: 13,
    lat: 37.4012,
    lng: -82.2446
  },
  {
    name: "Johns Creek Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 619,
    teachers: 48,
    lat: 37.564583,
    lng: -82.454052
  },
  {
    name: "Kimper Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 117,
    teachers: 11,
    lat: 37.5164,
    lng: -82.3627
  },
  {
    name: "Millard School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 586,
    teachers: 37,
    lat: 37.386961,
    lng: -82.438667
  },
  {
    name: "Mullins Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 789,
    teachers: 47,
    lat: 37.515448,
    lng: -82.505018
  },
  {
    name: "Northpoint Academy",
    district: "Pike County Schools",
    grades: "6–12",
    enrollment: 55,
    teachers: 5,
    lat: 37.5377,
    lng: -82.5809
  },
  {
    name: "Phelps Elementary School",
    district: "Pike County Schools",
    grades: "PK–6",
    enrollment: 288,
    teachers: 23,
    lat: 37.503226,
    lng: -82.178989
  },
  {
    name: "Phelps High School",
    district: "Pike County Schools",
    grades: "7–12",
    enrollment: 252,
    teachers: 15,
    lat: 37.5026,
    lng: -82.1809
  },
  {
    name: "Pike County Central High School",
    district: "Pike County Schools",
    grades: "9–12",
    enrollment: 595,
    teachers: 35,
    lat: 37.514494,
    lng: -82.500354
  },
  {
    name: "Pike County Day Treatment",
    district: "Pike County Schools",
    grades: "5–12",
    enrollment: 17,
    teachers: 4,
    lat: 37.537819,
    lng: -82.580967
  },
  {
    name: "Pike County Virtual Academy",
    district: "Pike County Schools",
    grades: "K–12",
    enrollment: 103,
    teachers: 3,
    lat: 37.514494,
    lng: -82.500354
  },
  {
    name: "Shelby Valley High School",
    district: "Pike County Schools",
    grades: "9–12",
    enrollment: 500,
    teachers: 31,
    lat: 37.38,
    lng: -82.5378
  },
  {
    name: "Valley Elementary School",
    district: "Pike County Schools",
    grades: "PK–8",
    enrollment: 880,
    teachers: 48,
    lat: 37.381419,
    lng: -82.539585
  },
  {
    name: "Pikeville Elementary School",
    district: "Pikeville Independent",
    grades: "PK–6",
    enrollment: 641,
    teachers: 45,
    lat: 37.4769,
    lng: -82.5087
  },
  {
    name: "Pikeville High School",
    district: "Pikeville Independent",
    grades: "7–12",
    enrollment: 536,
    teachers: 39,
    lat: 37.4881,
    lng: -82.543
  }
];

export const highSchools = schools.filter(
  (s) => /High School/.test(s.name) && s.enrollment > 0
);

/* ---------------- Medical facilities (OpenStreetMap) ---------------- */

// Named healthcare facilities inside the county boundary, from OpenStreetMap
// (point-in-polygon filtered). OSM coverage is community-maintained — solid
// for the hospitals and Pikeville/Elkhorn City clusters, but rural clinics
// (e.g. Big Sandy Health Care sites) may be missing until we add them.
export const medicalFacilities: { name: string; kind: string; lat: number; lng: number }[] = [
  {
    name: "Akers Family Chiropractic",
    kind: "Chiropractic",
    lat: 37.47445,
    lng: -82.52491
  },
  {
    name: "Elkhorn City Clinic",
    kind: "Clinic",
    lat: 37.29607,
    lng: -82.36016
  },
  {
    name: "MCHC Elkhorn City Medical Clinic",
    kind: "Clinic",
    lat: 37.30349,
    lng: -82.35136
  },
  {
    name: "Pikeville Medical Diagnostic Center & Employee Health",
    kind: "Clinic",
    lat: 37.47349,
    lng: -82.52328
  },
  {
    name: "PMC Medical Diagnostics",
    kind: "Clinic",
    lat: 37.47359,
    lng: -82.52341
  },
  {
    name: "PMC Paint Management & Outpatient Pharmacy",
    kind: "Clinic",
    lat: 37.4726,
    lng: -82.52615
  },
  {
    name: "Aspen Dental",
    kind: "Dental",
    lat: 37.50543,
    lng: -82.53629
  },
  {
    name: "Big Sandy Dental Center",
    kind: "Dental",
    lat: 37.48494,
    lng: -82.50946
  },
  {
    name: "Elkhorn Dental",
    kind: "Dental",
    lat: 37.30549,
    lng: -82.35271
  },
  {
    name: "Asthma & Allergy Center",
    kind: "Physician office",
    lat: 37.46329,
    lng: -82.52646
  },
  {
    name: "Meta Medical Center: Dr. Ronnie C. Parker, DO",
    kind: "Physician office",
    lat: 37.56483,
    lng: -82.44436
  },
  {
    name: "Pediatric Associates of Pikeville",
    kind: "Physician office",
    lat: 37.46322,
    lng: -82.52641
  },
  {
    name: "PMC Employee Health",
    kind: "Physician office",
    lat: 37.47333,
    lng: -82.52301
  },
  {
    name: "PMC Physicians Clinic",
    kind: "Physician office",
    lat: 37.47229,
    lng: -82.53067
  },
  {
    name: "Pikeville Medical Center",
    kind: "Hospital",
    lat: 37.4709,
    lng: -82.52182
  },
  {
    name: "Tug Valley ARH Regional Medical Center",
    kind: "Hospital",
    lat: 37.67657,
    lng: -82.29666
  },
  {
    name: "Landmark of Elkhorn City (Health & Rehabilitation Center)",
    kind: "Nursing & rehab",
    lat: 37.29585,
    lng: -82.36097
  },
  {
    name: "Dr. Mary Anne Belcher O.D. PSC",
    kind: "Optometry",
    lat: 37.30445,
    lng: -82.34763
  },
  {
    name: "Elkhorn Drug",
    kind: "Pharmacy",
    lat: 37.30549,
    lng: -82.35389
  },
  {
    name: "Nichols Apothecary",
    kind: "Pharmacy",
    lat: 37.30702,
    lng: -82.35382
  }
];
