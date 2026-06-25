import { prisma } from "@/lib/prisma";

export type ToolWithRelations = Awaited<ReturnType<typeof getToolBySlug>>;

export function serializeTool(tool: {
  slug: string;
  name: string;
  description: string;
  priceUsd: unknown;
  tags: string[];
  featured: boolean;
  live: boolean;
  inputSchema: unknown;
  category?: { slug: string; name: string } | null;
  provider?: { slug: string; name: string } | null;
}) {
  return {
    slug: tool.slug,
    name: tool.name,
    description: tool.description,
    priceUsd: Number(tool.priceUsd),
    tags: tool.tags,
    featured: tool.featured,
    live: tool.live,
    category: tool.category?.slug ?? null,
    categoryName: tool.category?.name ?? null,
    provider: tool.provider?.slug ?? null,
    providerName: tool.provider?.name ?? null,
    inputSchema: tool.inputSchema,
  };
}

export async function listTools(opts: { category?: string; q?: string } = {}) {
  const where: Record<string, unknown> = { active: true };
  if (opts.category) where.category = { slug: opts.category };
  if (opts.q) {
    where.OR = [
      { name: { contains: opts.q, mode: "insensitive" } },
      { description: { contains: opts.q, mode: "insensitive" } },
      { slug: { contains: opts.q, mode: "insensitive" } },
    ];
  }
  return prisma.tool.findMany({
    where,
    include: { category: true, provider: true },
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export function getToolBySlug(slug: string) {
  return prisma.tool.findUnique({
    where: { slug },
    include: { category: true, provider: true },
  });
}

export function listCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { tools: true } } },
  });
}
