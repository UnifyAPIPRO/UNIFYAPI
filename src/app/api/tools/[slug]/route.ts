import { getToolBySlug, serializeTool } from "@/lib/catalog";

export async function GET(_req: Request, ctx: RouteContext<"/api/tools/[slug]">) {
  const { slug } = await ctx.params;
  const tool = await getToolBySlug(slug);
  if (!tool) {
    return Response.json({ error: "Tool not found" }, { status: 404 });
  }
  return Response.json(serializeTool(tool));
}
