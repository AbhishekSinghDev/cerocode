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
- [Better Auth](https://www.better-auth.com/) — Authentication with device flow and bearer tokens
- [Drizzle ORM](https://orm.drizzle.team/) — Type-safe database toolkit
- [Neon Database](https://neon.tech/) — Serverless Postgres
- [Inngest](https://www.inngest.com/) — Background jobs and real-time streaming
- [Vercel AI SDK](https://github.com/vercel/ai) — AI model integration with Google Generative AI
- [Zod](https://zod.dev/) — Runtime validation

## Features

### Authentication

- OAuth 2.0 Device Authorization Grant (same flow as Netflix on TV)
- GitHub OAuth integration
- Bearer token authentication for CLI
- Secure session management with 7-day expiry and cookie caching

### AI Chat

- Streaming responses via Inngest Realtime channels
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
- bun
- A Neon Database instance (or any Postgres database)
- Google AI API key
- GitHub OAuth app credentials
- Inngest account (for background jobs)

### Installation

```bash
# Navigate to the API directory
cd apps/cero-api

# Install dependencies
bun install

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
bun db:generate

# Push schema to database
bun db:push

# (Optional) Open Drizzle Studio to view your data
bun db:studio
```

### Development

```bash
# Run the dev server
bun dev

# The API will be available at http://localhost:3001

# Run Inngest dev server (in a separate terminal)
bun dev:inngest
```

### Production

```bash
# Build for production
bun build

# Start the production server
bun start
```

## API Endpoints

### Health Check

- `GET /` — Returns `{ "status": "ok" }`

### Authentication

All Better Auth endpoints are available at `/api/auth/*`:

- `POST /api/auth/device/code` — Request device authorization code
- `POST /api/auth/device/token` — Poll for access token
- `POST /api/auth/sign-in/github` — GitHub OAuth sign-in
- `GET /api/auth/session` — Get current session

### Chat

- `POST /api/chat` — Send a chat message and receive streaming response
  - Requires: `Authorization: Bearer <token>` header
  - Body: `{ "message": "your message", "conversationId": "optional-id" }`
  - Returns: Server-Sent Events stream with tokens

### Conversations

- `GET /api/conversations` — Get all conversations for the authenticated user
  - Requires: `Authorization: Bearer <token>` header
  - Returns: `{ "conversations": [...] }`

- `GET /api/conversations/[id]/messages` — Get all messages in a conversation
  - Requires: `Authorization: Bearer <token>` header
  - Returns: `{ "messages": [...] }`

### User

- `GET /api/user/whoami` — Get authenticated user details
  - Requires: `Authorization: Bearer <token>` header
  - Returns: `{ "user": { "id", "name", "email" } }`

### Background Jobs

- `POST /api/inngest` — Inngest webhook endpoint for background job processing

## How It Works

### Device Authorization Flow

1. CLI requests a device code from `/api/auth/device/code`
2. User opens the verification URL (`/device` on the web app)
3. User enters the code and approves the request
4. CLI polls `/api/auth/device/token` until approved
5. API returns access token to CLI
6. CLI stores token in system keychain

### Chat Streaming

1. Client sends POST request to `/api/chat` with message
2. API triggers Inngest background job
3. Job streams AI response token-by-token via Inngest Realtime channels
4. Tokens are sent back to client as Server-Sent Events
5. Client renders response in real-time

### Realtime Channels

The API uses Inngest Realtime for streaming chat responses:

```typescript
chatChannel = channel((conversationId) => `chat.${conversationId}`)
  .addTopic("token")   // Individual tokens as they're generated
  .addTopic("done")    // Completion signal with full text
  .addTopic("error")   // Error handling
```

## Project Structure

```
src/
├── app/
│   ├── route.ts              # Health check endpoint
│   └── api/
│       ├── auth/
│       │   └── [...all]/     # Better Auth catch-all route
│       ├── chat/             # Chat endpoint
│       ├── conversations/    # Conversation history
│       │   └── [id]/
│       │       └── messages/ # Messages for a conversation
│       ├── inngest/          # Background job webhooks
│       └── user/
│           └── whoami/       # User info endpoint
├── server/
│   ├── better-auth/
│   │   └── config.ts         # Auth configuration
│   ├── db/
│   │   ├── index.ts          # Database client
│   │   └── schema.ts         # Drizzle schema
│   ├── inngest/
│   │   ├── client.ts         # Inngest client
│   │   ├── channels.ts       # Realtime channel definitions
│   │   └── functions/        # Background job handlers
│   └── utils/
│       ├── get-user.ts       # Auth helper
│       └── try-catch.ts      # Error handling utility
├── lib/
│   └── zod-schema.ts         # Validation schemas
├── types/
│   └── inngest.ts            # Inngest type definitions
└── env.ts                    # Environment variable validation
```

## Environment Variables

See `.env.example` for a complete list:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_GITHUB_CLIENT_ID="..."
BETTER_AUTH_GITHUB_CLIENT_SECRET="..."

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY="..."

# Inngest
INNGEST_SIGNING_KEY="..."
INNGEST_EVENT_KEY="..."

# Public URLs
NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Deployment

This API is designed to be deployed on platforms like:

- [Vercel](https://vercel.com) — Zero-config deployment

Make sure to:
1. Set all environment variables in your deployment platform
2. Configure Inngest webhooks to point to your deployed API
3. Update `NEXT_PUBLIC_WEBSITE_URL` and `NEXT_PUBLIC_API_URL` for production

## Contributing

Contributions are welcome! This is part of the Cero monorepo. See the root `CONTRIBUTING.md` for guidelines.

## License

MIT © [Abhishek Singh](https://abhisheksingh.me)

---

<div align="center">
Part of the CeroCode ecosystem
</div>
