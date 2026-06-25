import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const [keys, usageCount, spendAgg, recent] = await Promise.all([
    prisma.apiKey.findMany({
      where: { userId: user.id, revoked: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, prefix: true, last4: true, label: true, createdAt: true, lastUsedAt: true },
    }),
    prisma.usageRecord.count({ where: { userId: user.id, status: "success" } }),
    prisma.usageRecord.aggregate({ where: { userId: user.id }, _sum: { costUsd: true } }),
    prisma.usageRecord.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { tool: { select: { slug: true, name: true } } },
    }),
  ]);

  return Response.json({
    user: { id: user.id, email: user.email, balance: Number(user.balanceUsd) },
    stats: { calls: usageCount, totalSpend: Number(spendAgg._sum.costUsd ?? 0) },
    keys: keys.map((k) => ({ ...k, masked: `${k.prefix}_…${k.last4}` })),
    recent: recent.map((r) => ({
      id: r.id,
      tool: r.tool.slug,
      toolName: r.tool.name,
      status: r.status,
      cost: Number(r.costUsd),
      latencyMs: r.latencyMs,
      at: r.createdAt,
    })),
  });
}
