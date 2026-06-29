export const metadata = {
  title: "Changelog — UnifyAPI",
  description:
    "Product updates, new tools, and improvements to the UnifyAPI gateway.",
};

type Entry = {
  date: string;
  version: string;
  tag: "Launch" | "Feature" | "Improvement" | "Tools";
  title: string;
  items: string[];
};

const ENTRIES: Entry[] = [
  {
    date: "June 27, 2026",
    version: "v1.2",
    tag: "Feature",
    title: "Status page, Token page & more",
    items: [
      "Added a live System Status page with per-category tool availability.",
      "Launched the $UNIFY token page with tokenomics and utility.",
      "Added a Changelog so you can follow what's new.",
      "Introduced the Built With section on About — Claude Code, Privy, and Base.",
      "Added Open Graph images and SEO meta tags for richer link previews.",
    ],
  },
  {
    date: "June 27, 2026",
    version: "v1.1",
    tag: "Improvement",
    title: "Team, mobile menu & sign-in options",
    items: [
      "Added a Team section to the About page.",
      "Added Sign in with X (Twitter) alongside Google.",
      "Enabled embedded EVM wallets on login via Privy.",
      "Added a mobile hamburger menu to the navbar.",
      "Custom domain unifyapi.pro is now live with automatic HTTPS.",
    ],
  },
  {
    date: "June 26, 2026",
    version: "v1.0",
    tag: "Launch",
    title: "UnifyAPI is live",
    items: [
      "One MCP endpoint exposing 818 tools across 250 providers.",
      "Pay-per-call billing in USDC via the x402 protocol on Base.",
      "REST API, OpenAPI 3.1 spec, and machine-readable agent card.",
      "Dashboard with API keys, balance top-up, and usage history.",
      "Sign in with email or Google, powered by Privy.",
    ],
  },
];

const TAG_STYLES: Record<Entry["tag"], string> = {
  Launch: "text-accent border-accent/40",
  Feature: "text-primary-2 border-primary/40",
  Improvement: "text-blue-400 border-blue-400/40",
  Tools: "text-purple-400 border-purple-400/40",
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="space-y-3 mb-12">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">Changelog</p>
        <h1 className="text-4xl font-bold">What&apos;s new</h1>
        <p className="text-muted">
          Product updates, new tools, and improvements to the UnifyAPI gateway.
        </p>
      </div>

      <div className="space-y-12">
        {ENTRIES.map((e) => (
          <article key={e.version} className="relative pl-6 border-l border-border">
            <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary-2" />
            <div className="flex flex-wrap items-center gap-3">
              <span className={`badge ${TAG_STYLES[e.tag]}`}>{e.tag}</span>
              <span className="code text-sm text-muted">{e.version}</span>
              <span className="text-sm text-muted">{e.date}</span>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{e.title}</h2>
            <ul className="mt-3 space-y-2">
              {e.items.map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted">
                  <span className="text-primary-2 mt-0.5 shrink-0">→</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
