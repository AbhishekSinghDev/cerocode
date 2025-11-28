<div align="center">

# Cero

**AI-powered terminal assistant that doesn't suck**

[![npm version](https://img.shields.io/npm/v/cerocode.svg)](https://www.npmjs.com/package/cerocode)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Installation](#installation) • [Usage](#usage) • [Commands](#commands) • [How it Works](#how-it-works)

</div>

---

## What is this?

Cero is a CLI tool that brings AI chat capabilities directly to your terminal. No API keys to manage, no configuration files to mess with—just install, authenticate once, and start chatting.

## Installation

```bash
npm install -g cerocode
```

Or if you're using bun:

```bash
bun add -g cerocode
```

## Quick Start

```bash
# First time setup - authenticate via browser
cero login

# Start chatting (quick mode)
cero chat "explain what DNS is"

# Launch interactive terminal UI
cero interactive

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

### Quick Chat

For quick one-off questions:

```bash
cero chat "your message here"
```

The response streams back in real-time, just like ChatGPT.

### Interactive Mode

For a full chat experience with conversation history:

```bash
cero interactive
```

This launches a beautiful terminal UI with:

- **Chat area** with real-time streaming responses
- **Sidebar** showing your conversation history
- **Keyboard shortcuts** for efficient navigation
- **User info** display

### Logging Out

```bash
cero logout
```

This clears your stored credentials from the keychain.

## Commands

| Command               | Alias | Description                                |
| --------------------- | ----- | ------------------------------------------ |
| `cero login`          |       | Authenticate via device authorization flow |
| `cero chat <message>` | `c`   | Send a message and get an AI response      |
| `cero interactive`    | `i`   | Launch interactive terminal UI             |
| `cero logout`         |       | Clear stored credentials                   |
| `cero --help`         | `-h`  | Show help information                      |
| `cero --version`      | `-v`  | Display version number                     |

## How it Works

Cero uses OAuth 2.0 Device Authorization Grant for authentication. Here's the flow:

1. You run `cero login`
2. CLI requests a device code from the server
3. You approve the request in your browser
4. CLI polls the server until you approve
5. Tokens are stored securely in your system keychain
6. Future commands use these tokens automatically

### Chat Flow

1. You send a message via `cero chat` or interactive mode
2. CLI sends authenticated request to the API
3. API triggers background job for AI processing
4. Response streams back token-by-token via Server-Sent Events
5. Tokens are rendered in real-time as they arrive

## Features

### Currently Available

- **AI Chat** — Ask questions, get answers, right in your terminal
- **Interactive Terminal UI** — Full chat interface with sidebar and conversation history
- **Streaming Responses** — Real-time responses as they're generated
- **Conversation History** — Browse and continue past conversations
- **Secure Auth** — OAuth 2.0 device flow, no API keys to manage
- **Encrypted Storage** — Credentials stored in OS keychain
- **Cross-Platform** — Works on macOS, Windows, and Linux

### Coming Soon

We're actively building features that'll make Cero your go-to terminal assistant:

- **💾 Offline-First History** — Your chat history syncs both locally and to the cloud. No internet? No problem. You can still browse all your previous conversations.

- **🤖 Agent Mode** — Full-blown AI agent that can iterate on tasks, explore your codebase, and actually get work done. Similar to Copilot's agent or Cursor, but in your terminal.

- **📂 Codebase Context** — Since Cero runs in your terminal, it has full context of your current project. It knows what you're working on and can give you specific, relevant answers.

- **🔧 Tool Integration** —
  - Context7 for up-to-date library documentation
  - Brave Search API for web searches
  - URL inspection for fetching and analyzing web content
  - Git integration for commit history and branch context
  - File operations with permission controls

- **🎨 Multi-Model Support** — Choose between GPT-4, Claude, Gemini, and more.

Want to follow along or contribute? Check out our [GitHub repository](https://github.com/AbhishekSinghDev/cerocode).

## Requirements

- Bun 1.0.0 or higher
- A browser for authentication

## Development

Want to contribute or run this locally?

```bash
# Clone the repo
git clone https://github.com/AbhishekSinghDev/cerocode.git
cd cerocode/apps/cero-cli

# Install dependencies
bun install

# Run in development mode
bun dev

# To run commands in dev mode
bun dev <command>

# Build for production
bun build
```

## Architecture

```
src/
├── index.ts                 # Entry point
├── cli/
│   ├── commands/            # Command definitions
│   │   ├── auth.command.ts  # Login/logout commands
│   │   ├── chat.command.ts  # Quick chat command
│   │   └── tui.command.ts   # Interactive mode command
│   └── prompts/             # Interactive CLI prompts
│       ├── auth.prompts.ts  # Auth flow prompts
│       └── chat.prompt.ts   # Chat prompts
├── core/
│   ├── auth/                # Authentication
│   │   ├── auth.client.ts   # Better Auth client
│   │   ├── auth.service.ts  # Auth business logic
│   │   └── keychain.service.ts # Secure token storage
│   ├── chat/
│   │   └── chat.service.ts  # Chat API integration
│   ├── cli/
│   │   └── cli.service.ts   # CLI setup and command registration
│   ├── config/
│   │   ├── config.service.ts # Configuration management
│   │   └── constants.ts     # App constants
│   └── user/
│       └── user.service.ts  # User info fetching
├── tui/                     # Terminal User Interface
│   ├── app.tsx              # Main TUI application
│   ├── bootstrap.tsx        # TUI initialization
│   ├── actions/             # TUI data fetching
│   │   ├── conversations.ts # Conversation API calls
│   │   └── user.ts          # User API calls
│   ├── components/          # UI components
│   │   ├── chat-area.tsx    # Main chat display
│   │   ├── chat-input.tsx   # Message input
│   │   ├── chat-list.tsx    # Message list
│   │   ├── commands.tsx     # Command palette
│   │   ├── initializing-screen.tsx
│   │   ├── keyboard-handler.tsx
│   │   ├── logo.tsx         # Cero logo
│   │   ├── message-list.tsx # Message rendering
│   │   ├── sidebar.tsx      # Conversation sidebar
│   │   ├── unauthorized-screen.tsx
│   │   └── user-info.tsx    # User display
│   ├── context/             # React contexts
│   │   ├── auth-context.tsx
│   │   ├── chat-context.tsx
│   │   ├── conversations-context.tsx
│   │   └── ui-context.tsx
│   ├── helpers/
│   │   └── utils.ts         # TUI utilities
│   ├── hooks/               # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-chat.ts
│   │   ├── use-conversations.ts
│   │   └── use-ui.ts
│   └── theme/
│       └── index.ts         # Terminal theme colors
├── types/                   # TypeScript definitions
│   ├── auth.types.ts        # Auth types
│   ├── tui.type.ts          # TUI types
│   ├── user.type.ts         # User types
│   └── util.type.ts         # Utility types
└── utils/
    └── error-handler.util.ts # Error handling utilities
```

## Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **TUI Framework**: OpenTUI (React-based terminal UI)
- **Auth Client**: Better Auth
- **Auth Storage**: cross-keychain (native credential managers)
- **HTTP Client**: Fetch API
- **Styling**: Chalk, Figlet, Boxen

## License

MIT © [Abhishek Singh](https://abhisheksingh.me)

---

<div align="center">
Part of the CeroCode ecosystem
</div>
