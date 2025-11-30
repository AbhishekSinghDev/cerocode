import { ChatService } from "@core/chat/chat.service";
import type {
  ConversationsResponse,
  MessagesResponse,
  SupportedAIModelId,
  SupportedAIToolId,
} from "../../types/tui.type";

const chatService = new ChatService();

export async function fetchConversationsList(token: string): Promise<ConversationsResponse> {
  return await chatService.getConversations(token);
}

export async function fetchConversationMessages(
  token: string,
  conversationId: string
): Promise<MessagesResponse> {
  return await chatService.getMessages(token, conversationId);
}

export async function sendChatMessage(
  content: string,
  token: string,
  aiModel: SupportedAIModelId,
  conversationId: string | undefined,
  tools: SupportedAIToolId[] | undefined,
  onToken: (tokenText: string) => void,
  onInit: (conversationId: string) => void
) {
  return await chatService.run(
    content,
    token,
    aiModel,
    conversationId,
    tools,
    onToken,
    onInit
  );
}
