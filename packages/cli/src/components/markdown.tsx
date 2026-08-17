import { SyntaxStyle, RGBA } from "@opentui/core";

// Shared with DiffView so tool-call diffs use the same code-highlighting
// palette as markdown code blocks, independent of the active UI theme.
export const syntaxStyle = SyntaxStyle.fromStyles({
  // Keywords
  keyword: { fg: RGBA.fromHex("#FF7B72"), bold: true },
  "keyword.import": { fg: RGBA.fromHex("#FF7B72"), bold: true },
  "keyword.operator": { fg: RGBA.fromHex("#FF7B72") },
  "keyword.return": { fg: RGBA.fromHex("#FF7B72"), bold: true },
  "keyword.function": { fg: RGBA.fromHex("#FF7B72"), bold: true },
  "keyword.conditional": { fg: RGBA.fromHex("#FF7B72") },
  "keyword.repeat": { fg: RGBA.fromHex("#FF7B72") },
  "keyword.exception": { fg: RGBA.fromHex("#FF7B72") },

  // Literals
  string: { fg: RGBA.fromHex("#A5D6FF") },
  "string.escape": { fg: RGBA.fromHex("#79C0FF") },
  "string.special": { fg: RGBA.fromHex("#A5D6FF") },
  number: { fg: RGBA.fromHex("#79C0FF") },
  boolean: { fg: RGBA.fromHex("#79C0FF") },
  constant: { fg: RGBA.fromHex("#79C0FF") },
  "constant.builtin": { fg: RGBA.fromHex("#79C0FF"), bold: true },
  character: { fg: RGBA.fromHex("#A5D6FF") },
  comment: { fg: RGBA.fromHex("#8B949E"), italic: true },

  // Functions & types
  function: { fg: RGBA.fromHex("#D2A8FF") },
  "function.call": { fg: RGBA.fromHex("#D2A8FF") },
  "function.method": { fg: RGBA.fromHex("#D2A8FF") },
  "function.method.call": { fg: RGBA.fromHex("#D2A8FF") },
  "function.builtin": { fg: RGBA.fromHex("#D2A8FF"), italic: true },
  "function.macro": { fg: RGBA.fromHex("#D2A8FF") },
  type: { fg: RGBA.fromHex("#FFA657") },
  "type.builtin": { fg: RGBA.fromHex("#FFA657"), italic: true },
  constructor: { fg: RGBA.fromHex("#FFA657") },
  parameter: { fg: RGBA.fromHex("#E6EDF3") },

  // Variables & properties
  variable: { fg: RGBA.fromHex("#E6EDF3") },
  "variable.member": { fg: RGBA.fromHex("#79C0FF") },
  "variable.parameter": { fg: RGBA.fromHex("#E6EDF3") },
  "variable.builtin": { fg: RGBA.fromHex("#79C0FF"), italic: true },
  property: { fg: RGBA.fromHex("#79C0FF") },
  attribute: { fg: RGBA.fromHex("#79C0FF") },
  label: { fg: RGBA.fromHex("#FF7B72") },
  namespace: { fg: RGBA.fromHex("#FFA657") },
  module: { fg: RGBA.fromHex("#FFA657") },

  // Operators & punctuation
  operator: { fg: RGBA.fromHex("#FF7B72") },
  punctuation: { fg: RGBA.fromHex("#F0F6FC") },
  "punctuation.bracket": { fg: RGBA.fromHex("#F0F6FC") },
  "punctuation.delimiter": { fg: RGBA.fromHex("#C9D1D9") },
  "punctuation.special": { fg: RGBA.fromHex("#FF7B72") },

  // Markdown-specific (for the prose parts)
  "markup.heading": { fg: RGBA.fromHex("#58A6FF"), bold: true },
  "markup.heading.1": { fg: RGBA.fromHex("#58A6FF"), bold: true },
  "markup.heading.2": { fg: RGBA.fromHex("#79C0FF"), bold: true },
  "markup.heading.3": { fg: RGBA.fromHex("#79C0FF"), bold: true },
  "markup.bold": { fg: RGBA.fromHex("#F0F6FC"), bold: true },
  "markup.strong": { fg: RGBA.fromHex("#F0F6FC"), bold: true },
  "markup.italic": { fg: RGBA.fromHex("#F0F6FC"), italic: true },
  "markup.strikethrough": { fg: RGBA.fromHex("#8B949E"), dim: true },
  "markup.list": { fg: RGBA.fromHex("#FF7B72") },
  "markup.list.checked": { fg: RGBA.fromHex("#3FB950") },
  "markup.list.unchecked": { fg: RGBA.fromHex("#8B949E") },
  "markup.quote": { fg: RGBA.fromHex("#8B949E"), italic: true },
  "markup.raw": { fg: RGBA.fromHex("#A5D6FF") },
  "markup.raw.block": { fg: RGBA.fromHex("#A5D6FF") },
  "markup.link": { fg: RGBA.fromHex("#58A6FF"), underline: true },
  "markup.link.url": { fg: RGBA.fromHex("#58A6FF"), underline: true },
  "markup.link.label": { fg: RGBA.fromHex("#58A6FF") },

  // Diff / misc
  "diff.plus": { fg: RGBA.fromHex("#3FB950") },
  "diff.minus": { fg: RGBA.fromHex("#F85149") },
  "diff.delta": { fg: RGBA.fromHex("#D29922") },

  // Fallback — anything not matched above uses this
  default: { fg: RGBA.fromHex("#E6EDF3") },
});

type Props = {
  content: string;
  streaming?: boolean; // true while tokens are still arriving
};

export function MessageMarkdown({ content, streaming = false }: Props) {
  return (
    <markdown
      content={content}
      syntaxStyle={syntaxStyle}
      streaming={streaming}
      conceal={true}
      tableOptions={{ style: "grid", borders: true }}
    />
  );
}
