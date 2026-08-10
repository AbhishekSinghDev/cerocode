import {
  chatStreamEventSchema,
  type SupportedChatModelId,
} from "@cerocode/shared";
import type { ClientResponse } from "hono/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";

import { EventSourceParserStream } from "eventsource-parser/stream";
import prettyMilliseconds from "pretty-ms";
import { apiClient } from "../lib/api-client";

export type ClientToolCallPart = {
  type: "tool-call";
  id: string;
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status: "calling" | "done";
};
export type ClientMessagePart =
  | { type: "reasoning"; text: string }
  | ClientToolCallPart
  | { type: "text"; text: string };

export type Message =
  | {
      id: string;
      role: "user";
      content: string;
      mode: "BUILD" | "PLAN";
      model: SupportedChatModelId;
    }
  | {
      id: string;
      role: "assistant";
      content: string;
      mode: "BUILD" | "PLAN";
      model: SupportedChatModelId;
      parts: ClientMessagePart[];
      duration?: string;
      interrupted?: boolean;
    }
  | {
      id: string;
      role: "error";
      content: string;
    };

type StreamingState =
  | {
      status: "idle";
    }
  | {
      status: "streaming";
      parts: ClientMessagePart[];
      mode: "BUILD" | "PLAN";
      model: SupportedChatModelId;
    };

type ActiveStream = {
  requestId: string;
  controller: AbortController;
  mode: "BUILD" | "PLAN";
  model: SupportedChatModelId;
  parts: ClientMessagePart[];
  interruptedCaptured: boolean;
};

type SubmitParams = {
  userText: string;
  mode: "BUILD" | "PLAN";
  model: SupportedChatModelId;
};

type RunStreamParams = {
  mode: "BUILD" | "PLAN";
  model: SupportedChatModelId;
  request: (controller: AbortController) => Promise<ClientResponse<unknown>>;
};

