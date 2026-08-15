export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider =
  | "anthropic"
  | "openai"
  | "google"
  | "groq"
  | "mistral"
  | "openrouter";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    // Fastest model on Groq (~1,000 tok/s) with the same 200K TPD ceiling as the
    // 120b variant, so you get more completed calls per day for the same budget.
    id: "openai/gpt-oss-20b",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Same rate limits as gpt-oss-20b (30 RPM / 8K TPM / 200K TPD) but noticeably
    // smarter — good default for actual agentic/coding steps.
    id: "openai/gpt-oss-120b",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Vision-capable, general-purpose — keep after the gpt-oss models since it's
    // newer/less battle-tested on Groq's free tier.
    id: "qwen/qwen3.6-27b",
    provider: "groq",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },

  // --- Mistral (free "Experiment" tier, no card, phone verification) ---
  // Rate limit is uniform across all models (1 req/sec, 500K TPM, 1B tokens/month),
  // so ordering here is by token-efficiency for that shared budget, not by RPM/TPM.
  {
    // Smallest general model still good enough for most harness steps — stretches
    // the 1B token/month budget furthest.
    id: "ministral-8b-latest",
    provider: "mistral",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Best default balance of smartness vs. token spend for general agent turns.
    id: "mistral-small-latest",
    provider: "mistral",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Built specifically for agentic coding workflows — use for the actual
    // read/write/edit tool-calling loop.
    id: "devstral-small-latest",
    provider: "mistral",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Code-specialized, 256K context — reach for this on larger diffs/refactors.
    id: "codestral-latest",
    provider: "mistral",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },
  {
    // Flagship — smartest but heaviest, burns the shared token budget fastest.
    // Reserve for the hardest planning/reasoning steps only.
    id: "mistral-large-latest",
    provider: "mistral",
    pricing: {
      inputUsdPerMillionTokens: 0,
      outputUsdPerMillionTokens: 0,
    },
  },

  // --- OpenRouter (paid, one key for hundreds of models) ---
  {
    // GA release of DeepSeek V4 Flash (re-post-trained revision, Jul 31 2026).
    // Sparse MoE — 13B active params out of 284B — 1M-token context, built for
    // coding, reasoning, and agent workflows.
    id: "deepseek/deepseek-v4-flash-0731",
    provider: "openrouter",
    pricing: {
      inputUsdPerMillionTokens: 0.07826,
      outputUsdPerMillionTokens: 0.1565,
    },
  },

  // --- Google (paid) ---
  {
    id: "gemini-3.5-flash-lite",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0.3,
      outputUsdPerMillionTokens: 2.5,
    },
  },
  {
    id: "gemini-2.5-flash",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0.3,
      outputUsdPerMillionTokens: 2.5,
    },
  },
  {
    id: "gemini-3.6-flash",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 1.5,
      outputUsdPerMillionTokens: 7.5,
    },
  },
  {
    id: "gemini-3.1-pro-preview",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 2,
      outputUsdPerMillionTokens: 12,
    },
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];
export type SupportedChatModelId = SupportedChatModel["id"];

export function findSupportedChatModelById(id: string) {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === id);
}

// Default points at the highest-headroom free-tier model so the harness can run
// a lot of test iterations before hitting any rate limit.
export const DEFAULT_SUPPORTED_CHAT_MODEL: SupportedChatModelId =
  "devstral-small-latest";
