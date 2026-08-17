import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import { MessageMarkdown } from "../markdown";
import { DiffView } from "../diff-view";
import { getDiffSnapshot } from "../../lib/diff-cache";
import type { ModeType } from "@cerocode/shared";
import type { Message } from "../../hooks/use-chat";
import { GLYPH } from "../ui/glyphs";
import prettyMilliseconds from "pretty-ms";

const FILE_EDIT_TOOLS = new Set(["writeFile", "editFile"]);

type ClientMessagePart = Message["parts"][number];
type ToolPart = Extract<
  ClientMessagePart,
  { type: `tool-${string}` | "dynamic-tool" }
>;

type Props = {
  parts: ClientMessagePart[];
  model: string;
  mode: ModeType;
  duration?: number;
  streaming?: boolean;
};

const MAX_OUTPUT_LINES = 8;
const MAX_LINE_LENGTH = 160;

function formatToolName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function isToolPart(part: ClientMessagePart): part is ToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}

function formatOutputLines(output: unknown): string[] {
  if (output == null) return [];

  if (typeof output === "string") {
    return output.split("\n");
  }

  if (Array.isArray(output)) {
    return output.map((item) =>
      item != null && typeof item === "object"
        ? JSON.stringify(item)
        : String(item),
    );
  }

  if (typeof output === "object") {
    const obj = output as Record<string, unknown>;

    if (typeof obj.stdout === "string" || typeof obj.stderr === "string") {
      const lines = [
        ...(typeof obj.stdout === "string" && obj.stdout.trim()
          ? obj.stdout.trim().split("\n")
          : []),
        ...(typeof obj.stderr === "string" && obj.stderr.trim()
          ? obj.stderr
              .trim()
              .split("\n")
              .map((l) => `stderr: ${l}`)
          : []),
      ];
      if (obj.exitCode != null && obj.exitCode !== 0) {
        lines.push(`exit code: ${String(obj.exitCode)}`);
      }
      if (lines.length === 0 && obj.exitCode === 0) lines.push("ok");
      return lines;
    }

    if (typeof obj.content === "string") {
      const lines = obj.content.split("\n");
      if (obj.truncated === true) {
        lines.push(
          `... truncated${typeof obj.totalLength === "number" ? `, ${obj.totalLength} total chars` : ""}`,
        );
      }
      return lines;
    }

    if (Array.isArray(obj.entries)) {
      const header = typeof obj.path === "string" && obj.path ? obj.path : ".";
      const entries = (obj.entries as { name?: string; type?: string }[]).map(
        (entry) =>
          entry?.type === "directory" ? `${entry.name}/` : (entry?.name ?? ""),
      );
      if (entries.length === 0) return [header];
      return [header, ...entries];
    }

    if (Array.isArray(obj.files)) {
      const lines = (obj.files as string[]).slice();
      if (obj.truncated === true) lines.push("... truncated");
      return lines;
    }

    if (Array.isArray(obj.matches)) {
      const lines = (
        obj.matches as { file?: string; line?: number; content?: string }[]
      ).map((match) => `${match.file}:${match.line}: ${match.content}`);
      if (typeof obj.messages === "string") lines.unshift(obj.messages);
      if (obj.truncated === true && typeof obj.totalMatches === "number") {
        lines.push(`... truncated, ${obj.totalMatches} total matches`);
      }
      return lines;
    }

    if (obj.success === true) {
      if (typeof obj.bytesWritten === "number") {
        return [`Wrote ${obj.bytesWritten} bytes to ${String(obj.path)}`];
      }
      return [`Edited ${String(obj.path)}`];
    }

    return JSON.stringify(obj, null, 0).split("\n");
  }

  return [String(output)];
}

function capOutputLines(lines: string[]) {
  const capped = lines.map((line) =>
    line.length > MAX_LINE_LENGTH
      ? `${line.slice(0, MAX_LINE_LENGTH - 3)}...`
      : line,
  );

  if (capped.length <= MAX_OUTPUT_LINES) {
    return { lines: capped, omitted: 0 };
  }

  const omitted = capped.length - (MAX_OUTPUT_LINES - 1);
  return { lines: capped.slice(0, MAX_OUTPUT_LINES - 1), omitted };
}

function formatToolArgs(tc: ToolPart, toolName: string): string {
  if (!("input" in tc) || tc.input == null) return "";
  if (typeof tc.input !== "object") return String(tc.input);
  // For file edits the args are shown as a diff instead, so just surface
  // the path here rather than dumping the whole content/oldString/newString
  // inline as text.
  if (FILE_EDIT_TOOLS.has(toolName)) {
    const path = (tc.input as { path?: unknown }).path;
    return typeof path === "string" ? path : "";
  }
  return Object.values(tc.input).map(String).join(" ");
}

