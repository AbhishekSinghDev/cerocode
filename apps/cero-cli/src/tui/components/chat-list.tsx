import { formatRelativeTime } from "@tui/helpers/utils";
import { useChat } from "@tui/hooks/use-chat";
import { useConversations } from "@tui/hooks/use-conversations";
import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import type { Conversation } from "types/tui.type";

// Helper to truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

export function ChatList() {
  const { conversations, isLoading: conversationsLoading } = useConversations();
  const { activeConversationId } = useChat();
  const { sidebarCollapsed, focusedChatIndex, layout } = useUI();
  const { colors } = useTheme();

  if (sidebarCollapsed) {
    if (conversationsLoading) {
      return (
        <box style={{ flexDirection: "column", flexGrow: 1, paddingLeft: 1 }}>
          <text fg={colors.fg4}>...</text>
        </box>
      );
    }

    if (conversations.length === 0) {
      return (
        <box style={{ flexDirection: "column", flexGrow: 1, paddingLeft: 1 }}>
          <text fg={colors.fg5}>-</text>
        </box>
      );
    }

    return (
      <box style={{ flexDirection: "column", flexGrow: 1 }}>
        {conversations.map((conv: Conversation, idx: number) => (
          <box
            key={conv.id}
            style={{
              paddingLeft: 1,
              paddingRight: 1,
              backgroundColor:
                activeConversationId === conv.id
                  ? colors.bg4
                  : idx === focusedChatIndex
                    ? colors.bg3
                    : "transparent",
            }}
          >
            <text fg={activeConversationId === conv.id ? colors.primary : colors.fg2}>
              {(conv.shortTitle || "N").charAt(0)}
            </text>
          </box>
        ))}
      </box>
    );
  }

  if (conversationsLoading) {
    return (
      <box style={{ flexGrow: 1, paddingLeft: 1, paddingTop: 1 }}>
        <text fg={colors.fg4}>Loading conversations...</text>
      </box>
    );
  }

  if (conversations.length === 0) {
    return (
      <box style={{ flexGrow: 1, paddingLeft: 1, paddingTop: 1 }}>
        <text fg={colors.fg5}>No conversations yet</text>
      </box>
    );
  }

  return (
    <scrollbox
      style={{
        flexGrow: 1,
        rootOptions: { backgroundColor: colors.bg2 },
        wrapperOptions: { backgroundColor: colors.bg2 },
        viewportOptions: { backgroundColor: colors.bg2 },
        contentOptions: { backgroundColor: colors.bg2, gap: 1 },
        scrollbarOptions: {
          showArrows: false,
          trackOptions: {
            foregroundColor: colors.primaryMuted,
            backgroundColor: colors.bg3,
          },
        },
      }}
    >
      {conversations.map((conv: Conversation, idx: number) => {
        const isSelected = activeConversationId === conv.id;
        const isFocused = idx === focusedChatIndex;
        const relativeTime = formatRelativeTime(conv.updatedAt);
        // Calculate max title length based on sidebar width (account for padding, indicator, timestamp)
        const maxTitleLength = Math.max(8, layout.sidebarWidth - 14);
        const displayTitle = truncateText(conv.shortTitle || "New Chat", maxTitleLength);

        return (
          <box
            key={conv.id}
            style={{
              paddingRight: 1,
              height: 1,
              backgroundColor: isSelected
                ? colors.bg4
                : isFocused
                  ? colors.bg3
                  : "transparent",
              borderColor: isSelected
                ? colors.primary
                : isFocused
                  ? colors.secondary
                  : "transparent",
              borderStyle: "rounded",
              border: isSelected || isFocused,
            }}
          >
            <box style={{ flexDirection: "row", width: "100%" }}>
              <text
                fg={isSelected ? colors.primary : isFocused ? colors.secondary : colors.fg2}
              >
                {isSelected ? "● " : isFocused ? "› " : "  "}
              </text>
              <box style={{ flexDirection: "row", width: "100%" }}>
                <text fg={isSelected ? colors.primary : colors.fg1}>
                  {displayTitle.at(0)?.toUpperCase()}
                </text>
                <text fg={isSelected ? colors.primary : colors.fg1}>
                  {displayTitle.slice(1)}
                </text>
              </box>
              <box style={{ flexGrow: 1 }} />
              <text fg={colors.fg5}>{relativeTime}</text>
            </box>
          </box>
        );
      })}
    </scrollbox>
  );
}
