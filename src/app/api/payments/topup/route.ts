import { prisma } from "@/lib/prisma";
import { getSessionUser, authenticateApiKey } from "@/lib/auth";
import { buildPaymentRequirements, verifyAndSettle, x402Enabled } from "@/lib/x402";

async function resolveUser(req: Request) {
  const session = await getSessionUser();
  if (session) return session;
  const auth = await authenticateApiKey(req);
  return auth?.user ?? null;
}

export async function POST(req: Request) {
  const user = await resolveUser(req);
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  let amountUsd = 5;
  try {
    const body = await req.json();
    if (body?.amountUsd != null) amountUsd = Number(body.amountUsd);
  } catch {
    /* ignore */
  }
  if (!Number.isFinite(amountUsd) || amountUsd < 0.5 || amountUsd > 1000) {
    return Response.json({ error: "amountUsd must be between 0.5 and 1000" }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const requirements = buildPaymentRequirements({
    amountUsd,
    resource: `${base}/api/payments/topup`,
    description: `Top up UnifyAPI balance by $${amountUsd.toFixed(2)}`,
  });

  const xPayment = req.headers.get("x-payment");

  // Live mode, no payment yet → issue the x402 challenge (HTTP 402).
  if (x402Enabled() && !xPayment) {
    const pending = await prisma.payment.create({
      data: { userId: user.id, amountUsd, scheme: "x402", network: requirements.network, status: "pending" },
    });
    return Response.json(
      { x402Version: 1, error: "Payment required", accepts: [requirements], paymentId: pending.id },
      { status: 402 },
    );
  }

  // Verify + settle (or simulate when x402 is disabled).
  const settlement = await verifyAndSettle(xPayment ?? "", requirements);
  if (!settlement.ok) {
    await prisma.payment.create({
      data: { userId: user.id, amountUsd, scheme: settlement.scheme, network: settlement.network, status: "failed" },
    });
    return Response.json({ error: settlement.error ?? "Payment failed" }, { status: 402 });
  }

  const [, updated] = await prisma.$transaction([
    prisma.payment.create({
      data: {
        userId: user.id,
        amountUsd,
        scheme: settlement.scheme,
        network: settlement.network,
        txHash: settlement.txHash,
        payer: settlement.payer,
        status: "settled",
      },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { balanceUsd: { increment: amountUsd } },
    }),
  ]);

  return Response.json({
    ok: true,
    credited: amountUsd,
    balance: Number(updated.balanceUsd),
    mode: x402Enabled() ? "live" : "simulation",
    txHash: settlement.txHash,
    network: settlement.network,
  });
}
