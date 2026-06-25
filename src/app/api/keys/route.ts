import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { generateApiKey } from "@/lib/apiKeys";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id, revoked: false },
    orderBy: { createdAt: "desc" },
    select: { id: true, prefix: true, last4: true, label: true, createdAt: true, lastUsedAt: true },
  });
  return Response.json({ keys: keys.map((k) => ({ ...k, masked: `${k.prefix}_…${k.last4}` })) });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return Response.json({ error: "Not authenticated" }, { status: 401 });

  let label = "Default key";
  try {
    const body = await req.json();
    if (body?.label) label = String(body.label).slice(0, 60);
  } catch {
    /* ignore */
  }

  const generated = generateApiKey();
  await prisma.apiKey.create({
    data: {
      hashedKey: generated.hashedKey,
      prefix: generated.prefix,
      last4: generated.last4,
      label,
      userId: user.id,
    },
  });

  // Plaintext is returned exactly once and never stored.
  return Response.json({ key: generated.plaintext, label }, { status: 201 });
}
