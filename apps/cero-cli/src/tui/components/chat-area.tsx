import type { AIModel, Message } from "../../types/tui.type"
import { ChatInput } from "./chat-input"
import { MessageList } from "./message-list"

interface ChatAreaProps {
  messages: Message[]
  chatTitle: string
  models: AIModel[]
  selectedModel: string
  onModelSelect: (modelId: string) => void
  modelSelectorOpen: boolean
  onToggleModelSelector: () => void
  onInputChange: (value: string) => void
  onSubmit: (value: string) => void
  inputFocused: boolean
  width: number
  height: number
  isNewChat?: boolean
  isLoading?: boolean
  isStreaming?: boolean
  isAuthenticated?: boolean
  error?: string | null
}

export function ChatArea({
  messages,
  chatTitle,
  models,
  selectedModel,
  onModelSelect,
  modelSelectorOpen,
  onToggleModelSelector,
  onInputChange,
  onSubmit,
  inputFocused,
  width,
  height,
  isNewChat,
  isLoading,
  isStreaming,
  isAuthenticated,
  error,
}: ChatAreaProps) {
  return (
    <box
      style={{
        width,
        height,
        backgroundColor: "#000000",
        flexDirection: "column",
        border: true,
        borderStyle: "single",
        borderColor: "#222222",
      }}
    >
      {/* Messages */}
      <MessageList
        messages={messages}
        chatTitle={chatTitle}
        isNewChat={isNewChat ?? false}
        isLoading={isLoading ?? false}
        isStreaming={isStreaming ?? false}
        isAuthenticated={isAuthenticated ?? true}
      />

      {/* Divider */}
      <box style={{ height: 1, backgroundColor: "#1a1a1a" }} />

      {/* Error display */}
      {error && (
        <box style={{ paddingLeft: 1, paddingRight: 1, backgroundColor: "#2a1515" }}>
          <text fg="#ff6666">⚠ {error}</text>
        </box>
      )}

      {/* Input Area */}
      <ChatInput
        models={models}
        selectedModel={selectedModel}
        onModelSelect={onModelSelect}
        modelSelectorOpen={modelSelectorOpen}
        onToggleModelSelector={onToggleModelSelector}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        focused={inputFocused}
        disabled={isLoading === true || isStreaming === true}
      />
    </box>
  )
}
