// Import all tools from apibase.pro catalog into UnifyAPI database
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ── Broad category definitions ─────────────────────────────────────────────

const CATEGORIES = [
  { slug: "weather",       name: "Weather",            description: "Forecasts, air quality, climate, and atmospheric data.",           icon: "cloud" },
  { slug: "finance",       name: "Finance",            description: "Stocks, FX, bonds, banking, and economic indicators.",             icon: "trending-up" },
  { slug: "crypto",        name: "Crypto",             description: "Token prices, on-chain data, DeFi, and prediction markets.",       icon: "bitcoin" },
  { slug: "travel",        name: "Travel",             description: "Flights, hotels, shipping, logistics, and trip planning.",         icon: "plane" },
  { slug: "news",          name: "News & Media",       description: "Headlines, articles, broadcasts, and topical coverage.",           icon: "newspaper" },
  { slug: "search",        name: "Web Search",         description: "Search the web and extract clean page content.",                   icon: "search" },
  { slug: "ai",            name: "AI & ML",            description: "Text, image, audio, and vision models.",                           icon: "sparkles" },
  { slug: "geo",           name: "Geo & Maps",         description: "Geocoding, routing, elevation, tides, and timezone lookups.",      icon: "map-pin" },
  { slug: "health",        name: "Health",             description: "Nutrition, exercise, medical reference, drug, and genomic data.",  icon: "heart-pulse" },
  { slug: "education",     name: "Education",          description: "Dictionaries, translation, books, and language learning.",         icon: "graduation-cap" },
  { slug: "reference",     name: "Reference",          description: "Encyclopedic facts, quotes, public records, and directories.",     icon: "book-open" },
  { slug: "games",         name: "Games & Entertainment", description: "Video games, sports, chess, anime, and entertainment data.",    icon: "gamepad" },
  { slug: "space",         name: "Space & Astronomy",  description: "NASA, ISS, exoplanets, space weather, and celestial data.",       icon: "telescope" },
  { slug: "jobs",          name: "Jobs & Careers",     description: "Job listings, remote work, and employment data.",                 icon: "briefcase" },
  { slug: "developer",     name: "Developer Tools",    description: "GitHub, npm, packages, security advisories, and web utilities.",  icon: "code-2" },
  { slug: "government",    name: "Government & Legal", description: "Congress, regulations, court records, and public data.",          icon: "landmark" },
  { slug: "business",      name: "Business",           description: "Company lookup, enrichment, VAT, IBAN, and email verification.",  icon: "building-2" },
  { slug: "communication", name: "Communication",      description: "SMS, email, messaging, and social platform APIs.",                icon: "message-square" },
  { slug: "food",          name: "Food & Nutrition",   description: "Recipes, nutrition facts, and cocktail data.",                    icon: "utensils" },
  { slug: "science",       name: "Science & Research", description: "Chemistry, biology, genomics, environment, and open data.",       icon: "flask-conical" },
  { slug: "media",         name: "Media & Arts",       description: "Images, music, podcasts, museums, and cultural data.",            icon: "image" },
  { slug: "security",      name: "Security",           description: "IP intelligence, domain lookup, SSL, and vulnerability data.",    icon: "shield" },
  { slug: "social",        name: "Social",             description: "Bluesky, Mastodon, Twitter/X, and social platform data.",         icon: "users" },
  { slug: "data",          name: "Data & Analytics",   description: "Statistics, time series, enrichment, and open datasets.",        icon: "database" },
];

// ── Map apibase.pro category slug → UnifyAPI broad category slug ────────────

