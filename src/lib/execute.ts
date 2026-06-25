// Tool execution engine.
// "live" tools call a real, key-less upstream API. The rest return realistic,
// deterministic mock data so the catalog is fully explorable without provider keys.

type Input = Record<string, unknown>;

export type ExecuteResult = {
  data: unknown;
  upstream: "live" | "mock";
};

function num(v: unknown, fallback: number): number {
  const n = typeof v === "string" ? parseFloat(v) : (v as number);
  return Number.isFinite(n) ? n : fallback;
}

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" && v.length ? v : fallback;
}

// Cheap deterministic hash so mock numbers are stable per-input.
function seeded(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 0xffffffff;
}

async function fetchJson(url: string): Promise<unknown> {
  const res = await fetch(url, {
    headers: { "user-agent": "UnifyAPI/1.0", accept: "application/json" },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) throw new Error(`Upstream ${res.status}`);
  return res.json();
}

export async function executeTool(
  slug: string,
  input: Input,
  live: boolean,
): Promise<ExecuteResult> {
  if (live) {
    return { data: await runLive(slug, input), upstream: "live" };
  }
  return { data: runMock(slug, input), upstream: "mock" };
}

// ── Live upstreams (no API key required) ───────────────────────────

async function runLive(slug: string, input: Input): Promise<unknown> {
  switch (slug) {
    case "weather.forecast": {
      const lat = num(input.latitude, -6.2088);
      const lon = num(input.longitude, 106.8456);
      const days = Math.min(16, Math.max(1, Math.round(num(input.days, 3))));
      const data = (await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max` +
          `&forecast_days=${days}&timezone=auto`,
      )) as { daily?: Record<string, unknown[]>; timezone?: string };
      const d = data.daily ?? {};
      const out = (d.time ?? []).map((t, i) => ({
        date: t,
        tempMax: d.temperature_2m_max?.[i],
        tempMin: d.temperature_2m_min?.[i],
        precipitation: d.precipitation_sum?.[i],
        windMax: d.wind_speed_10m_max?.[i],
      }));
      return { latitude: lat, longitude: lon, timezone: data.timezone, forecast: out };
    }
    case "weather.current": {
      const lat = num(input.latitude, -6.2088);
      const lon = num(input.longitude, 106.8456);
      const data = (await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`,
      )) as { current_weather?: unknown };
      return { latitude: lat, longitude: lon, current: data.current_weather };
    }
    case "crypto.price": {
      const coin = str(input.coin, "bitcoin").toLowerCase();
      const vs = str(input.vs, "usd").toLowerCase();
      const data = (await fetchJson(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(coin)}&vs_currencies=${encodeURIComponent(vs)}`,
      )) as Record<string, Record<string, number>>;
      return { coin, vs, price: data?.[coin]?.[vs] ?? null };
    }
    case "crypto.market": {
      const coin = str(input.coin, "ethereum").toLowerCase();
      const arr = (await fetchJson(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${encodeURIComponent(coin)}`,
      )) as Array<Record<string, number>>;
      const m = arr?.[0] ?? {};
      return {
        coin,
        priceUsd: m.current_price ?? null,
        marketCapUsd: m.market_cap ?? null,
        volume24hUsd: m.total_volume ?? null,
        change24hPct: m.price_change_percentage_24h ?? null,
      };
    }
    case "fx.convert": {
      const from = str(input.from, "USD").toUpperCase();
      const to = str(input.to, "IDR").toUpperCase();
      const amount = num(input.amount, 100);
      const data = (await fetchJson(`https://open.er-api.com/v6/latest/${from}`)) as {
        rates?: Record<string, number>;
      };
      const rate = data.rates?.[to] ?? null;
      return { from, to, amount, rate, result: rate == null ? null : +(amount * rate).toFixed(2) };
    }
    case "geo.geocode": {
      const query = str(input.query, "Jakarta");
      const data = (await fetchJson(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`,
      )) as { results?: Array<Record<string, unknown>> };
      const r = data.results?.[0];
      if (!r) return { query, match: null };
      return {
        query,
        name: r.name,
        country: r.country,
        latitude: r.latitude,
        longitude: r.longitude,
        timezone: r.timezone,
      };
    }
    case "geo.timezone": {
      const lat = num(input.latitude, -6.2088);
      const lon = num(input.longitude, 106.8456);
      const data = (await fetchJson(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`,
      )) as { timezone?: string; current_weather?: { time?: string } };
      return { latitude: lat, longitude: lon, timezone: data.timezone, localTime: data.current_weather?.time };
    }
    case "dictionary.define": {
      const word = str(input.word, "serendipity").toLowerCase();
      const data = (await fetchJson(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      )) as Array<{ meanings?: Array<{ partOfSpeech?: string; definitions?: Array<{ definition?: string; example?: string }> }> }>;
      const meaning = data?.[0]?.meanings?.[0];
      const def = meaning?.definitions?.[0];
      return { word, partOfSpeech: meaning?.partOfSpeech ?? null, definition: def?.definition ?? null, example: def?.example ?? null };
    }
    case "text.translate": {
      const text = str(input.text, "Hello");
      const target = str(input.target, "ID").toLowerCase();
      const source = str(input.source, "en").toLowerCase();
      const data = (await fetchJson(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source}|${target}`,
      )) as { responseData?: { translatedText?: string } };
      return { source, target, original: text, translation: data.responseData?.translatedText ?? null };
    }
    case "news.headlines":
    case "news.search": {
      const query = str(input.topic, str(input.query, "technology"));
      const data = (await fetchJson(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&tags=story&hitsPerPage=5`,
      )) as { hits?: Array<{ title?: string; url?: string; author?: string; created_at?: string; points?: number }> };
      return {
        topic: query,
        articles: (data.hits ?? []).map((h) => ({
          title: h.title,
          source: "Hacker News",
          author: h.author,
          url: h.url ?? `https://news.ycombinator.com`,
          points: h.points,
          publishedAt: h.created_at,
        })),
      };
    }
    case "crypto.trending": {
      const data = (await fetchJson("https://api.coingecko.com/api/v3/search/trending")) as {
        coins?: Array<{ item?: { id?: string; name?: string; symbol?: string; market_cap_rank?: number } }>;
      };
      return {
        coins: (data.coins ?? []).slice(0, 7).map((c) => ({
          id: c.item?.id,
          name: c.item?.name,
          symbol: c.item?.symbol,
          marketCapRank: c.item?.market_cap_rank,
        })),
      };
    }
    case "crypto.global": {
      const data = (await fetchJson("https://api.coingecko.com/api/v3/global")) as {
        data?: {
          active_cryptocurrencies?: number;
          total_market_cap?: { usd?: number };
          market_cap_percentage?: { btc?: number; eth?: number };
          market_cap_change_percentage_24h_usd?: number;
        };
      };
      const d = data.data ?? {};
      return {
        activeCryptocurrencies: d.active_cryptocurrencies,
        totalMarketCapUsd: d.total_market_cap?.usd,
        btcDominancePct: d.market_cap_percentage?.btc,
        ethDominancePct: d.market_cap_percentage?.eth,
        marketCapChange24hPct: d.market_cap_change_percentage_24h_usd,
      };
    }
    case "weather.airquality": {
      const lat = num(input.latitude, -6.2088);
      const lon = num(input.longitude, 106.8456);
      const data = (await fetchJson(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
          `&current=pm10,pm2_5,us_aqi,european_aqi`,
      )) as { current?: unknown };
      return { latitude: lat, longitude: lon, current: data.current };
    }
    case "ip.geolocate": {
      const ip = str(input.ip, "8.8.8.8");
      const data = (await fetchJson(`https://ipwho.is/${encodeURIComponent(ip)}`)) as {
        ip?: string; country?: string; city?: string; region?: string;
        latitude?: number; longitude?: number; connection?: { isp?: string };
      };
      return {
        ip: data.ip, country: data.country, city: data.city, region: data.region,
        latitude: data.latitude, longitude: data.longitude, isp: data.connection?.isp,
      };
    }
    case "time.world": {
      const tz = str(input.timezone, "Asia/Jakarta");
      const data = (await fetchJson(
        `https://timeapi.io/api/Time/current/zone?timeZone=${encodeURIComponent(tz)}`,
      )) as { dateTime?: string; timeZone?: string; dayOfWeek?: string };
      return { timezone: data.timeZone ?? tz, dateTime: data.dateTime, dayOfWeek: data.dayOfWeek };
    }
    case "wiki.summary": {
      const title = str(input.title, "Model Context Protocol");
      const data = (await fetchJson(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`,
      )) as { title?: string; extract?: string; content_urls?: { desktop?: { page?: string } } };
      return { title: data.title, summary: data.extract, url: data.content_urls?.desktop?.page };
    }
    case "quotes.random": {
      const data = (await fetchJson("https://dummyjson.com/quotes/random")) as {
        quote?: string; author?: string;
      };
      return { quote: data.quote, author: data.author };
    }
    case "holidays.public": {
      const country = str(input.country, "ID").toUpperCase();
      const year = Math.round(num(input.year, new Date().getFullYear()));
      const data = (await fetchJson(
        `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      )) as Array<{ date?: string; localName?: string; name?: string }>;
      return {
        country, year,
        holidays: (data ?? []).map((h) => ({ date: h.date, name: h.name, localName: h.localName })),
      };
    }
    case "pokemon.lookup": {
      const name = str(input.name, "pikachu").toLowerCase();
      const data = (await fetchJson(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`)) as {
        name?: string; id?: number; height?: number; weight?: number;
        types?: Array<{ type?: { name?: string } }>;
        stats?: Array<{ base_stat?: number; stat?: { name?: string } }>;
      };
      return {
        name: data.name, id: data.id, heightDm: data.height, weightHg: data.weight,
        types: (data.types ?? []).map((t) => t.type?.name),
        stats: Object.fromEntries((data.stats ?? []).map((s) => [s.stat?.name, s.base_stat])),
      };
    }
    default:
      return runMock(slug, input);
  }
}

// ── Mock generators ────────────────────────────────────────────────

function runMock(slug: string, input: Input): unknown {
  const r = seeded(slug + JSON.stringify(input));
  switch (slug) {
    case "crypto.market": {
      const coin = str(input.coin, "ethereum");
      return {
        coin,
        priceUsd: +(500 + r * 4000).toFixed(2),
        marketCapUsd: Math.round((1e10 + r * 4e11)),
        volume24hUsd: Math.round(1e9 + r * 2e10),
        change24hPct: +((r - 0.5) * 12).toFixed(2),
      };
    }
    case "stocks.quote": {
      const symbol = str(input.symbol, "AAPL").toUpperCase();
      const price = +(50 + r * 400).toFixed(2);
      return {
        symbol,
        price,
        open: +(price * (0.98 + r * 0.02)).toFixed(2),
        high: +(price * (1.01 + r * 0.02)).toFixed(2),
        low: +(price * (0.96 + r * 0.02)).toFixed(2),
        volume: Math.round(1e6 + r * 5e7),
        currency: "USD",
      };
    }
    case "fx.convert": {
      const from = str(input.from, "USD").toUpperCase();
      const to = str(input.to, "IDR").toUpperCase();
      const amount = num(input.amount, 100);
      const rate = +(0.5 + r * 16500).toFixed(4);
      return { from, to, amount, rate, result: +(amount * rate).toFixed(2) };
    }
    case "company.fundamentals": {
      const symbol = str(input.symbol, "AAPL").toUpperCase();
      return {
        symbol,
        marketCapUsd: Math.round(5e10 + r * 2e12),
        peRatio: +(10 + r * 30).toFixed(1),
        eps: +(1 + r * 12).toFixed(2),
        sector: ["Technology", "Healthcare", "Financials", "Energy"][Math.floor(r * 4)],
      };
    }
    case "flights.search": {
      const origin = str(input.origin, "CGK").toUpperCase();
      const destination = str(input.destination, "SIN").toUpperCase();
      const date = str(input.date, "2026-07-01");
      const airlines = ["Garuda", "Singapore Airlines", "AirAsia", "Scoot"];
      return {
        origin,
        destination,
        date,
        results: Array.from({ length: 3 }, (_, i) => ({
          airline: airlines[Math.floor(seeded(slug + i) * airlines.length)],
          priceUsd: +(80 + seeded(slug + date + i) * 320).toFixed(2),
          durationMinutes: Math.round(90 + seeded(date + i) * 120),
          stops: i === 0 ? 0 : 1,
        })),
      };
    }
    case "hotels.search": {
      const city = str(input.city, "Singapore");
      return {
        city,
        results: Array.from({ length: 3 }, (_, i) => ({
          name: ["Marina Bay Suites", "Orchard Grand", "Riverside Inn"][i],
          pricePerNightUsd: +(60 + seeded(city + i) * 280).toFixed(2),
          rating: +(3.5 + seeded(city + i) * 1.5).toFixed(1),
        })),
      };
    }
    case "news.headlines":
    case "news.search": {
      const topic = str(input.topic, str(input.query, "technology"));
      return {
        topic,
        articles: Array.from({ length: 3 }, (_, i) => ({
          title: `${topic[0]?.toUpperCase()}${topic.slice(1)} update ${i + 1}`,
          source: ["Reuters", "AP", "Bloomberg"][i],
          url: `https://news.example.com/${topic}-${i + 1}`,
          publishedAt: new Date(Date.now() - i * 3600_000).toISOString(),
        })),
      };
    }
    case "web.search": {
      const query = str(input.query, "model context protocol");
      const max = Math.min(20, Math.max(1, Math.round(num(input.maxResults, 5))));
      return {
        query,
        results: Array.from({ length: max }, (_, i) => ({
          title: `${query} — result ${i + 1}`,
          url: `https://example.com/${encodeURIComponent(query)}/${i + 1}`,
          snippet: `A relevant passage about ${query} (${i + 1}).`,
          score: +(1 - i * 0.07).toFixed(2),
        })),
      };
    }
    case "web.extract": {
      const url = str(input.url, "https://example.com");
      return { url, title: "Extracted Page", content: `Clean readable text extracted from ${url}.`, wordCount: Math.round(200 + r * 1500) };
    }
    case "ai.complete": {
      const prompt = str(input.prompt, "Hello");
      return { model: str(input.model, "auto"), completion: `Here is a response to: "${prompt}".`, tokens: Math.round(20 + r * 200) };
    }
    case "ai.summarize": {
      const text = str(input.text, "");
      return { summary: `Summary: ${text.slice(0, 80)}${text.length > 80 ? "…" : ""}`, ratio: 0.2 };
    }
    case "geo.geocode": {
      const query = str(input.query, "Jakarta");
      return { query, latitude: +(-90 + seeded(query) * 180).toFixed(4), longitude: +(-180 + seeded(query + "x") * 360).toFixed(4), confidence: +(0.7 + r * 0.3).toFixed(2) };
    }
    case "geo.distance": {
      return { from: str(input.from), to: str(input.to), distanceKm: +(5 + r * 1500).toFixed(1), durationMinutes: Math.round(10 + r * 900) };
    }
    case "geo.timezone": {
      const tz = ["Asia/Jakarta", "Asia/Singapore", "Europe/London", "America/New_York"][Math.floor(r * 4)];
      return { latitude: num(input.latitude, 0), longitude: num(input.longitude, 0), timezone: tz, localTime: new Date().toISOString() };
    }
    case "company.enrich": {
      const domain = str(input.domain, "example.com");
      return { domain, name: domain.split(".")[0].replace(/^\w/, (c) => c.toUpperCase()), industry: ["SaaS", "Fintech", "E-commerce"][Math.floor(r * 3)], employees: Math.round(10 + r * 5000), country: "US" };
    }
    case "books.search": {
      const query = str(input.query, "clean code");
      const authors = ["R. C. Martin", "M. Fowler", "K. Beck", "A. Hunt", "E. Gamma"];
      return {
        query,
        books: Array.from({ length: 3 }, (_, i) => ({
          title: `${query[0]?.toUpperCase()}${query.slice(1)} — Vol. ${i + 1}`,
          author: authors[Math.floor(seeded(query + i) * authors.length)],
          firstPublished: 1995 + Math.floor(seeded(query + "y" + i) * 30),
        })),
      };
    }
    case "sentiment.analyze": {
      const text = str(input.text, "");
      const score = +((r - 0.5) * 2).toFixed(2);
      const label = score > 0.2 ? "positive" : score < -0.2 ? "negative" : "neutral";
      return { text: text.slice(0, 120), label, score };
    }
    case "stocks.history": {
      const symbol = str(input.symbol, "AAPL").toUpperCase();
      const days = Math.min(30, Math.max(1, Math.round(num(input.days, 7))));
      const base = 50 + r * 400;
      const series = Array.from({ length: days }, (_, i) => {
        const d = new Date(Date.now() - i * 86_400_000);
        const close = +(base * (0.9 + seeded(symbol + i) * 0.2)).toFixed(2);
        return { date: d.toISOString().slice(0, 10), close };
      });
      return { symbol, currency: "USD", series };
    }
    case "nutrition.lookup": {
      const query = str(input.query, "1 apple");
      return { query, calories: Math.round(50 + r * 600), protein_g: +(r * 30).toFixed(1), carbs_g: +(r * 80).toFixed(1), fat_g: +(r * 40).toFixed(1) };
    }
    case "text.translate": {
      const text = str(input.text, "Hello");
      const target = str(input.target, "ID").toUpperCase();
      return { target, original: text, translation: `[${target}] ${text}` };
    }
    case "dictionary.define": {
      const word = str(input.word, "serendipity");
      return { word, partOfSpeech: "noun", definition: `A mock definition for "${word}".`, example: `She used the word "${word}" in a sentence.` };
    }
    default:
      return { ok: true, echo: input, note: `Mock response for ${slug}` };
  }
}
