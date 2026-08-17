import type { InferResponseType } from "hono/client";
import { useCallback, useEffect, useState } from "react";
import { apiClient } from "../../lib/api-client";
import { useDialog } from "../../providers/dialog";
import { useToast } from "../../providers/toast";
import { getErrorMessage } from "../../lib/http-errors";
import { TextAttributes } from "@opentui/core";
import { DialogSearchList } from "../dialog-search-list";
import { useTheme } from "../../providers/theme";
import { format } from "date-fns";

type Session = InferResponseType<
  (typeof apiClient.sessions)["$get"],
  200
>[number];

type SessionDialogContentProps = {
  onSelectSession: (id: string) => void;
};

export const SessionDialogContent = ({ onSelectSession }: SessionDialogContentProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { close } = useDialog();
  const { show } = useToast();

  useEffect(() => {
    let ignore = false;

    const fetchSessions = async () => {
      try {
        const res = await apiClient.sessions.$get();
        if (!res.ok) {
          throw new Error(await getErrorMessage(res));
        }

        const data = await res.json();
        if (!ignore) {
          setSessions(data);
          setLoading(false);
        }
      } catch (error) {
        if (!ignore) {
          show({
            variant: "error",
            message: `Failed to fetch sessions: ${error instanceof Error ? error.message : String(error)}`,
          });
          close();
        }
      }
    };

    fetchSessions();

    return () => {
      ignore = true;
    };
  }, [close, show]);

  const handleSessionSelect = useCallback(
    (session: Session) => {
      close();
      onSelectSession(session.id);
    },
    [close, onSelectSession],
  );

  const { theme } = useTheme();

  if (loading) {
    return (
      <box flexDirection="column">
        <text attributes={TextAttributes.DIM}>Loading sessions...</text>
      </box>
    );
  }

  return (
    <DialogSearchList
      items={sessions}
      onSelect={handleSessionSelect}
      filterFn={(s, query) =>
        s.title.toLowerCase().includes(query.toLowerCase())
      }
      renderItem={(session, isSelected) => (
        <>
          <text selectable={false} fg={isSelected ? theme.colors.textOnSelection : theme.colors.text}>
            {session.title}
          </text>
          <box flexGrow={1} />
          <text
            selectable={false}
            fg={isSelected ? theme.colors.textOnSelection : theme.colors.textMuted}
            attributes={TextAttributes.DIM}
          >
            {session.createdAt
              ? format(new Date(session.createdAt), "hh:mm a")
              : null}
          </text>
        </>
      )}
      getKey={(s) => s.id}
      placeholder="Search sessions..."
      emptyText="No sessions found."
    />
  );
};
