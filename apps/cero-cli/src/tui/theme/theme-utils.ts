import type { SyntaxColors, ThemeColors } from "types/tui.type";

/**
 * Derive SyntaxColors from ThemeColors
 * Maps theme colors to syntax highlighting colors (matches OpenCode's full set)
 */
export function deriveSyntaxColors(theme: ThemeColors): SyntaxColors {
  return {
    // Markdown colors - derived from semantic colors (OpenCode pattern)
    markdownText: theme.fg1,
    markdownHeading: theme.accent,
    markdownStrong: theme.warning,
    markdownEmph: theme.secondary,
    markdownCode: theme.success,
    markdownCodeBlock: theme.fg1,
    markdownLink: theme.primary,
    markdownLinkText: theme.info,
    markdownBlockQuote: theme.secondary,
    markdownListItem: theme.primary,
    markdownListEnumeration: theme.info,
    markdownHorizontalRule: theme.fg4,
    markdownImage: theme.primary,
    markdownImageText: theme.info,

    // Diff colors - full set matching OpenCode
    diffAdded: "#4fd6be",
    diffRemoved: "#c53b53",
    diffContext: theme.fg3,
    diffHunkHeader: theme.fg3,
    diffHighlightAdded: "#b8db87",
    diffHighlightRemoved: "#e26a75",
    diffAddedBg: "#20303b",
    diffRemovedBg: "#37222c",
    diffContextBg: theme.bg2,
    diffLineNumber: theme.bg3,
    diffAddedLineNumberBg: "#1b2b34",
    diffRemovedLineNumberBg: "#2d1f26",

    // Syntax highlighting colors
    syntaxKeyword: theme.accent,
    syntaxFunction: theme.primary,
    syntaxVariable: theme.error,
    syntaxString: theme.success,
    syntaxNumber: theme.warning,
    syntaxType: theme.secondary,
    syntaxOperator: theme.info,
    syntaxComment: theme.fg4,
    syntaxPunctuation: theme.fg1,
  };
}
