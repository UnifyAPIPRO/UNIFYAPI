import { prisma } from "@/lib/prisma";
import { getToolBySlug } from "@/lib/catalog";
import { validateInput } from "@/lib/validate";
import { executeTool } from "@/lib/execute";

export type CallOutcome =
  | { ok: true; status: 200; body: unknown }
  | { ok: false; status: number; body: unknown };

/**
 * Run a tool on behalf of an authenticated user: validate input, check balance,
 * execute, charge, and record usage. Shared by the REST and MCP endpoints.
 */
export async function callTool(params: {
  slug: string;
  input: Record<string, unknown>;
  userId: string;
  balanceUsd: number;
  apiKeyId: string;
}): Promise<CallOutcome> {
  const { slug, input, userId, balanceUsd, apiKeyId } = params;

  const tool = await getToolBySlug(slug);
  if (!tool || !tool.active) {
    return { ok: false, status: 404, body: { error: `Unknown tool: ${slug}` } };
  }

  const price = Number(tool.priceUsd);

  const { ok, errors, value } = validateInput(tool.inputSchema, input);
  if (!ok) {
    return { ok: false, status: 400, body: { error: "Invalid input", details: errors } };
  }

  if (balanceUsd < price) {
    await prisma.usageRecord.create({
      data: { toolId: tool.id, apiKeyId, userId, status: "insufficient_funds", costUsd: 0 },
    });
    return {
      ok: false,
      status: 402,
      body: {
        error: "Insufficient balance",
        required: price,
        balance: balanceUsd,
        topUp: "/dashboard/billing",
      },
    };
  }

  const started = Date.now();
  try {
    const result = await executeTool(slug, value, tool.live);
    const latencyMs = Date.now() - started;

    const [, updated] = await prisma.$transaction([
      prisma.usageRecord.create({
        data: { toolId: tool.id, apiKeyId, userId, status: "success", costUsd: price, latencyMs },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { balanceUsd: { decrement: price } },
      }),
    ]);

    return {
      ok: true,
      status: 200,
      body: {
        tool: slug,
        cost: price,
        upstream: result.upstream,
        latencyMs,
        balance: Number(updated.balanceUsd),
        result: result.data,
      },
    };
  } catch (e) {
    const latencyMs = Date.now() - started;
    await prisma.usageRecord.create({
      data: { toolId: tool.id, apiKeyId, userId, status: "error", costUsd: 0, latencyMs },
    });
    return {
      ok: false,
      status: 502,
      body: { error: "Upstream execution failed", message: e instanceof Error ? e.message : "unknown" },
    };
  }
}
