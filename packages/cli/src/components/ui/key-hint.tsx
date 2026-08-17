import { TextAttributes } from "@opentui/core";
import { useTheme } from "../../providers/theme";

type KeyHintProps = {
  keyLabel: string;
  label: string;
};

/**
 * Keycap-style hint: `[key] label`, dimmed. Used in footers, the landing
 * hero, and dialog chrome so keyboard affordances read the same everywhere.
 */
export function KeyHint({ keyLabel, label }: KeyHintProps) {
  const { theme } = useTheme();

  return (
    <box flexDirection="row" gap={1} flexShrink={0}>
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        [{keyLabel}]
      </text>
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        {label}
      </text>
    </box>
  );
}
