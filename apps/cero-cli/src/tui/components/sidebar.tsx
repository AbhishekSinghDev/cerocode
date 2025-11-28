import { useChat } from "@tui/hooks/use-chat";
import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";
import { ChatList } from "./chat-list";
import { CommandsDisplay } from "./commands";
import { Logo } from "./logo";
import { UserInfo } from "./user-info";

export function Sidebar() {
  const { layout, sidebarCollapsed } = useUI();
  const { messages } = useChat();
  const { colors } = useTheme();

  const showCommands = messages.length > 0;

  if (sidebarCollapsed) {
    return (
      <box
        style={{
          width: 0,
          height: layout.height,
          backgroundColor: colors.bg2,
          flexDirection: "column",
        }}
      >
        <box style={{ paddingLeft: 1 }}>
          <text fg={colors.primary}>◆</text>
        </box>
        <box style={{ height: 1, backgroundColor: colors.border2 }} />
        <ChatList />
        <box style={{ flexGrow: 1 }} />
        <box style={{ height: 1, backgroundColor: colors.border2 }} />
        <UserInfo collapsed />
      </box>
    );
  }

  return (
    <box
      style={{
        width: layout.sidebarWidth,
        height: layout.height,
        backgroundColor: colors.bg2,
        flexDirection: "column",
      }}
    >
      {/* Header with Logo */}
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <Logo compact={layout.sidebarWidth < 28} />
      </box>

      {/* New Chat Button */}
      <box
        style={{
          marginLeft: 1,
          marginRight: 1,
          marginTop: 1,
          marginBottom: 1,
          height: 3,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <text fg={colors.bg1}>
          <strong>New Chat (n)</strong>
        </text>
      </box>

      {/* Section Header */}
      <box style={{ paddingLeft: 1, paddingRight: 1, marginBottom: 1, flexDirection: "row" }}>
        <text fg={colors.fg5}>HISTORY</text>
        <text fg={colors.fg4}> [↑↓]</text>
      </box>

      {/* Chat List */}
      <ChatList />

      {/* Commands or User Info */}
      <box />
      {showCommands ? (
        <CommandsDisplay compact />
      ) : (
        <box style={{ paddingLeft: 1, flexDirection: "row", minHeight: 2 }}>
          <text fg={colors.fg5}>[n]</text>
          <text fg={colors.fg4}> new </text>
          <text fg={colors.fg5}>[b]</text>
          <text fg={colors.fg4}> sidebar</text>
        </box>
      )}

      {/* User Info */}
      <box />
      <box style={{ minHeight: 3 }}>
        <UserInfo />
      </box>
    </box>
  );
}
