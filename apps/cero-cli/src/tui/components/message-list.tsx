import type { Message } from "../../types/tui.type"
import { CommandsDisplay } from "./commands"

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user"
  const isEmpty = !message.content || message.content.length === 0

  return (
    <box
      style={{
        marginLeft: isUser ? 2 : 0,
        marginRight: isUser ? 0 : 2,
        marginBottom: 1,
        paddingLeft: 1,
        paddingRight: 1,
        backgroundColor: isUser ? "#0d2818" : "#141414",
        borderColor: isUser ? "#00ff88" : isStreaming ? "#4488ff" : "#2a2a2a",
        borderStyle: "single",
        border: true,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        {/* Header */}
        <box style={{ flexDirection: "row" }}>
          <text fg={isUser ? "#00ff88" : "#888888"}>
            <strong>{isUser ? "You" : "◆ Cero"}</strong>
          </text>
          <text fg="#444444"> · {message.timestamp}</text>
          {isStreaming && (
            <text fg="#4488ff"> ● streaming</text>
          )}
        </box>
        {/* Content */}
        {!isEmpty && (<text fg="#e0e0e0">{message.content}</text>)}
      </box>
    </box>
  )
}

function LoadingIndicator() {
  return (
    <box
      style={{
        marginLeft: 0,
        marginRight: 2,
        marginBottom: 1,
        paddingLeft: 1,
        paddingRight: 1,
        backgroundColor: "#141414",
        borderColor: "#4488ff",
        borderStyle: "single",
        border: true,
      }}
    >
      <box style={{ flexDirection: "column" }}>
        <box style={{ flexDirection: "row" }}>
          <text fg="#888888">
            <strong>◆ Cero</strong>
          </text>
          <text fg="#4488ff"> ● thinking...</text>
        </box>
        <text fg="#666666">Processing your request...</text>
      </box>
    </box>
  )
}

function AuthWarning() {
  return (
    <box
      style={{
        margin: 1,
        padding: 1,
        backgroundColor: "#2a2015",
        borderColor: "#ffaa44",
        borderStyle: "single",
        border: true,
        alignItems: "center",
      }}
    >
      <box style={{ flexDirection: "column", alignItems: "center" }}>
        <text fg="#ffaa44">
          <strong>⚠ Authentication Required</strong>
        </text>
        <text fg="#888888">Run 'cero login' in your terminal to authenticate</text>
      </box>
    </box>
  )
}

interface MessageListProps {
  messages: Message[]
  chatTitle: string
  isNewChat?: boolean
  isLoading?: boolean
  isStreaming?: boolean
  isAuthenticated?: boolean
}

export function MessageList({
  messages,
  chatTitle,
  isNewChat,
  isLoading,
  isStreaming,
  isAuthenticated,
}: MessageListProps) {
  const showCommands = isNewChat && messages.length === 0

  return (
    <box style={{ flexDirection: "column", flexGrow: 1 }}>
      {/* Chat Header */}
      <box
        style={{
          paddingLeft: 1,
          paddingRight: 1,
          backgroundColor: "#0a0a0a",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <text fg="#00ff88">
          <strong>◆</strong>
        </text>
        <text fg="#ffffff">
          {" "}
          <strong>{chatTitle}</strong>
        </text>
        {isAuthenticated === false && (
          <text fg="#ff6666"> [Not Authenticated]</text>
        )}
        {isAuthenticated === true && (
          <text fg="#00ff88"> [Connected]</text>
        )}
      </box>

      {/* Divider */}
      <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />

      {/* Messages or Commands */}
      {showCommands ? (
        <>
          {isAuthenticated === false && <AuthWarning />}
          <CommandsDisplay showFull />
        </>
      ) : (
        <scrollbox
          stickyScroll
          stickyStart="bottom"
          style={{
            flexGrow: 1,
            rootOptions: { backgroundColor: "#000000" },
            wrapperOptions: { backgroundColor: "#000000" },
            viewportOptions: { backgroundColor: "#000000" },
            contentOptions: { backgroundColor: "#000000", paddingTop: 1 },
            scrollbarOptions: {
              showArrows: false,
              trackOptions: {
                foregroundColor: "#00ff88",
                backgroundColor: "#1a1a1a",
              },
            },
          }}
        >
          {messages.map((msg, idx) => {
            // Check if this is the last assistant message (potentially streaming)
            const isLastAssistant =
              msg.role === "assistant" && idx === messages.length - 1 && isStreaming === true

            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isStreaming={isLastAssistant}
              />
            )
          })}
          {/* Show loading indicator when waiting for first token */}
          {isLoading && <LoadingIndicator />}
        </scrollbox>
      )}
    </box>
  )
}
