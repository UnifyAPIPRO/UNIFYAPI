"use client";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

const PAIR = "0xba563f676ba0267a4f6fcc2414e101f37c9996f86d1c5044bce1e180d482eeac";
const API = `https://api.dexscreener.com/latest/dex/pairs/base/${PAIR}`;

type PairData = {
  priceUsd?: string;
  priceChange?: { h1?: number; h24?: number };
  liquidity?: { usd?: number };
  volume?: { h24?: number; h1?: number };
  marketCap?: number;
  fdv?: number;
};

function fmt(n: number | undefined): string {
  if (n === undefined || n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPrice(p: string | undefined): ReactNode {
  if (!p) return "—";
  const n = parseFloat(p);
  if (n >= 0.01) return `$${n.toFixed(6)}`;

  const str = n.toFixed(20);
  const afterDecimal = str.split(".")[1] || "";
  let zeros = 0;
  for (const ch of afterDecimal) {
    if (ch === "0") zeros++;
    else break;
  }

  if (zeros >= 3) {
    const significant = afterDecimal.slice(zeros, zeros + 4);
    return (
      <span>
        $0.0<sub className="text-[10px]">{zeros}</sub>{significant}
      </span>
    );
  }

  return `$${n.toFixed(8)}`;
}

function fmtChange(c: number | undefined): { text: string; positive: boolean } {
  if (c === undefined) return { text: "—", positive: true };
  return {
    text: `${c >= 0 ? "+" : ""}${c.toFixed(2)}%`,
    positive: c >= 0,
  };
}

export function MarketData() {
  const [pair, setPair] = useState<PairData | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch(API);
      const json = await res.json();
      setPair(json?.pairs?.[0] ?? null);
    } catch {
      // keep previous data on error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const change1h = fmtChange(pair?.priceChange?.h1);

  const change24h = fmtChange(pair?.priceChange?.h24);

  const items: { label: string; value: ReactNode; sub?: ReactNode; highlight?: boolean; positive?: boolean; isChange?: boolean }[] = [
    {
      label: "PRICE",
      value: loading ? "…" : fmtPrice(pair?.priceUsd),
      sub: loading ? null : (
        <span className={`text-xs font-semibold mt-1 ${change24h.positive ? "text-green-400" : "text-red-400"}`}>
          {change24h.positive ? "▲" : "▼"} {change24h.text} 24h
        </span>
      ),
      highlight: true,
    },
    {
      label: "1H CHANGE",
      value: loading ? "…" : change1h.text,
      positive: change1h.positive,
      isChange: true,
    },
    { label: "LIQUIDITY", value: loading ? "…" : fmt(pair?.liquidity?.usd) },
    { label: "VOLUME 24H", value: loading ? "…" : fmt(pair?.volume?.h24) },
    { label: "VOLUME 1H", value: loading ? "…" : fmt(pair?.volume?.h1) },
    { label: "MARKET CAP", value: loading ? "…" : fmt(pair?.marketCap) },
    { label: "FDV", value: loading ? "…" : fmt(pair?.fdv) },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((d) => (
        <div
          key={d.label}
          className={`card p-5 text-center ${d.label === "PRICE" ? "col-span-2" : ""}`}
        >
          <div className="text-xs text-muted mb-2">{d.label}</div>
          <div
            className={`text-2xl font-bold tabular-nums ${
              d.isChange
                ? d.positive
                  ? "text-primary-2"
                  : "text-red-400"
                : "text-primary-2"
            }`}
          >
            {d.value}
          </div>
          {d.sub && <div className="flex justify-center">{d.sub}</div>}
        </div>
      ))}
    </div>
  );
}
