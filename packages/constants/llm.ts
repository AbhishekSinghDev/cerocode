export const DEFAULT_AI_MODEL_ID = "gemini-2.5-flash-lite";

export const SUPPORTED_AI_TOOLS = [
  {
    id: "google_search",
    name: "Google Search",
    description: "Access latest information via Google Search",
  },
  {
    id: "url_context",
    name: "URL Context",
    description: "Analyze content from specific URLs",
  },
  {
    id: "code_execution",
    name: "Code Execution",
    description: "Execute Python code for calculations",
  },
] as const;

export type SupportedAIToolId = (typeof SUPPORTED_AI_TOOLS)[number]["id"];

export const SUPPORTED_AI_MODELS = [
  {
    id: "gemini-3-pro-preview",
    name: "Gemini 3 Pro Preview",
    description: "Latest preview model",
    provider: "Google",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Most capable",
    provider: "Google",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Fast & efficient",
    provider: "Google",
  },
  {
    id: "gemini-2.5-flash-lite",
    name: "Gemini 2.5 Flash Lite",
    description: "Lightweight",
    provider: "Google",
  },
  {
    id: "gemini-2.0-flash-lite",
    name: "Gemini 2.0 Flash Lite",
    description: "Fast multimodal",
    provider: "Google",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Fast multimodal",
    provider: "Google",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    description: "High performance",
    provider: "Google",
  },
  {
    id: "gemini-1.5-pro-latest",
    name: "Gemini 1.5 Pro Latest",
    description: "Latest stable",
    provider: "Google",
  },
  {
    id: "gemini-1.5-flash",
    name: "Gemini 1.5 Flash",
    description: "Balanced",
    provider: "Google",
  },
  {
    id: "gemini-1.5-flash-latest",
    name: "Gemini 1.5 Flash Latest",
    description: "Latest flash",
    provider: "Google",
  },
] as const;
