import { realtimeMiddleware } from "@inngest/realtime/middleware";
import { inngest } from "../client";

import type { Events } from "@/types/inngest";
import { chatChannel } from "../channels";

import { google } from "@ai-sdk/google";
import { streamText } from "ai";

export const processChat = inngest.createFunction(
  {
    id: "chat-message-process",
    name: "Process Chat Message",
    middleware: [realtimeMiddleware()],
  },
  { event: "chat/process" },
  async ({ event, publish, step }) => {
    const eventData = event.data as unknown as Events["chat/process"];

    if (!eventData?.data) {
      throw new Error(
        "Please provide all the required data to process the chat"
      );
    }

    try {
      await step.run("stream-ai-response", async () => {
        const result = streamText({
          model: google("gemini-2.0-flash-lite"),
          messages: [
            {
              role: "system",
              content:
                "You are cero, an AI Agentic CLI that helps users with their tasks. Be concise and to the point. Use markdown formatting where appropriate. Make sure even if you need to return a number, return it in markdown format. You are made by Abhishek Singh.",
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
          await publish(
            chatChannel(eventData.data.conversationId).token(chunk)
          );
        }

        // Signal completion
        await publish(
          chatChannel(eventData.data.conversationId).done({ fullText })
        );
        return { success: true, text: fullText };
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
