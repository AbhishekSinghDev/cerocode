import { db } from "@/server/db";
import { conversation, message } from "@/server/db/schema";
import { tryCatch } from "@/server/utils/try-catch";
import type { Events, RealtimeContext } from "@/types/inngest";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { eq } from "drizzle-orm";
import { chatChannel } from "../channels";
import { inngest } from "../client";

export const processChat = inngest.createFunction(
  {
    id: "chat-message-process",
    name: "Process Chat Message",
  },
  { event: "chat/process" },
  async (ctx: RealtimeContext) => {
    const { event, step, publish } = ctx;
    const eventData = event.data as unknown as Events["chat/process"];

    if (!eventData?.data) {
      throw new Error("Please provide all the required data to process the chat");
    }

    try {
      // First, save the user message
      await step.run("save-user-message", async () => {
        const { error: insertError } = await tryCatch(
          db.insert(message).values({
            conversationId: eventData.data.conversationId,
            role: "user",
            content: eventData.data.message,
          })
        );

        if (insertError) {
          console.error("Error saving user message to DB:", insertError);
          throw insertError;
        }
      });

      const result = await step.run("stream-ai-response", async () => {
        const result = streamText({
          model: google("gemini-2.0-flash-lite"),
          messages: [
            {
              role: "system",
              content: "You are cero",
            },
            {
              role: "user",
              content: eventData.data.message,
            },
          ],
        });

        let fullText = "";

        // Stream each token as it arrives
        for await (const chunk of result.textStream) {
          fullText += chunk;

          // Publish each token to Realtime channel
          await publish(chatChannel(eventData.data.conversationId).token(chunk));
        }

        // Signal completion
        await publish(chatChannel(eventData.data.conversationId).done({ fullText }));

        return { success: true, text: fullText };
      });

      // Save the assistant message
      await step.run("save-assistant-message", async () => {
        const { error: insertError } = await tryCatch(
          db.insert(message).values({
            conversationId: eventData.data.conversationId,
            role: "assistant",
            content: result.text,
          })
        );

        if (insertError) {
          console.error("Error saving assistant message to DB:", insertError);
          throw insertError;
        }
      });

      // Update conversation shortTitle if not set (use first 50 chars of first user message)
      await step.run("update-conversation-title", async () => {
        const { error: updateError } = await tryCatch(
          db
            .update(conversation)
            .set({ shortTitle: eventData.data.message.slice(0, 50) })
            .where(eq(conversation.id, eventData.data.conversationId))
        );

        if (updateError) {
          console.error("Error updating conversation title:", updateError);
          // Non-critical, don't throw
        }
      });
    } catch (err) {
      console.error("Error in chat processing:", err);
      await publish(
        chatChannel(eventData.data.conversationId).error({
          error: err instanceof Error ? err.message : "Unknown error",
        })
      );
      throw err;
    }
  }
);
