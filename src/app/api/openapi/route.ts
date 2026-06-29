import { listTools, serializeTool } from "@/lib/catalog";

export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
  const tools = await listTools();

  const paths: Record<string, unknown> = {};
  for (const t of tools) {
    const s = serializeTool(t);
    paths[`/api/call/${s.slug}`] = {
      post: {
        operationId: s.slug.replace(/\./g, "_"),
        summary: s.name,
        description: `${s.description} Price: $${s.priceUsd} per call.`,
        tags: [s.categoryName ?? "tools"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: s.inputSchema } },
        },
        responses: {
          "200": { description: "Tool result" },
          "401": { description: "Unauthorized" },
          "402": { description: "Insufficient balance" },
        },
      },
    };
  }

  return Response.json({
    openapi: "3.1.0",
    info: {
      title: "UnifyAPI",
      version: "1.0.0",
      description:
        "One API key and one billing rail for hundreds of tools across many providers.",
    },
    servers: [{ url: base }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", description: "Your UnifyAPI key (uak_live_...)" },
      },
    },
    paths,
  });
}
