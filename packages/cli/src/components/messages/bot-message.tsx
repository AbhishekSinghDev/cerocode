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

function formatToolName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function isToolPart(part: ClientMessagePart): part is ToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-");
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

              return (
                <box
                  key={part.toolCallId}
                  border={["left"]}
                  borderColor={theme.colors.border}
                  width="100%"
                  paddingX={2}
                >
                  <text attributes={TextAttributes.DIM}>
                    <em fg={theme.colors.info}>{formatToolName(toolName)} </em>
                    <em fg={theme.colors.textMuted}>{formatToolArgs(part)}</em>
                    {part.state !== "output-available" &&
                    part.state !== "output-error"
                      ? ".."
                      : ""}
                    {part.state === "output-error" ? `${part.errorText}` : ""}
                  </text>
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