const CATEGORY_MAP: Record<string, string> = {
  // Weather & Environment
  weather_alerts: "weather", weatherapi: "weather", metno: "weather", noaa: "weather",
  awc: "weather", avwx: "weather", checkwx: "weather", airquality: "weather",
  airnow: "weather", drought: "weather", climate: "weather", ncei: "weather",
  gdacs: "weather", carbonintensity: "weather", opensensemap: "weather", cma: "weather",

  // Finance
  finance: "finance", finnhub: "finance", exchangerate: "finance", frankfurter: "finance",
  bankofcanada: "finance", bcb: "finance", mfapi: "finance", rateapi: "finance",
  edgar: "finance", fdic: "finance", figi: "finance", lei: "finance",
  eurostat: "finance", scb: "finance", ssbnorway: "finance", worldbank: "finance",
  spending: "finance", canopy: "finance", carmarket: "finance", iban: "finance",
  vatcomply: "finance", razorpayifsc: "finance", usrealestate: "finance", wto: "finance",
  ukfsa: "finance", polymarket: "finance",

  // Crypto
  crypto: "crypto", coingecko: "crypto", hyperliquid: "crypto",

  // Travel & Logistics
  travel: "travel", amadeus: "travel", aviasales: "travel", sabre: "travel",
  dhl: "travel", shipengine: "travel", tracking: "travel", mbta_transit: "travel",
  "mbta-transit": "travel",

  // News & Media
  news: "news", currents: "news", gdelt: "news",

  // Search & Web
  search: "search", exa: "search", tavily: "search", serper: "search",
  spider: "search", diffbot: "search", browser: "search",

  // AI & ML
  ai: "ai", hf: "ai", stability: "ai", aipush: "ai", ocr: "ai", transcribe: "ai",

  // Geo & Maps
  geo: "geo", geonames: "geo", geocodio: "geo", opentopodata: "geo",
  overpass: "geo", country: "geo", postal: "geo", walkscore: "geo",
  sunrisesunset: "geo", tides: "geo", earthquake: "geo", marine: "geo",
  evcharge: "geo", ukpost: "geo", worldclock: "geo",

  // Health
  health: "health", cdc: "health", who: "health", disease: "health",
  clinical: "health", rxnorm: "health", pharmgkb: "health", wger: "health",
  fatsecret: "health", nvd: "health", safety: "health", sdwis: "health",
  nihreporter: "health", openfda_devices: "health", water: "health",

  // Education
  education: "education", dictionary: "education", books: "education",
  gutendex: "education", librivox: "education", tatoeba: "education",
  langbly: "education", bible: "education",

  // Reference
  reference: "reference", holidays: "reference", calendarific: "reference",
  pokeapi: "reference", random: "reference", upc: "reference", vin: "reference",
  nps: "reference", col: "reference", brasilapi: "reference", ibge: "reference",
  insee: "reference", unhcr: "reference", unsdg: "reference", imgflip: "reference",
  artic: "reference", bhl: "reference", wikidata: "reference",

  // Games & Entertainment
  games: "games", igdb: "games", rawg: "games", opendota: "games",
  chesscom: "games", lichess: "games", sports: "games", anime: "games",
  manga: "games", ticketmaster: "games", tmdb: "games",

  // Space & Astronomy
  space: "space", nasa: "space", jpl: "space", nasaexoplanet: "space",
  nasantrs: "space", iss: "space", celestrak: "space", usno: "space",
  solar: "space", swpc: "space", eonet: "space", firms: "space",

  // Jobs
  jobs: "jobs", usajobs: "jobs", adzuna: "jobs", reed: "jobs",
  jooble: "jobs", remotive: "jobs", arbeitnow: "jobs", theirstack: "jobs",

  // Developer Tools
  developer: "developer", github: "developer", npm: "developer", pypi: "developer",
  depsdev: "developer", osv: "developer", autodev: "developer", code: "developer",
  platform: "developer", cloudflare: "developer", namesilo: "developer",
  qrserver: "developer", shorturl: "developer", convert: "developer",
  screenshot: "developer", chart: "developer", account: "developer",

  // Government & Legal
  government: "government", congress: "government", regulations: "government",
  openstates: "government", fema: "government", courtlistener: "government",
  sam: "government", samuni: "government", fcc: "government", epa: "government",
  census: "government", govuk: "government", ukpolice: "government",
  ukcompany: "government", sg: "government", fec: "government",
  fedregister: "government",

  // Business
  business: "business", hunter: "business", email: "business",
  email_verify: "business", brreg: "business", ror: "business",

  // Communication
  communication: "communication", telegram: "communication", twilio: "communication",
  resend: "communication", telnyx: "communication",

  // Food & Nutrition
  food: "food", spoonacular: "food", cocktail: "food",

  // Science & Research
  science: "science", chem: "science", pubchem: "science", pdb: "science",
  materials: "science", gbif: "science", worms: "science", zenodo: "science",
  europepmc: "science", datacite: "science", dblp: "science", opencontext: "science",
  cernopendata: "science", soil: "science", gfw: "science", nrel: "science",
  mychem: "science", mygene: "science", myvariant: "science", eia: "science",
  bdl: "science",

  // Media & Arts
  media: "media", pexels: "media", rijks: "media", smithsonian: "media",
  vam: "media", met: "media", europeana: "media", music: "media",
  listennotes: "media", podcast: "media", audd: "media",

  // Security
  security: "security", ip: "security", ipqs: "security", ssl: "security",
  whois: "security", whoisjson: "security",

  // Social
  social: "social", bluesky: "social", mastodon: "social", twitter: "social",

  // Data & Analytics
  data: "data", aster: "data",
};

