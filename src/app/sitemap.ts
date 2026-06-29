import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = "https://unifyapi.pro";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/tools`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/docs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/token`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/status`, changeFrequency: "daily", priority: 0.6 },
    { url: `${BASE}/changelog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/login`, changeFrequency: "yearly", priority: 0.3 },
  ];

  let toolRoutes: MetadataRoute.Sitemap = [];
  try {
    const tools = await prisma.tool.findMany({
      where: { active: true },
      select: { slug: true },
    });
    toolRoutes = tools.map((t) => ({
      url: `${BASE}/tools/${t.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // If the DB is unreachable at build time, still return static routes.
  }

  return [...staticRoutes, ...toolRoutes];
}
