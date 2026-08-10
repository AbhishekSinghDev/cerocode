import { google, type GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import {
  findSupportedChatModelById,
  type SupportedChatModel,
  type SupportedChatModelId,
  type SupportedProvider,
} from "@cerocode/shared";
import type { ProviderOptions } from "@ai-sdk/provider-utils";

import type { LanguageModel } from "ai";

type GoogleModelId = Extract<SupportedChatModel, { provider: "google" }>["id"];

export type ResolvedModel = {
  model: LanguageModel;
  provider: SupportedProvider;
  modelId: SupportedChatModelId;
  providerOptions?: ProviderOptions;
};

const GOOGLE_PROVIDER_OPTIONS: Partial<Record<GoogleModelId, ProviderOptions>> =
  {
    "gemini-3.1-pro-preview": {
      google: {
        thinkingConfig: {
          thinkingLevel: "high",
          includeThoughts: true,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
    "gemini-3.5-flash-lite": {
      google: {
        thinkingConfig: {
          thinkingLevel: "low",
          includeThoughts: true,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
    "gemini-3.6-flash": {
      google: {
        thinkingConfig: {
          thinkingLevel: "high",
          includeThoughts: true,
        },
      } satisfies GoogleGenerativeAIProviderOptions,
    },
  };

function assertUnsupportedProvider(provider: never): never {
  throw new Error(`Unsupported provider: ${provider}`);
}

function resolveGoogleModel(modelId: GoogleModelId): ResolvedModel {
  return {
    model: google(modelId),
    provider: "google",
    modelId: modelId,
    providerOptions: GOOGLE_PROVIDER_OPTIONS[modelId],
  };
}

function resolveSupportedChatModel(model: SupportedChatModel): ResolvedModel {
  const provider = model.provider;

  switch (provider) {
    case "google":
      return resolveGoogleModel(model.id);
    default:
      return assertUnsupportedProvider(provider);
  }
}

export function isSupportedChatModel(
  modelId: string,
): modelId is SupportedChatModelId {
  return findSupportedChatModelById(modelId) !== null;
}

export function resolveChatModel(modelId: string): ResolvedModel {
  const model = findSupportedChatModelById(modelId);
  if (!model) {
    throw new Error(`Unsupported model: ${modelId}`);
  }

  return resolveSupportedChatModel(model);
}
