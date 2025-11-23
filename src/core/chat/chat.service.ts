import { ConfigService } from "@core/config/config.service";
import { tryCatch } from "@utils/error-handler.util";

export class ChatService {
  private configService = ConfigService.getInstance();

  async run(
    message: string,
    authToken: string,
    onToken?: (token: string) => void
  ): Promise<string> {
    const apiUrl = this.configService.apiUrl;

    const { data: response, error } = await tryCatch(
      fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ message }),
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

          if (data.topic === "token" && data.data) {
            if (onToken) {
              onToken(data.data);
            }
            fullMessage += data.data;
          } else if (data.topic === "done") {
            return fullMessage;
          } else if (data.topic === "error") {
            throw new Error(data.data?.error || "Unknown error");
          }
        } catch (e) {
          if (e instanceof SyntaxError) continue;
          throw e;
        }
      }
    }

    return fullMessage || "Chat response completed.";
  }
}
