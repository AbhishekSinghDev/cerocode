# @cerocode/database

Postgres database layer for cerocode: a Drizzle schema and a `postgres-js`
client. Internal workspace package — never published.

## Contents

- `schema` — the `sessions` table (id, user_id, title, messages JSONB,
  created_at, updated_at; indexed on user_id)
- `client` — a `drizzle` instance bound to `process.env.DATABASE_URL`
  (create a pool with `max: 10` connections)

## Environment variables

`DATABASE_URL` is required. `drizzle.config.ts` loads `../../.env` from the
repo root via `dotenv`; at runtime Bun loads `.env` from the working
directory automatically.

## Scripts

| Script | Description |
| --- | --- |
| `push` | Push the Drizzle schema to the database |
| `studio` | Open Drizzle Studio |
