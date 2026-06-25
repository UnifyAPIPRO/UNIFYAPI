import { verifyMessage } from "viem";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export const SIGN_IN_PREFIX = "Sign in to UnifyAPI";

// Wallet login: the client signs a message with their wallet; we verify the
// signature on the server, then create a session bound to the wallet address.
export async function POST(req: Request) {
  let address = "";
  let message = "";
  let signature = "";
  try {
    const body = await req.json();
    address = String(body?.address ?? "");
    message = String(body?.message ?? "");
    signature = String(body?.signature ?? "");
  } catch {
    /* ignore */
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address) || !message || !signature) {
    return Response.json({ error: "address, message and signature are required" }, { status: 400 });
  }

  // Basic anti-replay: message must be ours and freshly minted.
  if (!message.startsWith(SIGN_IN_PREFIX)) {
    return Response.json({ error: "Unexpected message" }, { status: 400 });
  }
  const tsMatch = message.match(/Issued At: (.+)/);
  const issuedAt = tsMatch ? Date.parse(tsMatch[1]) : NaN;
  if (!Number.isFinite(issuedAt) || Date.now() - issuedAt > 10 * 60 * 1000) {
    return Response.json({ error: "Message expired, please try again" }, { status: 400 });
  }

  let valid = false;
  try {
    valid = await verifyMessage({
      address: address as `0x${string}`,
      message,
      signature: signature as `0x${string}`,
    });
  } catch {
    valid = false;
  }
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const identityEmail = `${address.toLowerCase()}@wallet.unifyapi`;
  const user = await prisma.user.upsert({
    where: { email: identityEmail },
    update: { walletAddress: address },
    create: { email: identityEmail, walletAddress: address, balanceUsd: 0 },
  });

  await createSession(user.id);
  return Response.json({ id: user.id, wallet: user.walletAddress });
}
