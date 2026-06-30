import { ImageResponse } from "next/og";

export const alt = "UnifyAPI — One key for hundreds of API tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          padding: "70px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <svg width="56" height="56" viewBox="0 0 100 110" fill="none">
            <line x1="83" y1="56" x2="12" y2="91" stroke="#166534" strokeWidth="23" strokeLinecap="round" />
            <line x1="12" y1="19" x2="83" y2="56" stroke="#22c55e" strokeWidth="23" strokeLinecap="round" />
          </svg>
          <div style={{ fontSize: 40, fontWeight: 700, color: "white", display: "flex" }}>
            Unify<span style={{ color: "#22c55e" }}>API</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: 76, fontWeight: 800, color: "white", lineHeight: 1.05, display: "flex", flexDirection: "column" }}>
            <span>One Key for</span>
            <span style={{ color: "#22c55e" }}>Hundreds of API Tools</span>
          </div>
          <div style={{ fontSize: 30, color: "#a1a1aa", maxWidth: "900px", display: "flex" }}>
            A single MCP endpoint for AI agents. Pay per call with USDC via x402 on Solana.
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "60px" }}>
          {[
            ["818", "Tools"],
            ["250", "Providers"],
            ["$0.001", "Min per call"],
          ].map(([n, l]) => (
            <div key={l} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 48, fontWeight: 700, color: "white" }}>{n}</span>
              <span style={{ fontSize: 24, color: "#71717a" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
