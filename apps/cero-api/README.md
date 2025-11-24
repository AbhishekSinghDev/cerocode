<div align="center">

# Cero API

**The backend powering Cero CLI and Web**

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

## What is this?

This is the backend API that powers the Cero ecosystem. It handles authentication via OAuth 2.0 Device Authorization Grant, processes AI chat requests with streaming responses, and manages user data. Built with Next.js 16 as a full-stack API server.

## Stack

- [Next.js 16](https://nextjs.org/) — API routes and server infrastructure
- [Better Auth](https://www.better-auth.com/) — Authentication with device flow
- [Drizzle ORM](https://orm.drizzle.team/) — Type-safe database toolkit
- [Neon Database](https://neon.tech/) — Serverless Postgres
- [Inngest](https://www.inngest.com/) — Background jobs and real-time streaming
- [Vercel AI SDK](https://github.com/vercel/ai) — AI model integration
- [Zod](https://zod.dev/) — Runtime validation

## Features

### Authentication

- OAuth 2.0 Device Authorization Grant (same flow as Netflix on TV)
- GitHub OAuth integration
- Bearer token authentication for CLI
- Secure session management with 7-day expiry

### AI Chat

- Streaming responses via Inngest Realtime
- Background job processing for chat requests
- Conversation and message persistence
- Real-time token streaming to clients

### Database

- User and session management
- Device code flow state tracking
- Conversation history storage
- Drizzle ORM with type-safe queries

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- A Neon Database instance (or any Postgres database)
- Google AI API key
- GitHub OAuth app credentials
- Inngest account (for background jobs)

### Installation

```bash
# Navigate to the API directory
cd apps/cero-api

# Install dependencies
pnpm install

# Set up your environment variables
cp .env.example .env
```

### Environment Setup

Check `.env.example` for all required variables. You'll need:

- Database URL (Neon or Postgres)
- Better Auth credentials and GitHub OAuth keys
- Google AI API key
- Inngest keys
- Public URLs for web and API

### Database Setup

```bash
# Generate migration files
pnpm db:generate

# Push schema to database
pnpm db:push

# (Optional) Open Drizzle Studio to view your data
pnpm db:studio
```

### Development

```bash
# Run the dev server
pnpm dev

# The API will be available at http://localhost:3001
```

### Production

```bash
# Build for production
pnpm build

# Start the production server
pnpm start
```

## API Endpoints

### Authentication

- `POST /api/auth/device/code` — Request device authorization code
- `POST /api/auth/device/token` — Poll for access token
- `POST /api/auth/sign-in/github` — GitHub OAuth sign-in
- `GET /api/auth/session` — Get current session
- All other Better Auth endpoints available at `/api/auth/*`

### Chat

- `POST /api/chat` — Send a chat message and receive streaming response
  - Requires: `Authorization: Bearer <token>` header
  - Body: `{ "message": "your message" }`
  - Returns: Server-Sent Events stream with tokens

### Background Jobs

- `POST /api/inngest` — Inngest webhook endpoint for background job processing

## How It Works

### Device Authorization Flow

1. CLI requests a device code from `/api/auth/device/code`
2. User opens the verification URL in their browser
3. User enters the code and approves the request
4. CLI polls `/api/auth/device/token` until approved
5. API returns access token to CLI
6. CLI stores token in system keychain

### Chat Streaming

1. Client sends POST request to `/api/chat` with message
2. API triggers Inngest background job
3. Job streams AI response token-by-token via Inngest Realtime
4. Tokens are sent back to client as Server-Sent Events
5. Client renders response in real-time

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/        # Better Auth endpoints
│   │   ├── chat/        # Chat API endpoint
│   │   └── inngest/     # Background job webhooks
│   └── route.ts         # Root route
├── server/
│   ├── better-auth/     # Auth configuration
│   ├── db/              # Database schema and client
│   ├── inngest/         # Background job definitions
│   │   ├── functions/   # Job handlers (chat processing)
│   │   └── channels.ts  # Realtime channel definitions
│   └── utils/           # Server utilities
├── lib/                 # Shared utilities
└── types/               # TypeScript types
```

## Environment Variables

See `.env.example` for a complete list of required environment variables.

Key variables:

- `DATABASE_URL` — Postgres connection string
- `BETTER_AUTH_SECRET` — Random secret for auth
- `BETTER_AUTH_GITHUB_CLIENT_ID` / `CLIENT_SECRET` — GitHub OAuth credentials
- `GOOGLE_GENERATIVE_AI_API_KEY` — Google AI API key
- `INNGEST_SIGNING_KEY` / `EVENT_KEY` — Inngest credentials
- `NEXT_PUBLIC_WEBSITE_URL` — Web app URL
- `NEXT_PUBLIC_API_URL` — API URL (this server)

## Deployment

This API is designed to be deployed on platforms like:

- [Vercel](https://vercel.com) — Zero-config deployment
- [Railway](https://railway.app) — Simplified deployment
- [Fly.io](https://fly.io) — Global edge deployment

Make sure to set all environment variables in your deployment platform.

## Contributing

Contributions are welcome! This is part of the Cero monorepo. See the root `CONTRIBUTING.md` for guidelines.

## License

MIT © [Abhishek Singh](https://abhisheksingh.me)

---

<div align="center">
Part of the Cero ecosystem
</div>
