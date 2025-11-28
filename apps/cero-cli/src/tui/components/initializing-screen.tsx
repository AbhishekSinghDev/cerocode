import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";

export function InitializingScreen() {
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
      }}
    >
      <text fg={colors.primary}>◆ Initializing CEROCODE...</text>
    </box>
  );
}