export function useChat(sessionId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streaming, setStreaming] = useState<StreamingState>({
    status: "idle",
  });
  const activeStreamRef = useRef<ActiveStream | null>(null);

  const updateMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      setMessages((prev) => updater(prev));
    },
    [],
  );

  const isActiveRequest = useCallback((requestId: string) => {
    return activeStreamRef.current?.requestId === requestId;
  }, []);

  const emitParts = useCallback(
    (requestId: string, parts: ClientMessagePart[]) => {
      if (!isActiveRequest(requestId)) return;

      const snapshot = [...parts];
      const activeStream = activeStreamRef.current;
      if (!activeStream) return;

      activeStream.parts = snapshot;
      setStreaming({
        status: "streaming",
        parts: snapshot,
        mode: activeStream.mode,
        model: activeStream.model,
      });
    },
    [isActiveRequest],
  );

  const captureInterrupted = useCallback((activeStream: ActiveStream) => {
    if (activeStream.interruptedCaptured || activeStream.parts.length === 0)
      return;

    activeStream.interruptedCaptured = true;
    const parts = [...activeStream.parts];
    const fullText = parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    updateMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: fullText,
        mode: activeStream.mode,
        model: activeStream.model,
        parts: [...parts],
        interrupted: true,
      },
    ]);
  }, []);

  const clearStream = useCallback(
    (requestId: string) => {
      if (!isActiveRequest(requestId)) return;

      activeStreamRef.current = null;
      setStreaming({ status: "idle" });
    },
    [isActiveRequest],
  );

  const handleStream = useCallback(
    async (response: ClientResponse<unknown>, activeStream: ActiveStream) => {
      if (!isActiveRequest(activeStream.requestId)) return;

      if (!response.ok) {
        const messaage = await getErrorMessage(response);
        updateMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "error",
            content: messaage,
          },
        ]);
        return;
      }

      const parts: ClientMessagePart[] = [];

      const stream = response
        .body!.pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream());

      for await (const { data } of stream) {
        if (!isActiveRequest(activeStream.requestId)) return;

        let event;
        try {
          event = chatStreamEventSchema.parse(JSON.parse(data));
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Invalid stream event";
          updateMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "error",
              content: message,
            },
          ]);
          break;
        }

        switch (event.type) {
          case "reasoning-delta": {
            const last = parts[parts.length - 1];
            if (last && last.type === "reasoning") {
              last.text += event.text;
            } else {
              parts.push({ type: "reasoning", text: event.text });
            }
            emitParts(activeStream.requestId, parts);
            break;
          }
          case "tool-call": {
            parts.push({
              type: "tool-call",
              id: event.toolCallId,
              name: event.toolName,
              args: event.args,
              status: "calling",
            });
            emitParts(activeStream.requestId, parts);
            break;
          }
          case "tool-result": {
            const tc = parts.find(
              (p): p is ClientToolCallPart =>
                p.type === "tool-call" && p.id === event.toolCallId,
            );
            if (tc) {
              tc.result = event.result;
              tc.status = "done";
            }

            emitParts(activeStream.requestId, parts);
            break;
          }
          case "text-delta": {
            const last = parts[parts.length - 1];
            if (last && last.type === "text") {
              last.text += event.text;
            } else {
              parts.push({ type: "text", text: event.text });
            }
            emitParts(activeStream.requestId, parts);
            break;
          }
          case "done": {
            if (!isActiveRequest(activeStream.requestId)) return;

            const fullText = parts
              .filter((p) => p.type === "text")
              .map((p) => p.text)
              .join("");

            updateMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content: fullText,
                mode: activeStream.mode,
                model: activeStream.model,
                duration: prettyMilliseconds(event.durationMs),
                parts: [...parts],
              },
            ]);
            break;
          }
          case "error": {
            updateMessages((prev) => [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "error",
                content: event.message,
              },
            ]);
            break;
          }
        }
      }
    },
    [updateMessages, emitParts, isActiveRequest],
  );

  const runStream = useCallback(
    async ({ mode, model, request }: RunStreamParams) => {
      const controller = new AbortController();
      const activeStream: ActiveStream = {
        requestId: crypto.randomUUID(),
        controller: controller,
        mode: mode,
        model: model,
        parts: [],
        interruptedCaptured: false,
      };

      activeStreamRef.current = activeStream;
      setStreaming({ status: "streaming", parts: [], mode, model });

      try {
        const response = await request(controller);
        await handleStream(response, activeStream);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        if (!isActiveRequest(activeStream.requestId)) return;

        const message = error instanceof Error ? error.message : String(error);
        updateMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "error",
            content: message,
          },
        ]);
      } finally {
        clearStream(activeStream.requestId);
      }
    },
    [clearStream, handleStream, isActiveRequest, updateMessages],
  );

  const stopActiveStream = useCallback(
    (capturePartial: boolean) => {
      const activeStream = activeStreamRef.current;
      if (!activeStream) return;

      if (capturePartial) {
        captureInterrupted(activeStream);
      }

      activeStreamRef.current = null;
      setStreaming({ status: "idle" });
      activeStream.controller.abort();
    },
    [captureInterrupted],
  );

  const resume = useCallback(
    async ({ mode, model }: Omit<SubmitParams, "userText">) => {
      await runStream({
        mode: mode,
        model: model,
        request: async (controller) => {
          return apiClient.chat[":sessionId"].resume.$post(
            { param: { sessionId: sessionId } },
            { init: { signal: controller.signal } },
          );
        },
      });
    },
    [runStream, sessionId],
  );

  const hasAutoResumeRef = useRef(false);
  useEffect(() => {
    if (hasAutoResumeRef.current) return;
    const last = initialMessages[initialMessages.length - 1];
    if (!last || last.role !== "user") return;

    hasAutoResumeRef.current = true;
    void resume({ mode: last.mode, model: last.model });
  }, [initialMessages, resume]);

  const submit = useCallback(
    async ({ userText, mode, model }: SubmitParams) => {
      stopActiveStream(true);

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
        mode: mode,
        model: model,
      };
      updateMessages((prev) => [...prev, userMessage]);

      await runStream({
        mode: mode,
        model: model,
        request: async (controller) => {
          return apiClient.chat[":sessionId"].$post(
            {
              param: { sessionId: sessionId },
              json: { content: userText, mode, model },
            },
            { init: { signal: controller.signal } },
          );
        },
      });
    },
    [runStream, sessionId, updateMessages, stopActiveStream],
  );

  const abort = useCallback(() => {
    stopActiveStream(false);
  }, [stopActiveStream]);

  const interrupt = useCallback(() => {
    stopActiveStream(true);
  }, [stopActiveStream]);

  return {
    messages,
    streaming,
    submit,
    abort,
    interrupt,
  };
}
