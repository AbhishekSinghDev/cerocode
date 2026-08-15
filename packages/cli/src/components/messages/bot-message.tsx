import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import { MessageMarkdown } from "../markdown";
import type { ModeType } from "@cerocode/shared";
import type { Message } from "../../hooks/use-chat";
import prettyMilliseconds from "pretty-ms";

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

function formatToolArgs(tc: ToolPart): string {
  if (!("input" in tc) || tc.input == null) return "";
  if (typeof tc.input !== "object") return String(tc.input);
  return Object.values(tc.input).map(String).join(" ");
}

type PartGroup = {
  type: ClientMessagePart["type"];
  parts: ClientMessagePart[];
  key: string;
};

function groupConsecutiveParts(parts: ClientMessagePart[]): PartGroup[] {
  const groups: PartGroup[] = [];

  for (const part of parts) {
    let i = 0;
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.type === part.type) {
      lastGroup.parts.push(part);
    } else {
      const key = isToolPart(part)
        ? `group-tc-${part.toolCallId}`
        : `group-${part.type}-${i}`;
      groups.push({ type: part.type, parts: [part], key });
    }
    i++;
  }

  return groups;
}

export function BotMessage({
  parts,
  model,
  mode,
  duration,
  streaming = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <box width="100%" alignItems="center">
      {groupConsecutiveParts(parts).map((group, i) => (
        <box key={group.key} width="100%" paddingTop={i === 0 ? 0 : 1}>
          {group.parts.map((part, i) => {
            if (part.type === "reasoning") {
              return (
                <box
                  key={`reasoning-${i}`}
                  border={["left"]}
                  borderColor={theme.colors.border}
                  width="100%"
                  paddingX={2}
                >
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
              let outputLines: string[] | null = null;
              let omittedLines = 0;

              if (part.state === "output-available") {
                const preview = capOutputLines(formatOutputLines(part.output));
                outputLines = preview.lines;
                omittedLines = preview.omitted;
              }

              return (
                <box
                  key={part.toolCallId}
                  border={["left"]}
                  borderColor={theme.colors.border}
                  width="100%"
                  paddingX={2}
                  flexDirection="column"
                >
                  <text attributes={TextAttributes.DIM}>
                    <span fg={theme.colors.info}>
                      {formatToolName(toolName)}{" "}
                    </span>
                    <span fg={theme.colors.textMuted}>
                      {formatToolArgs(part)}
                    </span>
                    {!done ? ".." : ""}
                    {part.state === "output-error" ? ` ${part.errorText}` : ""}
                  </text>
                  {outputLines && outputLines.length > 0 ? (
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
              <box key={`text-${i}`} paddingX={2} width="100%">
                {/* <text fg={theme.colors.text}>{part.text}</text> */}
                <MessageMarkdown content={part.text} streaming={!streaming} />
              </box>
            );
          })}
        </box>
      ))}

      <box paddingX={3} paddingY={1} gap={1} width="100%">
        <box flexDirection="row" gap={2}>
          <text fg={mode === "PLAN" ? theme.colors.info : theme.colors.primary}>
            {">"}
          </text>

          <box flexDirection="row" gap={1}>
            <text>{mode === "PLAN" ? "Plan" : "Build"}</text>
            <text attributes={TextAttributes.DIM}>{">"}</text>
            <text attributes={TextAttributes.DIM}>{model}</text>
            {duration ? (
              <>
                <text attributes={TextAttributes.DIM}>{">"}</text>
                <text attributes={TextAttributes.DIM}>
                  {prettyMilliseconds(duration)}
                </text>
              </>
            ) : null}
          </box>
        </box>
      </box>
    </box>
  );
}
