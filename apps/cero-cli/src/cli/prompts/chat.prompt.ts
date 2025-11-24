import type { AuthService } from "@core/auth/auth.service";
import type { ChatService } from "@core/chat/chat.service";
import { tryCatch } from "@utils/error-handler.util";
import boxen from "boxen";
import chalk from "chalk";
import ora from "ora";

export async function chatPrompt(
  chatService: ChatService,
  authService: AuthService,
  message: string
): Promise<void> {
  const isAuthenticated = await authService.isAuthenticated();
  const authToken = await authService.getTokens();

  if (!isAuthenticated || !authToken) {
    console.log(chalk.red("✖ Authentication required"));
    console.log(chalk.dim("Run 'cero login' to authenticate."));
    process.exit(1);
  }

  console.clear();
  console.log(chalk.cyan.bold("\n💬 Chat\n"));

  console.log(
    boxen(message, {
      title: "You",
      titleAlignment: "left",
      padding: 1,
      borderColor: "blue",
      borderStyle: "round",
    })
  );

  const spinner = ora({
    text: chalk.dim("Thinking..."),
    color: "cyan",
  }).start();

  const now = Date.now();
  let isFirstToken = true;

  const { data: response, error } = await tryCatch(
    chatService.run(message, authToken.access_token, (token) => {
      if (isFirstToken) {
        spinner.stopAndPersist({
          symbol: chalk.green("✔"),
          text: chalk.green.dim(`Thought for ${Date.now() - now}ms`),
        });
        process.stdout.write(chalk.magenta.bold("\nAssistant:\n"));
        isFirstToken = false;
      }
      process.stdout.write(token);
    })
  );

  if (error) {
    if (isFirstToken) {
      spinner.fail(chalk.red("Failed"));
    } else {
      process.stdout.write(chalk.red("\n✖ Failed\n"));
    }
    console.error(chalk.red(`Error: ${error.message}`));
    console.log(chalk.dim("Chat session ended."));
    process.exit(1);
  }

  console.log(chalk.dim("\n\nChat session completed."));
  process.exit(0);
}
