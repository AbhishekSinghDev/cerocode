<div align="center">

# Cero Code

**AI-powered terminal assistant that actually gets you**

[![npm version](https://img.shields.io/npm/v/cero-code.svg)](https://www.npmjs.com/package/cero-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Documentation](#documentation)

<!-- TODO: Add demo here -->
<!-- <img src="assets/demo.gif" alt="Cero Demo" width="800" /> -->

</div>

---

## What is Cero?

Cero is a complete ecosystem that brings AI capabilities directly to your terminal, no API keys to manage, no configuration hell, just install and start coding smarter.

Think LLM meets your terminal, but built specifically for developers. Chat with AI, get real-time streaming responses, and keep your entire conversation history synced across devices. All from the comfort of your command line.

## Features

### Currently Available

#### 🤖 AI Chat in Your Terminal

Ask questions, get answers, debug code, all without leaving your terminal. Responses stream in real-time, just like ChatGPT.

```bash
cero chat "explain what DNS is"
```

#### 🔐 Passwordless Authentication

We use OAuth 2.0 Device Authorization Grant (the same flow Netflix uses for TV login). Authenticate once in your browser, never paste API keys into your terminal again.

```bash
cero login
```

#### 💾 Secure Credential Storage

Your access tokens are stored in your OS's native credential manager (Keychain on macOS, Credential Manager on Windows, libsecret on Linux). We never store passwords or API keys in plain text.

#### 📡 Real-Time Streaming

Responses stream token-by-token as they're generated. No waiting for the entire response before seeing anything—you get instant feedback.

#### 🔄 Cross-Platform Support

Works seamlessly on macOS, Windows, and Linux. One codebase, three platforms, zero compromises.

### Coming Soon

We're actively building features that'll make Cero your go-to terminal assistant:

#### 🎨 Interactive Terminal UI

A proper chat interface in your terminal with:

- Input box at the bottom (like a real chat app)
- Sidebar showing conversation history
- Syntax highlighting for code blocks
- Markdown rendering for formatted text

Think ChatGPT, but native to your terminal.

#### 💾 Offline-First History

Your conversations sync both locally and to the cloud:

- Browse chat history without internet connection
- Search through past conversations instantly
- Sync across all your devices
- Never lose important code snippets or solutions

Unlike web apps that need internet just to load, Cero works offline first.

#### 🤖 Agent Mode

Full-blown AI agent capabilities:

- **Context-Aware**: Understands your current project and codebase
- **Iterative Problem Solving**: Works through problems step-by-step
- **Code Exploration**: Navigates your codebase to find relevant context
- **Task Automation**: Executes multi-step workflows

Similar to Copilot's agent or Cursor, but designed for terminal workflows.

#### 📂 Codebase Context

Since Cero runs in your terminal, it has full access to your project:

- Knows what directory you're in
- Can read relevant files for context
- Understands your project structure
- Gives specific answers, not generic ones

#### 🔧 Tool Integration

Planned integrations to supercharge your workflow:

- **Context7** — Up-to-date library documentation
- **Brave Search API** — Real-time web searches
- **URL Inspection** — Fetch and analyze web content
- **Git Integration** — Understand your commit history and branch structure
- **File Operations** — Read, create, and modify files with permission
- **Custom Tools** — Build your own integrations

#### And More...

- Multi-model support (GPT-4, Claude, Gemini)
- Custom prompts and templates
- Team collaboration features
- Usage analytics and insights
- Plugin system for extensibility

Want to follow along or contribute? Check out our [GitHub repository](https://github.com/AbhishekSinghDev/cero-code).

## Quick Start

### Installation

```bash
npm install -g cero-code
```

Or with pnpm:

```bash
pnpm add -g cero-code
```

### First Time Setup

```bash
# Authenticate via browser (one-time setup)
cero login

# Start chatting
cero chat "explain async/await in JavaScript"

# When you're done
cero logout
```

That's it. No environment variables, no API keys, no config files.

## Architecture

Cero is a monorepo containing three main applications:

### 📱 [Cero CLI](apps/cero-cli)

The terminal client that you interact with daily. Built with TypeScript and Commander.js, it handles authentication, chat interactions, and credential storage.

**Key Features:**

- Device authorization flow
- Real-time streaming responses
- Secure keychain integration
- Cross-platform support

[View CLI Documentation →](apps/cero-cli/README.md)

### 🌐 [Cero Web](apps/cero-web)

The web companion that handles authentication and provides a landing page for the project. Built with Next.js 16, Tailwind CSS v4, and Radix UI.

**Key Features:**

- Device authorization approval UI
- GitHub OAuth integration
- Project documentation
- Responsive design with dark mode

[View Web Documentation →](apps/cero-web/README.md)

### ⚡ [Cero API](apps/cero-api)

The backend powering everything. Built with Next.js 16 as a full-stack API server, using Better Auth, Drizzle ORM, and Inngest for background jobs.

**Key Features:**

- OAuth 2.0 device flow
- AI chat with streaming responses
- Background job processing
- Conversation persistence

[View API Documentation →](apps/cero-api/README.md)

## Tech Stack

### CLI

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **CLI Framework**: Commander.js
- **Auth Storage**: cross-keychain (native credential managers)
- **HTTP Client**: Fetch API

### Web

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI
- **Auth**: Better Auth with GitHub OAuth
- **Forms**: React Hook Form + Zod
- **ORM**: Drizzle

### API

- **Framework**: Next.js 16 (API Routes)
- **Database**: Neon Postgres via Drizzle ORM
- **Auth**: Better Auth (device flow + GitHub OAuth)
- **Background Jobs**: Inngest
- **AI Integration**: Vercel AI SDK + Generative AI OF YOUR CHOICE
- **Validation**: Zod

## Development

### Prerequisites

- Node.js 18 or higher
- pnpm (we use workspaces)
- A Neon Database instance
- Google AI API key
- GitHub OAuth app credentials
- Inngest account

### Setup

```bash
# Clone the repository
git clone https://github.com/AbhishekSinghDev/cero-code.git
cd cero-code

# Install dependencies for all apps
pnpm install

# Set up environment variables for each app
cp apps/cero-api/.env.example apps/cero-api/.env
cp apps/cero-web/.env.example apps/cero-web/.env

# Set up the database
cd apps/cero-api
pnpm db:push
```

### Running Locally

```bash
# Run all apps in development mode
pnpm dev

# Note: I would recommend running your project individually

cd apps/cero-cli && pnpm dev <command>
cd apps/cero-web && pnpm dev
cd apps/cero-api && pnpm dev

# Dont forget to run inngest development server
pnpm dev:inngest
```

### Building

```bash
# Build all apps
pnpm build

# Build individual apps
cd apps/cero-cli && pnpm build
cd apps/cero-web && pnpm build
cd apps/cero-api && pnpm build
```

## Project Structure

```
cero/
├── apps/
│   ├── cero-cli/          # Terminal client
│   │   ├── src/
│   │   │   ├── cli/       # Commands and prompts
│   │   │   ├── core/      # Auth, chat, config
│   │   │   └── utils/     # Helpers
│   │   └── package.json
│   │
│   ├── cero-web/          # Web application
│   │   ├── src/
│   │   │   ├── app/       # Next.js app router
│   │   │   ├── components/# UI components
│   │   │   ├── lib/       # Utilities
│   │   │   └── server/    # Server-side code
│   │   └── package.json
│   │
│   └── cero-api/          # Backend API
│       ├── src/
│       │   ├── app/       # API routes
│       │   └── server/    # Auth, DB, Inngest
│       └── package.json
│
├── package.json           # Workspace root
├── pnpm-workspace.yaml    # pnpm workspace config
├── turbo.json            # Turborepo config
└── README.md             # This file
```

## How It Works

### Authentication Flow

1. User runs `cero login` in terminal
2. CLI requests device code from API
3. API generates code and returns verification URL
4. User opens URL in browser and enters code
5. CLI polls API for token approval
6. On approval, API returns access token
7. CLI stores token in OS keychain
8. Future requests use this token automatically

### Chat Flow

1. User sends message via `cero chat "message"`
2. CLI sends authenticated request to API
3. API triggers Inngest background job
4. Job streams AI response via Inngest Realtime
5. CLI receives tokens as Server-Sent Events
6. Tokens are rendered in real-time

### Data Storage

- **Tokens**: OS native keychain (Keychain, Credential Manager, libsecret)
- **User Data**: Neon Postgres via Drizzle ORM
- **Sessions**: Better Auth with 7-day expiry
- **Conversations**: Postgres with user association

## Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/cool-thing`)
3. Make your changes
4. Write or update tests if applicable
5. Ensure all apps build successfully (`pnpm build`)
6. Commit your changes (`git commit -am 'Add cool thing'`)
7. Push to your branch (`git push origin feature/cool-thing`)
8. Open a Pull Request

### Development Guidelines

- Use TypeScript for all new code
- Follow existing code style (we use Biome for formatting)
- Add JSDoc comments for public APIs
- Update relevant README files
- Test your changes locally before submitting

## Roadmap

- [x] CLI authentication via device flow
- [x] AI chat with streaming responses
- [x] Secure credential storage
- [x] Cross-platform support
- [ ] Tool integrations (Context7, Brave Search, URL inspection)
- [ ] Agent mode with codebase context
- [ ] Interactive terminal UI
- [ ] Offline-first conversation history
- [ ] Multi-model support (GPT-4, Claude, Gemini)
- [ ] Custom prompts and templates
- [ ] Plugin system

See our [GitHub Issues](https://github.com/AbhishekSinghDev/cero-code/issues) for detailed progress.

## License

MIT © [Abhishek Singh](https://abhisheksingh.me)

All three applications (CLI, Web, API) are licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the GitHub CLI's authentication flow
- Built with amazing open-source tools
- Powered by Google's Generative AI

## Links

- [Website](https://cero.abhisheksingh.me)
- [Documentation](https://cero.abhisheksingh.me/docs) (coming soon)
- [GitHub Repository](https://github.com/AbhishekSinghDev/cero-code)
- [npm Package](https://www.npmjs.com/package/cero-code)
- [Report Bug](https://github.com/AbhishekSinghDev/cero-code/issues)
- [Request Feature](https://github.com/AbhishekSinghDev/cero-code/issues)

## Support

If you find Cero useful, consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 📝 Contributing code or documentation

---

<div align="center">

**Built with ❤️ by [Abhishek Singh](https://abhisheksingh.me)**

Made for developers who live in the terminal

</div>
