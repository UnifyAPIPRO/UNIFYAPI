"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Eip1193 = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

function getWallet(): Eip1193 | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ethereum?: Eip1193 }).ethereum ?? null;
}

export function WalletLogin() {
  const router = useRouter();
  const [hasWallet, setHasWallet] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHasWallet(!!getWallet());
  }, []);

  async function connect() {
    setError(null);
    const wallet = getWallet();
    if (!wallet) {
      setError("No browser wallet detected. Install MetaMask or use Privy.");
      return;
    }
    setLoading(true);
    try {
      const accounts = (await wallet.request({ method: "eth_requestAccounts" })) as string[];
      const address = accounts?.[0];
      if (!address) throw new Error("No account selected");

      const message =
        `Sign in to UnifyAPI\n\n` +
        `Address: ${address}\n` +
        `Nonce: ${crypto.randomUUID()}\n` +
        `Issued At: ${new Date().toISOString()}`;

      const signature = (await wallet.request({
        method: "personal_sign",
        params: [message, address],
      })) as string;

      const res = await fetch("/api/auth/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, message, signature }),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Wallet sign in failed");
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Wallet connection cancelled";
      setError(msg.includes("rejected") ? "Signature request rejected" : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button onClick={connect} disabled={loading} className="btn btn-ghost w-full">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1H6.5a.5.5 0 0 0 0 1H21a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5.5A2.5 2.5 0 0 1 3 15.5v-8Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <circle cx="16.5" cy="13" r="1.3" fill="currentColor" />
        </svg>
        {loading ? "Check your wallet…" : "Continue with a wallet"}
      </button>
      {!hasWallet && (
        <p className="text-xs text-muted text-center">No browser wallet detected.</p>
      )}
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
