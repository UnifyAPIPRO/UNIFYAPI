import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type CategorySeed = {
  slug: string;
  name: string;
  description: string;
  icon: string;
};

type ProviderSeed = {
  slug: string;
  name: string;
  website: string;
  description: string;
};

type ToolSeed = {
  slug: string;
  name: string;
  description: string;
  category: string; // category slug
  provider: string; // provider slug
  priceUsd: number;
  tags: string[];
  featured?: boolean;
  live?: boolean;
  inputSchema: Prisma.InputJsonValue;
};

const categories: CategorySeed[] = [
  { slug: "weather", name: "Weather", description: "Forecasts, current conditions, and historical climate data.", icon: "cloud" },
  { slug: "finance", name: "Finance", description: "Equities, FX rates, company fundamentals, and market data.", icon: "trending-up" },
  { slug: "crypto", name: "Crypto", description: "Token prices, on-chain data, and exchange information.", icon: "bitcoin" },
  { slug: "travel", name: "Travel", description: "Flights, hotels, places, and trip planning.", icon: "plane" },
  { slug: "news", name: "News", description: "Headlines, articles, and topical coverage from many sources.", icon: "newspaper" },
  { slug: "search", name: "Web Search", description: "Search the web and retrieve clean page content.", icon: "search" },
  { slug: "ai", name: "AI & ML", description: "Text, image, and audio models behind one billing rail.", icon: "sparkles" },
  { slug: "geo", name: "Geo & Maps", description: "Geocoding, routing, distance, and timezone lookups.", icon: "map-pin" },
  { slug: "data", name: "Data & Enrichment", description: "Company, contact, and entity enrichment.", icon: "database" },
  { slug: "health", name: "Health", description: "Nutrition, exercise, and medical reference data.", icon: "heart-pulse" },
  { slug: "education", name: "Education", description: "Dictionaries, translation, and reference knowledge.", icon: "graduation-cap" },
  { slug: "reference", name: "Reference", description: "Encyclopedic facts, quotes, and public records.", icon: "book-open" },
  { slug: "games", name: "Games", description: "Game and entertainment data.", icon: "gamepad" },
];

const providers: ProviderSeed[] = [
  { slug: "open-meteo", name: "Open-Meteo", website: "https://open-meteo.com", description: "Free open weather API." },
  { slug: "coingecko", name: "CoinGecko", website: "https://coingecko.com", description: "Crypto market data." },
  { slug: "marketstack", name: "Marketstack", website: "https://marketstack.com", description: "Real-time and historical stock data." },
  { slug: "exchangerate", name: "ExchangeRate", website: "https://exchangerate.host", description: "Foreign exchange rates." },
  { slug: "skyscanner", name: "Skyscanner", website: "https://skyscanner.net", description: "Flight and travel search." },
  { slug: "newsapi", name: "NewsAPI", website: "https://newsapi.org", description: "Worldwide news headlines." },
  { slug: "tavily", name: "Tavily", website: "https://tavily.com", description: "Search built for AI agents." },
  { slug: "openrouter", name: "OpenRouter", website: "https://openrouter.ai", description: "Unified access to LLMs." },
  { slug: "mapbox", name: "Mapbox", website: "https://mapbox.com", description: "Maps, geocoding, and routing." },
  { slug: "clearbit", name: "Clearbit", website: "https://clearbit.com", description: "Company and contact enrichment." },
  { slug: "nutritionix", name: "Nutritionix", website: "https://nutritionix.com", description: "Nutrition database." },
  { slug: "deepl", name: "DeepL", website: "https://deepl.com", description: "High-quality machine translation." },
  { slug: "wikipedia", name: "Wikipedia", website: "https://wikipedia.org", description: "The free encyclopedia." },
  { slug: "dummyjson", name: "DummyJSON", website: "https://dummyjson.com", description: "Quotes and placeholder data." },
  { slug: "nagerdate", name: "Nager.Date", website: "https://date.nager.at", description: "Public holidays worldwide." },
  { slug: "openlibrary", name: "Open Library", website: "https://openlibrary.org", description: "Open catalog of books." },
  { slug: "pokeapi", name: "PokeAPI", website: "https://pokeapi.co", description: "Pokémon data API." },
  { slug: "ipwhois", name: "ipwho.is", website: "https://ipwho.is", description: "IP geolocation." },
  { slug: "timeapi", name: "TimeAPI", website: "https://timeapi.io", description: "World time by timezone." },
];

