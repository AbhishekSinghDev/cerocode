import { TextAttributes } from "@opentui/core";
import { useTheme } from "../providers/theme";
import { usePromptConfig } from "../providers/prompt-config";

export function StatusBar({ totalTokens }: { totalTokens?: number }) {
  const { theme } = useTheme();
  const { mode, model } = usePromptConfig();

  return (
    <box flexDirection="row" gap={1}>
      <box flexDirection="row" gap={1}>
        <text
          fg={mode === "BUILD" ? theme.colors.primary : theme.colors.selection}
        >
          {mode.toLocaleLowerCase()}
        </text>
        <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
          &#8250;
        </text>
        <text fg={theme.colors.text}>{model}</text>
      </box>
      {typeof totalTokens === "number" ? (
        <text
          marginLeft="auto"
          attributes={TextAttributes.DIM}
          fg={theme.colors.textMuted}
        >
          {totalTokens.toLocaleString("en-US")} tokens
        </text>
      ) : null}
    </box>
  );
}
