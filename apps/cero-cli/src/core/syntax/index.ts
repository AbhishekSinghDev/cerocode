import { addDefaultParsers } from "@opentui/core";
import { parsers } from "./parsers-config";

export {
  getFiletype,
  isBuiltinFiletype,
  isLanguageSupported,
  LANGUAGE_MAP,
} from "./language-map";

let registered = false;

export function registerParsers(): void {
  if (registered) return;
  addDefaultParsers(parsers);
  registered = true;
}