const tools: ToolSeed[] = [
  // Weather (live)
  {
    slug: "weather.forecast",
    name: "Weather Forecast",
    description: "Multi-day forecast for any latitude/longitude with temperature, precipitation, and wind.",
    category: "weather",
    provider: "open-meteo",
    priceUsd: 0.002,
    tags: ["weather", "forecast", "live"],
    featured: true,
    live: true,
    inputSchema: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: {
        latitude: { type: "number", description: "Latitude, e.g. -6.2088" },
        longitude: { type: "number", description: "Longitude, e.g. 106.8456" },
        days: { type: "integer", minimum: 1, maximum: 16, default: 3 },
      },
    },
  },
  {
    slug: "weather.current",
    name: "Current Conditions",
    description: "Current temperature, wind, and weather code for a coordinate.",
    category: "weather",
    provider: "open-meteo",
    priceUsd: 0.001,
    tags: ["weather", "current", "live"],
    live: true,
    inputSchema: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: {
        latitude: { type: "number" },
        longitude: { type: "number" },
      },
    },
  },
  // Crypto (live)
  {
    slug: "crypto.price",
    name: "Crypto Spot Price",
    description: "Current price of a coin in a fiat currency, sourced live from CoinGecko.",
    category: "crypto",
    provider: "coingecko",
    priceUsd: 0.002,
    tags: ["crypto", "price", "live"],
    featured: true,
    live: true,
    inputSchema: {
      type: "object",
      required: ["coin"],
      properties: {
        coin: { type: "string", description: "CoinGecko id, e.g. bitcoin, ethereum", default: "bitcoin" },
        vs: { type: "string", description: "Fiat currency", default: "usd" },
      },
    },
  },
  {
    slug: "crypto.market",
    name: "Token Market Snapshot",
    description: "Market cap, 24h volume, and price change for a token.",
    category: "crypto",
    provider: "coingecko",
    priceUsd: 0.003,
    tags: ["crypto", "market"],
    inputSchema: {
      type: "object",
      required: ["coin"],
      properties: { coin: { type: "string", default: "ethereum" } },
    },
  },
  // Finance (mock)
  {
    slug: "stocks.quote",
    name: "Stock Quote",
    description: "Latest price, open, high, low, and volume for a ticker.",
    category: "finance",
    provider: "marketstack",
    priceUsd: 0.004,
    tags: ["stocks", "quote"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["symbol"],
      properties: { symbol: { type: "string", description: "Ticker, e.g. AAPL" } },
    },
  },
  {
    slug: "fx.convert",
    name: "Currency Convert",
    description: "Convert an amount from one currency to another at the latest rate.",
    category: "finance",
    provider: "exchangerate",
    priceUsd: 0.001,
    tags: ["fx", "currency"],
    inputSchema: {
      type: "object",
      required: ["from", "to", "amount"],
      properties: {
        from: { type: "string", default: "USD" },
        to: { type: "string", default: "IDR" },
        amount: { type: "number", default: 100 },
      },
    },
  },
  {
    slug: "company.fundamentals",
    name: "Company Fundamentals",
    description: "Key fundamentals: market cap, P/E, EPS, and sector for a listed company.",
    category: "finance",
    provider: "marketstack",
    priceUsd: 0.006,
    tags: ["stocks", "fundamentals"],
    inputSchema: {
      type: "object",
      required: ["symbol"],
      properties: { symbol: { type: "string" } },
    },
  },
  // Travel (mock)
  {
    slug: "flights.search",
    name: "Flight Search",
    description: "Search the cheapest flights between two airports for a date.",
    category: "travel",
    provider: "skyscanner",
    priceUsd: 0.012,
    tags: ["travel", "flights"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["origin", "destination", "date"],
      properties: {
        origin: { type: "string", description: "IATA code, e.g. CGK" },
        destination: { type: "string", description: "IATA code, e.g. SIN" },
        date: { type: "string", description: "YYYY-MM-DD" },
      },
    },
  },
  {
    slug: "hotels.search",
    name: "Hotel Search",
    description: "Find available hotels in a city for given check-in/out dates.",
    category: "travel",
    provider: "skyscanner",
    priceUsd: 0.01,
    tags: ["travel", "hotels"],
    inputSchema: {
      type: "object",
      required: ["city", "checkIn", "checkOut"],
      properties: {
        city: { type: "string" },
        checkIn: { type: "string", description: "YYYY-MM-DD" },
        checkOut: { type: "string", description: "YYYY-MM-DD" },
      },
    },
  },
  // News (mock)
  {
    slug: "news.headlines",
    name: "Top Headlines",
    description: "Latest top news headlines, optionally filtered by topic or country.",
    category: "news",
    provider: "newsapi",
    priceUsd: 0.003,
    tags: ["news", "headlines"],
    featured: true,
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "e.g. technology, business" },
        country: { type: "string", default: "us" },
      },
    },
  },
  {
    slug: "news.search",
    name: "News Search",
    description: "Search recent news articles by keyword.",
    category: "news",
    provider: "newsapi",
    priceUsd: 0.004,
    tags: ["news", "search"],
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string" } },
    },
  },
  // Web search (mock)
  {
    slug: "web.search",
    name: "Web Search",
    description: "Agent-optimized web search returning ranked results with snippets.",
    category: "search",
    provider: "tavily",
    priceUsd: 0.008,
    tags: ["search", "web"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string" },
        maxResults: { type: "integer", default: 5, maximum: 20 },
      },
    },
  },
  {
    slug: "web.extract",
    name: "Page Extract",
    description: "Fetch a URL and return clean, readable text content.",
    category: "search",
    provider: "tavily",
    priceUsd: 0.006,
    tags: ["search", "scrape"],
    inputSchema: {
      type: "object",
      required: ["url"],
      properties: { url: { type: "string", description: "https://..." } },
    },
  },
  // AI (mock)
  {
    slug: "ai.complete",
    name: "Text Completion",
    description: "Generate a completion from a prompt via a unified model gateway.",
    category: "ai",
    provider: "openrouter",
    priceUsd: 0.02,
    tags: ["ai", "llm"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["prompt"],
      properties: {
        prompt: { type: "string" },
        model: { type: "string", default: "auto" },
        maxTokens: { type: "integer", default: 256 },
      },
    },
  },
  {
    slug: "ai.summarize",
    name: "Summarize",
    description: "Summarize a block of text into a short paragraph.",
    category: "ai",
    provider: "openrouter",
    priceUsd: 0.015,
    tags: ["ai", "summarize"],
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: { text: { type: "string" } },
    },
  },
  // Geo (mock)
  {
    slug: "geo.geocode",
    name: "Geocode Address",
    description: "Convert a place name or address into latitude/longitude.",
    category: "geo",
    provider: "mapbox",
    priceUsd: 0.002,
    tags: ["geo", "geocode"],
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string", description: "e.g. Monas, Jakarta" } },
    },
  },
  {
    slug: "geo.distance",
    name: "Distance Matrix",
    description: "Driving distance and duration between two coordinates.",
    category: "geo",
    provider: "mapbox",
    priceUsd: 0.003,
    tags: ["geo", "routing"],
    inputSchema: {
      type: "object",
      required: ["from", "to"],
      properties: {
        from: { type: "string", description: "lat,lon" },
        to: { type: "string", description: "lat,lon" },
      },
    },
  },
  {
    slug: "geo.timezone",
    name: "Timezone Lookup",
    description: "Return the timezone and current local time for a coordinate.",
    category: "geo",
    provider: "mapbox",
    priceUsd: 0.001,
    tags: ["geo", "timezone"],
    inputSchema: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: { latitude: { type: "number" }, longitude: { type: "number" } },
    },
  },
  // Data (mock)
  {
    slug: "company.enrich",
    name: "Company Enrichment",
    description: "Enrich a company domain with name, industry, size, and location.",
    category: "data",
    provider: "clearbit",
    priceUsd: 0.025,
    tags: ["data", "enrichment"],
    inputSchema: {
      type: "object",
      required: ["domain"],
      properties: { domain: { type: "string", description: "e.g. stripe.com" } },
    },
  },
  // Health (mock)
  {
    slug: "nutrition.lookup",
    name: "Nutrition Lookup",
    description: "Calories and macronutrients for a natural-language food query.",
    category: "health",
    provider: "nutritionix",
    priceUsd: 0.004,
    tags: ["health", "nutrition"],
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string", description: "e.g. 2 eggs and toast" } },
    },
  },
  // Education (mock)
  {
    slug: "text.translate",
    name: "Translate Text",
    description: "Translate text between languages with high quality.",
    category: "education",
    provider: "deepl",
    priceUsd: 0.006,
    tags: ["translate", "language"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["text", "target"],
      properties: {
        text: { type: "string" },
        target: { type: "string", description: "Target language code, e.g. en, id, ja" },
        source: { type: "string", description: "Source language code", default: "en" },
      },
    },
  },
  {
    slug: "dictionary.define",
    name: "Define Word",
    description: "Definitions, parts of speech, and examples for an English word.",
    category: "education",
    provider: "deepl",
    priceUsd: 0.001,
    tags: ["dictionary", "language"],
    inputSchema: {
      type: "object",
      required: ["word"],
      properties: { word: { type: "string" } },
    },
  },
  // Crypto (live)
  {
    slug: "crypto.trending",
    name: "Trending Coins",
    description: "The top trending coins on CoinGecko right now.",
    category: "crypto",
    provider: "coingecko",
    priceUsd: 0.003,
    tags: ["crypto", "trending"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    slug: "crypto.global",
    name: "Global Crypto Market",
    description: "Total market cap, 24h change, and BTC dominance across all crypto.",
    category: "crypto",
    provider: "coingecko",
    priceUsd: 0.002,
    tags: ["crypto", "market"],
    inputSchema: { type: "object", properties: {} },
  },
  // Weather (live)
  {
    slug: "weather.airquality",
    name: "Air Quality",
    description: "Current PM2.5, PM10, and US/European AQI for a coordinate.",
    category: "weather",
    provider: "open-meteo",
    priceUsd: 0.002,
    tags: ["weather", "air", "health"],
    inputSchema: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: { latitude: { type: "number" }, longitude: { type: "number" } },
    },
  },
  // Geo (live)
  {
    slug: "ip.geolocate",
    name: "IP Geolocation",
    description: "Country, city, coordinates, and ISP for an IP address.",
    category: "geo",
    provider: "ipwhois",
    priceUsd: 0.002,
    tags: ["geo", "ip"],
    inputSchema: {
      type: "object",
      required: ["ip"],
      properties: { ip: { type: "string", description: "IPv4/IPv6, e.g. 8.8.8.8", default: "8.8.8.8" } },
    },
  },
  {
    slug: "time.world",
    name: "World Time",
    description: "Current date and time for any IANA timezone.",
    category: "geo",
    provider: "timeapi",
    priceUsd: 0.001,
    tags: ["geo", "time"],
    inputSchema: {
      type: "object",
      required: ["timezone"],
      properties: { timezone: { type: "string", description: "e.g. Asia/Jakarta", default: "Asia/Jakarta" } },
    },
  },
  // Reference (live)
  {
    slug: "wiki.summary",
    name: "Wikipedia Summary",
    description: "A concise summary of any Wikipedia article.",
    category: "reference",
    provider: "wikipedia",
    priceUsd: 0.002,
    tags: ["reference", "wiki"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: { title: { type: "string", description: "Article title, e.g. Model Context Protocol" } },
    },
  },
  {
    slug: "quotes.random",
    name: "Random Quote",
    description: "A random inspirational quote with its author.",
    category: "reference",
    provider: "dummyjson",
    priceUsd: 0.001,
    tags: ["reference", "quotes"],
    inputSchema: { type: "object", properties: {} },
  },
  {
    slug: "holidays.public",
    name: "Public Holidays",
    description: "Public holidays for a country and year.",
    category: "reference",
    provider: "nagerdate",
    priceUsd: 0.002,
    tags: ["reference", "holidays"],
    inputSchema: {
      type: "object",
      required: ["country"],
      properties: {
        country: { type: "string", description: "ISO country code, e.g. ID, US", default: "ID" },
        year: { type: "integer", description: "e.g. 2026", default: 2026 },
      },
    },
  },
  // Education (live)
  {
    slug: "books.search",
    name: "Book Search",
    description: "Search millions of books by title or keyword.",
    category: "education",
    provider: "openlibrary",
    priceUsd: 0.003,
    tags: ["books", "search"],
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: { query: { type: "string", description: "e.g. clean code" } },
    },
  },
  // Games (live)
  {
    slug: "pokemon.lookup",
    name: "Pokémon Lookup",
    description: "Stats, types, and physical data for any Pokémon.",
    category: "games",
    provider: "pokeapi",
    priceUsd: 0.001,
    tags: ["games", "pokemon"],
    featured: true,
    inputSchema: {
      type: "object",
      required: ["name"],
      properties: { name: { type: "string", description: "e.g. pikachu", default: "pikachu" } },
    },
  },
  // AI (mock)
  {
    slug: "sentiment.analyze",
    name: "Sentiment Analysis",
    description: "Classify text as positive, negative, or neutral with a score.",
    category: "ai",
    provider: "openrouter",
    priceUsd: 0.008,
    tags: ["ai", "nlp"],
    inputSchema: {
      type: "object",
      required: ["text"],
      properties: { text: { type: "string" } },
    },
  },
  // Finance (mock)
  {
    slug: "stocks.history",
    name: "Stock Price History",
    description: "Daily closing prices for a ticker over a number of days.",
    category: "finance",
    provider: "marketstack",
    priceUsd: 0.006,
    tags: ["stocks", "history"],
    inputSchema: {
      type: "object",
      required: ["symbol"],
      properties: {
        symbol: { type: "string", description: "Ticker, e.g. AAPL" },
        days: { type: "integer", default: 7, maximum: 30 },
      },
    },
  },
];

