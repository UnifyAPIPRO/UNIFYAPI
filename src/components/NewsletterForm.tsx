"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return <p className="text-sm text-primary-2">Thanks for subscribing!</p>;
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        setDone(true);
      }}
      className="relative max-w-sm"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="pr-12"
      />
      <button
        type="submit"
        aria-label="Subscribe"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 grid place-items-center rounded-full bg-primary text-[#04140a] hover:opacity-90"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z" />
        </svg>
      </button>
    </form>
  );
}
