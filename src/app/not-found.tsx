import Link from "next/link";

export const metadata = {
  title: "404 — Page not found | UnifyAPI",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center space-y-8">
      <div className="flex items-center justify-center gap-3">
        <img src="/logo-icon.svg" alt="" className="h-10 w-10" />
        <span className="text-7xl font-bold tracking-tight">404</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold">This endpoint doesn&apos;t exist</h1>
        <p className="text-muted leading-relaxed">
          The page you&apos;re looking for couldn&apos;t be found. It may have moved, or the link was
          mistyped. The other 818 tools are still here, though.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn btn-primary">Back to home</Link>
        <Link href="/tools" className="btn btn-ghost">Browse the catalog</Link>
        <Link href="/docs" className="btn btn-ghost">Read the docs</Link>
      </div>

      <p className="text-xs text-muted code pt-4">GET /404 → Tool not found</p>
    </div>
  );
}
