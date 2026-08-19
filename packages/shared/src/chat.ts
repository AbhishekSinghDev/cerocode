import type { InferUITools, LanguageModelUsage, UIMessage } from "ai";

import type { ModeType, ToolContracts } from "./schemas";

export type ChatMessageMetadata = {
  mode?: ModeType;
  model?: string;
  durationMs?: number;
  usage?: LanguageModelUsage;
};

export type CerocodeUIMessage = UIMessage<
  ChatMessageMetadata,
  never,
  InferUITools<ToolContracts>
>;