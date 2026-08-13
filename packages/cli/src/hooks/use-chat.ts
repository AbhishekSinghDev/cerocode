import type {
  ModeType,
  SupportedChatModelId,
  ToolContracts,
} from "@cerocode/shared";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type InferUITools,
  type LanguageModelUsage,
  type UIMessage,
} from "ai";
import { useMemo } from "react";
import { apiClient } from "../lib/api-client";
import { getAuth } from "../lib/auth";
import { useChat as useAiChat } from "@ai-sdk/react";
import { executeLocalTool } from "../lib/local-tools";

export type ChatMessageMetadata = {
  mode?: ModeType;
  model?: SupportedChatModelId | string;
  durationMs?: number;
  usage?: LanguageModelUsage;
};

type ChatTools = {
  [Name in keyof InferUITools<ToolContracts>]: {
    input: InferUITools<ToolContracts>[Name]["input"];
    output: unknown;
  };
};

export type Message = UIMessage<ChatMessageMetadata, never, ChatTools>;

const REQUEST_TIMEOUT_MS = 60_000;
const STREAM_IDLE_TIMEOUT_MS = 90_000;
const LOCAL_TOOL_TIMEOUT_MS = 60_000;

function withToolTimeout<T>(promise: Promise<T>, toolName: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Tool '${toolName}' timed out`)),
      LOCAL_TOOL_TIMEOUT_MS,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function withRequestTimeout(
  parentSignal: AbortSignal | null | undefined,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  parentSignal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      parentSignal?.removeEventListener("abort", onAbort);
    },
  };
}

function withStreamIdleTimeout(
  stream: ReadableStream<Uint8Array>,
  timeoutMs: number,
) {
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  let resetIdle: () => void = () => {};

  return stream.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      start(controller) {
        resetIdle = () => {
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            controller.error(
              new Error("Response stream stalled: no data received"),
            );
          }, timeoutMs);
        };
        resetIdle();
      },
      transform(chunk, controller) {
        resetIdle();
        controller.enqueue(chunk);
      },
      flush() {
        if (idleTimer) clearTimeout(idleTimer);
      },
    }),
  );
}

export function useChat(sessionId: string, initialMessages: Message[]) {
  const transport = useMemo(() => {
    return new DefaultChatTransport<Message>({
      api: apiClient.chat.$url().toString(),
      headers() {
        const auth = getAuth();
        return auth ? { Authorization: `Bearer ${auth.token}` } : new Headers();
      },
      fetch: (async (
        input: string | Request | URL,
        init?: RequestInit,
      ) => {
        const { signal, cleanup } = withRequestTimeout(
          init?.signal,
          REQUEST_TIMEOUT_MS,
        );

        try {
          const response = await fetch(input, { ...init, signal });

          if (!response.body) return response;

          return new Response(
            withStreamIdleTimeout(response.body, STREAM_IDLE_TIMEOUT_MS),
            {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers,
            },
          );
        } finally {
          cleanup();
        }
      }) as typeof fetch,
      prepareSendMessagesRequest({ messages }) {
        if (messages.length === 0) {
          throw new Error("No messages to send");
        }

        const message = messages[messages.length - 1]!;
        const metadata = messages.findLast(
          (m) => m.metadata?.mode && m.metadata?.model,
        )?.metadata;

        return {
          body: {
            id: sessionId,
            messages,
            mode: message.metadata?.mode ?? metadata?.mode,
            model: message.metadata?.model ?? metadata?.model,
          },
        };
      },
    });
  }, [sessionId]);

  const chat = useAiChat<Message>({
    id: sessionId,
    messages: initialMessages,
    transport: transport,
    onToolCall({ toolCall }) {
      const mode = chat.messages.at(-1)?.metadata?.mode ?? "BUILD";

      void withToolTimeout(
        executeLocalTool(toolCall.toolName, toolCall.input, mode),
        toolCall.toolName,
      )
        .then((output) =>
          chat.addToolOutput({
            tool: toolCall.toolName as keyof ChatTools,
            toolCallId: toolCall.toolCallId,
            output: output,
          }),
        )
        .catch((error) =>
          chat.addToolOutput({
            tool: toolCall.toolName as keyof ChatTools,
            toolCallId: toolCall.toolCallId,
            state: "output-error",
            errorText: error instanceof Error ? error.message : String(error),
          }),
        );
    },
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  });

  return {
    messages: chat.messages,
    status: chat.status,
    error: chat.error,
    submit: (params: {
      userText: string;
      mode: ModeType;
      model: SupportedChatModelId;
    }) => {
      return chat.sendMessage({
        text: params.userText,
        metadata: {
          mode: params.mode,
          model: params.model,
        },
      });
    },
    abort: chat.stop,
    interrupt: chat.stop,
  };
}
