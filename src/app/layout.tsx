import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import NextTopLoader from "nextjs-toploader";
import { Providers } from "@/components/Providers";
import { NewsletterForm } from "@/components/NewsletterForm";
import { HomeLink } from "@/components/HomeLink";
import { MobileMenu } from "@/components/MobileMenu";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://unifyapi.pro"),
  title: {
    default: "UnifyAPI — One key for hundreds of API tools",
    template: "%s",
  },
  description:
    "UnifyAPI gives AI agents a single MCP endpoint and one billing rail to access 818 tools across 250 providers. Pay per call with USDC via x402 on Base.",
  keywords: [
    "MCP",
    "Model Context Protocol",
    "AI agents",
    "x402",
    "API gateway",
    "USDC",
    "Base",
    "tool calling",
  ],
  authors: [{ name: "UnifyAPI" }],
  openGraph: {
    type: "website",
    siteName: "UnifyAPI",
    url: "https://unifyapi.pro",
    title: "UnifyAPI — One key for hundreds of API tools",
    description:
      "A single MCP endpoint connecting AI agents to 818 tools across 250 providers. Pay per call with USDC via x402 on Base.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@UnifyAPI",
    creator: "@UnifyAPI",
    title: "UnifyAPI — One key for hundreds of API tools",
    description:
      "A single MCP endpoint connecting AI agents to 818 tools across 250 providers. Pay per call with USDC via x402 on Base.",
  },
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold text-[15px]">
      <img src="/logo-icon.svg" alt="" className="h-7 w-7" />
      <span>
        Unify<span className="text-primary-2">API</span>
      </span>
    </Link>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
          <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          <Link href="/status" className="hover:text-foreground transition-colors">Status</Link>
          <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost text-sm">Sign in</Link>
          <Link href="/dashboard" className="btn btn-primary text-sm">Get API key</Link>
          <Link href="/token" className="btn btn-primary text-sm">$UNIFY</Link>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  {
    label: "X",
    href: "https://x.com/UnifyAPI",
    icon: (
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/UnifyAPIPRO/UNIFYAPI",
    icon: (
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    ),
  },
];

function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-6xl px-5 py-16 grid gap-12 md:grid-cols-3">
        {/* Stay Connected */}
        <div>
          <h3 className="text-2xl font-bold leading-tight">
            Stay
            <br />
            Connected
          </h3>
          <p className="mt-4 text-sm text-muted max-w-xs">
            Join our newsletter for the latest updates, new tools, and product news.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold">Quick Links</h4>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><HomeLink className="hover:text-foreground">Home</HomeLink></li>
            <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
            <li><Link href="/tools" className="hover:text-foreground">Tools</Link></li>
            <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
            <li><Link href="/docs" className="hover:text-foreground">Docs</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
            <li><Link href="/token" className="hover:text-foreground">Token</Link></li>
            <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h4 className="font-semibold">Follow Us</h4>
          <div className="mt-4 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="h-11 w-11 grid place-items-center rounded-full border border-border text-muted hover:text-primary-2 hover:border-primary transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-5 py-6 text-xs text-muted">
          <span>© {new Date().getFullYear()} UnifyAPI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <NextTopLoader color="#22c55e" height={3} showSpinner={false} />
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
