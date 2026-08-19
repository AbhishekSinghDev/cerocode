import { pathToFiletype, TextAttributes } from "@opentui/core";
import { formatPatch, structuredPatch, type StructuredPatchHunk } from "diff";
import { useTheme } from "../providers/theme";
import { tint } from "./ui/tint";
import { DIFF_CONTEXT_LINES } from "../lib/unified-diff";
import { syntaxStyle } from "../lib/syntax-theme";

// Keeps a single huge hunk (e.g. writing a large new file) from blowing out
// the chat transcript — mirrors the line cap already used for plain tool
// output in bot-message.tsx.
const MAX_DIFF_LINES = 60;

function truncateHunk(hunk: StructuredPatchHunk, maxLines: number) {
  const lines = hunk.lines.slice(0, maxLines);
  let oldLines = 0;
  let newLines = 0;

  for (const line of lines) {
    if (line[0] === " ") {
      oldLines++;
      newLines++;
    } else if (line[0] === "-") {
      oldLines++;
    } else if (line[0] === "+") {
      newLines++;
    }
  }

  return { ...hunk, lines, oldLines, newLines };
}

// Caps total displayed lines across hunks, rewriting whichever hunk gets
// cut so its header counts stay consistent with its (shorter) line list —
// an inconsistent header makes the diff unparsable and the viewer falls
// back to an error display instead of the truncated diff.
function capHunks(hunks: StructuredPatchHunk[], maxLines: number) {
  const kept: StructuredPatchHunk[] = [];
  let used = 0;
  let omitted = 0;

  for (const hunk of hunks) {
    if (used >= maxLines) {
      omitted += hunk.lines.length;
      continue;
    }
    const remaining = maxLines - used;
    if (hunk.lines.length <= remaining) {
      kept.push(hunk);
      used += hunk.lines.length;
    } else {
      kept.push(truncateHunk(hunk, remaining));
      used = maxLines;
      omitted += hunk.lines.length - remaining;
    }
  }

  return { hunks: kept, omitted };
}

type Props = {
  path: string;
  oldContent: string;
  newContent: string;
};

export function DiffView({ path, oldContent, newContent }: Props) {
  const { theme } = useTheme();

  if (oldContent === newContent) {
    return (
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        No changes
      </text>
    );
  }

  const patch = structuredPatch(
    path,
    path,
    oldContent,
    newContent,
    undefined,
    undefined,
    { context: DIFF_CONTEXT_LINES },
  );

  if (patch.hunks.length === 0) {
    return (
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        No changes
      </text>
    );
  }

  const { hunks, omitted } = capHunks(patch.hunks, MAX_DIFF_LINES);
  const diffText = formatPatch({ ...patch, hunks });

  return (
    <box flexDirection="column" width="100%">
      <diff
        diff={diffText}
        filetype={pathToFiletype(path)}
        syntaxStyle={syntaxStyle}
        view="split"
        showLineNumbers
        wrapMode="char"
        addedBg={tint(theme.colors.success, 0.14)}
        removedBg={tint(theme.colors.error, 0.14)}
        contextBg="transparent"
        lineNumberBg="transparent"
        lineNumberFg={theme.colors.textMuted}
        addedSignColor={theme.colors.success}
        removedSignColor={theme.colors.error}
      />
      {omitted > 0 ? (
        <text attributes={TextAttributes.DIM} width="100%">
          <span fg={theme.colors.textMuted}>... {omitted} more lines</span>
        </text>
      ) : null}
    </box>
  );
}
