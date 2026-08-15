import {
  getToolContracts,
  modeSchema,
  type ModeType,
  type ToolContracts,
} from "@cerocode/shared";
import {
  convertToModelMessages,
  streamText,
  validateUIMessages,
  type InferUITools,
  type LanguageModelUsage,
  type UIMessage,
} from "ai";
import z from "zod";
import { isSupportedChatModel, resolveChatModel } from "../lib/models";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { AuthenticatedEnv } from "../middleware/require-auth";
import { db } from "@cerocode/database/client";
import { sessions } from "@cerocode/database/schema";
import { and, eq } from "@cerocode/database";
import { buildSystemPrompt } from "../system-prompt";

type ChatMessageMetadata = {
  mode?: ModeType;
  model?: string;
  durationMs?: number;
  usage?: LanguageModelUsage;
};

type CerocodeUIMessage = UIMessage<
  ChatMessageMetadata,
  never,
  InferUITools<ToolContracts>
>;

const submitSchema = z.object({
  id: z.string(),
  messages: z.array(
    z.custom<CerocodeUIMessage>((value) => {
      return (
        value != null &&
        typeof value === "object" &&
        "id" in value &&
        "parts" in value
      );
    }),
  ),
  mode: modeSchema,
  model: z.string().refine(isSupportedChatModel, "Unsupported model"),
});

const submitValidator = zValidator("json", submitSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

function hasPendingToolCalls(message: CerocodeUIMessage) {
  return message.parts.some((part) => {
    if (part.type === "dynamic-tool" || part.type.startsWith("tool-")) {
      const state = (part as { state?: string }).state;
      return state !== "output-available" && state !== "output-error";
    }

    return false;
  });
}

const app = new Hono<AuthenticatedEnv>().post(
  "/",
  submitValidator,
  async (c) => {
    const userId = c.get("userId");
    const { id, messages, mode, model } = c.req.valid("json");

    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.userId, userId)))
      .limit(1);

    const session = result[0];

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const startTime = Date.now();
    const tools = getToolContracts(mode);
    const resolvedModel = resolveChatModel(model);
    const previousMessages = Array.isArray(sessions.messages)
      ? (sessions.messages as unknown as CerocodeUIMessage[])
      : [];
    const mergedMessages = [...previousMessages];

    for (const message of messages) {
      const incomingMessage = {
        ...message,
        metadata: {
          ...message.metadata,
          mode: mode,
          model: model,
        } satisfies ChatMessageMetadata,
      };

      const existingMessageIndex = mergedMessages.findIndex(
        (m) => m.id === incomingMessage.id,
      );

      if (existingMessageIndex === -1) {
        mergedMessages.push(incomingMessage);
      } else {
        mergedMessages[existingMessageIndex] = incomingMessage;
      }
    }

    const nextMessages = await validateUIMessages<CerocodeUIMessage>({
      messages: mergedMessages,
      tools: tools,
    });

    const modelMessages = await convertToModelMessages(nextMessages, {
      tools,
      ignoreIncompleteToolCalls: true,
    });

    const aiResult = streamText({
      model: resolvedModel.model,
      system: buildSystemPrompt({ mode: mode }),
      messages: modelMessages,
      tools: tools,
      providerOptions: resolvedModel.providerOptions,
    });

    return aiResult.toUIMessageStreamResponse<CerocodeUIMessage>({
      originalMessages: nextMessages,
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return { mode: mode, model: model };
        }

        if (part.type !== "finish") return undefined;

        return {
          mode: mode,
          model: model,
          durationMs: Date.now() - startTime,
          ...(part.totalUsage ? { usage: part.totalUsage } : {}),
        };
      },
      onFinish: async (event) => {
        if (event.isAborted) return;

        if (hasPendingToolCalls(event.responseMessage)) return;

        try {
          await db
            .update(sessions)
            .set({ messages: event.messages })
            .where(and(eq(sessions.id, id), eq(sessions.userId, userId)));
        } catch (error) {
          console.error("Failed to persist session messages", error);
        }
      },
    });
  },
);

export default app;
