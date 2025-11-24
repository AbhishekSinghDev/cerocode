<div align="center">
  <h1>Cero Web</h1>
  <p>The web companion for Cero CLI — authentication, device authorization, and everything in between.</p>

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

## What is this?

This is where the magic happens when you run `cero login` in your terminal. While the CLI handles your day-to-day workflow, this web app takes care of authentication and provides a landing page for the project.

We're using OAuth 2.0 Device Authorization Grant (the same flow you see when signing into Netflix on your TV) to let you securely connect your terminal sessions without typing passwords into the command line.

## Why?

Because nobody wants to paste API keys into their terminal. This web app handles the OAuth dance so you can authenticate through your browser like a civilized human being.

## What's inside

- **Device Flow Auth** — Secure terminal authentication without passwords
- **GitHub OAuth** — Sign in with your GitHub account (powered by Better Auth)
- **Modern Stack** — Next.js 16, Tailwind v4, TypeScript, Drizzle ORM
- **Dark Mode** — Because your eyes matter
- **Type Safety** — Zod + TypeScript keeping things tight

## Stack

- [Next.js 16](https://nextjs.org/) — React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com/) — Styling
- [Radix UI](https://www.radix-ui.com/) — Unstyled, accessible components
- [Better Auth](https://www.better-auth.com/) — Authentication
- [Drizzle ORM](https://orm.drizzle.team/) — Database toolkit
- [Zod](https://zod.dev/) — Schema validation

## Getting Started

First, make sure you have Node.js (v18+) and pnpm installed.

```bash
# Navigate to the web app
cd apps/web

# Install dependencies
pnpm install

# Set up your environment variables
cp .env.example .env

# Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and you're good to go.

### Environment Variables

```env
NEXT_PUBLIC_API_URL=${SERVER_URL}
```

## How the Device Flow Works

1. You run `cero login` in your terminal
2. CLI generates a unique code and shows you a URL
3. You open the URL in your browser (handled by `/device`)
4. Enter the code and approve the request
5. CLI receives the access token
6. You're authenticated!

This is the same flow Netflix uses when you sign in on your TV. Secure, simple, no password typing in the terminal.

## Project Structure

```
src/
├── app/
│   ├── device/          # Device authorization pages
│   ├── login/           # Auth pages
│   └── page.tsx         # Landing page
├── components/
│   ├── landing-page/    # Hero, features, etc.
│   ├── ui/              # Reusable components
│   └── shared/          # Shared stuff
├── lib/                 # Utils and helpers
└── styles/              # Global CSS
```

## Contributing

Found a bug? Want to add a feature? PRs are welcome!

1. Fork it
2. Create your feature branch (`git checkout -b feature/cool-thing`)
3. Commit your changes (`git commit -am 'Add cool thing'`)
4. Push to the branch (`git push origin feature/cool-thing`)
5. Open a Pull Request

## License

MIT — see [LICENSE](../../LICENSE) for details.

---

<div align="center">
Part of the Cero ecosystem
</div>
