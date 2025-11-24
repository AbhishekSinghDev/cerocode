import { chatPrompt } from "@cli/prompts/chat.prompt";
import { AuthService } from "@core/auth/auth.service";
import { ChatService } from "@core/chat/chat.service";
import type { Command } from "commander";

export function setupChatCommands(program: Command) {
  const authService = new AuthService();
  const chatService = new ChatService();

  program
    .command("chat <message>")
    .description("Start a chat session with Cero")
    .action(async (message: string) => {
      await chatPrompt(chatService, authService, message);
    });
}
