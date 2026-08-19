import {
  DEFAULT_SUPPORTED_CHAT_MODEL,
  SUPPORTED_CHAT_MODELS,
} from "@cerocode/shared";

export type ModelRow = {
  provider: string;
  id: string;
  tier: "free" | "paid";
  isDefault?: boolean;
};

export const MODELS: ModelRow[] = SUPPORTED_CHAT_MODELS.map((model) => ({
  provider: model.provider,
  id: model.id,
  tier:
    model.pricing.inputUsdPerMillionTokens === 0 &&
    model.pricing.outputUsdPerMillionTokens === 0
      ? "free"
      : "paid",
  isDefault: model.id === DEFAULT_SUPPORTED_CHAT_MODEL || undefined,
}));