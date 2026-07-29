import { useTheme } from "../providers/theme";

export function Header() {
  const { theme } = useTheme();
  return (
    <box justifyContent="center" alignItems="center">
      <box
        flexDirection="row"
        justifyContent="center"
        gap={0.5}
        alignItems="center"
      >
        <ascii-font font="tiny" text="CERO" color={theme.colors.textMuted} />
        <ascii-font font="tiny" text="CODE" color={theme.colors.text} />
      </box>
    </box>
  );
}
