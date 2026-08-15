# cerocode

Interactive terminal UI for chatting with CeroCode AI agents. Run it inside a
project directory and the agent reads, searches, edits, and writes files and
runs shell commands there, streaming responses as you chat.

<!-- TODO: add demo screenshot/gif -->

## Requirements

- [Bun](https://bun.sh) >= 1.0 — the CLI runs on the Bun runtime (see the
  `engines` field in `package.json`)

## Install

```sh
bun add -g cerocode
```

or with npm:

```sh
npm install -g cerocode
```

## Usage

```sh
cd /path/to/your/project
cerocode
```

On first run, sign in with the `/login` command — your browser opens for
OAuth, and the resulting token is stored in `~/.cerocode/auth.json`
(permissions `0600`). `/logout` removes it.

Type your request in the input bar and press `Enter` (`Shift+Enter` for a new
line). Type `@` in the input to mention files or directories in the current
project. `Tab` toggles between the two agents:

- **BUILD** — full tool access: read, write, edit, list, glob, grep, bash
- **PLAN** — read-only: read, list, glob, grep

Write and bash actions require your approval in a dialog; `Esc` interrupts a
streaming response.

### Commands

Type `/` to open the command menu:

| Command | Description |
| --- | --- |
| `/new` | Start a new conversation |
| `/agents` | Switch between BUILD and PLAN agents |
| `/models` | View and change the current model |
| `/sessions` | View and manage your conversations |
| `/theme` | Change the application theme |
| `/login` | Sign in (opens your browser) |
| `/logout` | Sign out |
| `/upgrade` | Buy more credits (stub) |
| `/usage` | Open the billing portal (stub) |
| `/exit` | Quit the application |

## Configuration

No setup is needed. The published CLI ships with the default CeroCode server
and OAuth configuration baked in and connects to the hosted service:

| Endpoint | Value |
| --- | --- |
| API base URL | `https://api-cerocode.heyabhishek.in` |

For local development against a local server, set `NODE_ENV=development` —
this switches the CLI to `http://localhost:3000` and the dev Clerk app. See
the repository README for the full development setup.

## Development

```sh
bun install
bun run dev       # watch mode; points at http://localhost:3000
bun run build     # bundle src/index.tsx into dist/ (Bun target)
```

The build marks `react`, `hono`, `ai`, `zod`, and `@opentui/*` as external and
inlines the workspace packages (`@cerocode/shared`, `@cerocode/server` type
imports), so the published package has no `@cerocode/*` runtime dependencies.
