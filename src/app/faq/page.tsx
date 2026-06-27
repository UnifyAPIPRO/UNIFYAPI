import Link from "next/link";

export const metadata = {
  title: "FAQ — UnifyAPI",
  description:
    "Frequently asked questions about UnifyAPI — MCP, x402 billing, pricing, API keys, and how the gateway works.",
};

type QA = { q: string; a: React.ReactNode };

const GROUPS: { title: string; items: QA[] }[] = [
  {
    title: "Basics",
    items: [
      {
        q: "What is UnifyAPI?",
        a: "UnifyAPI is a unified gateway that exposes 818 tools across 250 providers behind a single API key and one billing rail. Instead of signing up for, integrating, and paying dozens of separate APIs, your app or AI agent connects once and reaches everything through one endpoint.",
      },
      {
        q: "What is MCP?",
        a: (
          <>
            MCP (Model Context Protocol) is an open standard that lets AI agents discover and call
            external tools. UnifyAPI exposes an MCP endpoint at{" "}
            <code className="code text-primary-2">/api/mcp</code>, so clients like Claude Desktop,
            Cursor, and Cline can use all 818 tools automatically. See the{" "}
            <Link href="/docs#claude" className="text-primary-2 hover:underline">setup guide</Link>.
          </>
        ),
      },
      {
        q: "Who is this for?",
        a: "Developers building AI agents, automation, and apps that need real-world data and actions — without the overhead of managing many provider accounts, keys, and invoices.",
      },
    ],
  },
  {
    title: "Pricing & billing",
    items: [
      {
        q: "How much does it cost?",
        a: (
          <>
            You pay per call — most tools start at{" "}
            <code className="code text-primary-2">$0.001</code> each. There are no subscriptions and
            no monthly minimums. See the{" "}
            <Link href="/pricing" className="text-primary-2 hover:underline">pricing page</Link> for
            the full breakdown.
          </>
        ),
      },
      {
        q: "What is x402?",
        a: "x402 is an open payment protocol that settles micropayments in USDC on-chain. UnifyAPI uses it so agents can pay per call automatically, with no credit card or invoicing. Until you configure a wallet it runs in simulation mode, so you can test the full flow for free.",
      },
      {
        q: "How do I add funds?",
        a: (
          <>
            Top up your balance from the{" "}
            <Link href="/dashboard" className="text-primary-2 hover:underline">dashboard</Link> using
            USDC over x402. Each tool call deducts its price from your balance.
          </>
        ),
      },
    ],
  },
  {
    title: "Using the API",
    items: [
      {
        q: "How do I get an API key?",
        a: (
          <>
            Sign in at <Link href="/login" className="text-primary-2 hover:underline">/login</Link>{" "}
            with email, Google, or X, then create a key in the{" "}
            <Link href="/dashboard" className="text-primary-2 hover:underline">dashboard</Link>. Keys
            are shown once — copy yours immediately.
          </>
        ),
      },
      {
        q: "What's the difference between live and mock tools?",
        a: (
          <>
            Live tools proxy a real upstream API and return real-time data. Mock tools return
            realistic sample data with the same schema, so you can build and test against any
            endpoint before it's wired to a live source. Check the{" "}
            <Link href="/status" className="text-primary-2 hover:underline">status page</Link> for
            current coverage.
          </>
        ),
      },
      {
        q: "Can I try a tool before integrating?",
        a: (
          <>
            Yes — every tool page has a built-in playground. Browse the{" "}
            <Link href="/tools" className="text-primary-2 hover:underline">catalog</Link>, open a
            tool, paste your key, and run a real call from the browser.
          </>
        ),
      },
    ],
  },
  {
    title: "$UNIFY token",
    items: [
      {
        q: "What is $UNIFY?",
        a: (
          <>
            $UNIFY is the community token of the UnifyAPI network, launched on Base. It aligns the
            people building, using, and growing the gateway. Learn more on the{" "}
            <Link href="/token" className="text-primary-2 hover:underline">token page</Link>.
          </>
        ),
      },
      {
        q: "Do I need $UNIFY to use the API?",
        a: "No. The API runs on USDC via x402. $UNIFY is a separate community token and is not required to call tools.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="space-y-3 mb-12">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">FAQ</p>
        <h1 className="text-4xl font-bold">Frequently asked questions</h1>
        <p className="text-muted">
          Everything you need to know about UnifyAPI, billing, and how to get started.
        </p>
      </div>

      <div className="space-y-12">
        {GROUPS.map((group) => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase">
              {group.title}
            </h2>
            <div className="space-y-3">
              {group.items.map((item) => (
                <details key={item.q} className="card p-5 group">
                  <summary className="flex items-center justify-between cursor-pointer font-medium list-none">
                    {item.q}
                    <span className="text-muted transition-transform group-open:rotate-45 text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 card p-8 text-center space-y-3">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="text-sm text-muted">
          Dive into the full documentation or start building right away.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/docs" className="btn btn-primary">Read the docs</Link>
          <Link href="/dashboard" className="btn btn-ghost">Get an API key</Link>
        </div>
      </div>
    </div>
  );
}
