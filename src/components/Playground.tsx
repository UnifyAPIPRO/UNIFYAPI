"use client";

import { useEffect, useState } from "react";

type Schema = {
  properties?: Record<string, { type?: string; description?: string; default?: unknown }>;
  required?: string[];
};

export function Playground({ slug, schema }: { slug: string; schema: Schema }) {
  const props = Object.entries(schema.properties ?? {});
  const [apiKey, setApiKey] = useState("");
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const [name, def] of props) {
      init[name] = def.default !== undefined ? String(def.default) : "";
    }
    return init;
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("unifyapi_key");
    if (saved) setApiKey(saved);
  }, []);

  async function run() {
    setLoading(true);
    setResult(null);
    setStatus(null);
    try {
      const body: Record<string, unknown> = {};
      for (const [name, def] of props) {
        const v = values[name];
        if (v === "" || v === undefined) continue;
        body[name] = def.type === "number" || def.type === "integer" ? Number(v) : v;
      }
      const res = await fetch(`/api/call/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
      });
      setStatus(res.status);
      setResult(JSON.stringify(await res.json(), null, 2));
    } catch (e) {
      setResult(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3 card p-4 space-y-3">
      <div>
        <label className="text-xs text-muted">API key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="uak_live_..."
          className="mt-1 code"
        />
      </div>

      {props.map(([name, def]) => (
        <div key={name}>
          <label className="text-xs text-muted">
            {name}
            {schema.required?.includes(name) && <span className="text-primary-2"> *</span>}
          </label>
          <input
            value={values[name] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [name]: e.target.value }))}
            placeholder={def.description ?? def.type}
            className="mt-1"
          />
        </div>
      ))}

      <button onClick={run} disabled={loading || !apiKey} className="btn btn-primary w-full">
        {loading ? "Running…" : "Run call"}
      </button>

      {result && (
        <div>
          <div className="flex items-center justify-between text-xs text-muted mb-1">
            <span>Response</span>
            {status !== null && (
              <span className={status < 300 ? "text-accent" : "text-red-400"}>HTTP {status}</span>
            )}
          </div>
          <pre className="code-block max-h-72">{result}</pre>
        </div>
      )}
    </div>
  );
}
