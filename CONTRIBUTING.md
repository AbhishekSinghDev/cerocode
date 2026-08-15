# Contributing to cerocode

Thanks for wanting to contribute. This document covers the setup and the
workflow the repo actually uses.

## Prerequisites

- [Bun](https://bun.sh) >= 1.0 — declared in `packages/cli/package.json`
  (`engines.bun`) and used throughout the repo (runtime, test-less tooling,
  and the CLI bundle). There is no Node.js requirement.

## Setup

```sh
git clone git@github.com:AbhishekSinghDev/cerocode.git
cd cerocode
bun install
```

The repo is a Bun workspace (`workspaces: ["packages/*"]`). `bun install`
symlinks `packages/cli`, `packages/server`, `packages/shared`, and
`packages/database` into the root `node_modules`, so cross-package imports
(`@cerocode/shared`, `@cerocode/server`, `@cerocode/database`) always resolve
to source. Only `packages/cli` is published; the other packages are
workspace-internal and their code is bundled into the CLI at build time.

### Local server configuration

The server needs a Postgres database, a Clerk application, and model provider
keys:

```sh
cp .env.example .env
# fill in DATABASE_URL, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY,
# and the model API keys you want to use
bun run --filter @cerocode/database push   # create the sessions table
```

Bun loads `.env` from the working directory automatically, so running scripts
from the repo root works without extra tooling. The CLI's dev mode
(`NODE_ENV=development`) points at `http://localhost:3000` and the dev Clerk
app — if you run the server locally, the CLI and server pick each other up
without configuration.

## Running in dev mode

Two terminals:

```sh
bun run dev:server   # Hono server, hot reload, http://localhost:3000
bun run dev:cli      # CLI, watch mode (development endpoints)
```

The CLI is a full-screen TUI: use `/login` in the TUI to authenticate (opens
your browser), then start chatting. To test the globally-installed binary
instead, use `bun run link:cli`, which builds the CLI and registers it with
`bun link`.

## Verifying changes before a PR

There is no test suite or linter configured. Before opening a PR:

```sh
bun run build        # bundles the CLI and the server
bunx tsc --noEmit -p packages/cli
bunx tsc --noEmit -p packages/server
bunx tsc --noEmit -p packages/shared
bunx tsc --noEmit -p packages/database
```

Then exercise the change in the TUI with `bun run dev:cli`.

## Commits and branches

The git history uses conventional-commit prefixes (`feat:`, `fix:`, `docs:`,
`chore:`, `refactor:`, `wip:`) and topic branches (e.g.
`patch/npm-registry-publish-configuration`,
`refactor/cli-theme-usage-improvements`). Follow the same pattern:
a short prefix + summary, on a topic branch, with a PR against `main`.

## Releases

Only `packages/cli` is published, to npm as `cerocode`. The flow is manual
and runs from the CLI package:

```sh
# 1. bump "version" in packages/cli/package.json
cd packages/cli
npm publish
```

`prepublishOnly` runs `bun run build` first, so the tarball always contains a
fresh `dist/index.js`. The build inlines the workspace packages
(`@cerocode/shared`, and `@cerocode/server` is a type-only import), so the
published package has no `workspace:*` or `@cerocode/*` dependencies — do not
add `@cerocode/*` packages to the CLI's runtime `dependencies`.
