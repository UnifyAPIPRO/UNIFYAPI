import { listTools } from "@/lib/catalog";
import { serializeTool } from "@/lib/catalog";

// Public tool-catalog API: JSON schemas for every available tool.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const tools = await listTools({ category, q });
  return Response.json({
    object: "list",
    count: tools.length,
    data: tools.map(serializeTool),
  });
}
