import Link from "next/link";
import { TokenCountdown } from "@/components/TokenCountdown";
import { MarketData } from "@/components/MarketData";
import { CopyContractButton } from "@/components/CopyContractButton";

export const metadata = {
  title: "$UNIFY Token — UnifyAPI",
  description:
    "$UNIFY is the token powering the UnifyAPI network — one MCP endpoint connecting AI agents to 818 tools across 250 providers, billed in USDC via x402 on Solana.",
};


const UTILITY = [
  {
    title: "Aligns the network",
    body: "$UNIFY connects the people building tools, the agents calling them, and the community growing the catalog — one shared asset across the whole gateway.",
  },
  {
    title: "Powered by Solana",
    body: "The token lives on Solana — ultra-fast transactions, near-zero fees, and instant finality powering every x402 micropayment in UnifyAPI.",
  },
  {
    title: "Fair launch",
    body: "Launched through BANKR — fixed supply, no pre-mine, and liquidity locked from day one.",
  },
];

export default function TokenPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 space-y-24">
      {/* Hero */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-primary/30 rounded-full px-4 py-1.5 text-xs font-mono text-primary-2 tracking-widest uppercase">
          Solana Network
        </div>
        <h1 className="text-5xl font-bold">
          <span className="text-primary-2">$UNIFY</span>
        </h1>
        <p className="text-muted leading-relaxed">
          UnifyAPI gives AI agents a single MCP endpoint to reach 818 tools across 250 providers,
          with every call billed in USDC via x402. $UNIFY aligns everyone building, using, and
          growing that network.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/about" className="btn btn-ghost">
            Learn about UnifyAPI
          </Link>
        </div>
      </section>



      {/* Contract address */}
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase">Contract</h2>
        <div className="card p-6 space-y-3">
          <p className="text-sm text-muted">
            $UNIFY is live on Solana. Always verify the contract address before trading.
          </p>
          <div className="code-block flex items-center justify-between">
            <span className="text-muted font-mono text-xs break-all">JNG2Q394yK3m3vZsWU4w2jcFPty2Kkub83e9LTYEASY</span>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              <CopyContractButton address="JNG2Q394yK3m3vZsWU4w2jcFPty2Kkub83e9LTYEASY" />
              <span className="badge">Solana</span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Data */}
      <section className="space-y-6">
        <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase text-center">
          Market Data
        </h2>
        <MarketData />
      </section>

      {/* Utility */}
      <section className="space-y-6">
        <h2 className="text-sm font-mono text-primary-2 tracking-widest uppercase text-center">
          Why $UNIFY
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {UTILITY.map((u) => (
            <div key={u.title} className="card p-6 space-y-2">
              <h3 className="font-semibold">{u.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{u.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Thank you */}
      <section className="rounded-2xl border border-primary/20 bg-primary/5 p-10 md:p-14 text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 badge text-base px-5 py-2 mx-auto">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          From the team
        </div>
        <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto leading-snug">
          Thank you for believing in UnifyAPI
        </h2>
        <p className="text-muted leading-relaxed max-w-2xl mx-auto">
          Every wallet that holds <span className="text-primary-2 font-medium">$UNIFY</span> is more
          than a number on a chart — it&apos;s a vote of confidence in a simple idea: that AI agents
          deserve one open doorway to the entire API surface of the internet.
        </p>
        <p className="text-muted leading-relaxed max-w-2xl mx-auto">
          Your support funds new tools, keeps the gateway fast and reliable, and lets us keep
          building in the open. We don&apos;t take that lightly. To everyone who backed us early,
          shared the project, and bought the token — <span className="text-foreground font-medium">thank you</span>.
          This is only the beginning, and you&apos;re part of it.
        </p>
        <p className="text-sm text-primary-2 font-medium pt-2">— The UnifyAPI team</p>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border pt-8">
        <p className="text-xs text-muted leading-relaxed max-w-3xl">
          $UNIFY is a community token. It is not an investment, security, or equity in UnifyAPI, and
          confers no ownership or profit rights. Cryptocurrency is volatile and high-risk — only
          interact with amounts you can afford to lose, and always verify the official contract
          address before trading.
        </p>
      </section>
    </div>
  );
}
