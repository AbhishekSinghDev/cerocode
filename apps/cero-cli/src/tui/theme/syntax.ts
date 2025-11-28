import { RGBA, SyntaxStyle } from "@opentui/core";
import type { ThemeColors } from "types/tui.type";

/**
 * Create syntax highlighting style from theme colors
 * Used for code blocks in markdown rendering
 */
export function createSyntaxStyle(colors: ThemeColors): SyntaxStyle {
  return SyntaxStyle.fromStyles({
    keyword: { fg: RGBA.fromHex(colors.accent), bold: true },
    string: { fg: RGBA.fromHex(colors.success) },
    comment: { fg: RGBA.fromHex(colors.fg4), italic: true },
    number: { fg: RGBA.fromHex(colors.warning) },
    function: { fg: RGBA.fromHex(colors.secondary) },
    variable: { fg: RGBA.fromHex(colors.fg2) },
    type: { fg: RGBA.fromHex(colors.primary) },
    operator: { fg: RGBA.fromHex(colors.fg3) },
    punctuation: { fg: RGBA.fromHex(colors.fg3) },
    default: { fg: RGBA.fromHex(colors.fg1) },
  });
}
