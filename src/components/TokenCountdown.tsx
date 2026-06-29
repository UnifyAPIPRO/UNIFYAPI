"use client";
import { useState, useEffect } from "react";

// June 29, 2026 12:00 PM ET (America/New_York = UTC-4 during EDT)
const LISTING_TARGET = new Date("2026-06-29T17:00:00Z");

function secondsUntilListing(): number {
  const diff = Math.floor((LISTING_TARGET.getTime() - Date.now()) / 1000);
  return Math.max(0, diff);
}

export function TokenCountdown() {
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    setSecs(secondsUntilListing());
    const id = setInterval(() => setSecs(secondsUntilListing()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const listed = secs === 0;

  const h = secs !== null ? Math.floor(secs / 3600) : 0;
  const m = secs !== null ? Math.floor((secs % 3600) / 60) : 0;
  const s = secs !== null ? secs % 60 : 0;

  if (listed) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">
          Listing countdown
        </p>
        <span className="font-mono text-4xl font-bold text-primary-2 tracking-widest">
          LIVE
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <p className="text-xs font-mono text-primary-2 tracking-widest uppercase">
        Listing countdown
      </p>
      <div className="flex items-center gap-3">
        {[
          { value: pad(h), label: "Hours" },
          { value: pad(m), label: "Minutes" },
          { value: pad(s), label: "Seconds" },
        ].map((unit, i) => (
          <div key={unit.label} className="flex items-center gap-3">
            <div className="flex flex-col items-center">
              <span className="font-mono text-5xl font-bold text-primary-2 tabular-nums w-[3ch] text-center">
                {secs !== null ? unit.value : "--"}
              </span>
              <span className="text-[10px] text-muted mt-1 uppercase tracking-widest">
                {unit.label}
              </span>
            </div>
            {i < 2 && (
              <span className="text-4xl font-bold text-primary-2/40 mb-4">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
