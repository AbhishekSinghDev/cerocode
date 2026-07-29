import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";

export function StatusBar() {
  const { theme } = useTheme();
  return (
    <box flexDirection="row" gap={1}>
      <text fg={theme.colors.primary}>Build</text>
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        &#8250;
      </text>
      <text fg={theme.colors.text}>opus-4-6</text>
    </box>
  );
}
