import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";
import { MessageMarkdown } from "../markdown";
import { DiffView } from "../diff-view";
import { getDiffSnapshot } from "../../lib/diff-cache";
import type { ModeType } from "@cerocode/shared";
import type { Message } from "../../hooks/use-chat";
import { GLYPH } from "../ui/glyphs";
import prettyMilliseconds from "pretty-ms";
import {
  capOutputLines,
  FILE_EDIT_TOOLS,
  formatOutputLines,
  formatToolArgs,
  formatToolName,
  isToolPart,
} from "../../lib/format-tool-output";

type ClientMessagePart = Message["parts"][number];

type Props = {
  parts: ClientMessagePart[];
  model: string;
  mode: ModeType;
  duration?: number;
  streaming?: boolean;
};

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
