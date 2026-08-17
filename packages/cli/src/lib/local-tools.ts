import { Mode, toolInputSchemas, type ModeType } from "@cerocode/shared";
import {
  mkdir,
  readdir,
  readFile,
  realpath,
  stat,
  writeFile,
} from "fs/promises";
import { basename, dirname, isAbsolute, join, relative, resolve } from "path";
import { setDiffSnapshot } from "./diff-cache";

const MAX_FILE_SIZE = 10_000;
const MAX_RESULTS = 200;
const MAX_MATCHES = 50;
const MAX_OUTPUT = 20_000;
const DEFAULT_TIMEOUT = 30_000;

async function resolveRealPath(target: string): Promise<string> {
  try {
    return await realpath(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    const parent = dirname(target);
    if (parent === target) throw error;
    const realParent = await resolveRealPath(parent);
    return join(realParent, basename(target));
  }
}

function isInside(parent: string, child: string) {
  const rel = relative(parent, child);
  return rel === "" || (!rel.startsWith("..") && !isAbsolute(rel));
}

async function resolveCwd(path: string) {
  const cwd = process.cwd();
  const resolved = resolve(cwd, path);
  const rel = relative(cwd, resolved);

  if (rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error("Path is outside the project directory");
  }

  const realCwd = await realpath(cwd);
  const realPath = await resolveRealPath(resolved);

  if (!isInside(realCwd, realPath)) {
    throw new Error("Path resolves outside the project directory");
  }

  return { cwd, resolved, realPath };
}

function truncate(value: string, limit: number) {
  return value.length > limit
    ? `${value.slice(0, limit)}\n... (truncated, ${value.length} total characters)`
    : value;
}

export async function executeLocalTool(
  toolName: string,
  input: unknown,
  mode: ModeType,
  toolCallId?: string,
) {
  if (
    mode === Mode.PLAN &&
    !["readFile", "listDirectory", "glob", "grep"].includes(toolName)
  ) {
    throw new Error(`Tool '${toolName}' is not allowed in PLAN mode`);
  }

  switch (toolName) {
    case "readFile": {
      const { path } = toolInputSchemas.readFile.parse(input);
      const { realPath } = await resolveCwd(path);
      const content = await readFile(realPath, "utf-8");
      return content.length > MAX_FILE_SIZE
        ? {
            content: content.slice(0, MAX_FILE_SIZE),
            truncated: true,
            totalLength: content.length,
          }
        : { content: content };
    }
    case "listDirectory": {
      const { path } = toolInputSchemas.listDirectory.parse(input);
      const { cwd, resolved, realPath } = await resolveCwd(path);
      const entries = await readdir(realPath);
      const results: { name: string; type: "file" | "directory" }[] = [];

      for (const entry of entries) {
        if (entry.startsWith(".") || entry === "node_modules") continue;
        const info = await stat(join(realPath, entry));
        results.push({
          name: entry,
          type: info.isDirectory() ? "directory" : "file",
        });
      }

      results.sort((a, b) =>
        a.type !== b.type
          ? a.type === "directory"
            ? -1
            : 1
          : a.name.localeCompare(b.name),
      );

      return {
        path: relative(cwd, resolved) ?? ".",
        entries: results,
      };
    }
    case "glob": {
      const { path, pattern } = toolInputSchemas.glob.parse(input);
      const { cwd, resolved } = await resolveCwd(path);
      const glob = new Bun.Glob(pattern);
      const files: string[] = [];
      let truncated = false;

      for await (const match of glob.scan({
        cwd: resolved,
        dot: false,
        onlyFiles: true,
      })) {
        if (match.includes("node_modules")) continue;
        if (files.length >= MAX_MATCHES) {
          truncated = true;
          break;
        }
        files.push(relative(cwd, resolve(resolved, match)));
      }

      files.sort();
      return {
        files: files,
        ...(truncated ? { truncated: true } : {}),
      };
    }
    case "grep": {
      const { pattern, path, include } = toolInputSchemas.grep.parse(input);
      const { cwd, resolved } = await resolveCwd(path);
      const args = [
        "-rn",
        "--color=never",
        "--exclude-dir=node_modules",
        "--exclude-dir=.git",
        "-E",
      ];

      if (include) args.push(`--include=${include}`);
      args.push(pattern, resolved);

      const proc = Bun.spawn(["grep", ...args], {
        cwd,
        stdout: "pipe",
        stderr: "pipe",
      });
      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      const exitCode = await proc.exited;

      if (exitCode !== 0 && exitCode !== 1) {
        throw new Error(`grep failed with exit code ${exitCode}: ${stderr}`);
      }
      if (!stdout.trim()) {
        return {
          matches: [],
          messages: "No matches found",
        };
      }

      const lines = stdout.trim().split("\n");
      const matches: { file: string; line: number; content: string }[] = [];
      let truncated = false;

      for (const line of lines) {
        if (matches.length >= MAX_RESULTS) {
          truncated = true;
          break;
        }
        const match = line.match(/^(.*?):(\d+):(.*)$/);
        if (match) {
          matches.push({
            file: relative(cwd, match[1]!),
            line: Number(match[2]),
            content: match[3]!,
          });
        }
      }

      return {
        matches: matches,
        ...(truncated ? { truncated: true, totalMatches: lines.length } : {}),
      };
    }
    case "writeFile": {
      const { path, content } = toolInputSchemas.writeFile.parse(input);
      const { cwd, resolved, realPath } = await resolveCwd(path);

      const previousContent = await readFile(realPath, "utf-8").catch(
        (error) => {
          if ((error as NodeJS.ErrnoException).code === "ENOENT") return "";
          throw error;
        },
      );

      await mkdir(dirname(realPath), { recursive: true });
      await writeFile(realPath, content, "utf-8");

      if (toolCallId) {
        setDiffSnapshot(toolCallId, {
          oldContent: previousContent,
          newContent: content,
        });
      }

      return {
        success: true as const,
        path: relative(cwd, resolved),
        bytesWritten: Buffer.byteLength(content, "utf-8"),
      };
    }
    case "editFile": {
      const { path, oldString, newString } =
        toolInputSchemas.editFile.parse(input);
      const { cwd, resolved, realPath } = await resolveCwd(path);
      const content = await readFile(realPath, "utf-8");
      const occurrences = content.split(oldString).length - 1;

      if (occurrences === 0) throw new Error("oldString not found in file");
      if (occurrences > 1)
        throw new Error(`oldString found ${occurrences} times in file`);

      const newContent = content.replace(oldString, newString);
      await writeFile(realPath, newContent, "utf-8");

      if (toolCallId) {
        setDiffSnapshot(toolCallId, { oldContent: content, newContent });
      }

      return {
        success: true as const,
        path: relative(cwd, resolved),
      };
    }
    case "bash": {
      const { command, timeout = DEFAULT_TIMEOUT } =
        toolInputSchemas.bash.parse(input);

      const env: Record<string, string> = {
        PATH: process.env.PATH ?? "/usr/bin:/bin",
        TERM: "dumb",
        LANG: process.env.LANG ?? "C.UTF-8",
      };
      if (process.env.HOME) env.HOME = process.env.HOME;
      if (process.env.TMPDIR) env.TMPDIR = process.env.TMPDIR;

      const { realPath } = await resolveCwd(".");
      const proc = Bun.spawn(["bash", "-c", command], {
        cwd: realPath,
        stdout: "pipe",
        stderr: "pipe",
        env: env,
      });
      const timer = setTimeout(() => proc.kill(), timeout);
      const [stdout, stderr] = await Promise.all([
        new Response(proc.stdout).text(),
        new Response(proc.stderr).text(),
      ]);
      const exitCode = await proc.exited;
      clearTimeout(timer);

      return {
        stdout: truncate(stdout, MAX_OUTPUT),
        stderr: truncate(stderr, MAX_OUTPUT),
        exitCode: exitCode,
      };
    }
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}
