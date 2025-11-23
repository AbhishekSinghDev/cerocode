import type { ClientOptions } from "inngest";

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
