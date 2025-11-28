import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { registerParsers } from "../core/syntax";
import { App } from "./app";

// Register custom tree-sitter parsers for syntax highlighting
registerParsers();

export async function startTUI() {
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
  });
  createRoot(renderer).render(<App />);
}
