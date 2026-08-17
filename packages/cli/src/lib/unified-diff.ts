import { createPatch, parsePatch } from "diff";

const DIFF_CONTEXT_LINES = 3;

/**
 * Builds a unified diff patch string (the same text format `git diff`
 * produces) between two versions of a file's content. This is the exact
 * format the OpenTUI `<diff>` component expects for its `diff` prop — it
 * parses the text with the same `diff` package under the hood.
 */
export function buildUnifiedDiff(
  path: string,
  oldContent: string,
  newContent: string,
): string {
  return createPatch(path, oldContent, newContent, undefined, undefined, {
    context: DIFF_CONTEXT_LINES,
  });
}

/** True if the patch contains no actual line changes (identical content). */
export function isEmptyDiff(patch: string): boolean {
  const parsed = parsePatch(patch);
  return parsed.length === 0 || parsed[0]!.hunks.length === 0;
}
