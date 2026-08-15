import { google, type GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { mistral } from "@ai-sdk/mistral";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  findSupportedChatModelById,
  type SupportedChatModel,
  type SupportedChatModelId,
  type SupportedProvider,
} from "@cerocode/shared";
import type { ProviderOptions } from "@ai-sdk/provider-utils";

import type { LanguageModel } from "ai";

type GoogleModelId = Extract<SupportedChatModel, { provider: "google" }>["id"];
type GroqModelId = Extract<SupportedChatModel, { provider: "groq" }>["id"];
type MistralModelId = Extract<
  SupportedChatModel,
  { provider: "mistral" }
>["id"];
type OpenRouterModelId = Extract<
  SupportedChatModel,
  { provider: "openrouter" }
>["id"];

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

const GROQ_PROVIDER_OPTIONS: Partial<Record<GroqModelId, ProviderOptions>> = {
  "openai/gpt-oss-120b": {
    groq: {
      reasoningFormat: "parsed",
    },
  },
};

const MISTRAL_PROVIDER_OPTIONS: Partial<
  Record<MistralModelId, ProviderOptions>
> = {};

const OPENROUTER_PROVIDER_OPTIONS: Partial<
  Record<OpenRouterModelId, ProviderOptions>
> = {};

// Reads the OPENROUTER_API_KEY environment variable.
const openrouter = createOpenRouter();

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

function resolveGroqModel(modelId: GroqModelId): ResolvedModel {
  return {
    model: groq(modelId),
    provider: "groq",
    modelId: modelId,
    providerOptions: GROQ_PROVIDER_OPTIONS[modelId],
  };
}

function resolveMistralModel(modelId: MistralModelId): ResolvedModel {
  return {
    model: mistral(modelId),
    provider: "mistral",
    modelId: modelId,
    providerOptions: MISTRAL_PROVIDER_OPTIONS[modelId],
  };
}

function resolveOpenRouterModel(modelId: OpenRouterModelId): ResolvedModel {
  return {
    model: openrouter.chat(modelId),
    provider: "openrouter",
    modelId: modelId,
    providerOptions: OPENROUTER_PROVIDER_OPTIONS[modelId],
  };
}

function resolveSupportedChatModel(model: SupportedChatModel): ResolvedModel {
  const provider = model.provider;

  switch (provider) {
    case "google":
      return resolveGoogleModel(model.id);
    case "groq":
      return resolveGroqModel(model.id);
    case "mistral":
      return resolveMistralModel(model.id);
    case "openrouter":
      return resolveOpenRouterModel(model.id);
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