export function BotMessage({
  parts,
  model,
  mode,
  duration,
  streaming = false,
}: Props) {
  const { theme } = useTheme();
  const accent = mode === "PLAN" ? theme.colors.info : theme.colors.primary;

  return (
    <box width="100%" flexDirection="column" paddingTop={1}>
      <box
        flexDirection="row"
        alignItems="center"
        gap={1}
        paddingX={2}
        paddingBottom={1}
        width="100%"
      >
        <text fg={accent}>{GLYPH.brand}</text>
        <text attributes={TextAttributes.BOLD} fg={theme.colors.text}>
          cerocode
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {GLYPH.dot}
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {mode === "PLAN" ? "plan" : "build"}
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {GLYPH.dot}
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {model}
        </text>
        {duration ? (
          <>
            <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
              {GLYPH.dot}
            </text>
            <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
              {prettyMilliseconds(duration)}
            </text>
          </>
        ) : null}
      </box>

      {/* Every part below shares one `gap`-driven rhythm — exactly one blank
          row between any two blocks, regardless of part type or ordering.
          Reasoning and tool-call blocks additionally get a left rule in a
          status color, setting "process" steps apart from the plain final
          reply text and from each other at a glance. */}
      <box flexDirection="column" width="100%" paddingX={2} gap={1}>
        {parts.map((part, i) => {
          if (part.type === "reasoning") {
            return (
              <box
                key={`reasoning-${i}`}
                width="100%"
                flexDirection="column"
                border={["left"]}
                borderColor={theme.colors.textMuted}
                paddingLeft={1}
              >
                <text
                  attributes={TextAttributes.DIM}
                  fg={theme.colors.textMuted}
                >
                  thinking
                </text>
                <text attributes={TextAttributes.DIM}>
                  <em fg={theme.colors.textMuted}>{part.text}</em>
                </text>
              </box>
            );
          }

          if (isToolPart(part)) {
            const toolName =
              part.type === "dynamic-tool"
                ? part.toolName
                : part.type.slice("tool-".length);

            const done =
              part.state === "output-available" ||
              part.state === "output-error";
            const failed = part.state === "output-error";
            const statusColor = failed
              ? theme.colors.error
              : done
                ? theme.colors.success
                : theme.colors.info;
            const statusGlyph = failed
              ? GLYPH.error
              : done
                ? GLYPH.success
                : GLYPH.thinking;

            const diffSnapshot =
              part.state === "output-available" &&
              FILE_EDIT_TOOLS.has(toolName)
                ? getDiffSnapshot(part.toolCallId)
                : undefined;

            let outputLines: string[] | null = null;
            let omittedLines = 0;

            if (part.state === "output-available" && !diffSnapshot) {
              const preview = capOutputLines(formatOutputLines(part.output));
              outputLines = preview.lines;
              omittedLines = preview.omitted;
            }

            return (
              <box
                key={part.toolCallId}
                width="100%"
                flexDirection="column"
                border={["left"]}
                borderColor={statusColor}
                paddingLeft={1}
              >
                <text fg={statusColor}>
                  {statusGlyph} {formatToolName(toolName)}
                </text>
                {formatToolArgs(part, toolName) ? (
                  <text attributes={TextAttributes.DIM}>
                    <span fg={theme.colors.textMuted}>
                      {formatToolArgs(part, toolName)}
                    </span>
                  </text>
                ) : null}
                {part.state === "output-error" ? (
                  <text fg={theme.colors.error} wrapMode="word" width="100%">
                    {part.errorText}
                  </text>
                ) : null}
                {diffSnapshot ? (
                  <box width="100%" paddingTop={1}>
                    <DiffView
                      path={formatToolArgs(part, toolName) || "file"}
                      oldContent={diffSnapshot.oldContent}
                      newContent={diffSnapshot.newContent}
                    />
                  </box>
                ) : outputLines && outputLines.length > 0 ? (
                  <box flexDirection="column" width="100%" paddingTop={1}>
                    {outputLines.map((line, i) => (
                      <text key={`out-${i}`} wrapMode="char" width="100%">
                        <span fg={theme.colors.textMuted}>{line}</span>
                      </text>
                    ))}
                    {omittedLines > 0 ? (
                      <text attributes={TextAttributes.DIM} width="100%">
                        <span fg={theme.colors.textMuted}>
                          ... {omittedLines} more lines
                        </span>
                      </text>
                    ) : null}
                  </box>
                ) : null}
              </box>
            );
          }

          if (part.type !== "text") return null;

          return (
            <box key={`text-${i}`} width="100%">
              <MessageMarkdown content={part.text} streaming={!streaming} />
            </box>
          );
        })}
      </box>
    </box>
  );
}
