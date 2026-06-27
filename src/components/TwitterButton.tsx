"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { privyEnabled } from "@/lib/clientEnv";

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function PrivyTwitter() {
  const router = useRouter();
  const { ready, authenticated, login, getAccessToken } = usePrivy();
  const bridged = useRef(false);

  useEffect(() => {
    if (!authenticated || bridged.current) return;
    bridged.current = true;
    (async () => {
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
        bridged.current = false;
      }
    })();
  }, [authenticated, getAccessToken, router]);

  return (
    <button
      onClick={() => login({ loginMethods: ["twitter"] })}
      disabled={!ready}
      className="btn btn-ghost w-full"
    >
      <XIcon /> Sign up with X
    </button>
  );
}

function DemoTwitter() {
  return (
    <button className="btn btn-ghost w-full opacity-50 cursor-not-allowed" disabled>
      <XIcon /> Sign up with X
    </button>
  );
}

export function TwitterButton() {
  return privyEnabled ? <PrivyTwitter /> : <DemoTwitter />;
}
