import { useCallback } from "react";
import { ChatArea } from "./components/chat-area";
import { InitializingScreen } from "./components/initializing-screen";
import { KeyboardHandler } from "./components/keyboard-handler";
import { Sidebar } from "./components/sidebar";
import { ThemeIndicator } from "./components/theme-indicator";
import { UnauthorizedScreen } from "./components/unauthorized-screen";
import { AuthProvider } from "./context/auth-context";
import { ChatProvider } from "./context/chat-context";
import { ConversationsProvider } from "./context/conversations-context";
import { ThemeProvider } from "./context/theme-context";
import { UIProvider } from "./context/ui-context";
import { useAuth } from "./hooks/use-auth";
import { useChat } from "./hooks/use-chat";
import { useConversations } from "./hooks/use-conversations";
import { useTheme } from "./hooks/use-theme";
import { useUI } from "./hooks/use-ui";

function AppContent() {
  const { layout } = useUI();
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { colors, showThemeIndicator } = useTheme();

  if (authLoading) {
    return <InitializingScreen />;
  }

  if (!isAuthenticated) {
    return <UnauthorizedScreen />;
  }

  return (
    <box
      style={{
        width: layout.width,
        height: layout.height,
        backgroundColor: colors.bg1,
        flexDirection: "row",
      }}
    >
      <KeyboardHandler />
      <Sidebar />
      <ChatArea />
      <ThemeIndicator show={showThemeIndicator} />
    </box>
  );
}

function AppWithChat() {
  const { isSending, isStreaming } = useChat();

  return (
    <UIProvider isLoading={isSending} isStreaming={isStreaming}>
      <AppContent />
    </UIProvider>
  );
}

function AppWithProviders() {
  const { refresh } = useConversations();

  // Refresh conversations list when a new conversation is created
  const handleNewConversation = useCallback(() => {
    refresh();
  }, [refresh]);

  return (
    <ChatProvider onNewConversation={handleNewConversation}>
      <AppWithChat />
    </ChatProvider>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ConversationsProvider>
          <AppWithProviders />
        </ConversationsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
