import { tool } from "ai";
import z from "zod";

export const Mode = {
  BUILD: "BUILD",
  PLAN: "PLAN",
} as const;

export const modeSchema = z.enum([Mode.BUILD, Mode.PLAN]);

export type ModeType = (typeof Mode)[keyof typeof Mode];

export const toolInputSchemas = {
  readFile: z.object({
    path: z.string().describe("Relative path to the file to read"),
  }),
  listDirectory: z.object({
    path: z
      .string()
      .default(".")
      .describe("Relative path to the directory to list"),
  }),
  glob: z.object({
    pattern: z.string().describe("Glob pattern to match files"),
    path: z.string().default(".").describe("Directory to search from"),
  }),
  grep: z.object({
    pattern: z.string().describe("Regex pattern to search for"),
    path: z.string().default(".").describe("Directory to search from"),
    include: z
      .string()
      .optional()
      .describe("Optional glob pattern to include files in the search"),
  }),
  writeFile: z.object({
    path: z.string().describe("Relative path to the file to write"),
    content: z.string().describe("Content to write to the file"),
  }),
  editFile: z.object({
    path: z.string().describe("Relative path to the file to edit"),
    oldString: z
      .string()
      .describe("Exact text to replace must be unique in the file"),
    newString: z.string().describe("New text to replace the old text with"),
  }),
  bash: z.object({
    command: z.string().describe("Command to execute in the shell"),
    description: z
      .string()
      .optional()
      .describe("Short description of the command"),
    timeout: z
      .number()
      .optional()
      .describe("Timeout in milliseconds for the command to complete"),
  }),
} as const;

export const readOnlyToolContracts = {
  readFile: tool({
    description: "Read a file from the current project directory",
    inputSchema: toolInputSchemas.readFile,
  }),
  listDirectory: tool({
    description: "List files in a directory from the current project directory",
    inputSchema: toolInputSchemas.listDirectory,
  }),
  glob: tool({
    description:
      "Find files matching a glob pattern in the current project directory",
    inputSchema: toolInputSchemas.glob,
  }),
  grep: tool({
    description:
      "Search for a regex pattern in files from the current project directory",
    inputSchema: toolInputSchemas.grep,
  }),
} as const;

export const buildToolContracts = {
  ...readOnlyToolContracts,
  writeFile: tool({
    description:
      "Create or overwrite a file under the current project directory",
    inputSchema: toolInputSchemas.writeFile,
  }),
  editFile: tool({
    description:
      "Replace exact text in a file under the current project directory",
    inputSchema: toolInputSchemas.editFile,
  }),
  bash: tool({
    description: "Run a shell command in the current project directory",
    inputSchema: toolInputSchemas.bash,
  }),
} as const;

export type ToolContracts = typeof buildToolContracts;

export function getToolContracts(mode: ModeType) {
  switch (mode) {
    case "BUILD":
      return buildToolContracts;
    case "PLAN":
      return readOnlyToolContracts;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
}
