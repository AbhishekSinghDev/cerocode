import {
  messages,
  messageStatusEnum,
  modeEnum,
  roleEnum,
} from "@cerocode/database/schema";
import z from "zod";
import { isSupportedChatModel, resolveChatModel } from "../lib/models";
import { zValidator } from "@hono/zod-validator";
import { streamSSE, type SSEStreamingApi } from "hono/streaming";
import { streamText as aiStreamText, stepCountIs } from "ai";
import {
  messagePartsSchema,
  toolCallArgsSchema,
  type ChatStreamEvent,
  type MessagePart,
} from "@cerocode/shared";
import { db } from "@cerocode/database/client";
import { Hono } from "hono";
import { createTools } from "../tools";
import { buildSystemPrompt } from "../system-prompt";
import type { AuthenticatedEnv } from "../middleware/require-auth";

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

const activeResumeSessionIds = new Set<string>();

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

function getResumeableUserMessage(
  messages: {
    role: (typeof roleEnum.enumValues)[number];
    model: string;
    mode: (typeof modeEnum.enumValues)[number];
  }[],
) {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage || lastMessage.role !== "USER") {
    return null;
  }

  return lastMessage;
}

type StreamParams = {
  sessionId: string;
  model: string;
  cwd: string | null;
  history: { role: "user" | "assistant"; content: string }[];
  mode: (typeof modeEnum.enumValues)[number];
  abortController: AbortController;
};

