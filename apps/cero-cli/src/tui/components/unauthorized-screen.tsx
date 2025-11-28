import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";

export function UnauthorizedScreen() {
  const { layout } = useUI();
  const { colors } = useTheme();

  return (
    <box
      style={{
        width: layout.width,
        height: layout.height,
        backgroundColor: colors.bg1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <text fg={colors.warning}>⚠ Not Authenticated</text>
      <text fg={colors.fg3}>Run 'cero login' in your terminal first</text>
      <text fg={colors.fg5}>[ESC to exit]</text>
    </box>
  );
}
