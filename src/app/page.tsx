import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { listCategories, serializeTool } from "@/lib/catalog";
import { CodeTabs } from "@/components/CodeTabs";

export const dynamic = "force-dynamic";

const ArrowIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const PLANS = [
  {
    name: "Pay as you go",
    price: "$0.001–$0.035",
    period: "per call, by tool",
    highlight: false,
    features: ["Every tool included", "One API key", "Per-call billing"],
  },
  {
    name: "x402 native",
    price: "USDC",
    period: "machine payments",
    highlight: true,
    features: ["Top up over x402", "Base", "Instant settlement"],
  },
  {
    name: "Transparent",
    price: "Demo",
    period: "you stay in control",
    highlight: false,
    features: ["Live usage dashboard", "Revoke keys anytime", "Open OpenAPI spec"],
  },
];

export default async function Home() {
  const [toolCount, providerCount, categories, featuredRaw] = await Promise.all([
    prisma.tool.count({ where: { active: true } }),
    prisma.provider.count(),
    listCategories(),
    prisma.tool.findMany({
      where: { active: true, featured: true },
      include: { category: true, provider: true },
      take: 6,
    }),
  ]);
  const featured = featuredRaw.map(serializeTool);

  return (
    <>
      {/* Hero */}
      <section className="bg-grid border-b border-border">
        <div className="mx-auto max-w-5xl px-5 pt-24 pb-24 text-center">
          <span className="badge mx-auto text-base px-7 py-3 gap-3">
            <span className="h-3 w-3 rounded-full bg-accent" /> MCP + x402
          </span>
          <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            One Key for
            <br />
            <span className="gradient-silver">Hundreds of API Tools</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            Give AI agents a single MCP endpoint and one billing rail to reach {toolCount} tools
            across {providerCount} providers. Pay per call with crypto via x402.
          </p>
          <div className="mt-9 flex items-center justify-center">
            <Link href="/dashboard" className="btn btn-primary">
              Get Started →
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center divide-x divide-border">
            {[
              { n: String(toolCount), l: "Tools" },
              { n: String(providerCount), l: "Providers" },
              { n: "$0.001", l: "Min per call" },
            ].map((s) => (
              <div key={s.l} className="px-8">
                <div className="text-3xl font-bold">{s.n}</div>
                <div className="text-xs text-muted mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold">Built for agents, simple for humans</h2>
            <p className="mt-3 text-muted">
              Speak MCP natively, or hit a plain REST endpoint with a Bearer token. Same catalog,
              same billing, same single key.
            </p>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Unified discovery — load only the tools you need",
                "Automatic per-call billing & usage tracking",
                "OpenAPI 3.1 spec + machine-readable agent card",
                "Crypto-native payments (x402 / USDC)",
              ].map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-accent">✓</span>
                  <span className="text-muted">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          <CodeTabs />
        </div>
      </section>

      {/* Short answer */}
      <section className="mx-auto max-w-6xl px-5 pb-8">
        <div className="rounded-xl border border-[#2a2a2a] p-6 font-mono text-sm leading-relaxed" style={{ background: "#0e1117" }}>
          <p className="text-[#e6edf3]/80">
            UnifyAPI is a unified MCP gateway that connects{" "}
            <span className="text-[#4ade80]">{providerCount} upstream providers</span> and{" "}
            <span className="text-[#4ade80]">{toolCount} tools</span> through a single endpoint.
            Automated software clients connect once and access weather, travel, finance, entertainment,
            maps, education, health, and more. Every tool call is billed via{" "}
            <span className="text-[#4ade80]">x402 USDC micropayments</span> — no subscriptions,
            no upfront commitments.
          </p>
        </div>
      </section>

      {/* Why people choose UnifyAPI */}
      <section className="mx-auto max-w-6xl px-5 pb-12">
        <div className="rounded-xl border-l-4 border-[#4ade80] border border-[#2a2a2a] p-6 font-mono text-sm leading-relaxed" style={{ background: "#0e1117" }}>
          <ul className="space-y-3 text-[#e6edf3]/80">
            {[
              <>One MCP endpoint (<span className="text-[#4ade80] border border-[#4ade80]/40 rounded px-1">https://unifyapi.pro/api/mcp</span>) replaces {providerCount} separate provider integrations</>,
              <>{toolCount} tools across travel, finance, weather, entertainment, maps, education, health, music, jobs, science, and more</>,
              <>x402 payments — USDC on Base, from $0.001 to $0.035 per call depending on the tool</>,
              <>Sign up with email or Google — secured by Privy, get your API key instantly, no setup friction</>,
              <>Usage dashboard — track your calls, costs, and per-tool breakdown in real time</>,
              <>Live tool status — check uptime and latency for any tool before calling</>,
              <>Full typed schema per tool — every tool ships with validated input/output definitions</>,
              <>Fail-safe architecture — validation errors reject immediately, no silent pass-through</>,
              <>Open catalog — browse and search {toolCount}+ tools by category, provider, or keyword</>,
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-[#4ade80] shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-5 py-20 border-t border-border">
        <h2 className="text-2xl font-bold text-center">How it works</h2>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 border-l border-t border-border rounded-xl overflow-hidden">
          {[
            { step: "01", t: "Connect your agent", d: "Sign up with email or Google — secured by Privy. Get your API key instantly, then point Claude, GPT, or any MCP client at https://unifyapi.pro/api/mcp. One URL, one key." },
            { step: "02", t: "Discover 800+ tools", d: "Browse the full catalog by category or search by task. Every tool ships with a live schema, status indicator, and exact per-call pricing." },
            { step: "03", t: "Pay as you go", d: "Top up your balance with USDC over x402. Each call is debited automatically — no subscriptions, no minimums, no surprises." },
          ].map((c) => (
            <div key={c.step} className="border-r border-b border-border p-8 min-h-[190px]">
              <div className="code text-primary-2 text-sm">{c.step}</div>
              <h3 className="mt-2 font-semibold text-lg">{c.t}</h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold">Explore by category</h2>
          <Link href="/tools" className="text-sm text-primary-2 hover:underline">View all →</Link>
        </div>
        <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.slug} href={`/tools?category=${c.slug}`} className="card card-hover p-5 block">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{c.name}</span>
                <span className="badge">{c._count.tools}</span>
              </div>
              <p className="mt-2 text-sm text-muted line-clamp-2">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured tools */}
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-2xl font-bold">Featured tools</h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-5 block">
              <div className="flex items-center justify-between">
                <span className="code text-sm text-primary-2">{t.slug}</span>
                {t.live && <span className="badge text-accent border-accent/40">live</span>}
              </div>
              <h3 className="mt-2 font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{t.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>{t.providerName}</span>
                <span className="code">${t.priceUsd.toFixed(3)}/call</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-6xl px-5 py-20 border-t border-border">
        <h2 className="text-2xl font-bold text-center">Usage-based pricing</h2>
        <p className="mt-3 text-center text-muted max-w-xl mx-auto">
          No subscriptions. You only pay for the calls you make. Top up with USDC and your balance
          is debited per call.
        </p>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`card p-8 flex flex-col ${plan.highlight ? "ring-1 ring-primary" : ""}`}
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>

              <div className="mt-5 flex items-end gap-1.5">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-muted mb-1.5 text-sm">/ {plan.period}</span>}
              </div>

              <ul className="mt-8 space-y-4 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex gap-3 items-start">
                    <svg className="text-primary-2 mt-0.5 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    <span className="font-medium">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard"
                className={`btn w-full mt-8 ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
              >
                Get started
                {ArrowIcon}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
