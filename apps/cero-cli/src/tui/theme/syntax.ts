import { SyntaxStyle } from "@opentui/core";
import type { SyntaxColors, ThemeColors } from "types/tui.type";
import { deriveSyntaxColors } from "./theme-utils";

/**
 * Syntax highlighting rules following OpenCode's pattern
 * Maps tree-sitter capture groups to syntax colors
 * Full coverage matching OpenCode's theme system
 */
function getSyntaxRules(theme: ThemeColors, syntax: SyntaxColors) {
  return [
    // ============ Code Syntax Highlighting ============
    // Keywords
    { scope: ["keyword"], style: { foreground: syntax.syntaxKeyword, bold: true } },
    { scope: ["keyword.function"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.return"], style: { foreground: syntax.syntaxKeyword, italic: true } },
    { scope: ["keyword.operator"], style: { foreground: syntax.syntaxOperator } },
    { scope: ["keyword.import", "keyword.export"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.modifier"], style: { foreground: syntax.syntaxKeyword, italic: true } },
    { scope: ["keyword.conditional"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.repeat"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.exception"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.storage"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.directive"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["keyword.coroutine"], style: { foreground: syntax.syntaxKeyword } },

    // Strings
    { scope: ["string"], style: { foreground: syntax.syntaxString } },
    { scope: ["string.special"], style: { foreground: syntax.syntaxString } },
    { scope: ["string.escape"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["string.regex"], style: { foreground: syntax.syntaxString, italic: true } },
    { scope: ["string.special.url"], style: { foreground: syntax.markdownLink, underline: true } },
    { scope: ["string.special.path"], style: { foreground: syntax.syntaxString } },

    // Comments
    { scope: ["comment"], style: { foreground: syntax.syntaxComment, italic: true } },
    { scope: ["comment.line"], style: { foreground: syntax.syntaxComment, italic: true } },
    { scope: ["comment.block"], style: { foreground: syntax.syntaxComment, italic: true } },
    { scope: ["comment.documentation"], style: { foreground: syntax.syntaxComment, italic: true } },
    { scope: ["comment.todo", "comment.note"], style: { foreground: theme.info, italic: true, bold: true } },
    { scope: ["comment.error"], style: { foreground: theme.error, italic: true, bold: true } },
    { scope: ["comment.warning"], style: { foreground: theme.warning, italic: true, bold: true } },
    { scope: ["comment.fixme"], style: { foreground: theme.warning, italic: true, bold: true } },
    { scope: ["comment.hack"], style: { foreground: theme.warning, italic: true } },

    // Numbers and constants
    { scope: ["number"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["number.float"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["float"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["boolean"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["constant"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["constant.builtin"], style: { foreground: syntax.syntaxNumber, italic: true } },
    { scope: ["constant.macro"], style: { foreground: syntax.syntaxNumber } },

    // Functions
    { scope: ["function"], style: { foreground: syntax.syntaxFunction } },
    { scope: ["function.call"], style: { foreground: syntax.syntaxFunction } },
    { scope: ["function.method"], style: { foreground: syntax.syntaxFunction } },
    { scope: ["function.method.call"], style: { foreground: syntax.syntaxFunction } },
    { scope: ["function.builtin"], style: { foreground: syntax.syntaxFunction, italic: true } },
    { scope: ["function.macro"], style: { foreground: syntax.syntaxFunction } },
    { scope: ["function.special"], style: { foreground: syntax.syntaxFunction, bold: true } },
    { scope: ["constructor"], style: { foreground: syntax.syntaxFunction, bold: true } },

    // Variables
    { scope: ["variable"], style: { foreground: syntax.syntaxVariable } },
    { scope: ["variable.builtin"], style: { foreground: syntax.syntaxVariable, italic: true } },
    { scope: ["variable.parameter"], style: { foreground: syntax.syntaxVariable } },
    { scope: ["variable.member"], style: { foreground: syntax.syntaxVariable } },
    { scope: ["property"], style: { foreground: syntax.syntaxVariable } },
    { scope: ["field"], style: { foreground: syntax.syntaxVariable } },

    // Types
    { scope: ["type"], style: { foreground: syntax.syntaxType } },
    { scope: ["type.builtin"], style: { foreground: syntax.syntaxType, italic: true } },
    { scope: ["type.definition"], style: { foreground: syntax.syntaxType, bold: true } },
    { scope: ["type.qualifier"], style: { foreground: syntax.syntaxType } },
    { scope: ["namespace"], style: { foreground: syntax.syntaxType } },
    { scope: ["module"], style: { foreground: syntax.syntaxType } },
    { scope: ["class"], style: { foreground: syntax.syntaxType, bold: true } },
    { scope: ["interface"], style: { foreground: syntax.syntaxType } },
    { scope: ["struct"], style: { foreground: syntax.syntaxType } },
    { scope: ["enum"], style: { foreground: syntax.syntaxType } },

    // Operators and punctuation
    { scope: ["operator"], style: { foreground: syntax.syntaxOperator } },
    { scope: ["punctuation"], style: { foreground: syntax.syntaxPunctuation } },
    { scope: ["punctuation.bracket"], style: { foreground: syntax.syntaxPunctuation } },
    { scope: ["punctuation.delimiter"], style: { foreground: syntax.syntaxPunctuation } },
    { scope: ["punctuation.special"], style: { foreground: theme.fg4 } },

    // Tags (HTML/JSX/XML)
    { scope: ["tag"], style: { foreground: theme.error } },
    { scope: ["tag.attribute"], style: { foreground: syntax.syntaxKeyword } },
    { scope: ["tag.delimiter"], style: { foreground: syntax.syntaxOperator } },
    { scope: ["tag.builtin"], style: { foreground: theme.error } },

    // Attributes and annotations
    { scope: ["attribute"], style: { foreground: theme.warning } },
    { scope: ["annotation"], style: { foreground: theme.warning } },
    { scope: ["decorator"], style: { foreground: theme.warning } },
    { scope: ["label"], style: { foreground: syntax.markdownLinkText } },

    // ============ Markdown Highlighting ============
    // Text
    { scope: ["text"], style: { foreground: syntax.markdownText } },
    { scope: ["text.literal"], style: { foreground: syntax.markdownCode } },
    { scope: ["text.reference"], style: { foreground: syntax.markdownLink } },
    { scope: ["text.title"], style: { foreground: syntax.markdownHeading, bold: true } },
    { scope: ["text.uri"], style: { foreground: syntax.markdownLink, underline: true } },
    { scope: ["text.underline"], style: { foreground: syntax.markdownText, underline: true } },

    // Headings - use different colors per level for visual hierarchy
    { scope: ["markup.heading"], style: { foreground: syntax.markdownHeading, bold: true } },
    { scope: ["markup.heading.1"], style: { foreground: theme.primary, bold: true } },
    { scope: ["markup.heading.2"], style: { foreground: theme.accent, bold: true } },
    { scope: ["markup.heading.3"], style: { foreground: theme.secondary, bold: true } },
    { scope: ["markup.heading.4"], style: { foreground: theme.info, bold: true } },
    { scope: ["markup.heading.5"], style: { foreground: theme.success, bold: true } },
    { scope: ["markup.heading.6"], style: { foreground: theme.warning, bold: true } },
    { scope: ["markup.heading.marker"], style: { foreground: syntax.markdownHeading } },

    // Inline formatting
    { scope: ["markup.bold", "markup.strong"], style: { foreground: syntax.markdownStrong, bold: true } },
    { scope: ["markup.italic"], style: { foreground: syntax.markdownEmph, italic: true } },
    { scope: ["markup.strikethrough"], style: { foreground: theme.fg4 } },
    { scope: ["markup.underline"], style: { foreground: theme.fg1, underline: true } },

    // Code
    { scope: ["markup.raw"], style: { foreground: syntax.markdownCode } },
    { scope: ["markup.raw.block"], style: { foreground: syntax.markdownCodeBlock } },
    { scope: ["markup.raw.inline"], style: { foreground: syntax.markdownCode, background: theme.bg3 } },

    // Links and images
    { scope: ["markup.link"], style: { foreground: syntax.markdownLink, underline: true } },
    { scope: ["markup.link.label"], style: { foreground: syntax.markdownLinkText } },
    { scope: ["markup.link.url"], style: { foreground: syntax.markdownLink, underline: true } },
    { scope: ["markup.link.text"], style: { foreground: syntax.markdownLinkText } },
    { scope: ["markup.image"], style: { foreground: syntax.markdownImage } },
    { scope: ["markup.image.text"], style: { foreground: syntax.markdownImageText } },

    // Lists
    { scope: ["markup.list"], style: { foreground: syntax.markdownListItem } },
    { scope: ["markup.list.unnumbered"], style: { foreground: syntax.markdownListItem } },
    { scope: ["markup.list.numbered"], style: { foreground: syntax.markdownListEnumeration } },
    { scope: ["markup.list.checked"], style: { foreground: theme.success } },
    { scope: ["markup.list.unchecked"], style: { foreground: theme.fg4 } },

    // Blockquotes
    { scope: ["markup.quote"], style: { foreground: syntax.markdownBlockQuote, italic: true } },

    // Horizontal rule
    { scope: ["markup.horizontal_rule"], style: { foreground: syntax.markdownHorizontalRule } },

    // ============ Diff Highlighting ============
    { scope: ["diff.plus"], style: { foreground: syntax.diffAdded, background: syntax.diffAddedBg } },
    { scope: ["diff.minus"], style: { foreground: syntax.diffRemoved, background: syntax.diffRemovedBg } },
    { scope: ["diff.delta"], style: { foreground: syntax.diffContext, background: syntax.diffContextBg } },
    { scope: ["diff.header"], style: { foreground: syntax.diffHunkHeader, bold: true } },
    { scope: ["diff.hunk"], style: { foreground: syntax.diffHunkHeader } },
    { scope: ["diff.highlight.added"], style: { foreground: syntax.diffHighlightAdded, background: syntax.diffAddedBg } },
    { scope: ["diff.highlight.removed"], style: { foreground: syntax.diffHighlightRemoved, background: syntax.diffRemovedBg } },

    // ============ Misc ============
    { scope: ["spell", "nospell"], style: { foreground: theme.fg1 } },
    { scope: ["conceal"], style: { foreground: theme.fg4 } },
    { scope: ["character"], style: { foreground: syntax.syntaxString } },
    { scope: ["character.special"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["escape"], style: { foreground: syntax.syntaxNumber } },
    { scope: ["embedded"], style: { foreground: syntax.syntaxVariable } },
    { scope: ["error"], style: { foreground: theme.error } },
    { scope: ["warning"], style: { foreground: theme.warning } },
    { scope: ["info"], style: { foreground: theme.info } },
    { scope: ["hint"], style: { foreground: theme.fg4 } },
    { scope: ["debug"], style: { foreground: theme.warning } },
    { scope: ["todo"], style: { foreground: theme.info, bold: true } },
    { scope: ["none"], style: { foreground: theme.fg1 } },
  ];
}

/**
 * Create syntax highlighting style from theme colors
 * Derives syntax colors internally from theme colors (like OpenCode)
 */
export function createSyntaxStyle(theme: ThemeColors): SyntaxStyle {
  const syntax = deriveSyntaxColors(theme);
  const rules = getSyntaxRules(theme, syntax);
  return SyntaxStyle.fromTheme(rules);
}

/**
 * Create a subtle/muted version of syntax style (for thinking blocks, etc.)
 */
export function createSubtleSyntaxStyle(theme: ThemeColors): SyntaxStyle {
  const syntax = deriveSyntaxColors(theme);
  const rules = getSyntaxRules(theme, syntax);
  const mutedRules = rules.map((rule) => ({
    ...rule,
    style: {
      ...rule.style,
      foreground: theme.fg3,
    },
  }));
  return SyntaxStyle.fromTheme(mutedRules);
}
