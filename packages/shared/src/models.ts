export type ModelPricing = {
  inputUsdPerMillionTokens: number;
  outputUsdPerMillionTokens: number;
};

export type SupportedProvider = "anthropic" | "openai" | "google";

type SupportedChatModelDefinition = {
  id: string;
  provider: SupportedProvider;
  pricing: ModelPricing;
};

export const SUPPORTED_CHAT_MODELS = [
  {
    id: "gemini-3.1-pro-preview",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 2,
      outputUsdPerMillionTokens: 12,
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
    id: "gemini-3.5-flash-lite",
    provider: "google",
    pricing: {
      inputUsdPerMillionTokens: 0.3,
      outputUsdPerMillionTokens: 2.5,
    },
  },
] as const satisfies readonly SupportedChatModelDefinition[];

export type SupportedChatModel = (typeof SUPPORTED_CHAT_MODELS)[number];
export type SupportedChatModelId = SupportedChatModel["id"];

export function findSupportedChatModelById(id: string) {
  return SUPPORTED_CHAT_MODELS.find((model) => model.id === id);
}

export const DEFAULT_SUPPORTED_CHAT_MODEL: SupportedChatModelId =
  "gemini-3.5-flash-lite";
