# @cerocode/shared

Types, schemas, and tool contracts shared between the CLI and the server.
Internal workspace package — never published; the CLI build inlines it.

## Contents

- `SUPPORTED_CHAT_MODELS` — the model registry (Groq, Mistral, Google) with
  pricing metadata, plus `DEFAULT_SUPPORTED_CHAT_MODEL`
  (`devstral-small-latest`)
- `Mode` / `modeSchema` — the BUILD / PLAN agent modes
- `toolInputSchemas`, `readOnlyToolContracts`, `buildToolContracts`,
  `getToolContracts(mode)` — the agent tool definitions (readFile,
  listDirectory, glob, grep, writeFile, editFile, bash)

## Scripts

| Script | Description |
| --- | --- |
| `clean` | Remove `node_modules` |
