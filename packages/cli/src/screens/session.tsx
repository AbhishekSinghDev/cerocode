import type { InferResponseType } from "hono";
import { SessionShell } from "../components/session-shell";
import { apiClient } from "../lib/api-client";
import z from "zod";
import { BotMessage, ErrorMessage, UserMessage } from "../components/messages";
import { useLocation, useNavigate, useParams } from "react-router";
import { useToast } from "../providers/toast";
import { useEffect, useMemo, useState } from "react";
import { getErrorMessage } from "../lib/http-errors";

type SessionData = InferResponseType<
  (typeof apiClient.sessions)[":id"]["$get"],
  200
>;

const sessionLocationSchema = z.object({
  session: z.custom<SessionData>(
    (val) => val != null && typeof val === "object" && "id" in val,
  ),
});

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

  return (
    <SessionShell onSubmit={() => {}} inputDisabled>
      {session.messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </SessionShell>
  );
}

function ChatMessage({
  message,
}: {
  message: SessionData["messages"][number];
}) {
  if (message.role === "USER") {
    return <UserMessage message={message.content} />;
  }

  if (message.role === "ERROR") {
    return <ErrorMessage message={message.content} />;
  }

  return <BotMessage content={message.content} model={message.model} />;
}
