"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function PrivyLogin() {
  const router = useRouter();
  const { ready, authenticated, login, getAccessToken } = usePrivy();
  const [status, setStatus] = useState<string | null>(null);
  const bridged = useRef(false);

  // Once Privy reports an authenticated user, exchange the token for our session.
  useEffect(() => {
    if (!authenticated || bridged.current) return;
    bridged.current = true;
    (async () => {
      setStatus("Finishing sign in…");
      const token = await getAccessToken();
      const res = await fetch("/api/auth/privy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setStatus(d.error ?? "Sign in failed");
        bridged.current = false;
      }
    })();
  }, [authenticated, getAccessToken, router]);

  return (
    <div className="space-y-3">
      <button
        onClick={() => login({ loginMethods: ["email"] })}
        disabled={!ready}
        className="btn btn-primary w-full"
      >
        Continue with email
      </button>

      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={() => login({ loginMethods: ["wallet"] })}
        disabled={!ready}
        className="btn btn-ghost w-full"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1H6.5a.5.5 0 0 0 0 1H21a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 15.5v-8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
        </svg>
        Continue with a wallet
      </button>

      {status && <p className="text-sm text-accent text-center">{status}</p>}
    </div>
  );
}
