import { SUPPORTED_AI_MODELS, SUPPORTED_AI_TOOLS } from "@cerocode/constants";
import z from "zod";

export const aiModelSchema = z.enum(
  SUPPORTED_AI_MODELS.map((model) => model.id) as [string, ...string[]]
);

export const aiToolsSchema = z
  .array(z.enum(SUPPORTED_AI_TOOLS.map((tool) => tool.id) as [string, ...string[]]))
  .optional();

export const chatSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().optional(),
  aiModel: aiModelSchema.optional(),
  tools: aiToolsSchema,
});

export const inngestChatFunctionSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string(),
  userId: z.string(),
  aiModel: aiModelSchema,
  tools: aiToolsSchema,
});
