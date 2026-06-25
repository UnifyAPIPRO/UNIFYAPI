"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CatalogSearch({
  initialQuery,
  category,
}: {
  initialQuery: string;
  category?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (q.trim()) params.set("q", q.trim());
    router.push(`/tools${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <form onSubmit={submit} className="flex gap-2 max-w-md">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search tools, e.g. weather, crypto, translate…"
        aria-label="Search tools"
      />
      <button type="submit" className="btn btn-ghost">Search</button>
    </form>
  );
}
