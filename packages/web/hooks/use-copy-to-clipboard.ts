"use client";

import { useState } from "react";

export function useCopyToClipboard(text: string, resetDelayMs = 1800) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetDelayMs);
    } catch {
      // Clipboard API unavailable; the command is already visible to copy by hand.
    }
  };

  return { copied, copy };
}