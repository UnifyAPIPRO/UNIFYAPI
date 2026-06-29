import Link from "next/link";

export const metadata = { title: "UnifyAPI — Documentation" };

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-xl font-bold border-b border-border pb-2">{title}</h2>
      <div className="mt-4 space-y-4 text-sm text-muted leading-relaxed">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return <code className="code text-primary-2">{children}</code>;
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 grid md:grid-cols-[200px_1fr] gap-10">
      {/* Sidebar */}
      <nav className="hidden md:block sticky top-20 self-start text-sm space-y-2 text-muted">
        {[
          ["overview",    "Overview"],
          ["quickstart",  "Quick start"],
          ["auth",        "Authentication"],
          ["rest",        "REST API"],
          ["mcp",         "MCP endpoint"],
          ["claude",      "Connect a client"],
          ["discovery",   "Discovery"],
          ["categories",  "Categories"],
          ["payments",    "Payments (x402)"],
          ["live-tools",  "Live tools"],
        ].map(([id, label]) => (
          <a key={id} href={`#${id}`} className="block hover:text-foreground transition-colors">
            {label}
          </a>
        ))}
      </nav>

      <div className="space-y-12 min-w-0">
        <div>
          <h1 className="text-3xl font-bold">Documentation</h1>
          <p className="mt-2 text-muted">
            Everything an agent or a human needs to call 818+ tools through UnifyAPI.
          </p>
        </div>

        {/* Overview */}
        <Section id="overview" title="Overview">
          <p>
            UnifyAPI is a unified API gateway that exposes <strong className="text-foreground">818 tools</strong> from{" "}
            <strong className="text-foreground">250 providers</strong> across{" "}
            <strong className="text-foreground">24 categories</strong> behind a single API key and
            one billing rail. Sign up with email or Google (powered by{" "}
            <strong className="text-foreground">Privy</strong>), get a key, and start calling tools
            in under a minute.
          </p>
          <p>Three ways to reach the catalog:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong className="text-foreground">MCP endpoint</strong> — for AI agents (Claude, GPT, etc.)
            </li>
            <li>
              <strong className="text-foreground">REST API</strong> — plain HTTP for any client or script
            </li>
            <li>
              <strong className="text-foreground">OpenAPI 3.1 spec</strong> — for SDK codegen
            </li>
          </ul>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><Link className="text-primary-2 hover:underline" href="/api/tools">/api/tools</Link> — full catalog as JSON</li>
            <li><Link className="text-primary-2 hover:underline" href="/api/openapi">/api/openapi</Link> — OpenAPI 3.1 spec</li>
            <li><Link className="text-primary-2 hover:underline" href="/api/agent-card">/api/agent-card</Link> — machine-readable agent card</li>
            <li><Link className="text-primary-2 hover:underline" href="/api/mcp">/api/mcp</Link> — MCP JSON-RPC endpoint</li>
          </ul>
        </Section>

        {/* Quick start */}
        <Section id="quickstart" title="Quick start">
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong className="text-foreground">Create an account</strong> — sign up at{" "}
              <Link className="text-primary-2 hover:underline" href="/login">/login</Link>{" "}
              with your email or Google account. Powered by Privy.
            </li>
            <li>
              <strong className="text-foreground">Get an API key</strong> — go to the{" "}
              <Link className="text-primary-2 hover:underline" href="/dashboard">dashboard</Link>,
              click <em>Create new key</em>. Copy it immediately — it won&apos;t be shown again.
            </li>
            <li>
              <strong className="text-foreground">Top up your balance</strong> — use USDC via x402
              or simulation mode from the dashboard.
            </li>
            <li>
              <strong className="text-foreground">Call your first tool</strong>:
            </li>
          </ol>
          <pre className="code-block">{`curl -X POST https://unifyapi.pro/api/call/crypto.price \\
  -H "Authorization: Bearer uak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "coin": "bitcoin", "vs": "usd" }'`}</pre>
          <p>Response:</p>
          <pre className="code-block">{`{
  "tool": "crypto.price",
  "cost": 0.002,
  "upstream": "live",
  "latencyMs": 143,
  "balance": 4.998,
  "result": { "coin": "bitcoin", "vs": "usd", "price": 64210 }
}`}</pre>
        </Section>

        {/* Authentication */}
        <Section id="auth" title="Authentication">
          <p>
            Sign up with <strong className="text-foreground">email or Google</strong> at{" "}
            <Link className="text-primary-2 hover:underline" href="/login">/login</Link>.
            Authentication is handled by <strong className="text-foreground">Privy</strong> — no
            passwords stored on our side.
          </p>
          <p>
            Once logged in, create an API key from the{" "}
            <Link className="text-primary-2 hover:underline" href="/dashboard">dashboard</Link>.
            Keys are prefixed <Code>uak_live_</Code> and must be sent as a Bearer token on every
            tool call:
          </p>
          <pre className="code-block">{`Authorization: Bearer uak_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</pre>
          <p>
            The <Code>/api/tools</Code>, <Code>/api/openapi</Code>, and <Code>/api/agent-card</Code>{" "}
            endpoints are public. <Code>{"/api/call/{slug}"}</Code> and <Code>tools/call</Code> via
            MCP require a valid key with sufficient balance.
          </p>
          <p>
            You can revoke any key at any time from the dashboard. Revoked keys are rejected
            immediately.
          </p>
        </Section>

        {/* REST API */}
        <Section id="rest" title="REST API">
          <p>
            Call any tool by its slug. The request body is validated against the tool&apos;s input
            schema before execution.
          </p>
          <pre className="code-block">{`POST /api/call/{slug}
Authorization: Bearer uak_live_...
Content-Type: application/json

{ ...tool input fields... }`}</pre>

          <p>Example — get weather forecast for Jakarta:</p>
          <pre className="code-block">{`curl -X POST https://unifyapi.pro/api/call/weather.forecast \\
  -H "Authorization: Bearer uak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "latitude": -6.2088, "longitude": 106.8456, "days": 3 }'`}</pre>

          <p>Every response includes billing metadata:</p>
          <pre className="code-block">{`{
  "tool":      "weather.forecast",
  "cost":      0.001,
  "upstream":  "live",
  "latencyMs": 210,
  "balance":   4.997,
  "result":    { ...tool output... }
}`}</pre>

          <p>Error responses:</p>
          <pre className="code-block">{`401  { "error": "Unauthorized" }          — missing or revoked key
402  { "error": "Insufficient balance" }  — top up required
404  { "error": "Tool not found" }
422  { "error": "Validation failed", ... } — bad input`}</pre>
        </Section>

        {/* MCP endpoint */}
        <Section id="mcp" title="MCP endpoint">
          <p>
            The MCP server runs at <Code>/api/mcp</Code> and speaks{" "}
            <strong className="text-foreground">JSON-RPC 2.0 over HTTP POST</strong> (streamable-HTTP
            transport). Supported methods:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><Code>initialize</Code> — handshake, returns protocol version and capabilities</li>
            <li><Code>ping</Code> — health check</li>
            <li><Code>tools/list</Code> — returns all active tools with name, description, and input schema (no auth required)</li>
            <li><Code>tools/call</Code> — executes a tool (requires Bearer token + balance)</li>
          </ul>

          <p>Example — initialize:</p>
          <pre className="code-block">{`POST /api/mcp
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-06-18",
    "clientInfo": { "name": "my-agent", "version": "1.0" }
  }
}`}</pre>

          <p>Example — call a tool:</p>
          <pre className="code-block">{`POST /api/mcp
Authorization: Bearer uak_live_...
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "crypto__price",
    "arguments": { "coin": "ethereum", "vs": "usd" }
  }
}`}</pre>
          <p>
            Tool slugs use dots (<Code>crypto.price</Code>) in the catalog but double underscores (
            <Code>crypto__price</Code>) in MCP to satisfy client requirements.
          </p>
        </Section>

        {/* Connect your client */}
        <Section id="claude" title="Connect your AI client">
          <p>
            UnifyAPI works with any MCP-compatible client. Add the endpoint once and your agent
            instantly discovers all 818 tools via <Code>tools/list</Code>. Grab a key from the{" "}
            <Link className="text-primary-2 hover:underline" href="/dashboard">dashboard</Link> first.
          </p>

          <p className="text-foreground font-medium mt-4">Claude Desktop</p>
          <p>
            Edit <Code>claude_desktop_config.json</Code> (Settings → Developer → Edit Config), then
            restart Claude:
          </p>
          <pre className="code-block">{`{
  "mcpServers": {
    "unifyapi": {
      "type": "http",
      "url": "https://unifyapi.pro/api/mcp",
      "headers": {
        "Authorization": "Bearer uak_live_..."
      }
    }
  }
}`}</pre>

          <p className="text-foreground font-medium mt-4">Cursor</p>
          <p>
            Create <Code>.cursor/mcp.json</Code> in your project (or <Code>~/.cursor/mcp.json</Code>{" "}
            for global), then enable it under Settings → MCP:
          </p>
          <pre className="code-block">{`{
  "mcpServers": {
    "unifyapi": {
      "url": "https://unifyapi.pro/api/mcp",
      "headers": {
        "Authorization": "Bearer uak_live_..."
      }
    }
  }
}`}</pre>

          <p className="text-foreground font-medium mt-4">Cline / Continue (VS Code)</p>
          <p>
            Open the MCP Servers panel → <em>Configure MCP Servers</em> and add the same block:
          </p>
          <pre className="code-block">{`{
  "mcpServers": {
    "unifyapi": {
      "url": "https://unifyapi.pro/api/mcp",
      "headers": { "Authorization": "Bearer uak_live_..." }
    }
  }
}`}</pre>

          <p>
            For local development replace the URL with{" "}
            <Code>http://localhost:3000/api/mcp</Code>. Restart the client after saving so it
            re-reads the config and re-discovers tools.
          </p>
        </Section>

        {/* Discovery */}
        <Section id="discovery" title="Discovery">
          <p>Browse and filter the tool catalog without authentication:</p>
          <pre className="code-block">{`# All active tools
GET /api/tools

# Filter by category slug
GET /api/tools?category=crypto

# Full-text search
GET /api/tools?q=weather

# Combine
GET /api/tools?category=finance&q=stock`}</pre>
          <p>Each tool entry includes:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Slug, name, description, category, provider</li>
            <li>Price in USD per call</li>
            <li>Input schema (JSON Schema object)</li>
            <li>Live/mock status and active flag</li>
          </ul>
          <p>
            The full OpenAPI 3.1 spec is available at{" "}
            <Link className="text-primary-2 hover:underline" href="/api/openapi">/api/openapi</Link>
            {" "}and the machine-readable agent card at{" "}
            <Link className="text-primary-2 hover:underline" href="/api/agent-card">/api/agent-card</Link>.
          </p>
        </Section>

        {/* Categories */}
        <Section id="categories" title="Categories">
          <p>
            Tools are grouped into <strong className="text-foreground">24 categories</strong>.
            Use the category slug with the <Code>?category=</Code> filter:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mt-2">
            {[
              ["weather",       "Weather"],
              ["finance",       "Finance"],
              ["crypto",        "Crypto"],
              ["travel",        "Travel"],
              ["news",          "News & Media"],
              ["search",        "Web Search"],
              ["ai",            "AI & ML"],
              ["geo",           "Geo & Maps"],
              ["health",        "Health"],
              ["education",     "Education"],
              ["reference",     "Reference"],
              ["games",         "Games & Entertainment"],
              ["space",         "Space & Astronomy"],
              ["jobs",          "Jobs & Careers"],
              ["developer",     "Developer Tools"],
              ["government",    "Government & Legal"],
              ["business",      "Business"],
              ["communication", "Communication"],
              ["food",          "Food & Nutrition"],
              ["science",       "Science & Research"],
              ["media",         "Media & Arts"],
              ["security",      "Security"],
              ["social",        "Social"],
              ["data",          "Data & Analytics"],
            ].map(([slug, name]) => (
              <Link
                key={slug}
                href={`/tools?category=${slug}`}
                className="flex items-center gap-1.5 text-xs hover:text-primary-2 transition-colors"
              >
                <span className="text-primary-2">→</span> {name}
              </Link>
            ))}
          </div>
        </Section>

        {/* Payments */}
        <Section id="payments" title="Payments (x402)">
          <p>
            UnifyAPI uses the <strong className="text-foreground">x402 protocol</strong> for
            machine-native payments. Each tool call deducts its cost (in USD) from your account
            balance. Top up using <strong className="text-foreground">USDC on Base</strong>.
          </p>
          <p>Top up from the dashboard or via API:</p>
          <pre className="code-block">{`POST /api/payments/topup
Authorization: Bearer uak_live_...
Content-Type: application/json

{ "amountUsd": 10 }`}</pre>
          <p>
            <strong className="text-foreground">Simulation mode</strong> (default) — credits your
            balance instantly without a real payment. Useful for development and testing.
          </p>
          <p>
            <strong className="text-foreground">Live mode</strong> — when x402 is configured, the
            server returns <Code>HTTP 402</Code> with an <Code>accepts</Code> array of payment
            requirements. An x402-capable wallet pays and retries with an{" "}
            <Code>X-PAYMENT</Code> header, which is verified and settled on-chain.
          </p>
          <p>
            Tool prices range from <strong className="text-foreground">$0.001 to $0.035</strong>{" "}
            per call. Your current balance and usage are always visible in the{" "}
            <Link className="text-primary-2 hover:underline" href="/dashboard">dashboard</Link>.
          </p>
        </Section>

        {/* Live tools */}
        <Section id="live-tools" title="Live tools">
          <p>
            These tools proxy a <strong className="text-foreground">real upstream API</strong> and
            return live data. All others return realistic deterministic mock data.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1 mt-2">
            {[
              ["weather.forecast",   "Open-Meteo — daily forecast"],
              ["weather.current",    "Open-Meteo — current conditions"],
              ["weather.airquality", "Open-Meteo — air quality (PM2.5/AQI)"],
              ["crypto.price",       "CoinGecko — spot price"],
              ["crypto.market",      "CoinGecko — market data"],
              ["crypto.trending",    "CoinGecko — trending coins"],
              ["crypto.global",      "CoinGecko — global market stats"],
              ["fx.convert",         "ExchangeRate API — FX conversion"],
              ["geo.geocode",        "Open-Meteo Geocoding"],
              ["geo.timezone",       "Open-Meteo — timezone lookup"],
              ["text.translate",     "MyMemory — free translation"],
              ["news.headlines",     "Hacker News Algolia"],
              ["news.search",        "Hacker News Algolia"],
              ["wiki.summary",       "Wikipedia REST API"],
              ["pokemon.lookup",     "PokéAPI"],
              ["ip.geolocate",       "ipwho.is — IP geolocation"],
              ["time.world",         "TimeAPI.io — world clock"],
              ["quotes.random",      "DummyJSON — random quotes"],
              ["holidays.public",    "Nager.Date — public holidays"],
              ["dictionary.define",  "DictionaryAPI.dev — definitions"],
            ].map(([slug, desc]) => (
              <div key={slug} className="flex gap-2 text-xs py-0.5">
                <Link href={`/tools/${slug}`} className="code text-primary-2 hover:underline shrink-0">{slug}</Link>
                <span className="text-muted">{desc}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
