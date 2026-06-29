import Link from "next/link";
import { notFound } from "next/navigation";
import { getToolBySlug, serializeTool } from "@/lib/catalog";
import { Playground } from "@/components/Playground";

export const dynamic = "force-dynamic";

export default async function ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const raw = await getToolBySlug(slug);
  if (!raw) notFound();
  const tool = serializeTool(raw);

  const schema = tool.inputSchema as {
    properties?: Record<string, { type?: string; description?: string; default?: unknown }>;
    required?: string[];
  };
  const props = Object.entries(schema.properties ?? {});

  const restSnippet = `curl -X POST ${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/call/${tool.slug} \\
  -H "Authorization: Bearer uak_live_..." \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(exampleArgs(props), null, 0)}'`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <Link href="/tools" className="text-sm text-muted hover:text-foreground">← Back to catalog</Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold code">{tool.slug}</h1>
        {tool.live ? (
          <span className="badge text-accent border-accent/40">live upstream</span>
        ) : (
          <span className="badge">mock data</span>
        )}
        <span className="badge">${tool.priceUsd.toFixed(3)} / call</span>
      </div>
      <h2 className="mt-1 text-lg text-muted">{tool.name}</h2>
      <p className="mt-3 max-w-2xl">{tool.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
        <Link href={`/tools?category=${tool.category}`} className="badge">{tool.categoryName}</Link>
        <span className="badge">provider: {tool.providerName}</span>
        {tool.tags.map((tag) => (
          <span key={tag} className="badge">#{tag}</span>
        ))}
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        {/* Schema */}
        <div>
          <h3 className="font-semibold">Input schema</h3>
          <div className="mt-3 card divide-y divide-border">
            {props.length === 0 && <p className="p-4 text-sm text-muted">No parameters.</p>}
            {props.map(([name, def]) => (
              <div key={name} className="p-3.5 flex items-start justify-between gap-3">
                <div>
                  <span className="code text-sm">{name}</span>
                  {schema.required?.includes(name) && (
                    <span className="ml-2 text-xs text-primary-2">required</span>
                  )}
                  {def.description && <p className="text-xs text-muted mt-0.5">{def.description}</p>}
                </div>
                <span className="badge shrink-0">{def.type ?? "any"}</span>
              </div>
            ))}
          </div>

          <h3 className="font-semibold mt-8">Call via REST</h3>
          <pre className="code-block mt-3">{restSnippet}</pre>
        </div>

        {/* Playground */}
        <div>
          <h3 className="font-semibold">Try it</h3>
          <p className="text-sm text-muted mt-1">
            Paste a UnifyAPI key (create one in the{" "}
            <Link href="/dashboard" className="text-primary-2 hover:underline">dashboard</Link>) and run a real call.
          </p>
          <Playground slug={tool.slug} schema={schema} />
        </div>
      </div>
    </div>
  );
}

function exampleArgs(
  props: [string, { type?: string; default?: unknown }][],
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, def] of props) {
    if (def.default !== undefined) out[name] = def.default;
    else if (def.type === "number" || def.type === "integer") out[name] = 0;
    else out[name] = `<${name}>`;
  }
  return out;
}