async function streamAIResponse(stream: SSEStreamingApi, params: StreamParams) {
  const { sessionId, model, cwd, history, mode, abortController } = params;
  const startTime = Date.now();
  const tools = cwd ? createTools(cwd, mode) : undefined;
  const parts: MessagePart[] = [];
  const resolvedModel = resolveChatModel(model);

  const persistInterruptedMessage = async () => {
    const fullText = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    if (fullText.length === 0 && parts.length === 0) return;

    const elapsedMs = Date.now() - startTime;
    const validatedParts =
      parts.length > 0 ? messagePartsSchema.parse(parts) : undefined;

    await db.insert(messages).values({
      sessionId: sessionId,
      role: "ASSISTANT",
      status: "INTERRUPTED",
      model: model,
      content: fullText,
      parts: validatedParts,
      mode: mode,
      duration: Math.round(elapsedMs / 1000),
    });
  };

  try {
    const result = aiStreamText({
      model: resolvedModel.model,
      system: buildSystemPrompt({ cwd, mode }),
      messages: history,
      tools: tools,
      stopWhen: tools ? stepCountIs(50) : undefined,
      abortSignal: abortController.signal,
      providerOptions: resolvedModel.providerOptions,
    });

    for await (const part of result.fullStream) {
      if (stream.aborted) break;

      if (part.type === "reasoning-delta") {
        const last = parts[parts.length - 1];
        if (last && last.type === "reasoning") {
          last.text += part.text;
        } else {
          parts.push({ type: "reasoning", text: part.text });
        }

        const event: ChatStreamEvent = {
          type: "reasoning-delta",
          text: part.text,
        };
        await stream.writeSSE({
          event: "reasoning-delta",
          data: JSON.stringify(event),
        });
      }

      if (part.type === "text-delta") {
        const last = parts[parts.length - 1];
        if (last && last.type === "text") {
          last.text += part.text;
        } else {
          parts.push({ type: "text", text: part.text });
        }

        const event: ChatStreamEvent = {
          type: "text-delta",
          text: part.text,
        };
        await stream.writeSSE({
          event: "text-delta",
          data: JSON.stringify(event),
        });
      }

      if (part.type === "tool-call") {
        const args = toolCallArgsSchema.parse(part.input);

        parts.push({
          type: "tool-call",
          id: part.toolCallId,
          name: part.toolName,
          args: args,
        });

        const event: ChatStreamEvent = {
          type: "tool-call",
          toolCallId: part.toolCallId,
          toolName: part.toolName,
          args: args,
        };
        await stream.writeSSE({
          event: "tool-call",
          data: JSON.stringify(event),
        });
      }

      if (part.type === "tool-result") {
        const resultStr =
          typeof part.output === "string"
            ? part.output
            : JSON.stringify(part.output);

        const tcPart = parts.find(
          (p): p is Extract<MessagePart, { type: "tool-call" }> =>
            p.type === "tool-call" && p.id === part.toolCallId,
        );

        if (tcPart) {
          tcPart.result = resultStr;
        }

        const event: ChatStreamEvent = {
          type: "tool-result",
          toolCallId: part.toolCallId,
          result: resultStr,
        };
        await stream.writeSSE({
          event: "tool-result",
          data: JSON.stringify(event),
        });
      }

      if (part.type === "error") {
        throw part.error;
      }
    }

    if (stream.aborted || abortController.signal.aborted) {
      await persistInterruptedMessage();
      return;
    }

    const elapsedMs = Date.now() - startTime;
    const fullText = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    const validatedParts =
      parts.length > 0 ? messagePartsSchema.parse(parts) : undefined;

    const assistantMessage = await db
      .insert(messages)
      .values({
        sessionId: sessionId,
        role: "ASSISTANT",
        status: "COMPLETE",
        model: model,
        content: fullText,
        parts: validatedParts,
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
    if (abortController.signal.aborted) {
      await persistInterruptedMessage();
      return;
    }

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

const app = new Hono<AuthenticatedEnv>()
  .post("/:sessionId/resume", async (c) => {
    const userId = c.get("userId");
    const sessionId = c.req.param("sessionId");

    const session = await db.query.sessions.findFirst({
      where: { id: sessionId, userId: userId },
      with: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const resumeableMessage = getResumeableUserMessage(session.messages);
    if (!resumeableMessage) {
      return c.json(
        { error: "Session has no pending user message to resume" },
        409,
      );
    }

    if (!isSupportedChatModel(resumeableMessage.model)) {
      return c.json(
        { error: `Session uses unsupported model: ${resumeableMessage.model}` },
        409,
      );
    }

    if (activeResumeSessionIds.has(sessionId)) {
      return c.json(
        { error: `Session ${sessionId} is already being resumed` },
        409,
      );
    }

    activeResumeSessionIds.add(sessionId);

    const history = buildConversationHistory(session.messages);
    const abortController = new AbortController();

    try {
      return streamSSE(
        c,
        async (stream) => {
          stream.onAbort(() => {
            abortController.abort();
          });

          try {
            await streamAIResponse(stream, {
              sessionId: sessionId,
              model: resumeableMessage.model,
              cwd: session.cwd,
              history: history,
              mode: resumeableMessage.mode,
              abortController: abortController,
            });
          } finally {
            activeResumeSessionIds.delete(sessionId);
          }
        },
        async (error, stream) => {
          activeResumeSessionIds.delete(sessionId);
          const message =
            error instanceof Error ? error.message : String(error);
          const errorEvent: ChatStreamEvent = {
            type: "error",
            message: message,
          };

          await stream.writeSSE({
            event: "error",
            data: JSON.stringify(errorEvent),
          });
        },
      );
    } catch (error) {
      activeResumeSessionIds.delete(sessionId);
      throw error;
    }
  })
  .post("/:sessionId", submitValidator, async (c) => {
    const sessionId = c.req.param("sessionId");
    const userId = c.get("userId");

    const session = await db.query.sessions.findFirst({
      where: { id: sessionId, userId: userId },
      with: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!session) {
      return c.json({ error: "Session not found" }, 404);
    }

    const data = c.req.valid("json");

    await db.insert(messages).values({
      sessionId: sessionId,
      role: "USER",
      status: "COMPLETE",
      model: data.model,
      content: data.content,
      mode: data.mode,
    });

    const history = buildConversationHistory([
      ...session.messages,
      {
        role: "USER",
        content: data.content,
        status: "COMPLETE",
      },
    ]);

    const abortController = new AbortController();

    return streamSSE(
      c,
      async (stream) => {
        stream.onAbort(() => {
          abortController.abort();
        });

        await streamAIResponse(stream, {
          sessionId: sessionId,
          model: data.model,
          cwd: session.cwd,
          history: history,
          mode: data.mode,
          abortController: abortController,
        });
      },
      async (error, stream) => {
        const message = error instanceof Error ? error.message : String(error);
        const errorEvent: ChatStreamEvent = { type: "error", message: message };

        await stream.writeSSE({
          event: "error",
          data: JSON.stringify(errorEvent),
        });
      },
    );
  });

export default app;
