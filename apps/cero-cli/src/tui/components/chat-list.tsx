import type { ChatSession } from "../../types/tui.type"

interface ChatListProps {
  chats: ChatSession[]
  selectedId: string
  focusedIndex: number
  onSelect: (id: string) => void
  collapsed?: boolean
}

export function ChatList({ chats, selectedId, focusedIndex, collapsed }: ChatListProps) {
  if (collapsed) {
    return (
      <box style={{ flexDirection: "column", flexGrow: 1 }}>
        {chats.slice(0, 8).map((chat, idx) => (
          <box
            key={chat.id}
            style={{
              paddingLeft: 1,
              paddingRight: 1,
              backgroundColor: selectedId === chat.id ? "#1a3a2a" : idx === focusedIndex ? "#1a1a2a" : "transparent",
            }}
          >
            <text fg={selectedId === chat.id ? "#00ff88" : "#888888"}>{chat.title.charAt(0)}</text>
          </box>
        ))}
      </box>
    )
  }

  return (
    <scrollbox
      style={{
        flexGrow: 1,
        rootOptions: { backgroundColor: "#0a0a0a" },
        wrapperOptions: { backgroundColor: "#0a0a0a" },
        viewportOptions: { backgroundColor: "#0a0a0a" },
        contentOptions: { backgroundColor: "#0a0a0a" },
        scrollbarOptions: {
          showArrows: false,
          trackOptions: {
            foregroundColor: "#00ff88",
            backgroundColor: "#1a1a1a",
          },
        },
      }}
    >
      {chats.map((chat, idx) => {
        const isSelected = selectedId === chat.id
        const isFocused = idx === focusedIndex

        return (
          <box
            key={chat.id}
            style={{
              paddingLeft: 1,
              paddingRight: 1,
              paddingTop: 0,
              paddingBottom: 0,
              marginBottom: 0,
              backgroundColor: isSelected ? "#0d2818" : isFocused ? "#141428" : "transparent",
              borderColor: isSelected ? "#00ff88" : isFocused ? "#4444ff" : "transparent",
              borderStyle: "single",
              border: isSelected || isFocused,
            }}
          >
            <box style={{ flexDirection: "column" }}>
              <box style={{ flexDirection: "row" }}>
                <text fg={isSelected ? "#00ff88" : isFocused ? "#8888ff" : "#cccccc"}>
                  {isSelected ? "● " : isFocused ? "› " : "  "}
                </text>
                <text fg={isSelected ? "#00ff88" : "#ffffff"}>{chat.title}</text>
                <text fg="#444444"> {chat.timestamp}</text>
              </box>
              <text fg="#555555">{"  "}{chat.lastMessage.length > 25 ? chat.lastMessage.slice(0, 25) + "…" : chat.lastMessage}</text>
            </box>
          </box>
        )
      })}
    </scrollbox>
  )
}
