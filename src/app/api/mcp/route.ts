import { authenticateApiKey } from "@/lib/auth";
import { listTools, serializeTool } from "@/lib/catalog";
import { callTool } from "@/lib/billing";

const PROTOCOL_VERSION = "2025-06-18";

// MCP tool names must avoid dots for some clients; map slug <-> name.
const toName = (slug: string) => slug.replace(/\./g, "__");
const toSlug = (name: string) => name.replace(/__/g, ".");

function rpc(id: unknown, result: unknown) {
  return Response.json({ jsonrpc: "2.0", id, result });
}
function rpcError(id: unknown, code: number, message: string, status = 200) {
  return Response.json({ jsonrpc: "2.0", id, error: { code, message } }, { status });
}

export async function GET() {
  return Response.json({
    name: "UnifyAPI MCP Server",
    description:
      "One MCP endpoint for hundreds of API tools across many providers, billed per call via x402.",
    protocolVersion: PROTOCOL_VERSION,
    transport: "streamable-http (JSON-RPC over POST)",
    methods: ["initialize", "tools/list", "tools/call"],
    auth: "Bearer API key required for tools/call",
  });
}

export async function POST(req: Request) {
  let msg: { id?: unknown; method?: string; params?: Record<string, unknown> };
  try {
    msg = await req.json();
  } catch {
    return rpcError(null, -32700, "Parse error");
  }

  const { id, method, params } = msg;

  switch (method) {
    case "initialize":
      return rpc(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "unifyapi", version: "1.0.0" },
      });

    case "ping":
      return rpc(id, {});

    case "tools/list": {
      const tools = await listTools();
      return rpc(id, {
        tools: tools.map((t) => {
          const s = serializeTool(t);
          return {
            name: toName(s.slug),
            description: `${s.description} (provider: ${s.providerName}, price: $${s.priceUsd}/call)`,
            inputSchema: s.inputSchema,
          };
        }),
      });
    }

    case "tools/call": {
      const auth = await authenticateApiKey(req);
      if (!auth) {
        return rpcError(id, -32001, "Unauthorized: provide a UnifyAPI key as a Bearer token.");
      }
      const name = String(params?.name ?? "");
      const args = (params?.arguments ?? {}) as Record<string, unknown>;
      const outcome = await callTool({
        slug: toSlug(name),
        input: args,
        userId: auth.user.id,
        balanceUsd: Number(auth.user.balanceUsd),
        apiKeyId: auth.apiKeyId,
      });

      if (!outcome.ok) {
        return rpc(id, {
          isError: true,
          content: [{ type: "text", text: JSON.stringify(outcome.body) }],
        });
      }
      return rpc(id, {
        content: [{ type: "text", text: JSON.stringify((outcome.body as { result: unknown }).result) }],
        structuredContent: outcome.body,
      });
    }

    default:
      return rpcError(id, -32601, `Method not found: ${method}`);
  }
}
