import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/keys/[id]">) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await ctx.params;
  const key = await prisma.apiKey.findUnique({ where: { id } });
  if (!key || key.userId !== user.id) {
    return Response.json({ error: "Key not found" }, { status: 404 });
  }
  await prisma.apiKey.update({ where: { id }, data: { revoked: true } });
  return Response.json({ ok: true });
}
