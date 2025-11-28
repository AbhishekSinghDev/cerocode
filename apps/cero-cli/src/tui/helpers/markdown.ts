import { getFiletype } from "../../core/syntax";

export type ContentBlock =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language: string; filetype: string | null };

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
  const unwrapped = unwrapMarkdownWrapper(content);
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
