import {
  messages,
  messageStatusEnum,
  modeEnum,
  roleEnum,
} from "@cerocode/database/schema";
import z from "zod";
import { isSupportedChatModel, resolveChatModel } from "../lib/models";
import { zValidator } from "@hono/zod-validator";
import type { SSEStreamingApi } from "hono/streaming";
import { streamText as aiStreamText } from "ai";
import type { ChatStreamEvent } from "@cerocode/shared";
import { db } from "@cerocode/database/client";

const submitSchema = z.object({
  content: z.string(),
  mode: z.enum(modeEnum.enumValues),
  model: z.string().refine(isSupportedChatModel, "Unsupported model"),
});

const submitValidator = zValidator("json", submitSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }
});

function buildConversationHistory(
  messages: {
    role: (typeof roleEnum.enumValues)[number];
    content: string;
    status: (typeof messageStatusEnum.enumValues)[number];
  }[],
) {
  return messages.flatMap((m) => {
    if (m.role === "ERROR") return [];
    if (m.role === "ASSISTANT" && m.content.length === 0) return [];

    return [
      {
        role: m.role === "USER" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      },
    ];
  });
}

type StreamParams = {
  sessionId: string;
  model: string;
  history: { role: "user" | "assistant"; content: string }[];
  mode: (typeof modeEnum.enumValues)[number];
  abortController: AbortController;
};

async function streamAIResponse(stream: SSEStreamingApi, params: StreamParams) {
  const { sessionId, model, history, mode, abortController } = params;
  const startTime = Date.now();

  const resolvedModel = resolveChatModel(model);
  let fullText = "";

  try {
    const result = aiStreamText({
      model: resolvedModel.model,
      messages: history,
      abortSignal: abortController.signal,
    });

    for await (const part of result.fullStream) {
      if (stream.aborted) break;

      if (part.type === "text-delta") {
        fullText += part.text;
        const event: ChatStreamEvent = { type: "text-delta", text: part.text };
        await stream.writeSSE({
          event: "text-delta",
          data: JSON.stringify(event),
        });
      }

      if (part.type === "error") {
        throw part.error;
      }
    }

    if (stream.aborted || abortController.signal.aborted) return;

    const elapsedMs = Date.now() - startTime;

    const assistantMessage = await db
      .insert(messages)
      .values({
        sessionId: sessionId,
        role: "ASSISTANT",
        status: "COMPLETE",
        model: model,
        content: fullText,
        mode: mode,
        duration: Math.round(elapsedMs / 1000),
      })
      .returning({ id: messages.id });

    const messageId = assistantMessage[0]?.id;

    if (!messageId) {
      throw new Error("Failed to insert assistant message");
    }

    const doneEvent: ChatStreamEvent = {
      type: "done",
      messageId: messageId,
      durationMs: elapsedMs,
    };

    await stream.writeSSE({ event: "done", data: JSON.stringify(doneEvent) });
  } catch (error) {
    if (abortController.signal.aborted) return;

    const message = error instanceof Error ? error.message : String(error);

    await db.insert(messages).values({
      sessionId: sessionId,
      role: "ERROR",
      status: "COMPLETE",
      model: model,
      content: message,
      mode: mode,
    });

    const errorEvent: ChatStreamEvent = {
      type: "error",
      message: message,
    };

    await stream.writeSSE({ event: "error", data: JSON.stringify(errorEvent) });
  }
}
