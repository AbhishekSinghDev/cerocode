import type { InferResponseType } from "hono";
import { SessionShell } from "../components/session-shell";
import { apiClient } from "../lib/api-client";
import z from "zod";
import { BotMessage, ErrorMessage, UserMessage } from "../components/messages";
import { useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../providers/toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";
import { useChat, type Message } from "../hooks/use-chat";
import { type ModeType, type SupportedChatModelId } from "@cerocode/shared";
import { useKeyboardLayer } from "../providers/kebboard";
import { useKeyboard } from "@opentui/react";
import { usePromptConfig } from "../providers/prompt-config";

type SessionData = InferResponseType<
  (typeof apiClient.sessions)[":id"]["$get"],
  200
>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>(
    (val) => val != null && typeof val === "object" && "id" in val,
  ),
  initialPrompt: z.object({
    message: z.string(),
    mode: z.custom<ModeType>(),
    model: z.custom<SupportedChatModelId>().optional(),
  }),
});

export function SessionScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const prefetched = useMemo(() => {
    const parsed = sessionLocationSchema.safeParse(location.state);
    return parsed.success ? parsed.data : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(
    prefetched?.session ?? null,
  );

  useEffect(() => {
    if (prefetched?.session) return;
    setSession(null);
    if (!id) return;

    let ignore = false;
    const fetchSession = async () => {
      try {
        const res = await apiClient.sessions[":id"].$get({
          param: { id: id },
        });

        if (ignore) return;
        if (!res.ok) throw new Error(await getErrorMessage(res));

        const resolved = await res.json();
        setSession(resolved);
      } catch (error) {
        if (ignore) return;
        toast.show({
          variant: "error",
          message:
            error instanceof Error ? error.message : "Failed to fetch session",
        });
        navigate("/", { replace: true });
      }
    };

    fetchSession();

    return () => {
      ignore = true;
    };
  }, [id, prefetched, toast, navigate]);

  if (!session) {
    return <SessionShell onSubmit={() => {}} inputDisabled loading />;
  }

  return (
    <SessionChat
      key={session.id}
      session={session}
      initialPrompt={prefetched?.initialPrompt}
    />
  );
}

function SessionChat({
  session,
  initialPrompt,
}: {
  session: SessionData;
  initialPrompt?: {
    message: string;
    mode: ModeType;
    model?: SupportedChatModelId;
  };
}) {
  const [initialMessages] = useState<Message[]>(
    Array.isArray(session.messages)
      ? (session.messages as unknown as Message[])
      : [],
  );
  const { isTop } = useKeyboardLayer();
  const { messages, status, submit, abort, error, interrupt } = useChat(
    session.id,
    initialMessages,
  );
  const { mode, model } = usePromptConfig();

  const hasSubmittedInitialPromptRef = useRef(false);

  useEffect(() => {
    return () => void abort();
  }, [abort]);

  useKeyboard((key) => {
    if (key.name === "escape" && isTop("base") && status === "streaming") {
      key.preventDefault();
      interrupt();
    }
  });

  useEffect(() => {
    if (
      !initialPrompt ||
      !initialPrompt.model ||
      hasSubmittedInitialPromptRef.current
    )
      return;

    hasSubmittedInitialPromptRef.current = true;
    void submit({
      userText: initialPrompt.message,
      mode: initialPrompt.mode,
      model: initialPrompt.model,
    });
  }, [initialPrompt, submit]);

  return (
    <SessionShell
      onSubmit={(text) =>
        submit({
          userText: text,
          mode: mode,
          model: model,
        })
      }
      loading={status === "submitted" || status === "streaming"}
      interruptible={status === "submitted" || status === "streaming"}
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {error && <ErrorMessage message={error.message} />}
    </SessionShell>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    const text = message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    return (
      <UserMessage message={text} mode={message.metadata?.mode ?? "BUILD"} />
    );
  }

  return (
    <BotMessage
      parts={message.parts}
      model={message.metadata?.model ?? "unknown"}
      mode={message.metadata?.mode ?? "BUILD"}
      duration={message.metadata?.durationMs}
      streaming={false}
    />
  );
}
