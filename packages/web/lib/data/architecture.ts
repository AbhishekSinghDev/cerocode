import {
  TerminalIcon,
  ServerStack01Icon,
  Package01Icon,
  Database01Icon,
} from "@hugeicons/core-free-icons";

export type Pkg = {
  icon: typeof TerminalIcon;
  name: string;
  path: string;
  description: string;
  facts: string[];
  stack: { slug: string; label: string }[];
};

export const PACKAGES: Pkg[] = [
  {
    icon: TerminalIcon,
    name: "cli",
    path: "packages/cli",
    description: "OpenTUI renders the TUI, React drives the component tree.",
    facts: [
      "PKCE OAuth against Clerk",
      "Token cached at ~/.cerocode/auth.json, mode 0600",
    ],
    stack: [
      { slug: "bun", label: "Bun" },
      { slug: "react", label: "React" },
      { slug: "typescript", label: "TypeScript" },
    ],
  },
  {
    icon: ServerStack01Icon,
    name: "server",
    path: "packages/server",
    description: "Hono API on port 3000, streams model output as it's generated.",
    facts: [
      "Clerk middleware guards /sessions/* and /chat/*",
      "Sentry captures unhandled errors",
    ],
    stack: [
      { slug: "hono", label: "Hono" },
      { slug: "typescript", label: "TypeScript" },
    ],
  },
  {
    icon: Package01Icon,
    name: "shared",
    path: "packages/shared",
    description: "The contract layer. No network calls, no filesystem access.",
    facts: [
      "Model registry keyed by provider and id",
      "Zod schemas validate every tool input",
    ],
    stack: [{ slug: "typescript", label: "TypeScript" }],
  },
  {
    icon: Database01Icon,
    name: "database",
    path: "packages/database",
    description: "One sessions table. Messages stored as JSONB, not one row per message.",
    facts: [
      "postgres-js client, schema pushed with drizzle-kit",
      "Session history survives CLI restarts",
    ],
    stack: [
      { slug: "drizzle", label: "Drizzle" },
      { slug: "postgresql", label: "Postgres" },
    ],
  },
];