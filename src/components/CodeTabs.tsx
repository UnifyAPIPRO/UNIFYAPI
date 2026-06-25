"use client";

import { useState } from "react";

const SNIPPETS: Record<string, string> = {
  cURL: `curl -X POST https://unifyapi.pro/api/call/crypto.price \\
  -H "Authorization: Bearer uak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{ "coin": "bitcoin", "vs": "usd" }'`,
  MCP: `// Any MCP client
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "crypto__price",
    "arguments": { "coin": "ethereum", "vs": "usd" }
  }
}
// → POST https://unifyapi.pro/api/mcp
//   Authorization: Bearer uak_live_...`,
  Python: `import requests

r = requests.post(
    "https://unifyapi.pro/api/call/weather.forecast",
    headers={"Authorization": "Bearer uak_live_..."},
    json={"latitude": -6.2088, "longitude": 106.8456, "days": 3},
)
print(r.json())  # { cost, balance, result: {...} }`,
};

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CodeTabs() {
  const tabs = Object.keys(SNIPPETS);
  const [active, setActive] = useState(tabs[0]);
  const [copied, setCopied] = useState(false);

  function markCopied() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function copy() {
    const text = SNIPPETS[active];
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(markCopied).catch(() => execCopy(text));
    } else {
      execCopy(text);
    }
  }

  function execCopy(text: string) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); markCopied(); } catch {}
    document.body.removeChild(ta);
  }

  return (
    <div className="rounded-xl overflow-hidden border border-[#2a2a2a] shadow-2xl" style={{ background: "#0e1117" }}>
      {/* Title bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1e1e1e]" style={{ background: "#161b22" }}>
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-[#484f58] select-none font-mono">unifyapi ~ terminal</span>
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-[#1e1e1e] px-1" style={{ background: "#161b22" }}>
        <div className="flex">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-2 text-sm font-mono transition-colors ${
                active === t
                  ? "text-[#58a6ff] border-b-2 border-[#58a6ff]"
                  : "text-[#484f58] hover:text-[#8b949e]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Copy button */}
        <button
          onClick={copy}
          className={`flex items-center gap-1.5 mr-2 px-2.5 py-1 rounded text-xs font-mono transition-all ${
            copied
              ? "text-[#3fb950] bg-[#3fb950]/10"
              : "text-[#484f58] hover:text-[#8b949e] hover:bg-[#21262d]"
          }`}
          aria-label="Copy code"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          <span>{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>

      {/* Code body */}
      <pre
        className="p-5 text-sm font-mono leading-relaxed overflow-x-auto m-0 text-[#4ade80]"
        style={{ background: "#0e1117", minHeight: "160px" }}
      >
        {SNIPPETS[active]}
      </pre>
    </div>
  );
}
