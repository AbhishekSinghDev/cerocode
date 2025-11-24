import { env } from "@/env";
import type { Events } from "@/types/inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";
import { Inngest } from "inngest";

export const inngest = new Inngest<Events>({
  id: "cero-api",
  eventKey: env.INNGEST_EVENT_KEY,
  middleware: [realtimeMiddleware()],
});
