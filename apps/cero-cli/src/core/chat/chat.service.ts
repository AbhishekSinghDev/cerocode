import { ConfigService } from "@core/config/config.service";
import { tryCatch } from "@utils/error-handler.util";
import type { SupportedAIModelId, SupportedAIToolId } from "types/tui.type";

export interface ChatResponse {
  fullMessage: string;
  conversationId: string;
}

export class ChatService {
  private configService = ConfigService.getInstance();

  async run(
    message: string,
    authToken: string,
    aiModel: SupportedAIModelId,
    conversationId?: string,
    tools?: SupportedAIToolId[],
    onToken?: (token: string) => void,
    onInit?: (conversationId: string) => void
  ): Promise<ChatResponse> {
    const apiUrl = this.configService.apiUrl;

    const { data: response, error } = await tryCatch(
      fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message, conversationId, aiModel, tools }),
      })
    );

    if (error || !response) {
      throw new Error(error.message || "Failed to fetch chat response");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable");
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let fullMessage = "";
    let finalConversationId = conversationId || "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        break;
      }

      if (!value) {
        continue;
      }

      const decodedChunk = decoder.decode(value, { stream: true });
      buffer += decodedChunk;

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          continue;
        }

        try {
          const data = JSON.parse(trimmedLine);

          if (data.topic === "init" && data.data?.conversationId) {
            finalConversationId = data.data.conversationId;
            if (onInit) {
              onInit(finalConversationId);
            }
          } else if (data.topic === "token" && data.data) {
            if (onToken) {
              onToken(data.data);
            }
            fullMessage += data.data;
          } else if (data.topic === "done") {
            return { fullMessage, conversationId: finalConversationId };
          } else if (data.topic === "error") {
            throw new Error(data.data?.error || "Unknown error");
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    return {
      fullMessage: fullMessage || "Chat response completed.",
      conversationId: finalConversationId,
    };
  }

  async getConversations(authToken: string) {
    const apiUrl = this.configService.apiUrl;

    const { data: response, error } = await tryCatch(
      fetch(`${apiUrl}/api/conversations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
    );

    if (error || !response) {
      throw new Error(error?.message || "Failed to fetch conversations");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.status}`);
    }

    return response.json();
  }

  async getMessages(authToken: string, conversationId: string) {
    const apiUrl = this.configService.apiUrl;

    const { data: response, error } = await tryCatch(
      fetch(`${apiUrl}/api/conversations/${conversationId}/messages`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
    );

    if (error || !response) {
      throw new Error(error?.message || "Failed to fetch messages");
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.status}`);
    }

    return response.json();
  }
}
