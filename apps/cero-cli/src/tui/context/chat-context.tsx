import { createContext, type ReactNode, useCallback, useMemo, useRef, useState } from "react";
import type {
  ActiveChat,
  ApiMessage,
  ChatContextValue,
  ChatState,
  Conversation,
  SupportedAIModelId,
  SupportedAIToolId,
} from "../../types/tui.type";
import { fetchConversationMessages, sendChatMessage } from "../actions/conversations";
import { useAuth } from "../hooks/use-auth";

export const ChatContext = createContext<ChatContextValue | null>(null);

interface ChatProviderProps {
  children: ReactNode;
  onNewConversation?: (conversationId: string) => void;
}

export function ChatProvider({ children, onNewConversation }: ChatProviderProps) {
  const { isAuthenticated, getToken } = useAuth();

  // Using ref to store active conversation ID to avoid stale closure issues
  const activeConversationRef = useRef<string | null>(null);

  const [activeChat, setActiveChat] = useState<ActiveChat>({
    conversationId: null,
    conversation: null,
  });

  const [state, setState] = useState<ChatState>({
    messages: [],
    messagesLoading: false,
    isSending: false,
    isStreaming: false,
    error: null,
  });

  // Keep ref in sync with state
  activeConversationRef.current = activeChat.conversationId;

  const openChat = useCallback(
    async (conversation: Conversation) => {
      if (!isAuthenticated) return;

      const token = await getToken();
      if (!token) return;

      // Set active conversation immediately
      setActiveChat({
        conversationId: conversation.id,
        conversation,
      });

      setState((prev) => ({
        ...prev,
        messages: [],
        messagesLoading: true,
        error: null,
      }));

      try {
        const response = await fetchConversationMessages(token, conversation.id);
        setState((prev) => ({
          ...prev,
          messages: response.messages,
          messagesLoading: false,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Failed to load messages",
          messagesLoading: false,
        }));
      }
    },
    [getToken, isAuthenticated]
  );

  const startNewChat = useCallback(() => {
    setActiveChat({
      conversationId: null,
      conversation: null,
    });
    setState({
      messages: [],
      messagesLoading: false,
      isSending: false,
      isStreaming: false,
      error: null,
    });
  }, []);

  const sendMessage = useCallback(
    async (
      content: string,
      aiModel: SupportedAIModelId,
      tools?: SupportedAIToolId[]
    ): Promise<{ conversationId: string | null }> => {
      if (!content.trim() || !isAuthenticated) {
        return { conversationId: activeConversationRef.current };
      }

      const token = await getToken();
      if (!token) {
        return { conversationId: activeConversationRef.current };
      }

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Add user message immediately
      const userMessage: ApiMessage = {
        id: `msg_${Date.now()}_user`,
        role: "user",
        content,
        timestamp,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isSending: true,
        error: null,
      }));

      const assistantMessageId = `msg_${Date.now()}_assistant`;
      let hasReceivedToken = false;

      // Use ref to get current conversation ID (avoids stale closure)
      const conversationId = activeConversationRef.current;

      try {
        const result = await sendChatMessage(
          content,
          token,
          aiModel,
          conversationId ?? undefined,
          tools,
          // On token received
          (tokenText) => {
            if (!hasReceivedToken) {
              hasReceivedToken = true;
              const assistantMessage: ApiMessage = {
                id: assistantMessageId,
                role: "assistant",
                content: tokenText,
                timestamp,
              };
              setState((prev) => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                isSending: false,
                isStreaming: true,
              }));
            } else {
              setState((prev) => ({
                ...prev,
                messages: prev.messages.map((msg) =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: msg.content + tokenText }
                    : msg
                ),
              }));
            }
          },
          // On init (new conversation created by API)
          (newConversationId) => {
            // Only update if this was a new chat
            if (!conversationId) {
              activeConversationRef.current = newConversationId;
              setActiveChat((prev) => ({
                ...prev,
                conversationId: newConversationId,
              }));
              // Notify parent to refresh conversations list
              onNewConversation?.(newConversationId);
            }
          }
        );

        setState((prev) => ({
          ...prev,
          isStreaming: false,
        }));

        return { conversationId: result.conversationId || conversationId };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to send message";

        setState((prev) => {
          const updatedMessages = !hasReceivedToken
            ? [
                ...prev.messages,
                {
                  id: assistantMessageId,
                  role: "assistant" as const,
                  content: `Error: ${errorMessage}`,
                  timestamp,
                },
              ]
            : prev.messages.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: `${msg.content}\n\nError: ${errorMessage}` }
                  : msg
              );

          return {
            ...prev,
            error: errorMessage,
            messages: updatedMessages,
            isSending: false,
            isStreaming: false,
          };
        });

        return { conversationId };
      }
    },
    [getToken, isAuthenticated, onNewConversation]
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo<ChatContextValue>(
    () => ({
      messages: state.messages,
      messagesLoading: state.messagesLoading,
      isSending: state.isSending,
      isStreaming: state.isStreaming,
      error: state.error,

      activeConversationId: activeChat.conversationId,
      activeConversation: activeChat.conversation,
      chatTitle: activeChat.conversation?.shortTitle ?? "New Chat",
      isNewChat: activeChat.conversationId === null && state.messages.length === 0,
      isLoading: state.isSending || state.messagesLoading,

      openChat,
      startNewChat,
      sendMessage,
      clearError,
    }),
    [state, activeChat, openChat, startNewChat, sendMessage, clearError]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
