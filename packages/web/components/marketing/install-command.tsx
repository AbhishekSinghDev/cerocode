"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";
import { INSTALL_COMMAND } from "@/lib/constants";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export function InstallCommand({ className }: { className?: string }) {
  const { copied, copy } = useCopyToClipboard(INSTALL_COMMAND);

  return (
    <button
      type="button"
      onClick={copy}
      className={cn(
        "group inline-flex items-center gap-3 border border-border bg-card px-4 py-2.5 font-mono text-sm transition-colors hover:border-foreground/30",
        className,
      )}
    >
      <span className="text-terminal-blue">$</span>
      <span className="text-foreground">{INSTALL_COMMAND}</span>
      <HugeiconsIcon
        icon={copied ? CheckmarkCircle02Icon : Copy01Icon}
        size={14}
        strokeWidth={1.5}
        className={cn(
          "shrink-0 text-muted-foreground transition-colors group-hover:text-foreground",
          copied && "text-success group-hover:text-success",
        )}
      />
    </button>
  );
}
