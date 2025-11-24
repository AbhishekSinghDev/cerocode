// My Details
export const ME = {
  name: "Abhishek Singh",
  portfolioUrl: "https://abhisheksingh.me",
  githubUrl: "https://github.com/AbhishekSinghDev",
};

// Navigation Links
export const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  {
    href: "https://github.com/AbhishekSinghDev/cero-cli",
    label: "GitHub",
    external: true,
  },
];

// Features Data
export const FEATURES_TABS = [
  {
    id: "chat",
    title: "Direct LLM Conversations",
    description:
      "Ask questions and get instant AI responses right in your terminal. Perfect for quick coding help, explanations, and debugging assistance.",
    code: `$ cero chat "how do I reverse a string in Python?"

✨ Here are three ways to reverse a string in Python:

1. Using slicing (most Pythonic):
   reversed_str = original_str[::-1]

2. Using reversed() function:
   reversed_str = ''.join(reversed(original_str))

3. Using a loop:
   reversed_str = ''
   for char in original_str:
       reversed_str = char + reversed_str`,
  },
  {
    id: "agent",
    title: "Internet Search & Code Execution",
    description:
      "Enable agent mode to search the web for current information and execute code snippets. Get real-time data and validated solutions.",
    code: `$ cero agent "what's the latest Next.js version?"

🔍 Searching the web...
📊 Found 3 sources

Latest Next.js version: 14.0.4 (Released Nov 2023)

Key features:
• Turbopack improvements (5x faster)
• Server Actions (stable)
• Partial Prerendering (preview)

Source: nextjs.org/blog/next-14`,
  },
  {
    id: "history",
    title: "Session History & Search",
    description:
      "All conversations are automatically saved and searchable. Never lose important insights or code snippets from previous sessions.",
    code: `$ cero history search "async"

Found 5 conversations:

[2 days ago] "explain async/await"
[1 week ago] "async function error handling"
[2 weeks ago] "Promise vs async/await"

$ cero history show 1

[Session from 2 days ago]
You: explain async/await
AI: Async/await is a way to write...`,
  },
];

// How It Works Steps
export const STEPS = [
  {
    number: "01",
    title: "Install via npm",
    description: "Get started in seconds with a simple npm install command",
    command: "npm install -g cero-code",
    color: "#FF6B6B",
  },
  {
    number: "02",
    title: "Authenticate in browser",
    description: "Secure device code flow - no API keys to manage",
    command: "cero login",
    color: "#06B6D4",
  },
  {
    number: "03",
    title: "Start chatting",
    description: "Ask questions, get answers, and boost your productivity",
    command: 'cero chat "help me code"',
    color: "#374151",
  },
];

// Code Examples
export const CODE_EXAMPLES = [
  {
    id: "chat",
    title: "Normal Chat",
    description: "Quick answers to development questions",
    code: `$ cero chat "what's the difference between let and const?"

✨ Great question! Here's the key difference:

const:
- Cannot be reassigned after initialization
- Must be initialized when declared
- Block-scoped
- Use for values that won't change

let:
- Can be reassigned
- Can be declared without initialization
- Block-scoped
- Use for values that will change

Example:
const API_KEY = 'abc123';  // Can't reassign
let counter = 0;           // Can reassign
counter = 1;               // ✅ Works
API_KEY = 'new';           // ❌ Error!`,
  },
  {
    id: "search",
    title: "Web Search",
    description: "Get current information from the internet",
    code: `$ cero agent "latest tailwind css version and new features"

🔍 Searching the web...
📊 Found 5 sources

Latest Version: Tailwind CSS v3.4.1 (January 2024)

New Features:
✨ Dynamic breakpoints
✨ Extended color palette
✨ Improved typography plugin
✨ Container queries support
✨ New arbitrary variants

Popular Changes:
- Simplified configuration
- Better IntelliSense support
- Reduced bundle size (~10% smaller)

Sources:
• tailwindcss.com/blog
• github.com/tailwindlabs
• Official documentation`,
  },
  {
    id: "execute",
    title: "Code Execution",
    description: "Run and test code snippets instantly",
    code: `$ cero agent "write and test a fibonacci function in python"

🤖 Agent Mode: Creating and testing...

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

▶️ Running tests...

Test 1: fibonacci(5) = 5 ✅
Test 2: fibonacci(10) = 55 ✅
Test 3: fibonacci(0) = 0 ✅

💡 Note: This recursive solution works but is O(2^n).
For better performance, consider using memoization
or an iterative approach!`,
  },
];

