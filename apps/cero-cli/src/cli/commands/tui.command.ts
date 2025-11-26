import { startTUI } from "@tui/bootstrap";
import type { Command } from "commander";

export function setupTuiCommands(program: Command) {
    program
        .command("interactive")
        .alias("i")
        .description("Start the interactive TUI mode")
        .action(async () => {
            await startTUI();
        });
}
