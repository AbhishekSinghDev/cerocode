import { normalizeCodeBlockLanguages, unwrapMarkdownWrapper } from "@tui/helpers/markdown";
import { createSyntaxStyle } from "@tui/theme";
import { useMemo } from "react";
import type { ApiMessage, ThemeColors } from "types/tui.type";

interface MessageBubbleProps {
  message: ApiMessage;
  isStreaming: boolean;
  colors: ThemeColors;
}

export function MessageBubble({ message, isStreaming, colors }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content || message.content.length === 0;

  const syntaxStyle = useMemo(() => createSyntaxStyle(colors), [colors]);

  // Process AI responses: unwrap ```markdown wrapper, then normalize language tags
  const normalizedContent = useMemo(() => {
    if (isUser) return message.content;
    // First unwrap any ```markdown wrapper, then normalize language tags like tsx→typescript
    return normalizeCodeBlockLanguages(unwrapMarkdownWrapper(message.content));
  }, [message.content, isUser]);

  return (
    <box
      style={{
        marginLeft: isUser ? 8 : 1,
        marginRight: isUser ? 1 : 8,
        marginBottom: 1,
        paddingLeft: 2,
        paddingRight: 2,
        paddingTop: 1,
        paddingBottom: 1,
        borderColor: isUser ? colors.primary : isStreaming ? colors.secondary : colors.border2,
        borderStyle: "rounded",
        border: true,
        backgroundColor: isUser ? colors.bg2 : colors.bg1,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        {/* Header */}
        <box style={{ flexDirection: "row", marginBottom: 1 }}>
          <text fg={isUser ? colors.primary : colors.accent}>{isUser ? "👤 " : "🤖 "}</text>
          <text fg={isUser ? colors.primary : colors.fg2}>
            <strong>{isUser ? "You" : "Cero"}</strong>
          </text>
          <text fg={colors.fg5}> · </text>
          <text fg={colors.fg5}>{message.timestamp}</text>
          {isStreaming && (
            <>
              <text fg={colors.fg5}> · </text>
              <text fg={colors.secondary}>
                <strong>● streaming</strong>
              </text>
            </>
          )}
        </box>

        {/* Divider */}
        {!isEmpty && (
          <text fg={colors.border1}>
            {isUser ? "────────────────────────" : "────────────────────────────────────────"}
          </text>
        )}

        {/* Content - Use OpenTUI's native markdown rendering with tree-sitter */}
        {!isEmpty && (
          <box style={{ marginTop: 1 }}>
            {isUser ? (
              <text fg={colors.fg1}>{message.content}</text>
            ) : (
              <code content={normalizedContent} filetype="markdown" syntaxStyle={syntaxStyle} />
            )}
          </box>
        )}
      </box>
    </box>
  );
}
