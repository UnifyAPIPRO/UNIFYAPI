"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { privyEnabled } from "@/lib/clientEnv";

function clearLocal() {
  try {
    localStorage.removeItem("unifyapi_key");
  } catch {
    /* ignore */
  }
}

function PrivyLogout({ onDone }: { onDone: () => void }) {
  const { logout } = usePrivy();
  return (
    <button
      onClick={async () => {
        await logout().catch(() => {});
        onDone();
      }}
      className="btn btn-ghost"
    >
      Sign out
    </button>
  );
}

function PlainLogout({ onDone }: { onDone: () => void }) {
  return (
    <button onClick={onDone} className="btn btn-ghost">
      Sign out
    </button>
  );
}

export function LogoutButton() {
  const router = useRouter();
  const done = async () => {
    clearLocal();
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };
  return privyEnabled ? <PrivyLogout onDone={done} /> : <PlainLogout onDone={done} />;
}
