#!/usr/bin/env node

import { CLIService } from "@core/cli/cli.service";

async function main() {
  const cli = new CLIService();
  await cli.run();
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
