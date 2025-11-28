import { useTheme } from "@tui/hooks/use-theme";

interface ThemeIndicatorProps {
  show: boolean;
}

export function ThemeIndicator({ show }: ThemeIndicatorProps) {
  const { colors, currentThemeName, currentThemeIndex, themeCount } = useTheme();

  if (!show) return null;

  return (
    <box
      style={{
        position: "absolute",
        left: 2,
        bottom: 2,
        padding: 1,
        paddingLeft: 2,
        paddingRight: 2,
        backgroundColor: colors.bg4,
        border: true,
        borderStyle: "rounded",
        borderColor: colors.primary,
        flexDirection: "row",
        zIndex: 100,
        height: 5,
      }}
    >
      <text fg={colors.primary}>◆ </text>
      <text fg={colors.fg1} style={{ wrapMode: "none" }}>
        Theme:{" "}
      </text>
      <text fg={colors.primary} style={{ wrapMode: "none" }}>
        <strong>{currentThemeName}</strong>
      </text>
      <text fg={colors.fg1} style={{ wrapMode: "none" }}>
        ({currentThemeIndex + 1}/{themeCount})
      </text>
    </box>
  );
}
