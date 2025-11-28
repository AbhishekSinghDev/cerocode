import { useKeyboard } from "@opentui/react";
import { AI_MODELS } from "@tui/context/ui-context";
import { useChat } from "@tui/hooks/use-chat";
import { useConversations } from "@tui/hooks/use-conversations";
import { useTheme } from "@tui/hooks/use-theme";
import { useUI } from "@tui/hooks/use-ui";

export function KeyboardHandler() {
  const {
    modelSelectorOpen,
    inputFocused,
    focusMode,
    sidebarCollapsed,
    focusedChatIndex,
    toggleModelSelector,
    toggleSidebar,
    setSelectedModel,
    focusChat,
    focusSidebar,
    setFocusedChatIndex,
    resetForNewChat,
  } = useUI();

  const { conversations } = useConversations();
  const { openChat, startNewChat } = useChat();
  const { nextTheme } = useTheme();

  useKeyboard((key) => {
    // Theme cycling - Ctrl+T (or Cmd+T on macOS)
    if (key.name === "t" && (key.ctrl || key.meta)) {
      nextTheme();
      return;
    }

    // Escape - close model selector or exit
    if (key.name === "escape") {
      if (modelSelectorOpen) {
        toggleModelSelector();
        return;
      }
      process.exit(0);
    }

    // New chat shortcut
    if (key.name === "n" && !inputFocused) {
      startNewChat();
      resetForNewChat();
      return;
    }

    // Toggle sidebar
    if (key.name === "b" && !inputFocused) {
      toggleSidebar();
      return;
    }

    // Toggle model selector
    if (key.name === "m" && inputFocused) {
      toggleModelSelector();
      return;
    }

    // Model selection by number
    if (modelSelectorOpen && key.name && /^[1-5]$/.test(key.name)) {
      const idx = Number.parseInt(key.name, 10) - 1;
      const model = AI_MODELS[idx];
      if (model) {
        setSelectedModel(model.id);
      }
      return;
    }

    // Tab - switch focus between sidebar and chat
    if (key.name === "tab") {
      if (focusMode === "chat") {
        focusSidebar();
      } else {
        focusChat();
      }
      return;
    }

    // Sidebar navigation
    if (focusMode === "sidebar" && !sidebarCollapsed) {
      if (key.name === "up" || key.name === "k") {
        setFocusedChatIndex((prev) => Math.max(0, prev - 1));
        return;
      }
      if (key.name === "down" || key.name === "j") {
        setFocusedChatIndex((prev) => Math.min(conversations.length - 1, prev + 1));
        return;
      }
      if (key.name === "return") {
        const conversation = conversations[focusedChatIndex];
        if (conversation) {
          openChat(conversation);
          focusChat();
        }
        return;
      }
    }
  });

  return null;
}
