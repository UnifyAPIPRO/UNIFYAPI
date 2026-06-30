import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing — UnifyAPI",
  description:
    "Simple usage-based pricing for UnifyAPI. Pay per call in USDC via x402 — no subscriptions, no minimums. Most tools start at $0.001 per call.",
};

const HIGHLIGHTS = [
  { title: "No subscriptions", body: "You never pay a monthly fee. Charges happen only when a tool actually runs." },
  { title: "Per-call billing", body: "Each call deducts its exact price from your balance — from $0.001 to $0.035 depending on the tool." },
  { title: "USDC via x402", body: "Top up once with USDC over the x402 protocol on Solana. Settlement is instant and automatic." },
];

export default async function PricingPage() {
  // A spread of real tools across price points for the example table.
  let examples: { slug: string; name: string; priceUsd: number; categoryName: string }[] = [];
  let min = 0.001;
  let max = 0.035;
  try {
    const tools = await prisma.tool.findMany({
      where: { active: true, featured: true },
      include: { category: true },
      orderBy: { priceUsd: "asc" },
      take: 8,
    });
    examples = tools.map((t) => ({
      slug: t.slug,
      name: t.name,
      priceUsd: Number(t.priceUsd),
      categoryName: t.category?.name ?? "—",
    }));
    const agg = await prisma.tool.aggregate({
      where: { active: true },
      _min: { priceUsd: true },
      _max: { priceUsd: true },
    });
    const dbMin = Number(agg._min.priceUsd);
    const dbMax = Number(agg._max.priceUsd);
    if (dbMin > 0) min = dbMin;
    if (dbMax > 0) max = dbMax;
  } catch {
    // DB unreachable — fall back to defaults.
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-5 max-w-2xl mx-auto">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Pricing</p>
        <h1 className="text-5xl font-bold">Pay only for what you call</h1>
        <p className="text-muted text-lg leading-relaxed">
          Usage-based pricing with no subscriptions and no minimums. Most tools start at{" "}
          <span className="text-primary-2 font-semibold">${min.toFixed(3)}</span> per call.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="btn btn-primary">Get an API key</Link>
          <Link href="/tools" className="btn btn-ghost">Browse the catalog</Link>
        </div>
      </section>

      {/* Price range banner */}
      <section className="card p-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-border">
          <div className="pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl font-bold text-primary-2">${min.toFixed(3)}</div>
            <div className="text-xs text-muted mt-1 leading-snug">Cheapest<br />per call</div>
          </div>
          <div className="pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl font-bold">${Number(max).toFixed(2)}</div>
            <div className="text-xs text-muted mt-1 leading-snug">Most expensive<br />per call</div>
          </div>
          <div className="pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl font-bold">$0</div>
            <div className="text-xs text-muted mt-1 leading-snug">Monthly<br />fee</div>
          </div>
          <div className="pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl font-bold">818</div>
            <div className="text-xs text-muted mt-1 leading-snug">Tools<br />available</div>
          </div>
          <div className="pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl font-bold">250</div>
            <div className="text-xs text-muted mt-1 leading-snug">API<br />providers</div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid sm:grid-cols-3 gap-6">
        {HIGHLIGHTS.map((h) => (
          <div key={h.title} className="card p-6 space-y-2">
            <h3 className="font-semibold">{h.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{h.body}</p>
          </div>
        ))}
      </section>

      {/* Example prices */}
      {examples.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase text-center">
            Example prices
          </h2>
          <div className="card divide-y divide-border">
            {examples.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="flex items-center gap-4 p-4 hover:bg-foreground/[0.02] transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="code text-sm truncate">{t.slug}</p>
                  <p className="text-xs text-muted truncate">{t.name} · {t.categoryName}</p>
                </div>
                <span className="code text-sm text-primary-2 shrink-0">
                  ${t.priceUsd.toFixed(3)}<span className="text-muted">/call</span>
                </span>
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted text-center">
            Every tool lists its exact price on its detail page. Prices are charged only on
            successful calls.
          </p>
        </section>
      )}

      {/* How billing works */}
      <section className="space-y-5">
        <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase text-center">
          How billing works
        </h2>
        <div className="card p-8 space-y-4 text-sm text-muted leading-relaxed">
          <p>
            <span className="text-foreground font-medium">1. Top up.</span> Add USDC to your balance
            from the dashboard over x402. Until you configure a wallet, top-up runs in simulation
            mode so you can test everything for free.
          </p>
          <p>
            <span className="text-foreground font-medium">2. Call tools.</span> Each successful call
            deducts its price from your balance. Failed or unauthorized calls are never charged.
          </p>
          <p>
            <span className="text-foreground font-medium">3. Stay in control.</span> Watch every
            call and your remaining balance in real time on the{" "}
            <Link href="/dashboard" className="text-primary-2 hover:underline">dashboard</Link>, and
            revoke any key instantly.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Ready to start?</h2>
        <p className="text-muted">Create a key and make your first call in under two minutes.</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/dashboard" className="btn btn-primary">Get an API key</Link>
          <Link href="/faq" className="btn btn-ghost">Read the FAQ</Link>
        </div>
      </section>
    </div>
  );
}
