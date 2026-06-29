import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { extractToken, hashKey } from "@/lib/apiKeys";

const SECRET = process.env.API_KEY_SECRET ?? "dev-unifyapi-secret-change-me";
const SESSION_COOKIE = "unifyapi_session";

// ── Human dashboard session (passwordless demo auth) ───────────────

function sign(userId: string): string {
  const sig = createHmac("sha256", SECRET).update(userId).digest("hex");
  return `${userId}.${sig}`;
}

function unsign(value: string): string | null {
  const idx = value.lastIndexOf(".");
  if (idx < 0) return null;
  const userId = value.slice(0, idx);
  const sig = value.slice(idx + 1);
  const expected = createHmac("sha256", SECRET).update(userId).digest("hex");
  return sig === expected ? userId : null;
}

export async function createSession(userId: string) {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, sign(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

export async function getSessionUser() {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const userId = unsign(raw);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}

// ── Agent API-key auth ─────────────────────────────────────────────

export type AuthedKey = {
  user: NonNullable<Awaited<ReturnType<typeof prisma.user.findUnique>>>;
  apiKeyId: string;
};

export async function authenticateApiKey(req: Request): Promise<AuthedKey | null> {
  const token = extractToken(req);
  if (!token) return null;
  const hashed = hashKey(token);
  const key = await prisma.apiKey.findUnique({
    where: { hashedKey: hashed },
    include: { user: true },
  });
  if (!key || key.revoked) return null;
  // best-effort last-used update
  prisma.apiKey
    .update({ where: { id: key.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});
  return { user: key.user, apiKeyId: key.id };
}
