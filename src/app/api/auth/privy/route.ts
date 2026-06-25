import { PrivyClient } from "@privy-io/server-auth";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const appSecret = process.env.PRIVY_APP_SECRET ?? "";

// Verify a Privy access token, then bridge the identity into our own session.
export async function POST(req: Request) {
  if (!appId || !appSecret) {
    return Response.json({ error: "Privy is not configured on the server" }, { status: 501 });
  }

  let token = "";
  try {
    const body = await req.json();
    token = String(body?.token ?? "");
  } catch {
    /* ignore */
  }
  if (!token) return Response.json({ error: "Missing token" }, { status: 400 });

  const client = new PrivyClient(appId, appSecret);

  let privyUserId: string;
  try {
    const claims = await client.verifyAuthToken(token);
    privyUserId = claims.userId;
  } catch {
    return Response.json({ error: "Invalid Privy token" }, { status: 401 });
  }

  // Pull linked accounts to find an email and/or wallet.
  let email: string | null = null;
  let wallet: string | null = null;
  try {
    const pUser = await client.getUser(privyUserId);
    email = pUser.email?.address ?? null;
    wallet = pUser.wallet?.address ?? null;
    if (!email) {
      const linked = (pUser.linkedAccounts ?? []) as Array<{ type?: string; address?: string }>;
      const emailAcct = linked.find((a) => a.type === "email");
      email = emailAcct?.address ?? null;
      if (!wallet) wallet = linked.find((a) => a.type === "wallet")?.address ?? null;
    }
  } catch {
    /* fall through to synthetic identity */
  }

  // Every account needs a stable unique key. Prefer email, else wallet, else Privy id.
  const identityEmail =
    email ?? (wallet ? `${wallet.toLowerCase()}@wallet.unifyapi` : `${privyUserId}@privy.unifyapi`);

  const user = await prisma.user.upsert({
    where: { email: identityEmail },
    update: { walletAddress: wallet ?? undefined },
    create: { email: identityEmail, walletAddress: wallet ?? undefined, balanceUsd: 0 },
  });

  await createSession(user.id);
  return Response.json({ id: user.id, email: user.email, wallet: user.walletAddress });
}
