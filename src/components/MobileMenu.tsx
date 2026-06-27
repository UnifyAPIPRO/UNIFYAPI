"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/status", label: "Status" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-muted hover:text-foreground transition-colors"
        aria-label="Toggle menu"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-14 left-0 right-0 z-50 bg-background border-b border-border px-5 py-4 flex flex-col gap-4 text-sm text-muted">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="hover:text-foreground transition-colors py-1"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-border">
            <div className="flex gap-3">
              <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost text-sm flex-1 text-center">Sign in</Link>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="btn btn-primary text-sm flex-1 text-center">Get API key</Link>
            </div>
            <Link href="/token" onClick={() => setOpen(false)} className="btn btn-primary text-sm w-full text-center">$UNIFY</Link>
          </div>
        </div>
      )}
    </div>
  );
}