// Testimonials
export const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "TechCorp",
    avatar: "SC",
    quote:
      "Finally, a CLI tool that actually understands what I'm asking. The agent mode with web search has saved me hours of documentation diving.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "StartupXYZ",
    avatar: "MR",
    quote:
      "I've tried every AI coding assistant out there. Cero's simplicity and terminal integration make it my go-to for quick questions and code snippets.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "DevOps Engineer",
    company: "CloudScale",
    avatar: "EW",
    quote:
      "The session history feature is a game-changer. I can revisit past solutions and build a personal knowledge base right in my terminal.",
    rating: 5,
  },
  {
    name: "Alex Kumar",
    role: "Backend Developer",
    company: "DataFlow Inc",
    avatar: "AK",
    quote:
      "No API keys to manage, no complex setup. Just install and start coding smarter. This is how developer tools should work.",
    rating: 5,
  },
];

// Pricing Plans
export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started and personal projects",
    badge: null,
    features: [
      "50 messages per day",
      "Access to GPT-3.5",
      "Basic chat mode",
      "Session history (7 days)",
      "Community support",
      "All core features",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For professional developers who need more power",
    badge: "Most Popular",
    features: [
      "Unlimited messages",
      "Access to GPT-4 & Claude",
      "Agent mode with web search",
      "Unlimited session history",
      "Priority support",
      "Code execution",
      "Advanced search",
      "Early access to new features",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For teams and organizations with specific needs",
    badge: null,
    features: [
      "Everything in Pro",
      "Custom model deployment",
      "On-premise hosting",
      "SSO & advanced security",
      "Dedicated support",
      "SLA guarantee",
      "Custom integrations",
      "Team analytics",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

// FAQ Data
export const FAQ_DATA = [
  {
    question: "How do I install cero?",
    answer:
      "Installing cero is simple! Just run 'npm install -g cero-code' in your terminal. Make sure you have Node.js 16+ installed. After installation, run 'cero login' to authenticate, and you're ready to start chatting with AI.",
  },
  {
    question: "Do I need my own API keys?",
    answer:
      "No! That's one of the best features of cero. We handle all the API keys and infrastructure for you. Just install, authenticate once with your account, and start using it immediately. No need to sign up for OpenAI, Anthropic, or manage any API keys yourself.",
  },
  {
    question: "What models are supported?",
    answer:
      "Free users get access to GPT-3.5 Turbo. Pro users can choose from GPT-4, GPT-4 Turbo, Claude 3 (Haiku, Sonnet, and Opus), and other popular models. Enterprise customers can request custom model deployments or use their own model endpoints.",
  },
  {
    question: "Is my data stored anywhere?",
    answer:
      "We take privacy seriously. Your conversations are stored locally on your machine by default. Session history is encrypted and stored in a local database. For Pro users who enable cloud sync, data is encrypted in transit and at rest. We never use your data to train models, and you can delete all history at any time.",
  },
  {
    question: "Can I use this in CI/CD?",
    answer:
      "Yes! Cero can be used in automated workflows. You can authenticate using environment variables (CERO_API_KEY) and run commands in non-interactive mode. This is great for generating documentation, code reviews, or automated testing. Check our docs for CI/CD examples.",
  },
  {
    question: "How does authentication work?",
    answer:
      "We use a secure device code flow, similar to GitHub CLI. Run 'cero login', and you'll get a code to enter in your browser. This creates a secure session token stored locally. No passwords are stored on your machine, and you can revoke access anytime from your account dashboard.",
  },
  {
    question: "What's the difference between chat and agent mode?",
    answer:
      "Chat mode is for direct LLM conversations - fast, straightforward Q&A. Agent mode (Pro feature) is more powerful: it can search the web for current information, execute code snippets, and perform multi-step reasoning. Use chat for quick questions, agent mode for complex tasks requiring external data.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Absolutely! You can cancel your Pro subscription at any time from your account settings. You'll retain Pro features until the end of your billing period, then automatically switch to the Free tier. No hidden fees, no questions asked. We also offer a 14-day money-back guarantee.",
  },
];

// Footer Sections
export const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Documentation", href: "/docs" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "GitHub", href: "https://github.com/yourusername/cero" },
      { label: "Community", href: "/community" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Brand", href: "/brand" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "License", href: "/license" },
    ],
  },
];

// Social Links
export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    href: "https://github.com/yourusername/cero",
    icon: "brand-github",
  },
  {
    name: "Twitter",
    href: "https://twitter.com/cerodev",
    icon: "brand-twitter",
  },
  {
    name: "Discord",
    href: "https://discord.gg/cero",
    icon: "brand-discord",
  },
];

// Brand Colors
export const COLORS = {
  primary: "#FF6B6B",
  cyan: "#06B6D4",
  darkGrey: "#111827",
  mediumGrey: "#374151",
};

// Hero Section
export const HERO_BADGE_TEXT = "Free • Open Source • No API Key Required";
export const HERO_HEADLINE = "AI-Powered CLI for Developers";
export const HERO_SUBHEADLINE =
  "Chat with LLMs, search the web, and execute code—all from your terminal";
export const INSTALL_COMMAND = "npm install -g cero-code";
