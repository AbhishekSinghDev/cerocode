# @cerocode/server

Hono API server backing the cerocode CLI. Not published to npm — it is an
internal workspace package.

## What it does

- `POST /auth/callback` — relays the Clerk OAuth callback back to the CLI's
  local callback server (the CLI starts one on a random port during `/login`)
- `GET /sessions` / `GET /sessions/:id` / `POST /sessions` — session CRUD,
  user-scoped via the Clerk-issued OAuth token
- `POST /chat` — validates UI messages, merges them into the persisted
  session, and streams a chat completion (AI SDK v7 `streamText`) with a
  per-mode (BUILD/PLAN) system prompt

`/sessions/*` and `/chat/*` require an authenticated Clerk OAuth token
(`Authorization: Bearer <token>`).

## Environment variables

The server requires `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, and
`DATABASE_URL` (it throws at startup if the Clerk keys are missing). Model
provider keys are read lazily: `GOOGLE_GENERATIVE_AI_API_KEY`,
`GROQ_API_KEY`, `MISTRAL_API_KEY`. Bun loads `.env` from the working
directory automatically.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Run with hot reload |
| `build` | Bundle `src/index.ts` into `dist/` (Bun target) |
| `start` | Run the compiled server from `dist/index.js` |
| `clean` | Remove `node_modules` |
