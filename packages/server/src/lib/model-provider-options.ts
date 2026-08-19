import { google, type GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import type { ProviderOptions } from "@ai-sdk/provider-utils";

import type { SupportedChatModel } from "@cerocode/shared";

export type GoogleModelId = Extract<
  SupportedChatModel,
  { provider: "google" }
>["id"];
export type GroqModelId = Extract<SupportedChatModel, { provider: "groq" }>["id"];
export type MistralModelId = Extract<
  SupportedChatModel,
  { provider: "mistral" }
>["id"];
export type OpenRouterModelId = Extract<
  SupportedChatModel,
  { provider: "openrouter" }
>["id"];

export const GOOGLE_PROVIDER_OPTIONS: Partial<
  Record<GoogleModelId, ProviderOptions>
> = {
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

export const GROQ_PROVIDER_OPTIONS: Partial<
  Record<GroqModelId, ProviderOptions>
> = {
  "openai/gpt-oss-120b": {
    groq: {
      reasoningFormat: "parsed",
    },
  },
};

export const MISTRAL_PROVIDER_OPTIONS: Partial<
  Record<MistralModelId, ProviderOptions>
> = {};

export const OPENROUTER_PROVIDER_OPTIONS: Partial<
  Record<OpenRouterModelId, ProviderOptions>
> = {};