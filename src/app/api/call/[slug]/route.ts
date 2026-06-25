import { authenticateApiKey } from "@/lib/auth";
import { callTool } from "@/lib/billing";

export async function POST(req: Request, ctx: RouteContext<"/api/call/[slug]">) {
  const auth = await authenticateApiKey(req);
  if (!auth) {
    return Response.json(
      { error: "Unauthorized. Provide a UnifyAPI key via 'Authorization: Bearer <key>'." },
      { status: 401 },
    );
  }

  const { slug } = await ctx.params;

  let input: Record<string, unknown> = {};
  try {
    const body = await req.json();
    if (body && typeof body === "object") input = body as Record<string, unknown>;
  } catch {
    // empty/no body is allowed
  }

  const outcome = await callTool({
    slug,
    input,
    userId: auth.user.id,
    balanceUsd: Number(auth.user.balanceUsd),
    apiKeyId: auth.apiKeyId,
  });

  return Response.json(outcome.body, { status: outcome.status });
}
