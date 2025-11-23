import { channel, topic } from "@inngest/realtime";

export const chatChannel = channel(
  (conversationId: string) => `chat.${conversationId}`
)
  .addTopic(topic("token").type<string>())
  .addTopic(topic("done").type<{ fullText: string }>())
  .addTopic(topic("error").type<{ error: string }>());
