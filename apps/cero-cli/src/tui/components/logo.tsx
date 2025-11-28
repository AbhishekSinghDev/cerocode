import { useTheme } from "@tui/hooks/use-theme";

export const LOGO_LINES = [
  "┏━╸┏━╸┏━┓┏━┓┏━╸┏━┓╺┳┓┏━╸",
  "┃  ┣╸ ┣┳┛┃ ┃┃  ┃ ┃ ┃┃┣╸",
  "┗━╸┗━╸╹┗╸┗━┛┗━╸┗━┛╺┻┛┗━╸",
];

export const LOGO_MINI = ["CEROCODE"];

export const LOGO_INLINE = "CEROCODE";

export function Logo({ compact = false }: { compact?: boolean }) {
  const { colors } = useTheme();
  if (compact) {
    return (
      <box style={{ height: 1 }}>
        <text fg={colors.fg1}>
          <strong>CERO</strong>
        </text>
        <text fg={colors.primary}>CODE</text>
      </box>
    );
  }

  return (
    <box style={{ flexDirection: "column", minHeight: 3 }}>
      <text fg={colors.primary}>
        <strong>{LOGO_LINES.join("\n")}</strong>
      </text>
    </box>
  );
}
