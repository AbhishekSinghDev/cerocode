import type { ChatSession } from "../../types/tui.type"
import { ChatList } from "./chat-list"
import { CommandsDisplay } from "./commands"
import { Logo } from "./logo"
import { UserInfo } from "./user-info"

interface SidebarProps {
  chats: ChatSession[]
  selectedChat: string
  focusedChatIndex: number
  onSelectChat: (id: string) => void
  width: number
  height: number
  collapsed: boolean
  onToggleCollapse: () => void
  showCommands?: boolean
}

export function Sidebar({
  chats,
  selectedChat,
  focusedChatIndex,
  onSelectChat,
  width,
  height,
  collapsed,
  showCommands,
}: SidebarProps) {
  const collapsedWidth = 4

  if (collapsed) {
    return (
      <box
        style={{
          width: collapsedWidth,
          height,
          backgroundColor: "#0a0a0a",
          flexDirection: "column",
          borderStyle: "single",
          borderColor: "#1a1a1a",
          border: true,
        }}
      >
        <box style={{ paddingLeft: 1 }}>
          <text fg="#00ff88">◆</text>
        </box>
        <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />
        <ChatList chats={chats} selectedId={selectedChat} focusedIndex={focusedChatIndex} onSelect={onSelectChat} collapsed />
        <box style={{ flexGrow: 1 }} />
        <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />
        <UserInfo collapsed />
      </box>
    )
  }

  return (
    <box
      style={{
        width,
        height,
        backgroundColor: "#0a0a0a",
        flexDirection: "column",
        borderStyle: "single",
        borderColor: "#1a1a1a",
        border: true,
      }}
    >
      {/* Header with Logo */}
      <box style={{ paddingLeft: 1, paddingRight: 1 }}>
        <Logo compact={width < 28} />
      </box>

      {/* New Chat Button */}
      <box
        style={{
          marginLeft: 1,
          marginRight: 1,
          backgroundColor: "#00ff88",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <text fg="#000000">
          <strong>+ New Chat</strong>
        </text>
      </box>

      {/* Section Header */}
      <box style={{ paddingLeft: 1, paddingRight: 1, flexDirection: "row" }}>
        <text fg="#555555">HISTORY</text>
        <text fg="#444444"> [↑↓]</text>
      </box>

      {/* Chat List */}
      <ChatList chats={chats} selectedId={selectedChat} focusedIndex={focusedChatIndex} onSelect={onSelectChat} />

      {/* Commands or User Info */}
      <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      {showCommands ? (
        <CommandsDisplay compact />
      ) : (
        <box style={{ paddingLeft: 1, flexDirection: "row" }}>
          <text fg="#555555">[n]</text>
          <text fg="#444444"> new </text>
          <text fg="#555555">[b]</text>
          <text fg="#444444"> sidebar</text>
        </box>
      )}

      {/* User Info */}
      <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />
      <UserInfo />
    </box>
  )
}
