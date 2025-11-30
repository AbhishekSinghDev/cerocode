import { inngestChatFunctionSchema } from "@/lib/zod-schema";
import { db } from "@/server/db";
import { message } from "@/server/db/schema";
import { buildTools } from "@/server/utils/build-tools";
import { MAX_CONTEXT_MESSAGES } from "@/server/utils/constants";
import { SYSTEM_GEMINI_PROMPT } from "@/server/utils/prompts/gemini";
import { tryCatch } from "@/server/utils/try-catch";
import type { RealtimeContext } from "@/types/inngest";
import { google } from "@ai-sdk/google";
import type { SupportedAIToolId } from "@cerocode/constants";
import { encode } from "@toon-format/toon";
import { streamText } from "ai";
import { desc, eq } from "drizzle-orm";
import { chatChannel } from "../channels";
import { inngest } from "../client";

export const processChat = inngest.createFunction(
  {
    id: "chat-message-process",
    name: "Process Chat Message",
    retries: 1,
  },
  { event: "chat/process" },
  async (ctx: RealtimeContext) => {
    const { event, step, publish } = ctx;

    const parseEventData = inngestChatFunctionSchema.safeParse(event.data);
    if (!parseEventData.success || parseEventData.error) {
      throw new Error("Invalid event data");
    }
    const eventData = parseEventData.data;

    try {
      // First, save the user message
      await step.run("save-user-message", async () => {
        const { error: insertError } = await tryCatch(
          db.insert(message).values({
            conversationId: eventData.conversationId,
            role: "user",
            content: eventData.message,
          })
        );

        if (insertError) {
          console.error("Error saving user message to DB:", insertError);
          throw insertError;
        }
      });

      const result = await step.run("stream-ai-response", async () => {
        // Fetch previous messages from DB with limit for context
        const { data: previousMessages, error: fetchError } = await tryCatch(
          db
            .select({
              role: message.role,
              content: message.content,
            })
            .from(message)
            .where(eq(message.conversationId, eventData.conversationId))
            .orderBy(desc(message.createdAt))
            .limit(MAX_CONTEXT_MESSAGES)
        );

        if (fetchError) {
          console.error("Error fetching previous messages:", fetchError);
        }

        // Build messages array with proper role structure
        const messages: Array<{
          role: "system" | "user" | "assistant";
          content: string;
        }> = [{ role: "system", content: SYSTEM_GEMINI_PROMPT }];

        if (previousMessages && previousMessages.length > 0) {
          const chronologicalMessages = previousMessages.reverse();

          if (chronologicalMessages.length > 6) {
            const olderMessages = chronologicalMessages.slice(0, -6);
            const recentMessages = chronologicalMessages.slice(-6);

            const compressedContext = encode(
              olderMessages.map((m) => ({ role: m.role, content: m.content }))
            );
            messages.push({
              role: "system",
              content: `Previous conversation context (compressed): ${compressedContext}`,
            });

            for (const msg of recentMessages) {
              messages.push({
                role: msg.role as "user" | "assistant",
                content: msg.content,
              });
            }
          } else {
            for (const msg of chronologicalMessages) {
              messages.push({
                role: msg.role as "user" | "assistant",
                content: msg.content,
              });
            }
          }
        }

        // Build tools if any are selected
        const tools = buildTools(eventData.tools as SupportedAIToolId[] | undefined);

        const streamResult = streamText({
          model: google(eventData.aiModel),
          messages: messages,
          tools,
        });

        let fullText = "";

        // Stream each token as it arrives
        for await (const chunk of streamResult.textStream) {
          fullText += chunk;

          // Publish each token to Realtime channel
          await publish(chatChannel(eventData.conversationId).token(chunk));
        }

        // Signal completion
        await publish(chatChannel(eventData.conversationId).done({ fullText }));

        return { success: true, text: fullText };
      });

      console.log(result.text);

      // Save the assistant message
      await step.run("save-assistant-message", async () => {
        const { error: insertError } = await tryCatch(
          db.insert(message).values({
            conversationId: eventData.conversationId,
            role: "assistant",
            content: result.text,
          })
        );

        if (insertError) {
          console.error("Error saving assistant message to DB:", insertError);
          throw insertError;
        }
      });
    } catch (err) {
      console.error("Error in chat processing:", err);
      await publish(
        chatChannel(eventData.conversationId).error({
          error: err instanceof Error ? err.message : "Unknown error",
        })
      );
      throw err;
    }
  }
);
