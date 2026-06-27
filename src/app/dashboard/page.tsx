"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LogoutButton } from "@/components/LogoutButton";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="shrink-0 text-xs px-3 py-1.5 rounded-lg border border-border hover:border-accent hover:text-accent transition-colors"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function RevealKeyButton({ id }: { id: string }) {
  const [plain, setPlain] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reveal = async () => {
    if (plain) { setPlain(null); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/keys/${id}/reveal`);
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setPlain(data.plaintext);
    } catch {
      setError("Failed to reveal key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      {plain && (
        <div className="flex items-center gap-2">
          <code className="text-xs font-mono bg-background border border-border rounded px-2 py-1 flex-1 overflow-x-auto select-all">{plain}</code>
          <CopyButton text={plain} />
        </div>
      )}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="flex justify-end">
        <button
          onClick={reveal}
          disabled={loading}
          className="text-xs text-muted hover:text-foreground transition-colors"
        >
          {loading ? "Loading…" : plain ? "Hide" : "Show key"}
        </button>
      </div>
    </div>
  );
}

type Me = {
  user: { id: string; email: string; balance: number };
  stats: { calls: number; totalSpend: number };
  keys: { id: string; masked: string; label: string; createdAt: string; lastUsedAt: string | null }[];
  recent: { id: string; tool: string; toolName: string; status: string; cost: number; latencyMs: number; at: string }[];
};

type Recent = Me["recent"];

function Analytics({ recent }: { recent: Recent }) {
  // spend grouped by tool
  const spendByTool = new Map<string, number>();
  const callsByTool = new Map<string, number>();
  let success = 0;
  for (const r of recent) {
    spendByTool.set(r.tool, (spendByTool.get(r.tool) ?? 0) + r.cost);
    callsByTool.set(r.tool, (callsByTool.get(r.tool) ?? 0) + 1);
    if (r.status === "success") success++;
  }
  const topTools = [...callsByTool.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
  const maxCalls = Math.max(...topTools.map(([, c]) => c), 1);
  const successRate = Math.round((success / recent.length) * 100);
  const avgLatency = Math.round(
    recent.reduce((s, r) => s + r.latencyMs, 0) / recent.length,
  );

  return (
    <div className="mt-8 card p-6">
      <h2 className="font-semibold">Usage analytics</h2>
      <p className="text-sm text-muted mt-1">Based on your last {recent.length} calls.</p>

      <div className="mt-5 grid sm:grid-cols-3 gap-4">
        <div className="border border-border rounded-lg p-4">
          <div className="text-xs text-muted">Success rate</div>
          <div className="text-2xl font-bold mt-1 text-accent">{successRate}%</div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-xs text-muted">Avg latency</div>
          <div className="text-2xl font-bold mt-1">{avgLatency}ms</div>
        </div>
        <div className="border border-border rounded-lg p-4">
          <div className="text-xs text-muted">Tools used</div>
          <div className="text-2xl font-bold mt-1">{callsByTool.size}</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-xs text-muted mb-3">Most-called tools</div>
        <div className="space-y-2.5">
          {topTools.map(([tool, count]) => (
            <div key={tool} className="flex items-center gap-3">
              <span className="code text-xs w-40 truncate shrink-0">{tool}</span>
              <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary-2 rounded-full"
                  style={{ width: `${(count / maxCalls) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted w-16 text-right">
                {count} · ${(spendByTool.get(tool) ?? 0).toFixed(3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [topupAmount, setTopupAmount] = useState("5");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/me");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    setMe(await res.json());
    setLoading(false);
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function createKey() {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch("/api/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      if (res.ok) {
        setNewKey(data.key);
        localStorage.setItem("unifyapi_key", data.key);
        load();
      } else {
        setNotice(data.error ?? "Failed to create key.");
      }
    } catch (e) {
      setNotice("Network error — could not reach server.");
    } finally {
      setBusy(false);
    }
  }

  async function revokeKey(id: string) {
    await fetch(`/api/keys/${id}`, { method: "DELETE" });
    load();
  }

  async function topup() {
    setBusy(true);
    setNotice(null);
    const res = await fetch("/api/payments/topup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amountUsd: Number(topupAmount) }),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      setNotice(`Credited $${data.credited} (${data.mode} mode${data.txHash ? `, tx ${data.txHash}` : ""}).`);
      load();
    } else if (res.status === 402 && data.accepts) {
      setNotice("Live x402 mode: server returned payment requirements. An x402-capable agent/wallet must complete the payment. See README.");
    } else {
      setNotice(data.error ?? "Top up failed");
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl px-5 py-24 text-muted">Loading…</div>;
  if (!me) return null;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted mt-1">{me.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      {/* Stat cards */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-xs text-muted">Balance</div>
          <div className="text-2xl font-bold mt-1">${parseFloat(me.user.balance.toFixed(4))}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-muted">Successful calls</div>
          <div className="text-2xl font-bold mt-1">{me.stats.calls}</div>
        </div>
        <div className="card p-5">
          <div className="text-xs text-muted">Total spend</div>
          <div className="text-2xl font-bold mt-1">${parseFloat(me.stats.totalSpend.toFixed(4))}</div>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        {/* Top up */}
        <div className="card p-6">
          <h2 className="font-semibold">Top up balance</h2>
          <p className="text-sm text-muted mt-1">Pay with USDC over x402. Runs in simulation mode until x402 is configured.</p>
          <div className="mt-4 flex gap-2">
            <input value={topupAmount} onChange={(e) => setTopupAmount(e.target.value)} type="number" min="0.5" step="0.5" />
            <button onClick={topup} disabled={busy} className="btn btn-primary shrink-0">Top up</button>
          </div>
          {notice && <p className="mt-3 text-sm text-accent">{notice}</p>}
        </div>

        {/* Create key */}
        <div className="card p-6">
          <h2 className="font-semibold">API keys</h2>
          <p className="text-sm text-muted mt-1">Use these as a Bearer token for the REST and MCP endpoints.</p>
          <button onClick={createKey} disabled={busy} className="btn btn-primary mt-4">Create new key</button>
          {newKey && (
            <div className="mt-3">
              <p className="text-xs text-accent">Copy this now — it won&apos;t be shown again:</p>
              <div className="flex items-center gap-2 mt-1">
                <pre className="code-block !text-xs select-all flex-1 overflow-x-auto">{newKey}</pre>
                <CopyButton text={newKey} />
              </div>
            </div>
          )}
          <div className="mt-4 space-y-2">
            {me.keys.length === 0 && <p className="text-sm text-muted">No keys yet.</p>}
            {me.keys.map((k) => (
              <div key={k.id} className="flex flex-col gap-2 text-sm border border-border rounded-lg px-3 py-3">
                <div className="flex items-center justify-between">
                  <span className="code">{k.masked}</span>
                  <button onClick={() => revokeKey(k.id)} className="text-xs text-red-400 hover:underline shrink-0 ml-3">Revoke</button>
                </div>
                <RevealKeyButton id={k.id} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics */}
      {me.recent.length > 0 && <Analytics recent={me.recent} />}

      {/* Recent usage */}
      <div className="mt-8 card p-6">
        <h2 className="font-semibold">Recent activity</h2>
        {me.recent.length === 0 ? (
          <p className="text-sm text-muted mt-2">
            No calls yet. Grab a key and try a tool in the{" "}
            <Link href="/tools" className="text-primary-2 hover:underline">catalog</Link>.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted text-left">
                <tr className="border-b border-border">
                  <th className="py-2 font-medium">Tool</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Cost</th>
                  <th className="py-2 font-medium">Latency</th>
                  <th className="py-2 font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {me.recent.map((r) => (
                  <tr key={r.id} className="border-b border-border/60">
                    <td className="py-2 code">{r.tool}</td>
                    <td className="py-2">
                      <span className={r.status === "success" ? "text-accent" : "text-red-400"}>{r.status}</span>
                    </td>
                    <td className="py-2 code">${r.cost.toFixed(3)}</td>
                    <td className="py-2 text-muted">{r.latencyMs}ms</td>
                    <td className="py-2 text-muted">{new Date(r.at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
