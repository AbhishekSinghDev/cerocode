import { getFiletype } from "../../core/syntax";

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language: string; filetype: string | null };

/**
 * Language aliases that should be normalized to their base parser filetype
 * This ensures code blocks use the correct tree-sitter parser
 */
const LANGUAGE_NORMALIZATIONS: Record<string, string> = {
  // JSX/TSX variants → typescript (built-in parser handles JSX)
  typescriptreact: "typescript",
  javascriptreact: "typescript",
  tsx: "typescript",
  jsx: "typescript",
  // JS variants → typescript
  javascript: "typescript",
  js: "typescript",
  mjs: "typescript",
  cjs: "typescript",
  // Shell variants → bash
  shell: "bash",
  sh: "bash",
  zsh: "bash",
  // Other common aliases
  yml: "yaml",
  py: "python",
  rb: "ruby",
  rs: "rust",
  cs: "csharp",
  "c#": "csharp",
  "c++": "cpp",
  md: "markdown",
};

/**
 * Normalize language tags in markdown code blocks
 * Replaces aliases like `tsx`, `jsx`, `typescriptreact` with their base parser filetype
 */
export function normalizeCodeBlockLanguages(content: string): string {
  return content.replace(/```(\w+)/g, (match, lang) => {
    const normalized = LANGUAGE_NORMALIZATIONS[lang.toLowerCase()];
    return normalized ? `\`\`\`${normalized}` : match;
  });
}

export function unwrapMarkdownWrapper(content: string): string {
  const trimmed = content.trim();

  // Case 1: Properly closed ```markdown ... ```
  const closedMatch = trimmed.match(/^```markdown\n?([\s\S]*?)```$/);
  if (closedMatch?.[1]) {
    return closedMatch[1].trim();
  }

  // Case 2: Unclosed ```markdown ... (no closing ```)
  if (trimmed.startsWith("```markdown\n") || trimmed.startsWith("```markdown\r\n")) {
    return trimmed.replace(/^```markdown\r?\n/, "");
  }

  return trimmed;
}

export function parseMarkdownBlocks(content: string): ContentBlock[] {
  // First unwrap any markdown wrapper, then normalize language tags
  const unwrapped = normalizeCodeBlockLanguages(unwrapMarkdownWrapper(content));
  const blocks: ContentBlock[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(unwrapped)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textContent = unwrapped.slice(lastIndex, match.index).trim();
      if (textContent) {
        blocks.push({ type: "text", content: textContent });
      }
    }

    // Add code block with resolved filetype
    const language = match[1] || "text";
    const codeContent = match[2] || "";
    if (codeContent.trim()) {
      blocks.push({
        type: "code",
        content: codeContent.trimEnd(),
        language,
        filetype: getFiletype(language),
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last code block
  if (lastIndex < unwrapped.length) {
    const textContent = unwrapped.slice(lastIndex).trim();
    if (textContent) {
      blocks.push({ type: "text", content: textContent });
    }
  }

  // If no blocks were created, treat entire content as text
  if (blocks.length === 0 && unwrapped.trim()) {
    blocks.push({ type: "text", content: unwrapped.trim() });
  }

  return blocks;
}
