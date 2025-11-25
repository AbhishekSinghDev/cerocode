// My Details
export const ME = {
  name: "Abhishek Singh",
  email: "abhisheksingh.pf@gmail.com",
  portfolioUrl: "https://abhisheksingh.me",
  githubUrl: "https://github.com/AbhishekSinghDev",
};

// Navigation Links
export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "/docs", label: "Docs" },
  {
    href: "https://github.com/AbhishekSinghDev/cerocode",
    label: "GitHub",
    external: true,
  },
];

// Brand/Theme
export const BRAND = {
  name: "cerocode",
  tagline: "AI-powered terminal assistant",
  colors: {
    primary: "#00ff41",
    cyan: "#00d4ff",
    amber: "#ffb700",
    purple: "#a855f7",
  },
};

// Hero Section
export const HERO = {
  badge: "Open Source",
  headline: "AI in your terminal.",
  subheadline:
    "Cero is a terminal-first AI assistant for developers. Chat with AI, get real-time streaming responses, and keep your conversation history synced across devices. All from the comfort of your command line.",
  highlight: "No API keys required.",
  platforms: ["macOS", "Windows", "Linux"],
};

export const INSTALL_COMMAND = "npm install -g cerocode";

// Features Data
export const FEATURES = [
  {
    id: "chat",
    title: "AI Chat",
    description:
      "Ask questions, get answers, debug code—all without leaving your terminal. Responses stream in real-time, just like ChatGPT.",
    icon: "message-circle",
    color: "#00ff41",
    command: "cero chat",
    status: "Live",
  },
  {
    id: "interactive-ui",
    title: "Interactive Terminal UI",
    description:
      "Proper chat interface in your terminal with input box, sidebar, syntax highlighting, and markdown rendering. Think ChatGPT, but native.",
    icon: "terminal",
    color: "#00ff41",
    command: "cero interactive",
    status: "In Development",
  },
  {
    id: "agent-mode",
    title: "Agent Mode",
    description:
      "Context-aware AI that understands your codebase. Iterative problem solving, code exploration, and task automation.",
    icon: "world",
    color: "#ffb700",
    command: null,
    status: "Planned",
  },
  {
    id: "offline-history",
    title: "Offline-First History",
    description:
      "Browse chat history without internet. Search past conversations instantly. Sync across devices. Never lose code snippets.",
    icon: "history",
    color: "#00d4ff",
    command: null,
    status: "In Development",
  },
  {
    id: "codebase-context",
    title: "Codebase Context",
    description:
      "Full access to your project. Knows your directory, reads relevant files, understands structure. Specific answers, not generic.",
    icon: "brain",
    color: "#a855f7",
    command: null,
    status: "Planned",
  },
  {
    id: "tool-integration",
    title: "Tool Integration",
    description:
      "Context7 for docs, Brave Search API, URL inspection, Git integration, file operations, and custom tools.",
    icon: "puzzle",
    color: "#00d4ff",
    command: null,
    status: "Planned",
  },
  {
    id: "multi-model",
    title: "Multi-Model Support",
    description:
      "Choose between GPT-4, Claude, Gemini, and more. Use the best model for your task.",
    icon: "stack",
    color: "#00ff41",
    command: null,
    status: "Planned",
  },
  {
    id: "crossplatform",
    title: "Cross-Platform",
    description:
      "One codebase, three platforms, zero compromises. Works seamlessly on macOS, Windows, and Linux.",
    icon: "devices",
    color: "#00d4ff",
    command: null,
    status: "Live",
  },

  {
    id: "streaming",
    title: "Real-time Streaming",
    description:
      "Responses stream token-by-token as they're generated. No waiting for the entire response—instant feedback.",
    icon: "bolt",
    color: "#ffb700",
    command: null,
    status: "Live",
  },
];

// Upcoming Features
export const UPCOMING_FEATURES = [
  {
    id: "agent-mode",
    title: "Agent Mode",
    description:
      "Context-aware AI that understands your codebase. Iterative problem solving, code exploration, and task automation.",
    icon: "world",
    color: "#ffb700",
    status: "Planned",
  },
  {
    id: "codebase-context",
    title: "Codebase Context",
    description:
      "Full access to your project. Knows your directory, reads relevant files, understands structure. Specific answers, not generic.",
    icon: "brain",
    color: "#a855f7",
    status: "Planned",
  },
  {
    id: "tool-integration",
    title: "Tool Integration",
    description:
      "Context7 for docs, Brave Search API, URL inspection, Git integration, file operations, and custom tools.",
    icon: "puzzle",
    color: "#00d4ff",
    status: "Planned",
  },
  {
    id: "multi-model",
    title: "Multi-Model Support",
    description:
      "Choose between GPT-4, Claude, Gemini, and more. Use the best model for your task.",
    icon: "stack",
    color: "#00ff41",
    status: "Planned",
  },
];

// How It Works Steps
export const STEPS = [
  {
    number: "01",
    title: "Install and authenticate",
    description: "One npm install, one browser login. No config files needed.",
    command: "npm install -g cerocode && cero login",
    icon: "download",
    color: "#00ff41",
  },
  {
    number: "02",
    title: "Launch interactive mode",
    description:
      "Open the beautiful terminal UI with chat interface, history sidebar, and markdown support.",
    command: "cero interactive",
    icon: "terminal",
    color: "#00d4ff",
  },
  {
    number: "03",
    title: "Chat and build smarter",
    description:
      "Ask questions, debug code, get real-time streaming responses. All in your terminal.",
    command: "Ask anything, get instant answers",
    icon: "message-circle",
    color: "#ffb700",
  },
];

// FAQ Data
export const FAQ_DATA = [
  {
    question: "Do I need API keys?",
    answer:
      "No. Cero handles all AI infrastructure. Just authenticate once with GitHub and you're ready to go. No API keys to manage.",
  },
  {
    question: "What AI models are available?",
    answer:
      "Currently using Google's Generative AI. Multi-model support (GPT-4, Claude, Gemini) is coming soon.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Credentials are stored in your OS's native credential manager (Keychain on macOS, Credential Manager on Windows, libsecret on Linux). We never store passwords or API keys in plain text.",
  },
  {
    question: "Does it work offline?",
    answer:
      "Cero requires an internet connection to communicate with AI models. Offline-first conversation history is coming soon.",
  },
  {
    question: "Can I use it in CI/CD pipelines?",
    answer: "Not yet, but non-interactive mode for automation is on our roadmap.",
  },
  {
    question: "What's coming next?",
    answer:
      "We're actively building interactive terminal UI, offline history, agent mode with codebase context, and tool integrations. Check our GitHub for detailed roadmap.",
  },
];

// Footer Links
export const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/AbhishekSinghDev/cerocode",
        external: true,
      },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "License", href: "/license" },
    ],
  },
];

// Social Links
export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/AbhishekSinghDev/cerocode",
    icon: "brand-github",
  },
  { name: "Twitter", href: "https://twitter.com/cerodev", icon: "brand-twitter" },
  { name: "Discord", href: "https://discord.gg/cero", icon: "brand-discord" },
];
