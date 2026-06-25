"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { privyAppId, privyEnabled } from "@/lib/clientEnv";

// Wraps the app in Privy when configured; otherwise renders children untouched
// so the platform still runs (with the demo email login) without Privy keys.
export function Providers({ children }: { children: React.ReactNode }) {
  if (!privyEnabled) return <>{children}</>;

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        loginMethods: ["email", "google", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
          logo: undefined,
        },
        embeddedWallets: {
          ethereum: { createOnLogin: "users-without-wallets" },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
