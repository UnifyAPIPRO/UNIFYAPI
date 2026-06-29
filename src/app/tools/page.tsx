import Link from "next/link";
import { listCategories, listTools, serializeTool } from "@/lib/catalog";
import { CatalogSearch } from "@/components/CatalogSearch";

export const dynamic = "force-dynamic";

export default async function ToolsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const [categories, toolsRaw] = await Promise.all([
    listCategories(),
    listTools({ category, q }),
  ]);
  const tools = toolsRaw.map(serializeTool);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="text-3xl font-bold">Tool catalog</h1>
      <p className="mt-2 text-muted">
        {tools.length} tool{tools.length === 1 ? "" : "s"} available — call any of them with one
        UnifyAPI key.
      </p>

      <div className="mt-6">
        <CatalogSearch initialQuery={q ?? ""} category={category} />
      </div>

      {/* Category chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/tools"
          className={`badge ${!category ? "!text-foreground !border-primary" : ""}`}
        >
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/tools?category=${c.slug}`}
            className={`badge ${category === c.slug ? "!text-foreground !border-primary" : ""}`}
          >
            {c.name} <span className="opacity-60">{c._count.tools}</span>
          </Link>
        ))}
      </div>

      {/* Grid */}
      {tools.length === 0 ? (
        <p className="mt-12 text-muted">No tools match your search.</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((t) => (
            <Link key={t.slug} href={`/tools/${t.slug}`} className="card card-hover p-5 block">
              <div className="flex items-center justify-between">
                <span className="code text-sm text-primary-2">{t.slug}</span>
                {t.live && <span className="badge text-accent border-accent/40">live</span>}
              </div>
              <h3 className="mt-2 font-semibold">{t.name}</h3>
              <p className="mt-1 text-sm text-muted line-clamp-2">{t.description}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-muted">
                <span>{t.categoryName}</span>
                <span className="code">${t.priceUsd.toFixed(3)}/call</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
