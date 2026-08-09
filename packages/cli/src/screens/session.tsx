import type { InferResponseType } from "hono";
import { SessionShell } from "../components/session-shell";
import { apiClient } from "../lib/api-client";
import z from "zod";
import { BotMessage, ErrorMessage, UserMessage } from "../components/messages";
import { useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../providers/toast";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";
import { useChat, type Message } from "../hooks/use-chat";
import {
  DEFAULT_SUPPORTED_CHAT_MODEL,
  type SupportedChatModelId,
} from "@cerocode/shared";
import prettyMilliseconds from "pretty-ms";
import { useKeyboardLayer } from "../providers/kebboard";
import { useKeyboard } from "@opentui/react";

type SessionData = InferResponseType<
  (typeof apiClient.sessions)[":id"]["$get"],
  200
>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>(
    (val) => val != null && typeof val === "object" && "id" in val,
  ),
});

function mapDbMessages(dbMessages: SessionData["messages"]): Message[] {
  return dbMessages.map((msg): Message => {
    if (msg.role === "ERROR") {
      return { id: msg.id, role: "error", content: msg.content };
    }

    if (msg.role === "USER") {
      return {
        id: msg.id,
        role: "user",
        content: msg.content,
        mode: msg.mode,
        model: msg.model as SupportedChatModelId,
      };
    }

    return {
      id: msg.id,
      role: "assistant",
      content: msg.content,
      model: msg.model as SupportedChatModelId,
      mode: msg.mode,
      parts: [{ type: "text", text: msg.content }],
      ...(msg.duration !== null
        ? { duration: prettyMilliseconds(msg.duration * 1000) }
        : {}),
      interrupted: msg.status === "INTERRUPTED",
    };
  });
}

export function SessionScreen() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const prefetched = useMemo(() => {
    const parsed = sessionLocationSchema.safeParse(location.state);
    return parsed.success ? parsed.data.session : null;
  }, [location.state]);

  const [session, setSession] = useState<SessionData | null>(prefetched);

  useEffect(() => {
    if (prefetched) return;
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

  return <SessionChat key={session.id} session={session} />;
}

function SessionChat({ session }: { session: SessionData }) {
  const [initialMessages] = useState(() => mapDbMessages(session.messages));
  const { isTop } = useKeyboardLayer();
  const { messages, streaming, submit, abort, interrupt } = useChat(
    session.id,
    initialMessages,
  );

  useEffect(() => {
    return () => abort();
  }, [abort]);

  useKeyboard((key) => {
    if (
      key.name === "escape" &&
      isTop("base") &&
      streaming.status === "streaming"
    ) {
      key.preventDefault();
      interrupt();
    }
  });

  return (
    <SessionShell
      onSubmit={(text) =>
        submit({
          userText: text,
          mode: "BUILD",
          model: DEFAULT_SUPPORTED_CHAT_MODEL,
        })
      }
      loading={streaming.status === "streaming"}
      interruptible={streaming.status === "streaming"}
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {streaming.status === "streaming" && (
        <BotMessage
          parts={streaming.parts}
          model={streaming.model}
          mode={streaming.mode}
          streaming
        />
      )}
    </SessionShell>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    return <UserMessage message={message.content} />;
  }

  if (message.role === "error") {
    return <ErrorMessage message={message.content} />;
  }

  return (
    <BotMessage
      parts={message.parts}
      model={message.model}
      mode={message.mode}
      duration={message.duration}
      streaming={false}
      interrupted={message.interrupted}
    />
  );
}
