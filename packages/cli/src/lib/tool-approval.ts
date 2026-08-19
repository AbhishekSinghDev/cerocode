const SENSITIVE_FILE_NAMES = new Set([
  "package.json",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lock",
  "bun.lockb",
  "gemfile.lock",
  "cargo.lock",
  "go.sum",
  "poetry.lock",
  "composer.lock",
  "uv.lock",
]);

const SENSITIVE_FILE_EXTENSIONS = new Set([
  ".sh",
  ".bash",
  ".zsh",
  ".fish",
  ".csh",
  ".ksh",
  ".ps1",
  ".bat",
  ".cmd",
]);

const SAFE_BASH_PATTERN =
  /^(?:ls|pwd|cat|head|tail|grep|find|echo|date|whoami|uname|which)(?:[ \t]+[\w@./:=+~\-'"*?]+)*$/;

const SAFE_GIT_PATTERN =
  /^git\s+(?:status|diff|log|branch|ls-files|grep|show|rev-parse)(?:[ \t]+[\w@./:=+~\-'"*?]+)*$/;

export function isSensitivePath(path: string) {
  const parts = path.split("/").filter(Boolean);
  const base = (parts.at(-1) ?? "").toLowerCase();

  if (parts.some((part) => part.startsWith("."))) return true;
  if (SENSITIVE_FILE_NAMES.has(base)) return true;

  const dotIndex = base.lastIndexOf(".");
  if (dotIndex < 0) return false;

  return SENSITIVE_FILE_EXTENSIONS.has(base.slice(dotIndex));
}

export function isSafeBashCommand(command: string) {
  const trimmed = command.trim();

  if (/[\r\n\v\f]/.test(trimmed)) return false;

  if (!SAFE_BASH_PATTERN.test(trimmed) && !SAFE_GIT_PATTERN.test(trimmed)) {
    return false;
  }

  if (trimmed === "tail" || trimmed.startsWith("tail ")) {
    if (/(^|\s)-{1,2}f(ollow)?(\s|$)/.test(trimmed)) return false;
  }

  return true;
}