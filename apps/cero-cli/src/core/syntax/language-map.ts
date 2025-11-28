export const LANGUAGE_MAP: Record<string, string> = {
  // JavaScript/TypeScript family - all map to typescript (handles JSX)
  ".js": "typescript",
  ".jsx": "typescript",
  ".ts": "typescript",
  ".tsx": "typescript",
  ".mjs": "typescript",
  ".cjs": "typescript",
  ".mts": "typescript",
  ".cts": "typescript",
  ".mtsx": "typescript",
  ".ctsx": "typescript",

  // Code block aliases (without dots) - all JS/TS variants use typescript
  js: "typescript",
  javascript: "typescript",
  jsx: "typescript",
  ts: "typescript",
  typescript: "typescript",
  tsx: "typescript",
  mjs: "typescript",
  cjs: "typescript",
  mts: "typescript",
  cts: "typescript",

  // Python
  ".py": "python",
  py: "python",
  python: "python",
  python3: "python",

  // Rust
  ".rs": "rust",
  rs: "rust",
  rust: "rust",

  // Go
  ".go": "go",
  go: "go",
  golang: "go",

  // Java
  ".java": "java",
  java: "java",

  // C
  ".c": "c",
  ".h": "c",
  c: "c",
  h: "c",

  // C++
  ".cpp": "cpp",
  ".cxx": "cpp",
  ".cc": "cpp",
  ".c++": "cpp",
  ".hpp": "cpp",
  cpp: "cpp",
  "c++": "cpp",
  cxx: "cpp",
  cc: "cpp",
  hpp: "cpp",

  // C#
  ".cs": "csharp",
  cs: "csharp",
  csharp: "csharp",
  "c#": "csharp",

  // Shell/Bash
  ".sh": "bash",
  ".bash": "bash",
  ".zsh": "bash",
  ".ksh": "bash",
  sh: "bash",
  bash: "bash",
  shell: "bash",
  zsh: "bash",
  shellscript: "bash",

  // Ruby
  ".rb": "ruby",
  ".rake": "ruby",
  ".gemspec": "ruby",
  ".ru": "ruby",
  rb: "ruby",
  ruby: "ruby",

  // PHP
  ".php": "php",
  php: "php",

  // JSON
  ".json": "json",
  json: "json",
  jsonc: "json",

  // YAML
  ".yaml": "yaml",
  ".yml": "yaml",
  yaml: "yaml",
  yml: "yaml",

  // HTML
  ".html": "html",
  ".htm": "html",
  html: "html",
  htm: "html",

  // CSS
  ".css": "css",
  ".scss": "css",
  ".sass": "css",
  ".less": "css",
  css: "css",
  scss: "css",
  sass: "css",
  less: "css",

  // Swift
  ".swift": "swift",
  swift: "swift",

  // Scala
  ".scala": "scala",
  scala: "scala",

  // Markdown (built-in)
  ".md": "markdown",
  ".markdown": "markdown",
  md: "markdown",
  markdown: "markdown",

  // Zig (built-in)
  ".zig": "zig",
  ".zon": "zig",
  zig: "zig",

  // Lua
  ".lua": "lua",
  lua: "lua",

  // SQL
  ".sql": "sql",
  sql: "sql",

  // Haskell
  ".hs": "haskell",
  hs: "haskell",
  haskell: "haskell",

  // Clojure
  ".clj": "clojure",
  ".cljs": "clojure",
  ".cljc": "clojure",
  ".edn": "clojure",
  clj: "clojure",
  clojure: "clojure",

  // Julia
  ".jl": "julia",
  jl: "julia",
  julia: "julia",

  // OCaml
  ".ml": "ocaml",
  ".mli": "ocaml",
  ml: "ocaml",
  ocaml: "ocaml",

  // Dart
  ".dart": "dart",
  dart: "dart",

  // Kotlin
  ".kt": "kotlin",
  ".kts": "kotlin",
  kt: "kotlin",
  kotlin: "kotlin",

  // Elixir
  ".ex": "elixir",
  ".exs": "elixir",
  ex: "elixir",
  elixir: "elixir",

  // Erlang
  ".erl": "erlang",
  ".hrl": "erlang",
  erl: "erlang",
  erlang: "erlang",

  // Vue
  ".vue": "vue",
  vue: "vue",

  // Svelte
  ".svelte": "svelte",
  svelte: "svelte",

  // Astro
  ".astro": "astro",
  astro: "astro",

  // XML
  ".xml": "xml",
  ".xsl": "xml",
  xml: "xml",

  // TOML
  ".toml": "toml",
  toml: "toml",

  // INI
  ".ini": "ini",
  ini: "ini",

  // Diff/Patch
  ".diff": "diff",
  ".patch": "diff",
  diff: "diff",
  patch: "diff",

  // Dockerfile
  dockerfile: "dockerfile",
  docker: "dockerfile",

  // Makefile
  makefile: "makefile",
  make: "makefile",

  // Plain text fallback
  text: "plaintext",
  txt: "plaintext",
  plain: "plaintext",
};

export const BUILTIN_FILETYPES = new Set(["javascript", "typescript", "markdown", "zig"]);

export function getFiletype(lang: string): string | null {
  return LANGUAGE_MAP[lang.toLowerCase()] ?? null;
}

export function isBuiltinFiletype(filetype: string): boolean {
  return BUILTIN_FILETYPES.has(filetype);
}

export function isLanguageSupported(lang: string): boolean {
  return getFiletype(lang) !== null;
}
