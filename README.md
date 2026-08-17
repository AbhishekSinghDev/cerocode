# cerocode

<!-- TODO: add demo screenshot/gif -->

cerocode is a terminal AI coding agent: an interactive TUI for chatting with
CeroCode AI agents from your terminal. Run it inside a project directory and
the agent can read, search, edit, and write files and run shell commands in
that directory, streaming its responses back as you chat. Sessions are stored
server-side and survive restarts.

It is built as a Bun monorepo:

- `packages/cli` — the TUI (OpenTUI + React), published to npm as [`cerocode`](https://www.npmjs.com/package/cerocode)
- `packages/server` — a Hono API server that handles authentication, session
  storage, and streaming chat completions through the AI SDK (Google, Groq,
  and Mistral models)
- `packages/shared` — model registry, modes, and tool contracts shared between
  the CLI and server
- `packages/database` — Drizzle schema and Postgres client for sessions

By default the CLI talks to the hosted CeroCode service; it can also run
against a local instance of the server (see [Configuration](#configuration)).

## Install

Requires [Bun](https://bun.sh) >= 1.0 (the CLI runs on the Bun runtime):

```sh
bun add -g cerocode
```

or with npm:

```sh
npm install -g cerocode
```

## Quick start

```sh
cd /path/to/your/project
cerocode
```

Then sign in with the `/login` command (opens your browser for OAuth), pick an
agent and model, and ask the agent to work on the code. `Tab` toggles between
**BUILD** (full read/write/bash tools) and **PLAN** (read-only analysis)
agents. Type `/` to see all commands.

## Development

```sh
git clone git@github.com:AbhishekSinghDev/cerocode.git
cd cerocode
bun install
```

Bun workspaces symlink `packages/*` into the root `node_modules`, so
`@cerocode/server`, `@cerocode/shared`, and `@cerocode/database` resolve
directly to their source. `packages/shared` and the other workspace packages
are internal-only: they are never published, and the CLI's production build
bundles their code into the CLI itself.

The dev environment needs a local server plus the CLI in two terminals:

```sh
bun run dev:server   # Hono server with hot reload, http://localhost:3000
bun run dev:cli      # CLI in watch mode; NODE_ENV=development points it at localhost:3000
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for full setup (database, Clerk, and
model API keys) and [.env.example](.env.example) for the environment variables
the server reads.

## Build & publish

```sh
bun run build       # builds the CLI and the server bundles
bun run link:cli    # builds the CLI and `bun link`s it for global use
```

The CLI is the only published package. To release:

```sh
# 1. bump "version" in packages/cli/package.json
cd packages/cli
npm publish
```

`prepublishOnly` runs the build first. The build inlines all workspace
dependencies (`@cerocode/shared`, `@cerocode/server` types) into
`dist/index.js` — they are not in the `--external` list — so the published
tarball ships only `dist`, `bin`, `README.md`, and `LICENSE`, with no
`workspace:*` or `@cerocode/*` runtime dependencies.

## Project structure

```
packages/
  cli/         TUI client; published to npm as "cerocode" (bin: cerocode)
  server/      Hono API: /auth OAuth relay, /sessions CRUD, /chat streaming
  shared/      Model registry, BUILD/PLAN modes, tool input schemas (not published)
  database/    Drizzle schema (sessions table), Postgres client, drizzle-kit setup
```

### CLI

- OpenTUI + React renderer (`src/index.tsx`), react-router memory router with
  home, new-session, and session screens
- OAuth login (PKCE) against Clerk; the bearer token is stored in
  `~/.cerocode/auth.json` (mode `0600`)
- Tools run locally on the machine the CLI runs on: `readFile`,
  `listDirectory`, `glob`, `grep` (both modes); `writeFile`, `editFile`,
  `bash` (BUILD mode only)
- Tool safety: paths are confined to the current directory, `bash` is gated
  behind an allowlist or an approval prompt, and write/bash actions require
  in-TUI confirmation
- Slash commands: `/new`, `/agents`, `/models`, `/sessions`, `/theme`,
  `/login`, `/logout`, `/upgrade`, `/usage`, `/exit` (`/upgrade` and
  `/usage` are stubs)

### Server

- Hono on port `3000`; Clerk OAuth token auth on `/sessions/*` and `/chat/*`
- `POST /chat` validates UI messages, merges them into the persisted session,
  and streams a model response (AI SDK v7 `streamText`) with per-mode system
  prompts
- Models: Groq (gpt-oss-20b, gpt-oss-120b, qwen3.6-27b), Mistral
  (ministral-8b, mistral-small, devstral-small, codestral, mistral-large),
  Google (gemini-3.5-flash-lite, gemini-2.5-flash, gemini-3.6-flash,
  gemini-3.1-pro-preview); default is `devstral-small-latest`
- Sentry error tracking

### Database

- Single `sessions` table (id, user_id, title, messages JSONB, timestamps)
- `postgres-js` client, Drizzle ORM, schema pushed with drizzle-kit

## Configuration

### CLI

No configuration is required — production endpoints are baked in:

| Variable   | Effect                                                                                                                                             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NODE_ENV` | `development` switches the API base URL to `http://localhost:3000` and the dev Clerk app; anything else uses the hosted CeroCode API and Clerk app |

The auth token lives in `~/.cerocode/auth.json`; delete it to sign out.

### Server

Bun loads `.env` from the working directory automatically. Copy
[.env.example](.env.example) to `.env` and fill in:

| Variable                       | Required | Purpose                                                         |
| ------------------------------ | -------- | --------------------------------------------------------------- |
| `DATABASE_URL`                 | yes      | Postgres connection string (server + drizzle-kit)               |
| `CLERK_SECRET_KEY`             | yes      | Clerk backend secret; the server throws at startup if missing   |
| `CLERK_PUBLISHABLE_KEY`        | yes      | Clerk frontend API key; the server throws at startup if missing |
| `GOOGLE_GENERATIVE_AI_API_KEY` | no       | Enables Google models                                           |
| `GROQ_API_KEY`                 | no       | Enables Groq models                                             |
| `MISTRAL_API_KEY`              | no       | Enables Mistral models (default model)                          |

## Scripts

| Script           | Package  | Description                                             |
| ---------------- | -------- | ------------------------------------------------------- |
| `dev:server`     | root     | Run the Hono server with hot reload                     |
| `dev:cli`        | root     | Run the CLI in watch mode (development endpoints)       |
| `build`          | root     | Build the CLI and server bundles                        |
| `build:cli`      | root     | Build the CLI bundle only                               |
| `link:cli`       | root     | Build the CLI and link it globally with `bun link`      |
| `clean`          | root     | Remove build output and `node_modules` in all packages  |
| `dev`            | cli      | Run the CLI in watch mode (same as root `dev:cli`)      |
| `build`          | cli      | Bundle `src/index.tsx` into `dist/` for the Bun runtime |
| `prepublishOnly` | cli      | npm hook — runs `build` before publishing               |
| `clean`          | cli      | Remove `node_modules` and `dist`                        |
| `dev`            | server   | Run the server with hot reload                          |
| `start`          | server   | Run the compiled server from `dist/index.js`            |
| `build`          | server   | Bundle `src/index.ts` into `dist/`                      |
| `clean`          | server   | Remove `node_modules`                                   |
| `clean`          | shared   | Remove `node_modules`                                   |
| `push`           | database | Push the Drizzle schema to the database                 |
| `studio`         | database | Open Drizzle Studio                                     |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
