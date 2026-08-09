import { TextAttributes } from "@opentui/core";
import type { ClientMessagePart } from "../../hooks/use-chat";
import { useTheme } from "../../providers/theme";

type Props = {
  parts: ClientMessagePart[];
  model: string;
  mode: "BUILD" | "PLAN";
  duration?: string;
  streaming?: boolean;
  interrupted?: boolean;
};

export function BotMessage({
  parts,
  model,
  mode,
  duration,
  streaming = false,
  interrupted = false,
}: Props) {
  const { theme } = useTheme();
  const text = parts
    .filter((p) => p.type === "text")
    .map((p) => p.text)
    .join("");

  return (
    <box width="100%" alignItems="center">
      <box paddingY={1} width="100%">
        <box paddingX={3} width="100%">
          <text fg={theme.colors.text}>{text}</text>
        </box>
      </box>

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
