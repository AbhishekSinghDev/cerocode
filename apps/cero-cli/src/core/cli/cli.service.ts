import { ME } from "@core/config/constants";
import chalk from "chalk";
import { program } from "commander";
import figlet from "figlet";

import { setupAuthCommands } from "@cli/commands/auth.command";
import { setupChatCommands } from "@cli/commands/chat.command";

import PackageJson from "../../../package.json" assert { type: "json" };

export class CLIService {
  constructor() {
    this.displayBanner();
    this.setupCommands();
  }

  private displayBanner(): void {
    console.log(
      chalk.cyan(figlet.textSync("CERO", { horizontalLayout: "full" }))
    );
    console.log(chalk.gray("─".repeat(50)));
    console.log(
      chalk.white.bold("AI-Powered CLI") +
        chalk.gray(" • Built by ") +
        chalk.cyan.underline(ME.name)
    );
    console.log(chalk.gray("─".repeat(50)));
  }

  private setupCommands(): void {
    program
      .name("cero")
      .version(PackageJson.version, "-v, --version", "Display version number")
      .description("AI-powered CLI with chat and agent capabilities")
      .helpOption("-h, --help", "Display help information")
      .showHelpAfterError("(add --help for additional information)")
      .showSuggestionAfterError();

    // Setup command groups
    setupAuthCommands(program);
    setupChatCommands(program);

    // Exit command
    program
      .command("exit")
      .description("Exit the Cero CLI gracefully")
      .action(() => {
        console.log(chalk.cyan("Thanks for using Cero! 👋"));
        process.exit(0);
      });
  }

  async run(): Promise<void> {
    await program.parseAsync(process.argv);
  }
}
