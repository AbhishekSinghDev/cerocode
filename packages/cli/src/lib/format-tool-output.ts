import type { Message } from "../hooks/use-chat";

export type ClientMessagePart = Message["parts"][number];
export type ToolPart = Extract<
  ClientMessagePart,
  { type: `tool-${string}` | "dynamic-tool" }
>;

export const FILE_EDIT_TOOLS = new Set(["writeFile", "editFile"]);

export const MAX_OUTPUT_LINES = 8;
export const MAX_LINE_LENGTH = 160;

export function formatToolName(name: string) {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
}

export function isToolPart(part: ClientMessagePart): part is ToolPart {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-");
}

export function formatOutputLines(output: unknown): string[] {
  if (output == null) return [];

  if (typeof output === "string") {
    return output.split("\n");
  }

  if (Array.isArray(output)) {
    return output.map((item) =>
      item != null && typeof item === "object"
        ? JSON.stringify(item)
        : String(item),
    );
  }

  if (typeof output === "object") {
    const obj = output as Record<string, unknown>;

    if (typeof obj.stdout === "string" || typeof obj.stderr === "string") {
      const lines = [
        ...(typeof obj.stdout === "string" && obj.stdout.trim()
          ? obj.stdout.trim().split("\n")
          : []),
        ...(typeof obj.stderr === "string" && obj.stderr.trim()
          ? obj.stderr
              .trim()
              .split("\n")
              .map((l) => `stderr: ${l}`)
          : []),
      ];
      if (obj.exitCode != null && obj.exitCode !== 0) {
        lines.push(`exit code: ${String(obj.exitCode)}`);
      }
      if (lines.length === 0 && obj.exitCode === 0) lines.push("ok");
      return lines;
    }

    if (typeof obj.content === "string") {
      const lines = obj.content.split("\n");
      if (obj.truncated === true) {
        lines.push(
          `... truncated${typeof obj.totalLength === "number" ? `, ${obj.totalLength} total chars` : ""}`,
        );
      }
      return lines;
    }

    if (Array.isArray(obj.entries)) {
      const header = typeof obj.path === "string" && obj.path ? obj.path : ".";
      const entries = (obj.entries as { name?: string; type?: string }[]).map(
        (entry) =>
          entry?.type === "directory" ? `${entry.name}/` : (entry?.name ?? ""),
      );
      if (entries.length === 0) return [header];
      return [header, ...entries];
    }

    if (Array.isArray(obj.files)) {
      const lines = (obj.files as string[]).slice();
      if (obj.truncated === true) lines.push("... truncated");
      return lines;
    }

    if (Array.isArray(obj.matches)) {
      const lines = (
        obj.matches as { file?: string; line?: number; content?: string }[]
      ).map((match) => `${match.file}:${match.line}: ${match.content}`);
      if (typeof obj.messages === "string") lines.unshift(obj.messages);
      if (obj.truncated === true && typeof obj.totalMatches === "number") {
        lines.push(`... truncated, ${obj.totalMatches} total matches`);
      }
      return lines;
    }

    if (obj.success === true) {
      if (typeof obj.bytesWritten === "number") {
        return [`Wrote ${obj.bytesWritten} bytes to ${String(obj.path)}`];
      }
      return [`Edited ${String(obj.path)}`];
    }

    return JSON.stringify(obj, null, 0).split("\n");
  }

  return [String(output)];
}

export function capOutputLines(lines: string[]) {
  const capped = lines.map((line) =>
    line.length > MAX_LINE_LENGTH
      ? `${line.slice(0, MAX_LINE_LENGTH - 3)}...`
      : line,
  );

  if (capped.length <= MAX_OUTPUT_LINES) {
    return { lines: capped, omitted: 0 };
  }

  const omitted = capped.length - (MAX_OUTPUT_LINES - 1);
  return { lines: capped.slice(0, MAX_OUTPUT_LINES - 1), omitted };
}

export function formatToolArgs(tc: ToolPart, toolName: string): string {
  if (!("input" in tc) || tc.input == null) return "";
  if (typeof tc.input !== "object") return String(tc.input);
  // For file edits the args are shown as a diff instead, so just surface
  // the path here rather than dumping the whole content/oldString/newString
  // inline as text.
  if (FILE_EDIT_TOOLS.has(toolName)) {
    const path = (tc.input as { path?: unknown }).path;
    return typeof path === "string" ? path : "";
  }
  return Object.values(tc.input).map(String).join(" ");
}