import { addDefaultParsers } from "@opentui/core";
import { parsers } from "./parsers-config";

export { getFiletype, isBuiltinFiletype, isLanguageSupported, LANGUAGE_MAP } from "./language-map";

let registered = false;

/**
 * Register custom tree-sitter parsers with opentui
 * Should be called once at app startup before rendering
 * WASM files are downloaded on-demand and cached
 */
export function registerParsers(): void {
  if (registered) return;
  addDefaultParsers(parsers);
  registered = true;
}
