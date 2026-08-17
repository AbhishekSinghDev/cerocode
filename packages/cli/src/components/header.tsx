import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";

export function Header() {
  const { theme } = useTheme();

  return (
    <box justifyContent="center" alignItems="center" gap={1}>
      <ascii-font font="tiny" text="CEROCODE" />
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        your terminal coding agent
      </text>
    </box>
  );
}
