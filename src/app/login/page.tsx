"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleButton } from "@/components/GoogleButton";
import { WalletLogin } from "@/components/WalletLogin";

function Brand() {
  return (
    <div className="flex items-center justify-center gap-2.5">
      <img src="/logo-icon.svg" alt="" className="h-9 w-9" />
      <span className="text-xl font-semibold">
        Unify<span className="text-primary-2">API</span>
      </span>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Sign in failed");
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <div className="card p-8">
        <Brand />

        <form onSubmit={submit} className="mt-8 space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoFocus
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? "Please wait…" : "Continue"}
          </button>
        </form>

        <div className="mt-3 space-y-3">
          <GoogleButton />
          <WalletLogin />
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          New or returning — one button signs you in or creates your account.
        </p>

        <a
          href="https://privy.io"
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          Protected by
          <Image src="/privy-icon.png" alt="Privy" width={14} height={14} />
          <span className="font-medium">Privy</span>
        </a>
      </div>
    </div>
  );
}
