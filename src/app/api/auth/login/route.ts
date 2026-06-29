import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { hashPassword, verifyPassword } from "@/lib/password";

// Combined sign-in / sign-up with email + password.
// - New email      → create the account.
// - Existing email → verify the password and sign in.
export async function POST(req: Request) {
  let email = "";
  let password = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
    password = String(body?.password ?? "");
  } catch {
    /* ignore */
  }

  if (!email || !email.includes("@")) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const user = await prisma.user.create({
      data: { email, passwordHash: hashPassword(password), balanceUsd: 0 },
    });
    await createSession(user.id);
    return Response.json({ id: user.id, email: user.email, created: true });
  }

  if (!existing.passwordHash) {
    // Account exists without a password (e.g. wallet/Privy) — set it on first use.
    await prisma.user.update({
      where: { id: existing.id },
      data: { passwordHash: hashPassword(password) },
    });
    await createSession(existing.id);
    return Response.json({ id: existing.id, email: existing.email, created: false });
  }

  if (!verifyPassword(password, existing.passwordHash)) {
    return Response.json({ error: "Incorrect password for this email" }, { status: 401 });
  }

  await createSession(existing.id);
  return Response.json({ id: existing.id, email: existing.email, created: false });
}
