import * as clack from "@clack/prompts";
import chalk from "chalk";
import { ConfigService } from "../core/config/config.service";
import type { Result } from "../types/util.type";

const configService = ConfigService.getInstance();

export function handleError(error: Error, context?: string): never {
  const message = context ? `${context}: ${error.message}` : error.message;
  clack.log.error(chalk.red(message));

  if (configService.isDevelopment) {
    console.error(error.stack);
  }

  process.exit(1);
}

export async function tryCatch<T, E = Error>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as E };
  }
}
