import { CLIService } from "@core/cli/cli.service";

process.on("unhandledRejection", (e) => {
    console.error("Unhandled Promise Rejection:", e);
    process.exit(0);
});

process.on("uncaughtException", (e) => {
    console.error("Uncaught Exception:", e);
    process.exit(0);
});

async function main() {
    const cli = new CLIService();
    await cli.run();
}

main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(0);
});
