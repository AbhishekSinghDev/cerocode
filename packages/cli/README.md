# CEROCODE CLI

Interactive terminal UI for chatting with CeroCode AI agents.

## Requirements

- [Bun](https://bun.sh) >= 1.0 (the CLI uses Bun-native APIs and runs on the Bun runtime)

## Install

```sh
bun add -g cerocode
```

or with npm:

```sh
npm install -g @cerocode/cli
```

## Usage

```sh
cerocode
```

Requires a running CeroCode server and authentication (see repo documentation for setup).

## Configuration

No setup needed — the CLI ships with the default CeroCode server and OAuth configuration baked in. For local development, `NODE_ENV=development` switches the CLI to `localhost:3000` and the dev Clerk app.
