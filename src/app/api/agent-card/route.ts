import { listCategories } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { x402Enabled } from "@/lib/x402";

// A machine-readable card describing this service to AI agents.
export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const [categories, toolCount, providerCount] = await Promise.all([
    listCategories(),
    prisma.tool.count({ where: { active: true } }),
    prisma.provider.count(),
  ]);

  return Response.json({
    name: "UnifyAPI",
    description:
      "A unified gateway exposing hundreds of API tools across many providers through a single MCP endpoint, billed per call.",
    version: "1.0.0",
    url: base,
    endpoints: {
      mcp: `${base}/api/mcp`,
      tools: `${base}/api/tools`,
      call: `${base}/api/call/{tool}`,
      openapi: `${base}/api/openapi`,
    },
    auth: { type: "bearer", header: "Authorization", scheme: "Bearer <uak_live_...>" },
    payments: {
      protocol: "x402",
      mode: x402Enabled() ? "live" : "simulation",
      currency: "USDC",
      endpoint: `${base}/api/payments/topup`,
    },
    stats: { tools: toolCount, providers: providerCount, categories: categories.length },
    categories: categories.map((c) => ({ slug: c.slug, name: c.name, tools: c._count.tools })),
  });
}
