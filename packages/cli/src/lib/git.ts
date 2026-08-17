import { existsSync, readFileSync, statSync } from "fs";
import { dirname, isAbsolute, join, resolve } from "path";

const HEAD_REF_PREFIX = "ref: refs/heads/";

function findGitDir(startDir: string): string | null {
  let dir = startDir;

  while (true) {
    const gitPath = join(dir, ".git");

    if (existsSync(gitPath)) {
      if (statSync(gitPath).isDirectory()) return gitPath;

      // Worktrees/submodules use a `.git` file: "gitdir: <path>"
      try {
        const content = readFileSync(gitPath, "utf-8").trim();
        const match = content.match(/^gitdir:\s*(.+)$/);
        if (!match) return null;
        return isAbsolute(match[1]!) ? match[1]! : resolve(dir, match[1]!);
      } catch {
        return null;
      }
    }

    const parent = dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

/**
 * Current git branch for `cwd`, or a short commit hash when HEAD is
 * detached. Returns `null` outside a git repo. Cheap enough to call per
 * render (a couple of small synchronous file reads), but callers holding
 * a stable cwd for a whole session should still memoize it.
 */
export function getGitBranch(cwd: string = process.cwd()): string | null {
  const gitDir = findGitDir(cwd);
  if (!gitDir) return null;

  try {
    const head = readFileSync(join(gitDir, "HEAD"), "utf-8").trim();
    if (head.startsWith(HEAD_REF_PREFIX)) {
      return head.slice(HEAD_REF_PREFIX.length);
    }
    return head.slice(0, 7);
  } catch {
    return null;
  }
}
