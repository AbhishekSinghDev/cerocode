import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TextAttributes } from "@opentui/core";
import { useKeyboard } from "@opentui/react";
import type { ModeType, SupportedChatModelId } from "@cerocode/shared";
import { apiClient } from "../lib/api-client";
import { getErrorMessage } from "../lib/http-errors";
import { useChat, type ConfirmTool, type Message } from "../hooks/use-chat";
import { usePromptConfig } from "../providers/prompt-config";
import { useToast } from "../providers/toast";
import { useDialog } from "../providers/dialog";
import { useKeyboardLayer } from "../providers/kebboard";
import { useTheme } from "../providers/theme";
import { SessionShell } from "../components/session-shell";
import { Header } from "../components/header";
import { UserMessage, BotMessage, ErrorMessage } from "../components/messages";

// A stable placeholder id passed to useChat before a real session exists.
// Nothing is ever sent under this id — submit() only runs once a session
// has actually been created on the backend.
const DRAFT_SESSION_ID = "draft";

const EMPTY_STATE_HINTS = [
  { keyLabel: "/", label: "commands" },
  { keyLabel: "@", label: "files" },
  { keyLabel: "tab", label: "agent" },
];

type PendingPrompt = {
  text: string;
  mode: ModeType;
  model: SupportedChatModelId;
};

/**
 * The single persistent screen for the whole app lifetime: a landing/empty
 * state, first-message session creation, and an active conversation all
 * live in one always-mounted component (no route/screen swap), the same
 * way other terminal agent UIs keep one continuous view.
 */
export function ChatScreen() {
  const toast = useToast();
  const dialog = useDialog();
  const { mode, model } = usePromptConfig();
  const { isTop } = useKeyboardLayer();

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [creating, setCreating] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<PendingPrompt | null>(null);
  const submittedPendingRef = useRef(false);

  const hasStarted = sessionId !== null;

  const confirmTool = useCallback<ConfirmTool>(
    async (_toolName, detail) =>
      dialog.confirm({
        title: "Approve tool execution",
        message: detail || "The agent requested an action. Approve it, or deny to cancel.",
      }),
    [dialog],
  );

  const { messages, status, submit, abort, error, interrupt } = useChat(
    sessionId ?? DRAFT_SESSION_ID,
    initialMessages,
    confirmTool,
  );

  useEffect(() => {
    return () => void abort();
  }, [abort]);

  useKeyboard((key) => {
    if (
      key.name === "escape" &&
      isTop("base") &&
      (status === "streaming" || status === "submitted")
    ) {
      key.preventDefault();
      interrupt();
    }
  });

  // Once the freshly created session gets its real id, fire the message the
  // user typed before the session existed. Keep showing the optimistic
  // bubble until the real message has actually landed in `messages`, so it
  // never flickers away for a frame.
  useEffect(() => {
    if (!sessionId || !pendingPrompt || submittedPendingRef.current) return;
    submittedPendingRef.current = true;
    void submit({
      userText: pendingPrompt.text,
      mode: pendingPrompt.mode,
      model: pendingPrompt.model,
    });
  }, [sessionId, pendingPrompt, submit]);

  useEffect(() => {
    if (pendingPrompt && messages.length > 0) {
      setPendingPrompt(null);
      submittedPendingRef.current = false;
    }
  }, [messages.length, pendingPrompt]);

  const startNewSession = useCallback(() => {
    void abort();
    submittedPendingRef.current = false;
    setSessionId(null);
    setInitialMessages([]);
    setPendingPrompt(null);
    setCreating(false);
    setLoadingSession(false);
  }, [abort]);

  const openSession = useCallback(
    (id: string) => {
      if (id === sessionId) return;
      void abort();
      submittedPendingRef.current = false;
      setPendingPrompt(null);
      setCreating(false);
      setLoadingSession(true);

      (async () => {
        try {
          const res = await apiClient.sessions[":id"].$get({ param: { id } });
          if (!res.ok) throw new Error(await getErrorMessage(res));

          const session = await res.json();
          setInitialMessages(
            Array.isArray(session.messages) ? (session.messages as unknown as Message[]) : [],
          );
          setSessionId(id);
        } catch (err) {
          toast.show({
            variant: "error",
            message: err instanceof Error ? err.message : "Failed to open session",
          });
        } finally {
          setLoadingSession(false);
        }
      })();
    },
    [sessionId, abort, toast],
  );

  const handleSubmit = useCallback(
    (text: string) => {
      if (sessionId) {
        void submit({ userText: text, mode, model });
        return;
      }

      // First message of a brand new conversation: create the session
      // behind the scenes while the message is already shown.
      setPendingPrompt({ text, mode, model });
      setCreating(true);

      (async () => {
        try {
          const res = await apiClient.sessions.$post({
            json: { title: text.slice(0, 50) },
          });
          if (!res.ok) throw new Error(await getErrorMessage(res));

          const session = await res.json();
          setInitialMessages([]);
          setSessionId(session.id);
        } catch (err) {
          setPendingPrompt(null);
          toast.show({
            variant: "error",
            message: err instanceof Error ? err.message : "Failed to create session",
          });
        } finally {
          setCreating(false);
        }
      })();
    },
    [sessionId, mode, model, toast],
  );

  const totalTokens = useMemo(() => {
    let count = 0;
    for (const msg of messages) {
      const usage = msg.metadata?.usage;
      if (typeof usage?.totalTokens === "number") count += usage.totalTokens;
    }
    return count;
  }, [messages]);

  const isLoading = creating || loadingSession || status === "submitted" || status === "streaming";
  const isInterruptible = !creating && !loadingSession && (status === "submitted" || status === "streaming");

  return (
    <SessionShell
      onSubmit={handleSubmit}
      onNewSession={startNewSession}
      onOpenSession={openSession}
      inputDisabled={loadingSession}
      loading={isLoading}
      interruptible={isInterruptible}
      totalTokens={hasStarted ? totalTokens : undefined}
      hints={hasStarted ? undefined : EMPTY_STATE_HINTS}
    >
      {!hasStarted && !pendingPrompt ? <EmptyState /> : null}
      {pendingPrompt ? <UserMessage message={pendingPrompt.text} mode={pendingPrompt.mode} /> : null}
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {error && <ErrorMessage message={error.message} />}
    </SessionShell>
  );
}

function EmptyState() {
  const { theme } = useTheme();

  return (
    <box alignItems="center" justifyContent="center" width="100%" paddingTop={4} gap={1}>
      <Header />
      <text attributes={TextAttributes.DIM} fg={theme.colors.textMuted}>
        Type below to start a new conversation.
      </text>
    </box>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.role === "user") {
    const text = message.parts
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

    return <UserMessage message={text} mode={message.metadata?.mode ?? "BUILD"} />;
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
