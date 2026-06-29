import Link from "next/link";

export const metadata = {
  title: "About — UnifyAPI",
  description:
    "Learn about UnifyAPI — the unified MCP gateway that connects AI agents to 818 tools across 250 providers through a single endpoint and one billing rail.",
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary-2">{value}</div>
      <div className="mt-1 text-sm text-muted">{label}</div>
    </div>
  );
}

function Pillar({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6 flex flex-col gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary-2">
        {icon}
      </div>
      <h3 className="font-semibold text-base">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{children}</p>
    </div>
  );
}

function TimelineItem({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="h-9 w-9 rounded-full border border-primary-2 flex items-center justify-center text-primary-2 text-xs font-bold shrink-0">
          {step}
        </div>
        <div className="w-px flex-1 bg-border mt-2" />
      </div>
      <div className="pb-8">
        <h4 className="font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function StackBadge({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-center gap-3 border border-border rounded-lg px-4 py-3">
      <span className="text-primary-2 font-mono text-sm font-semibold">{name}</span>
      <span className="text-muted text-xs">{role}</span>
    </div>
  );
}

const TEAM = [
  { role: "Founder & Engineering", img: "/team/1.png" },
  { role: "Protocol & x402", img: "/team/2.png" },
  { role: "Catalog & Growth", img: "/team/3.png" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 space-y-28">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold leading-tight tracking-tight">
          The unified gateway<br />
          <span className="text-primary-2">for AI-native API access</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed">
          UnifyAPI was built with one conviction: AI agents should be able to reach any API
          in the world through a single URL, a single key, and a single payment rail —
          without integration work, without subscriptions, and without surprises.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn btn-primary">Get your API key</Link>
          <Link href="/docs" className="btn btn-ghost">Read the docs</Link>
        </div>
      </section>

      {/* ── Stats bar ──────────────────────────────────────────────── */}
      <section className="border border-border rounded-2xl p-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
        <Stat value="818+" label="Tools available" />
        <Stat value="250+"  label="Upstream providers" />
        <Stat value="24"   label="Categories" />
        <Stat value="$0.001" label="Minimum per-call cost" />
      </section>

      {/* ── The problem ────────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-5">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">The problem</p>
          <h2 className="text-3xl font-bold leading-snug">
            Integration debt is the silent killer of AI products
          </h2>
          <div className="space-y-4 text-muted text-sm leading-relaxed">
            <p>
              Every time an AI agent needs a new capability — current weather, a stock quote,
              a flight price, a product lookup — someone has to integrate a new third-party
              API. That means reading docs, handling auth, wrangling rate limits, dealing
              with schema drift, parsing errors, and writing glue code. Then doing it again
              for the next provider. And the next.
            </p>
            <p>
              The hidden cost isn&apos;t the integration itself. It&apos;s the ongoing
              maintenance: providers change endpoints, deprecate fields, rotate API keys.
              A team maintaining fifteen integrations is not building product — they&apos;re
              babysitting plumbing.
            </p>
            <p>
              Most existing API marketplaces were designed for human developers building
              REST clients. They don&apos;t speak the language of AI agents. They have no
              concept of tool schemas, MCP, or machine-native payment flows. They assume
              a human in the loop who can fill out a form, read documentation, and pay a
              monthly invoice.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border font-mono text-xs p-6 space-y-3 bg-card leading-loose">
          <p className="text-muted">// Without UnifyAPI</p>
          <p><span className="text-red-400">import</span> <span className="text-foreground">OpenWeather</span> <span className="text-red-400">from</span> <span className="text-green-400">&apos;openweather-api&apos;</span></p>
          <p><span className="text-red-400">import</span> <span className="text-foreground">CoinGecko</span> <span className="text-red-400">from</span> <span className="text-green-400">&apos;coingecko-api&apos;</span></p>
          <p><span className="text-red-400">import</span> <span className="text-foreground">Amadeus</span> <span className="text-red-400">from</span> <span className="text-green-400">&apos;amadeus&apos;</span></p>
          <p><span className="text-red-400">import</span> <span className="text-foreground">Finnhub</span> <span className="text-red-400">from</span> <span className="text-green-400">&apos;finnhub&apos;</span></p>
          <p className="text-muted">{"// ... 246 more providers"}</p>
          <p className="text-muted pt-2">// With UnifyAPI</p>
          <p>
            <span className="text-blue-400">const</span>{" "}
            <span className="text-foreground">result</span>{" "}
            <span className="text-blue-400">=</span>{" "}
            <span className="text-red-400">await</span>{" "}
            <span className="text-yellow-400">mcp</span>
            <span className="text-foreground">.call(</span>
            <span className="text-green-400">&apos;weather.forecast&apos;</span>
            <span className="text-foreground">, {"{"}...{"}"}</span>
            <span className="text-foreground">)</span>
          </p>
          <p className="text-primary-2">{"// done ✓"}</p>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section className="space-y-10">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Architecture</p>
          <h2 className="text-3xl font-bold">How UnifyAPI works</h2>
          <p className="text-muted text-sm leading-relaxed">
            UnifyAPI sits between your AI agent and the world. Every request flows through
            a consistent pipeline — authenticated, billed, validated, and logged — before
            being proxied to the upstream provider.
          </p>
        </div>
        <div className="space-y-0">
          <TimelineItem step="01" title="Sign up with email or Google">
            Authentication is handled end-to-end by <strong className="text-foreground">Privy</strong> — a
            crypto-native identity layer that supports email, social login, and embedded wallets.
            No passwords are stored on our servers. Your session is a signed JWT issued by Privy
            and verified on every request. Google OAuth and email magic links are both supported.
          </TimelineItem>
          <TimelineItem step="02" title="Create an API key">
            From the dashboard you can generate one or more API keys prefixed{" "}
            <code className="code text-primary-2">uak_live_</code>. Keys are one-way hashed in
            the database — we store only a masked preview for display. Revoke any key at any
            time; revocation takes effect on the next request, with no propagation delay.
          </TimelineItem>
          <TimelineItem step="03" title="Top up your balance">
            Balances are denominated in USD and topped up with{" "}
            <strong className="text-foreground">USDC on Base</strong> via the{" "}
            <strong className="text-foreground">x402 protocol</strong>. x402 is an open
            standard for machine-native HTTP payments: the server issues an HTTP 402 response
            with payment requirements, an x402-capable wallet pays on-chain and retries, and
            the server verifies and settles without any human in the loop. During development
            you can use simulation mode, which credits instantly so you can test end-to-end
            flows before connecting a wallet.
          </TimelineItem>
          <TimelineItem step="04" title="Point your agent at the MCP endpoint">
            Add <code className="code text-primary-2">https://unifyapi.pro/api/mcp</code> to
            your MCP client config with your Bearer token. The endpoint speaks{" "}
            <strong className="text-foreground">JSON-RPC 2.0 over HTTP POST</strong> and
            implements the full MCP spec: <code className="code">initialize</code>,{" "}
            <code className="code">tools/list</code>, and{" "}
            <code className="code">tools/call</code>. Your agent calls{" "}
            <code className="code">tools/list</code> once and gets back all 818 tools with
            their typed input schemas. From that point it can call any tool as a native
            function — no additional configuration.
          </TimelineItem>
          <TimelineItem step="05" title="Every call is debited automatically">
            When a tool is called, the pipeline authenticates the key, checks the balance,
            validates the input against the tool&apos;s JSON Schema, proxies to the upstream
            provider, records the result, and deducts the cost — all in a single round trip.
            The response includes the cost, remaining balance, upstream latency, and the
            tool&apos;s output. There are no subscriptions, no minimum spend, and no
            monthly invoices.
          </TimelineItem>
        </div>
      </section>

      {/* ── Core pillars ───────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Principles</p>
          <h2 className="text-3xl font-bold">Built on four pillars</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <Pillar
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            }
            title="Agent-first, not API-wrapper-first"
          >
            Every design decision starts with the agent&apos;s perspective. Tool names are
            descriptive. Schemas are typed and minimal. Errors are structured. The MCP
            endpoint needs no documentation — an agent discovers everything it needs at
            runtime via <code className="code">tools/list</code>.
          </Pillar>
          <Pillar
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            }
            title="Pay-as-you-go, not subscribe-to-maybe-use"
          >
            The subscription model is a bad fit for AI agents that call tools sporadically
            at unpredictable volumes. UnifyAPI charges per call — from $0.001 to $0.035
            depending on the upstream provider. Top up when you need to. Stop when you
            don&apos;t. No commitments, no idle spend.
          </Pillar>
          <Pillar
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            }
            title="Zero-trust security by default"
          >
            API keys are one-way hashed at rest. Every request is authenticated before
            any upstream call is made. Input is validated against a strict JSON Schema
            before execution — invalid payloads are rejected immediately, never silently
            passed through. Keys can be revoked instantly from the dashboard.
          </Pillar>
          <Pillar
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            }
            title="Full observability, always"
          >
            Every tool call is logged with its cost, latency, status, and upstream
            identifier. Your dashboard shows spend by tool, call counts, and recent
            activity in real time. You always know exactly what was called, when, and
            how much it cost — no opaque billing surprises.
          </Pillar>
        </div>
      </section>

      {/* ── The catalog ────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">The catalog</p>
          <h2 className="text-3xl font-bold">818 tools. 24 categories. One endpoint.</h2>
          <p className="text-muted text-sm leading-relaxed">
            The UnifyAPI catalog spans the full breadth of what a general-purpose AI agent
            might need. Tools are grouped into 24 broad categories, each with multiple
            providers offering different trade-offs between price, freshness, and coverage.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { slug: "weather",       name: "Weather",              count: "16 providers" },
            { slug: "finance",       name: "Finance",              count: "26 providers" },
            { slug: "crypto",        name: "Crypto",               count: "3 providers"  },
            { slug: "travel",        name: "Travel",               count: "8 providers"  },
            { slug: "news",          name: "News & Media",         count: "3 providers"  },
            { slug: "search",        name: "Web Search",           count: "7 providers"  },
            { slug: "ai",            name: "AI & ML",              count: "6 providers"  },
            { slug: "geo",           name: "Geo & Maps",           count: "15 providers" },
            { slug: "health",        name: "Health",               count: "15 providers" },
            { slug: "education",     name: "Education",            count: "8 providers"  },
            { slug: "reference",     name: "Reference",            count: "17 providers" },
            { slug: "games",         name: "Games & Entertainment","count": "11 providers"},
            { slug: "space",         name: "Space & Astronomy",    count: "12 providers" },
            { slug: "jobs",          name: "Jobs & Careers",       count: "8 providers"  },
            { slug: "developer",     name: "Developer Tools",      count: "17 providers" },
            { slug: "government",    name: "Government & Legal",   count: "16 providers" },
            { slug: "business",      name: "Business",             count: "6 providers"  },
            { slug: "food",          name: "Food & Nutrition",     count: "3 providers"  },
            { slug: "science",       name: "Science & Research",   count: "21 providers" },
            { slug: "media",         name: "Media & Arts",         count: "11 providers" },
            { slug: "security",      name: "Security",             count: "6 providers"  },
            { slug: "social",        name: "Social",               count: "4 providers"  },
            { slug: "communication", name: "Communication",        count: "4 providers"  },
            { slug: "data",          name: "Data & Analytics",     count: "2 providers"  },
          ].map((c) => (
            <Link
              key={c.slug}
              href={`/tools?category=${c.slug}`}
              className="card p-4 hover:border-primary-2/50 transition-colors group"
            >
              <div className="font-medium text-sm group-hover:text-primary-2 transition-colors">{c.name}</div>
              <div className="text-xs text-muted mt-1">{c.count}</div>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link href="/tools" className="btn btn-ghost text-sm">Browse full catalog →</Link>
        </div>
      </section>

      {/* ── Tech stack ─────────────────────────────────────────────── */}
      <section className="space-y-8">
        <div className="space-y-3 max-w-2xl">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Technology</p>
          <h2 className="text-3xl font-bold">Built with modern, production-grade tools</h2>
          <p className="text-muted text-sm leading-relaxed">
            UnifyAPI is built entirely on open standards and production-grade infrastructure.
            Every component was chosen for reliability, type safety, and developer experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <StackBadge name="Next.js 16"     role="Full-stack React framework with App Router" />
          <StackBadge name="TypeScript"     role="End-to-end type safety across API and UI" />
          <StackBadge name="Prisma 7"       role="Type-safe ORM with PostgreSQL and PrismaPg adapter" />
          <StackBadge name="PostgreSQL"     role="Primary database for users, keys, tools, and logs" />
          <StackBadge name="Privy"          role="Authentication — email, Google OAuth, embedded wallets" />
          <StackBadge name="x402"           role="Machine-native HTTP payment protocol over USDC" />
          <StackBadge name="MCP (JSON-RPC)" role="Model Context Protocol — AI agent tool interface" />
          <StackBadge name="Tailwind CSS"   role="Utility-first styling with custom design tokens" />
          <StackBadge name="Base (L2)"      role="Ethereum L2 for USDC settlement via x402" />
          <StackBadge name="Vercel"         role="Edge deployment with automatic preview environments" />
        </div>
      </section>

      {/* ── x402 deep dive ─────────────────────────────────────────── */}
      <section className="grid md:grid-cols-2 gap-12 items-start">
        <div className="space-y-5">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Payments</p>
          <h2 className="text-3xl font-bold">Why x402?</h2>
          <div className="space-y-4 text-muted text-sm leading-relaxed">
            <p>
              Traditional payment rails — credit cards, wire transfers, monthly invoices —
              were built for humans and billing cycles. They don&apos;t work for machines
              that want to pay $0.002 for a single API call at 3 AM with no human in
              the loop.
            </p>
            <p>
              <strong className="text-foreground">x402</strong> is an open protocol built
              on the long-forgotten HTTP 402 Payment Required status code. When a client
              hits a paywall, the server returns 402 with a structured{" "}
              <code className="code">accepts</code> field describing exactly what payment
              is needed — amount, currency, and network. An x402-capable client (or wallet)
              constructs the payment, submits it on-chain, and retries the request with an{" "}
              <code className="code">X-PAYMENT</code> header. The server verifies the
              on-chain proof and responds. No intermediaries. No chargebacks. No fraud.
            </p>
            <p>
              For UnifyAPI this means: an AI agent can autonomously top up its own balance,
              call tools, and manage spend — all without a human approving each transaction.
              This is the foundation of truly autonomous agents that operate in the world.
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-border font-mono text-xs p-6 space-y-2 bg-card leading-relaxed">
          <p className="text-muted">{"// 1. Agent calls tool"}</p>
          <p><span className="text-blue-400">POST</span> /api/payments/topup</p>
          <p className="text-muted mt-2">{"// 2. Server responds (live mode)"}</p>
          <p><span className="text-yellow-400">HTTP 402</span> Payment Required</p>
          <p className="text-foreground">accepts: [{"{"}</p>
          <p className="pl-4 text-foreground">scheme: <span className="text-green-400">&quot;exact&quot;</span>,</p>
          <p className="pl-4 text-foreground">network: <span className="text-green-400">&quot;base&quot;</span>,</p>
          <p className="pl-4 text-foreground">amount: <span className="text-green-400">&quot;10000000&quot;</span>,</p>
          <p className="pl-4 text-foreground">asset: <span className="text-green-400">&quot;USDC&quot;</span></p>
          <p className="text-foreground">{"}"}]</p>
          <p className="text-muted mt-2">{"// 3. Wallet pays on-chain, agent retries"}</p>
          <p><span className="text-blue-400">POST</span> /api/payments/topup</p>
          <p>X-PAYMENT: <span className="text-green-400">&lt;proof&gt;</span></p>
          <p className="text-muted mt-2">{"// 4. Server verifies and credits"}</p>
          <p><span className="text-primary-2">HTTP 200</span> {"{"}credited: 10{"}"}</p>
        </div>
      </section>

      {/* ── MCP deep dive ──────────────────────────────────────────── */}
      <section className="space-y-6 max-w-3xl">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Protocol</p>
        <h2 className="text-3xl font-bold">MCP — the language of AI agents</h2>
        <div className="space-y-4 text-muted text-sm leading-relaxed">
          <p>
            The <strong className="text-foreground">Model Context Protocol (MCP)</strong>{" "}
            is an open standard that gives AI models a structured way to discover and call
            external tools. Rather than hardcoding API integrations into every model, MCP
            lets a client (Claude, GPT, an open-source model, or a custom agent) ask a
            server: &ldquo;what tools do you have, and how do I call them?&rdquo; The server
            responds with typed schemas, and the client can call any tool as if it were a
            native function.
          </p>
          <p>
            UnifyAPI&apos;s MCP endpoint at{" "}
            <code className="code text-primary-2">https://unifyapi.pro/api/mcp</code>{" "}
            exposes all 818 tools in this format. Configure it once in your MCP client and
            your agent gains access to weather data, crypto prices, flight schedules, company
            lookups, gene databases, satellite imagery, and hundreds of other capabilities —
            all through the same interface, all billed the same way.
          </p>
          <p>
            This matters because it dissolves the boundary between &ldquo;what a model knows&rdquo;
            and &ldquo;what a model can do.&rdquo; A model that can call{" "}
            <code className="code">weather.forecast</code> doesn&apos;t need weather data
            in its training set. A model that can call <code className="code">crypto.price</code>{" "}
            is always up to date, regardless of its knowledge cutoff. MCP turns static
            models into dynamic agents.
          </p>
        </div>
      </section>

      {/* ── Vision ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-10 space-y-5 text-center">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Vision</p>
        <h2 className="text-3xl font-bold max-w-2xl mx-auto leading-snug">
          An internet where every API is accessible to every agent
        </h2>
        <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto">
          We believe the next generation of software will be written by agents, not humans.
          Those agents need reliable, affordable, discoverable access to real-world data and
          actions. UnifyAPI is our answer to that need — a single gateway that makes the
          entire API surface of the internet accessible through one endpoint, one key, and
          one payment that happens automatically.
        </p>
        <p className="text-muted text-sm leading-relaxed max-w-2xl mx-auto">
          We&apos;re starting with 818 tools. We&apos;re not stopping there. Every provider
          that joins the catalog makes every agent on the platform more capable. Every dollar
          spent goes directly to the tool that earned it. We&apos;re building the
          infrastructure layer for autonomous AI — and we&apos;re building it in the open.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/tools" className="btn btn-primary">Explore the catalog</Link>
          <Link href="/docs" className="btn btn-ghost">View the docs</Link>
        </div>
      </section>

      {/* ── Team ───────────────────────────────────────────────────── */}
      <section className="text-center space-y-10">
        <div className="space-y-3">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Team</p>
          <h2 className="text-3xl font-bold">The people behind UnifyAPI</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            A small team obsessed with making the entire API surface of the internet
            accessible to autonomous agents.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-3xl mx-auto">
          {TEAM.map((m) => (
            <div key={m.role} className="flex flex-col items-center gap-4">
              <img
                src={m.img}
                alt={m.role}
                className="h-32 w-32 rounded-full object-cover border-2 border-border"
              />
              <p className="text-sm text-primary-2 font-medium">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Built With ─────────────────────────────────────────────── */}
      <section className="text-center space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Built With</p>
          <h2 className="text-3xl font-bold">Powered by the best stack</h2>
          <p className="text-muted text-sm max-w-xl mx-auto">
            UnifyAPI is built and shipped entirely using cutting-edge tools — from AI-assisted
            development to decentralized payments and authentication.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Claude Code */}
          <div className="card p-6 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white">
              <img src="/logos/claude-code.png" alt="Claude Code" className="h-9 w-9" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Claude Code</p>
              <p className="text-xs font-mono" style={{color:"#D97757"}}>Opus 4.8</p>
              <p className="text-xs text-muted leading-relaxed">
                Entire codebase written and shipped with Claude Code — Anthropic&apos;s most powerful AI coding agent.
              </p>
            </div>
          </div>
          {/* Privy */}
          <div className="card p-6 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden bg-white">
              <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
                <ellipse cx="50" cy="38" rx="28" ry="28" fill="#09090F"/>
                <ellipse cx="50" cy="82" rx="14" ry="5" fill="#09090F"/>
              </svg>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Privy</p>
              <p className="text-xs font-mono text-purple-400">Auth & Wallets</p>
              <p className="text-xs text-muted leading-relaxed">
                Seamless authentication via email, Google, and Twitter — with embedded wallets created automatically on login.
              </p>
            </div>
          </div>
          {/* Base */}
          <div className="card p-6 flex flex-col items-center gap-4 text-center">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="/logos/base.jpg" alt="Base" className="h-14 w-14 object-cover" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Base Network</p>
              <p className="text-xs font-mono text-blue-400">L2 by Coinbase</p>
              <p className="text-xs text-muted leading-relaxed">
                All x402 micropayments settle on Base — Coinbase&apos;s Ethereum L2 with near-zero fees and instant finality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-border pt-16 grid sm:grid-cols-3 gap-8">
        <div className="space-y-2">
          <h3 className="font-semibold">Start building</h3>
          <p className="text-sm text-muted">Get an API key and make your first tool call in under 2 minutes.</p>
          <Link href="/dashboard" className="inline-block mt-2 text-primary-2 text-sm hover:underline">
            Go to dashboard →
          </Link>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Read the docs</h3>
          <p className="text-sm text-muted">Full reference for the REST API, MCP endpoint, and x402 payments.</p>
          <Link href="/docs" className="inline-block mt-2 text-primary-2 text-sm hover:underline">
            Open documentation →
          </Link>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Browse tools</h3>
          <p className="text-sm text-muted">Filter 818 tools by category, search by task, check live status.</p>
          <Link href="/tools" className="inline-block mt-2 text-primary-2 text-sm hover:underline">
            Explore catalog →
          </Link>
        </div>
      </section>

    </div>
  );
}