// Tools wired to a real, key-less upstream API in src/lib/execute.ts.
const LIVE_SLUGS = new Set([
  "weather.forecast",
  "weather.current",
  "crypto.price",
  "crypto.market",
  "fx.convert",
  "geo.geocode",
  "geo.timezone",
  "dictionary.define",
  "text.translate",
  "news.headlines",
  "news.search",
  "crypto.trending",
  "crypto.global",
  "weather.airquality",
  "ip.geolocate",
  "time.world",
  "wiki.summary",
  "quotes.random",
  "holidays.public",
  "pokemon.lookup",
]);

async function main() {
  console.log("Seeding categories...");
  const categoryIds: Record<string, string> = {};
  for (const c of categories) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, icon: c.icon },
      create: c,
    });
    categoryIds[c.slug] = row.id;
  }

  console.log("Seeding providers...");
  const providerIds: Record<string, string> = {};
  for (const p of providers) {
    const row = await prisma.provider.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, website: p.website },
      create: p,
    });
    providerIds[p.slug] = row.id;
  }

  console.log("Seeding tools...");
  for (const t of tools) {
    await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        name: t.name,
        description: t.description,
        priceUsd: t.priceUsd,
        tags: t.tags,
        featured: t.featured ?? false,
        live: LIVE_SLUGS.has(t.slug),
        inputSchema: t.inputSchema,
        categoryId: categoryIds[t.category],
        providerId: providerIds[t.provider],
      },
      create: {
        slug: t.slug,
        name: t.name,
        description: t.description,
        priceUsd: t.priceUsd,
        tags: t.tags,
        featured: t.featured ?? false,
        live: LIVE_SLUGS.has(t.slug),
        inputSchema: t.inputSchema,
        categoryId: categoryIds[t.category],
        providerId: providerIds[t.provider],
      },
    });
  }

  // Remove anything no longer in the seed (e.g. retired tools/providers/categories).
  console.log("Pruning stale catalog entries...");
  const removed = await prisma.tool.findMany({
    where: { slug: { notIn: tools.map((t) => t.slug) } },
    select: { id: true },
  });
  if (removed.length) {
    const ids = removed.map((t) => t.id);
    await prisma.usageRecord.deleteMany({ where: { toolId: { in: ids } } });
    await prisma.tool.deleteMany({ where: { id: { in: ids } } });
  }
  await prisma.provider.deleteMany({ where: { slug: { notIn: providers.map((p) => p.slug) } } });
  await prisma.category.deleteMany({ where: { slug: { notIn: categories.map((c) => c.slug) } } });

  const [cat, prov, tool] = await Promise.all([
    prisma.category.count(),
    prisma.provider.count(),
    prisma.tool.count(),
  ]);
  console.log(`Done. ${cat} categories, ${prov} providers, ${tool} tools.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
