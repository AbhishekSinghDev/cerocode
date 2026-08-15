# CEROCODE

## Overview

CEROCODE is a monorepo project that includes a server and a CLI tool. This project is built using TypeScript and managed with Bun.

## Project Structure

- `packages/server`: Contains the server-side code.
- `packages/cli`: Contains the CLI tool code.

## Installation

To install the project dependencies, run the following command:

```bash
bun install
```

## Usage

### Development

To start the development server, run:

```bash
bun run dev:server
```

To start the CLI tool in watch mode, run:

```bash
bun run dev:cli
```

### Building

To build the CLI tool, run:

```bash
bun run build:cli
```

### Linking

To link the CLI tool globally, run:

```bash
bun run link:cli
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
