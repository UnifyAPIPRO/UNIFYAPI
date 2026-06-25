// Public, build-time-inlined env. Safe to import from both server and client.
export const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
export const privyEnabled = privyAppId.length > 0;
