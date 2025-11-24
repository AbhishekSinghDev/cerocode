import type { Realtime } from "@inngest/realtime";
import type { ClientOptions, Context } from "inngest";

export type Events = ClientOptions & {
  "chat/process"?: {
    data: {
      conversationId: string;
      message: string;
      userId: string;
    };
  };
};

export interface EventData {
  message: string;
  conversationId: string;
  userId: string;
}

export type RealtimeContext = Context & {
  publish: Realtime.PublishFn;
};
