"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { privyEnabled } from "@/lib/clientEnv";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.1 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6.1C12.2 13.2 17.6 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.2-3.9 6.6-9.6 6.6-16.4z" />
      <path fill="#FBBC05" d="M10.3 19.4l-7.8-6.1C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6.1c-.5-1.4-.7-2.9-.7-4.6s.2-3.2.7-4.6z" />
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.1-5.5c-2 1.3-4.6 2.1-7.9 2.1-6.4 0-11.8-3.7-13.7-9.4l-7.8 6.1C6.4 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function PrivyGoogle() {
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
    <button onClick={() => login({ loginMethods: ["google"] })} disabled={!ready} className="btn btn-ghost w-full">
      <GoogleIcon /> Sign up with Google
    </button>
  );
}

function DemoGoogle() {
  const [note, setNote] = useState(false);
  return (
    <div className="space-y-1">
      <button onClick={() => setNote(true)} className="btn btn-ghost w-full">
        <GoogleIcon /> Sign up with Google
      </button>
      {note && (
        <p className="text-xs text-muted text-center">
          Add Privy keys (NEXT_PUBLIC_PRIVY_APP_ID) to enable Google sign-in.
        </p>
      )}
    </div>
  );
}

export function GoogleButton() {
  return privyEnabled ? <PrivyGoogle /> : <DemoGoogle />;
}
