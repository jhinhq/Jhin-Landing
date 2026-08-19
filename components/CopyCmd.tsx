"use client";

import { useState } from "react";
import { INSTALL_CMD } from "@/lib/site";

export default function CopyCmd({ className = "" }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <button
      onClick={copy}
      className={`group flex items-center gap-3 rounded-full border border-line-strong bg-surface px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-accent cursor-pointer ${className}`}
      style={{ borderColor: "var(--line-strong)" }}
      aria-label="Copy install command"
    >
      <span className="text-accent-ink select-none">$</span>
      <span className="truncate">{INSTALL_CMD}</span>
      <span className="ml-1 shrink-0 text-muted transition-colors group-hover:text-accent-ink">
        {copied ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="9" y="9" width="12" height="12" rx="2.5" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
        )}
      </span>
    </button>
  );
}
