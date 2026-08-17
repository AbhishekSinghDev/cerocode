import { TextAttributes } from "@opentui/core";
import { useTerminalDimensions } from "@opentui/react";
import type { ModeType } from "@cerocode/shared";
import { useTheme } from "../providers/theme";
import { Spinner } from "./spinner";
import { Badge } from "./ui/badge";
import { KeyHint } from "./ui/key-hint";
import { GLYPH } from "./ui/glyphs";

export type FooterHint = {
  keyLabel: string;
  label: string;
};

type FooterBarProps = {
  mode: ModeType;
  model: string;
  totalTokens?: number;
  loading?: boolean;
  interruptible?: boolean;
  cwd?: string;
  hints?: FooterHint[];
};

/**
 * The single persistent status line used under the composer on both the
 * landing screen and inside a session. It is the one place session state
 * (mode, model, tokens, working/interrupt state, cwd) and keyboard
 * affordances are surfaced, so nothing else needs to repeat them.
 */
export function FooterBar({
  mode,
  model,
  totalTokens,
  loading,
  interruptible,
  cwd,
  hints,
}: FooterBarProps) {
  const { theme } = useTheme();
  const { width } = useTerminalDimensions();
  const modeColor = mode === "PLAN" ? theme.colors.info : theme.colors.primary;

  // Narrow terminals can't fit mode/model + cwd + tokens + hints on one row —
  // drop the least essential segments first rather than let anything wrap.
  const showHints = width >= 70;
  const showCwd = width >= 90;

  return (
    <box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      height={1}
      flexShrink={0}
      overflow="hidden"
    >
      <box flexDirection="row" alignItems="center" gap={2} flexShrink={1} overflow="hidden">
        {loading ? (
          <box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
            <Spinner mode={mode} />
            {interruptible ? (
              <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
                esc to interrupt
              </text>
            ) : null}
          </box>
        ) : (
          <box flexDirection="row" alignItems="center" gap={1} flexShrink={0}>
            <Badge label={mode.toLowerCase()} color={modeColor} />
            <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
              {GLYPH.dot}
            </text>
            <text fg={theme.colors.textMuted}>{model}</text>
          </box>
        )}
        {cwd && showCwd ? (
          <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted} selectable={false}>
            {cwd}
          </text>
        ) : null}
      </box>

      <box flexDirection="row" alignItems="center" gap={2} flexShrink={0}>
        {typeof totalTokens === "number" ? (
          <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
            {totalTokens.toLocaleString("en-US")} tok
          </text>
        ) : null}
        {showHints
          ? hints?.map((hint) => (
              <KeyHint key={hint.keyLabel + hint.label} keyLabel={hint.keyLabel} label={hint.label} />
            ))
          : null}
      </box>
    </box>
  );
}
