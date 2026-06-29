"use client";
import { useState } from "react";

export function CopyContractButton({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const isPlaceholder = address.startsWith("0x…");

  function handleCopy() {
    if (isPlaceholder) return;
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      disabled={isPlaceholder}
      title={isPlaceholder ? "Contract address not yet available" : "Copy address"}
      className={`text-xs px-3 py-1.5 rounded-md border transition-colors font-mono ${
        isPlaceholder
          ? "border-border text-muted cursor-not-allowed opacity-40"
          : copied
          ? "border-primary bg-primary/10 text-primary-2"
          : "border-border text-muted hover:border-primary hover:text-primary-2 cursor-pointer"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
