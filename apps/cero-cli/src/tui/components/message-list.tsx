import { useChat } from "@tui/hooks/use-chat";
import { useTheme } from "@tui/hooks/use-theme";
import { useMemo } from "react";
import type { ApiMessage, ThemeColors } from "types/tui.type";
import { parseMarkdownBlocks, type ContentBlock } from "../helpers/markdown";
import { createSyntaxStyle } from "../theme/syntax";
import { CommandsDisplay } from "./commands";

interface CodeBlockProps {
  block: ContentBlock & { type: "code" };
  colors: ThemeColors;
  syntaxStyle: ReturnType<typeof createSyntaxStyle>;
}

function CodeBlock({ block, colors, syntaxStyle }: CodeBlockProps) {
  return (
    <box
      style={{
        marginTop: 1,
        marginBottom: 1,
        border: true,
        borderStyle: "rounded",
        borderColor: colors.border2,
        backgroundColor: colors.bg3,
      }}
    >
      {/* Language label */}
      <box
        style={{
          paddingLeft: 1,
          paddingRight: 1,
          backgroundColor: colors.bg4,
        }}
      >
        <text fg={colors.fg4}>{block.language || "code"}</text>
      </box>
      {/* Code content with syntax highlighting */}
      {block.filetype ? (
        <code content={block.content} filetype={block.filetype} syntaxStyle={syntaxStyle} />
      ) : (
        <box style={{ paddingLeft: 1, paddingRight: 1 }}>
          <text fg={colors.fg2}>{block.content}</text>
        </box>
      )}
    </box>
  );
}

interface MessageBubbleProps {
  message: ApiMessage;
  isStreaming: boolean;
  colors: ThemeColors;
}

function MessageBubble({ message, isStreaming, colors }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isEmpty = !message.content || message.content.length === 0;

  const syntaxStyle = useMemo(() => createSyntaxStyle(colors), [colors]);
  const contentBlocks = useMemo(
    () => (message.content && !isUser ? parseMarkdownBlocks(message.content) : []),
    [message.content, isUser],
  );

  return (
    <box
      style={{
        marginLeft: isUser ? 4 : 0,
        marginRight: isUser ? 0 : 4,
        paddingLeft: 2,
        paddingRight: 2,
        borderColor: isUser ? colors.primary : isStreaming ? colors.secondary : colors.border1,
        borderStyle: "rounded",
        border: true,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        {/* Header */}
        <box style={{ flexDirection: "row" }}>
          <text fg={isUser ? colors.primary : colors.fg3}>
            <strong>{isUser ? "You" : "◆ Cero"}</strong>
          </text>
          <text fg={colors.fg5}> · {message.timestamp}</text>
          {isStreaming && <text fg={colors.secondary}> ● streaming</text>}
        </box>
        {/* Content */}
        {!isEmpty &&
          (isUser ? (
            <text fg={colors.fg1}>{message.content}</text>
          ) : (
            contentBlocks.map((block, idx) =>
              block.type === "code" ? (
                <CodeBlock key={idx} block={block} colors={colors} syntaxStyle={syntaxStyle} />
              ) : (
                <text key={idx} fg={colors.fg1}>
                  {block.content}
                </text>
              ),
            )
          ))}
      </box>
    </box>
  );
}

interface LoadingIndicatorProps {
  colors: ThemeColors;
}

function LoadingIndicator({ colors }: LoadingIndicatorProps) {
  return (
    <box
      style={{
        marginLeft: 0,
        marginRight: 2,
        marginBottom: 1,
        paddingLeft: 1,
        paddingRight: 1,
        backgroundColor: colors.bg4,
        borderColor: colors.secondary,
        borderStyle: "rounded",
        border: true,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <box style={{ flexDirection: "row" }}>
          <text fg={colors.fg3}>
            <strong>◆ Cero</strong>
          </text>
          <text fg={colors.secondary}> ● thinking...</text>
        </box>
        <text fg={colors.fg4}>Processing your request...</text>
      </box>
    </box>
  );
}

export function MessageList() {
  const { messages, chatTitle, isNewChat, isLoading, isStreaming } = useChat();
  const { colors } = useTheme();

  const showCommands = isNewChat && messages.length === 0;

  return (
    <box style={{ flexDirection: "column", flexGrow: 1 }}>
      {/* Chat Header */}
      <box
        style={{
          paddingLeft: 1,
          paddingRight: 1,
          backgroundColor: colors.bg2,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <text fg={colors.primary}>
          <strong>◆</strong>
        </text>
        <text fg={colors.fg1}>
          <strong>{` ${chatTitle}`}</strong>
        </text>
        <text fg={colors.primary}> [Connected]</text>
      </box>

      {/* Divider */}
      <box />

      {/* Messages or Commands */}
      {showCommands ? (
        <CommandsDisplay showFull />
      ) : (
        <scrollbox
          stickyScroll
          stickyStart="bottom"
          style={{
            flexGrow: 1,
            rootOptions: { backgroundColor: colors.bg1 },
            wrapperOptions: { backgroundColor: colors.bg1 },
            viewportOptions: { backgroundColor: colors.bg1 },
            contentOptions: { backgroundColor: colors.bg1, paddingTop: 1 },
            scrollbarOptions: {
              showArrows: false,
              trackOptions: {
                foregroundColor: colors.primaryMuted,
                backgroundColor: colors.bg3,
              },
            },
          }}
        >
          {messages.map((msg: ApiMessage, idx: number) => {
            const isLastAssistant =
              msg.role === "assistant" && idx === messages.length - 1 && isStreaming;

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={isLastAssistant}
                colors={colors}
              />
            );
          })}
          {isLoading && <LoadingIndicator colors={colors} />}
        </scrollbox>
      )}
    </box>
  );
}
