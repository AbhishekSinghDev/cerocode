"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const INSTALL_COMMAND = "bun add -g cerocode";

export function InstallCommand({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(INSTALL_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable; the command is already visible to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group inline-flex items-center gap-3 border border-border bg-card px-4 py-2.5 font-mono text-sm transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <span className="text-[#89B4FA]">$</span>
      <span className="text-foreground">{INSTALL_COMMAND}</span>
      <HugeiconsIcon
        icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
        size={14}
        strokeWidth={1.5}
        className={cn(
          "shrink-0 text-muted-foreground transition-colors group-hover:text-foreground",
          copied && "text-[#82E0AA] group-hover:text-[#82E0AA]",
        )}
      />
    </button>
  );
}
