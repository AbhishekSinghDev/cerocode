import { useKeyboard, useTerminalDimensions } from "@opentui/react"
import { useState } from "react"

import type { Message } from "../types/tui.type"
import { ChatArea } from "./components/chat-area"
import { Sidebar } from "./components/sidebar"
import { useChat } from "./hooks/use-chat"
import { getMessagesForChat, mockChatHistory, mockModels } from "./mock-data"

export function App() {
  const { width, height } = useTerminalDimensions()

  const {
    messages,
    isLoading,
    isStreaming,
    error,
    isAuthenticated,
    authChecked,
    sendMessage,
    clearMessages,
    setMessages,
  } = useChat()

  // Sidebar state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedChat, setSelectedChat] = useState<string | null>(null) // null = new chat
  const [focusedChatIndex, setFocusedChatIndex] = useState(-1) // -1 = no focus on history

  // UI state
  const [inputFocused, setInputFocused] = useState(true)

  // Model selector state
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)

  // Focus mode: "sidebar" | "chat"
  const [focusMode, setFocusMode] = useState<"sidebar" | "chat">("chat")

  // Layout calculations
  const sidebarWidth = sidebarCollapsed ? 4 : Math.max(28, Math.floor(width * 0.22))
  const chatWidth = width - sidebarWidth

  // Get current chat title
  const currentChat = selectedChat ? mockChatHistory.find((c) => c.id === selectedChat) : null
  const chatTitle = currentChat?.title ?? "New Chat"
  const isNewChat = selectedChat === null

  // Determine if we should show commands in sidebar (when chat has messages)
  const showCommandsInSidebar = messages.length > 0

  useKeyboard((key) => {
    // Exit
    if (key.name === "escape") {
      if (modelSelectorOpen) {
        setModelSelectorOpen(false)
        return
      }
      process.exit(0)
    }

    // New chat shortcut (works globally)
    if (key.name === "n" && !inputFocused) {
      setSelectedChat(null)
      clearMessages()
      setFocusedChatIndex(-1)
      setFocusMode("chat")
      setInputFocused(true)
      return
    }

    // Toggle sidebar
    if (key.name === "b" && !inputFocused) {
      setSidebarCollapsed((prev) => !prev)
      return
    }

    // Toggle model selector
    if (key.name === "m" && inputFocused) {
      setModelSelectorOpen((prev) => !prev)
      return
    }

    // Model selection with number keys
    if (modelSelectorOpen && key.name && /^[1-5]$/.test(key.name)) {
      const idx = Number.parseInt(key.name) - 1
      if (mockModels[idx]) {
        setSelectedModel(mockModels[idx].id)
        setModelSelectorOpen(false)
      }
      return
    }

    // Tab to switch focus between sidebar and chat
    if (key.name === "tab") {
      if (focusMode === "chat") {
        setFocusMode("sidebar")
        setInputFocused(false)
        if (focusedChatIndex === -1 && mockChatHistory.length > 0) {
          setFocusedChatIndex(0)
        }
      } else {
        setFocusMode("chat")
        setInputFocused(true)
      }
      return
    }

    // Navigate chat history when sidebar focused
    if (focusMode === "sidebar" && !sidebarCollapsed) {
      if (key.name === "up" || key.name === "k") {
        setFocusedChatIndex((prev) => Math.max(0, prev - 1))
        return
      }
      if (key.name === "down" || key.name === "j") {
        setFocusedChatIndex((prev) => Math.min(mockChatHistory.length - 1, prev + 1))
        return
      }
      if (key.name === "return") {
        const chat = mockChatHistory[focusedChatIndex]
        if (chat) {
          setSelectedChat(chat.id)
          setMessages(getMessagesForChat(chat.id))
          setFocusMode("chat")
          setInputFocused(true)
        }
        return
      }
    }
  })

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return

    if (isLoading || isStreaming) return

    if (!isAuthenticated) {
      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: "⚠ Not authenticated. Please run 'cero login' in your terminal first.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, errorMessage])
      return
    }

    await sendMessage(value)
  }

  if (!authChecked) {
    return (
      <box
        style={{
          width,
          height,
          backgroundColor: "#000000",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <text fg="#00ff88">◆ Initializing CEROCODE...</text>
      </box>
    )
  }

  return (
    <box
      style={{
        width,
        height,
        backgroundColor: "#000000",
        flexDirection: "row",
      }}
    >
      <Sidebar
        chats={mockChatHistory}
        selectedChat={selectedChat ?? ""}
        focusedChatIndex={focusedChatIndex}
        onSelectChat={(id) => {
          setSelectedChat(id)
          setMessages(getMessagesForChat(id))
        }}
        width={sidebarWidth}
        height={height}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        showCommands={showCommandsInSidebar}
      />
      <ChatArea
        messages={messages}
        chatTitle={chatTitle}
        models={mockModels}
        selectedModel={selectedModel}
        onModelSelect={setSelectedModel}
        modelSelectorOpen={modelSelectorOpen}
        onToggleModelSelector={() => setModelSelectorOpen((prev) => !prev)}
        onInputChange={() => {}}
        onSubmit={handleSubmit}
        inputFocused={inputFocused}
        width={chatWidth}
        height={height}
        isNewChat={isNewChat && messages.length === 0}
        isLoading={isLoading}
        isStreaming={isStreaming}
        isAuthenticated={isAuthenticated}
        error={error}
      />
    </box>
  )
}
