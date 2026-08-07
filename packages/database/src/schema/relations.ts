import { defineRelations } from "drizzle-orm";
import { messages, sessions } from "./schema";

export const relations = defineRelations({ sessions, messages }, (r) => ({
  sessions: {
    messages: r.many.messages({
      from: r.sessions.id,
      to: r.messages.sessionId,
    }),
  },
  messages: {
    session: r.one.sessions({
      from: r.messages.sessionId,
      to: r.sessions.id,
    }),
  },
}));
