import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { decryptKey } from "@/lib/apiKeys";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const { id } = await params;
  const key = await prisma.apiKey.findFirst({
    where: { id, userId: user.id, revoked: false },
    select: { encryptedKey: true },
  });

  if (!key) return Response.json({ error: "Not found" }, { status: 404 });
  if (!key.encryptedKey) return Response.json({ error: "Key was created before reveal support was added. Revoke and create a new key." }, { status: 410 });

  try {
    const plaintext = decryptKey(key.encryptedKey);
    return Response.json({ plaintext });
  } catch {
    return Response.json({ error: "Failed to decrypt key." }, { status: 500 });
  }
}