function getCategorySlug(providerSlug: string): string {
  return CATEGORY_MAP[providerSlug] ?? "reference";
}

// Capitalize first letter of each word
function toTitleCase(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  console.log("📥  Reading apibase-tools.json …");
  const raw = fs.readFileSync(
    path.join(__dirname, "../apibase-tools.json"),
    "utf-8",
  );
  const { data: tools } = JSON.parse(raw) as {
    data: Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      pricing: { price_usd: number };
      input_schema: Record<string, unknown>;
      status: string;
    }>;
  };
  console.log(`   Found ${tools.length} tools across ${new Set(tools.map((t) => t.category)).size} providers.\n`);

  // ── 1. Upsert categories ──────────────────────────────────────────────────
  console.log("📂  Upserting categories …");
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, icon: cat.icon },
      create: cat,
    });
  }
  console.log(`   ✓ ${CATEGORIES.length} categories ready.\n`);

  // ── 2. Collect unique providers from tool data ────────────────────────────
  const providerSlugs = [...new Set(tools.map((t) => t.category))];
  console.log(`🏢  Upserting ${providerSlugs.length} providers …`);
  for (const slug of providerSlugs) {
    await prisma.provider.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: toTitleCase(slug),
        website: `https://${slug.replace(/-/g, "")}.com`,
        description: `${toTitleCase(slug)} API via UnifyAPI.`,
      },
    });
  }
  console.log(`   ✓ ${providerSlugs.length} providers ready.\n`);

  // ── 3. Resolve category & provider DB ids ────────────────────────────────
  const categoryRows = await prisma.category.findMany();
  const providerRows = await prisma.provider.findMany();
  const catMap = Object.fromEntries(categoryRows.map((c) => [c.slug, c.id]));
  const prvMap = Object.fromEntries(providerRows.map((p) => [p.slug, p.id]));

  // ── 4. Upsert tools ───────────────────────────────────────────────────────
  console.log(`🔧  Upserting ${tools.length} tools …`);
  let ok = 0;
  let skip = 0;
  for (const t of tools) {
    const catSlug = getCategorySlug(t.category);
    const categoryId = catMap[catSlug];
    const providerId = prvMap[t.category];

    if (!categoryId || !providerId) {
      console.warn(`   ⚠  Skipping ${t.id}: missing category="${catSlug}" or provider="${t.category}"`);
      skip++;
      continue;
    }

    const priceUsd = typeof t.pricing?.price_usd === "number" ? t.pricing.price_usd : 0.001;

    await prisma.tool.upsert({
      where: { slug: t.id },
      update: {
        name: t.name,
        description: t.description,
        priceUsd: new Prisma.Decimal(priceUsd),
        inputSchema: (t.input_schema ?? { type: "object", properties: {} }) as Prisma.InputJsonValue,
        active: t.status === "healthy",
        categoryId,
        providerId,
      },
      create: {
        slug: t.id,
        name: t.name,
        description: t.description,
        priceUsd: new Prisma.Decimal(priceUsd),
        inputSchema: (t.input_schema ?? { type: "object", properties: {} }) as Prisma.InputJsonValue,
        tags: [t.category, catSlug],
        featured: false,
        active: t.status === "healthy",
        live: false,
        categoryId,
        providerId,
      },
    });
    ok++;
  }

  console.log(`   ✓ ${ok} tools upserted, ${skip} skipped.\n`);
  console.log("🎉  Import complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
