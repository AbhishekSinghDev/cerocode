<div align="center">

# Cero

**AI-powered terminal assistant that doesn't suck**

[![npm version](https://img.shields.io/npm/v/cero-code.svg)](https://www.npmjs.com/package/cero-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Installation](#installation) • [Usage](#usage) • [Commands](#commands) • [How it Works](#how-it-works)

</div>

---

## What is this?

Cero is a CLI tool that brings AI chat capabilities directly to your terminal. No API keys to manage, no configuration files to mess with, just install, authenticate once, and start chatting.

## Installation

```bash
npm install -g cero-code
```

Or if you're using pnpm:

```bash
pnpm add -g cero-code
```

## Quick Start

```bash
# First time setup - authenticate via browser
cero login

# Start chatting
cero chat "explain what DNS is"

# When you're done
cero logout
```

That's it. No environment variables, no config files, nothing.

## Usage

### Authentication

Cero uses device authorization (the same flow Netflix uses for TV login). You authenticate once in your browser, and the CLI handles the rest.

```bash
cero login
```

This will:

1. Generate a unique code
2. Open your browser to the authorization page
3. Wait for you to approve the request
4. Store your credentials securely in your system keychain

Your tokens are stored using your OS's native credential manager (Keychain on macOS, Credential Manager on Windows, libsecret on Linux).

### Chatting

Once authenticated, you can start chatting:

```bash
cero chat "your message here"
```

The response streams back in real-time, just like ChatGPT.

### Logging Out

```bash
cero logout
```

This clears your stored credentials from the keychain.

## Commands

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `cero login`          | Authenticate via device authorization flow |
| `cero chat <message>` | Send a message and get an AI response      |
| `cero logout`         | Clear stored credentials                   |
| `cero --help`         | Show help information                      |
| `cero --version`      | Display version number                     |

## How it Works

Cero uses OAuth 2.0 Device Authorization Grant for authentication. Here's the flow:

1. You run `cero login`
2. CLI requests a device code from the server
3. You approve the request in your browser
4. CLI polls the server until you approve
5. Tokens are stored securely in your system keychain
6. Future commands use these tokens automatically

## Features

### Currently Available

- **AI Chat** — Ask questions, get answers, right in your terminal
- **Streaming Responses** — Real-time responses as they're generated
- **Secure Auth** — OAuth 2.0 device flow, no API keys to manage
- **Encrypted Storage** — Credentials stored in OS keychain
- **Cross-Platform** — Works on macOS, Windows, and Linux

### Coming Soon

We're actively building features that'll make Cero your go-to terminal assistant:

- **🎨 Interactive Interface** — A proper chat UI in your terminal with an input box at the bottom and a sidebar showing your conversation history. Think ChatGPT, but in your terminal.

- **💾 Offline-First History** — Your chat history syncs both locally and to the cloud. No internet? No problem. You can still browse all your previous conversations, unlike web apps that need a connection just to load.

- **🤖 Agent Mode** — Full-blown AI agent that can iterate on tasks, explore your codebase, and actually get work done. Similar to Copilot's agent or Cursor, but in your terminal.

- **📂 Codebase Context** — Since Cero runs in your terminal, it has full context of your current project. It knows what you're working on and can give you specific, relevant answers instead of generic responses.

- **🔧 Tool Integration** —

  - Context7 for up-to-date library documentation
  - Brave Search API for web searches
  - URL inspection for fetching and analyzing web content
  - More integrations on the way

- **And more...** — We're just getting started. File operations, git integration, custom tools — lots of ideas in the pipeline.

Want to follow along or contribute? Check out our [GitHub repository](https://github.com/AbhishekSinghDev/cero-code).

## Requirements

- Node.js 18 or higher
- A browser for authentication

## Development

Want to contribute or run this locally?

```bash
# Clone the repo
git clone https://github.com/AbhishekSinghDev/cero-code.git
cd cero-code

# Install dependencies
pnpm install

# Run in development mode
pnpm dev

# To run commands in dev mode
pnpm dev <command>

# Build for production
pnpm build
```

## Architecture

```
src/
├── cli/
│   ├── commands/     # Command definitions (login, chat, logout)
│   └── prompts/      # Interactive CLI prompts
├── core/
│   ├── auth/         # Authentication logic and keychain management
│   ├── chat/         # Chat service and streaming handler
│   └── config/       # Configuration and constants
├── types/            # TypeScript type definitions
└── utils/            # Error handling and helpers
```

## License

MIT © [Abhishek Singh](https://abhisheksingh.me)

---

<div align="center">
Part of the Cero ecosystem
</div>
