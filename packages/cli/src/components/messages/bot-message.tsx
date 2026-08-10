import { TextAttributes } from "@opentui/core";
import type {
  ClientMessagePart,
  ClientToolCallPart,
} from "../../hooks/use-chat";
import { useTheme } from "../../providers/theme";

type Props = {
  parts: ClientMessagePart[];
  model: string;
  mode: "BUILD" | "PLAN";
  duration?: string;
  streaming?: boolean;
  interrupted?: boolean;
};

function formatToolName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

function formatToolArgs(tc: ClientToolCallPart): string {
  return Object.values(tc.args).map(String).join(" ");
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
      const key =
        part.type === "tool-call"
          ? `group-tc-${part.id}`
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
  interrupted = false,
}: Props) {
  const { theme } = useTheme();

  return (
    <box width="100%" alignItems="center">
      {groupConsecutiveParts(parts).map((group) => (
        <box key={group.key} padding={1} width="100%">
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

            if (part.type === "tool-call") {
              return (
                <box
                  key={part.id}
                  border={["left"]}
                  borderColor={theme.colors.border}
                  width="100%"
                  paddingX={2}
                >
                  <text attributes={TextAttributes.DIM}>
                    <em fg={theme.colors.info}>{formatToolName(part.name)}</em>
                    {Object.keys(part.args).length > 0 ? (
                      <em fg={theme.colors.textMuted}>
                        {" "}
                        {formatToolArgs(part)}
                      </em>
                    ) : null}
                    {part.status === "calling" ? ".." : ""}
                  </text>
                </box>
              );
            }

            if (part.type === "text") {
              return (
                <box key={`text-${i}`} paddingX={2} width="100%">
                  <text>{part.text}</text>
                </box>
              );
            }

            return null;
          })}
        </box>
      ))}

      <box paddingX={3} paddingBottom={1} gap={1} width="100%">
        <box flexDirection="row" gap={2}>
          <text
            attributes={interrupted ? TextAttributes.DIM : 0}
            fg={
              interrupted
                ? undefined
                : mode === "PLAN"
                  ? theme.colors.info
                  : theme.colors.primary
            }
          >
            {">"}
          </text>

          <box flexDirection="row" gap={1}>
            <text attributes={interrupted ? TextAttributes.DIM : 0}>
              {mode === "PLAN" ? "Plan" : "Build"}
            </text>
            <text attributes={TextAttributes.DIM} fg={theme.colors.surface}>
              {">"}
            </text>
            <text attributes={TextAttributes.DIM}>{model}</text>
            {duration || interrupted ? (
              <>
                <text attributes={TextAttributes.DIM} fg={theme.colors.surface}>
                  {">"}
                </text>
                <text attributes={TextAttributes.DIM}>
                  {interrupted ? "interrupted" : duration}
                </text>
              </>
            ) : null}
          </box>
        </box>
      </box>
    </box>
  );
}
