"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const LISTING_TARGET = new Date("2026-06-29T17:00:00Z");

function secondsUntilListing(): number {
  const diff = Math.floor((LISTING_TARGET.getTime() - Date.now()) / 1000);
  return Math.max(0, diff);
}

function fmt(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function UnifyCountdown() {
  const [secs, setSecs] = useState<number | null>(null);

  useEffect(() => {
    setSecs(secondsUntilListing());
    const id = setInterval(() => setSecs(secondsUntilListing()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Link href="/token" className="btn btn-primary text-sm flex items-center gap-1.5">
      <span>$UNIFY</span>
      {secs !== null && (
        <span className="font-mono text-[11px] opacity-75 tabular-nums">
    {secs > 0 ? fmt(secs) : null}
        </span>
      )}
    </Link>
  );
}
