import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type Props = {
  message: string;
  mode: "PLAN" | "BUILD";
};

export function UserMessage({ message, mode }: Props) {
  const { theme } = useTheme();

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
        <text attributes={TextAttributes.BOLD} fg={theme.colors.primary}>
          you
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          ·
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          {mode.toLowerCase()}
        </text>
      </box>
      <box width="100%" paddingX={2}>
        <text fg={theme.colors.text} wrapMode="word" width="100%">
          {message}
        </text>
      </box>
    </box>
  );
}
