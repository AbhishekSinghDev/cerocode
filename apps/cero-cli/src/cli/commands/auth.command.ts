import { loginPrompt, logoutPrompt } from "@cli/prompts/auth.prompts";
import { AuthService } from "@core/auth/auth.service";
import { Command } from "commander";

export function setupAuthCommands(program: Command): void {
  const authService = new AuthService();

  program
    .command("login")
    .description("Authenticate with Cero using device authorization flow")
    .action(async () => {
      await loginPrompt(authService);
    });

  program
    .command("logout")
    .description("Logout from Cero")
    .action(async () => {
      await logoutPrompt(authService);
    });
}
