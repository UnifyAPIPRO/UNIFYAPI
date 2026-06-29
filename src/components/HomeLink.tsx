"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Home link that scrolls to the top of the page. When already on the home page
// it smooth-scrolls up; otherwise it navigates home (which lands at the top).
export function HomeLink({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}
