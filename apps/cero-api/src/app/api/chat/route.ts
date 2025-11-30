import { chatSchema } from "@/lib/zod-schema";
import { db } from "@/server/db";
import { conversation } from "@/server/db/schema";
import { inngest } from "@/server/inngest/client";
import { getAuthenticatedUser } from "@/server/utils/get-user";
import { tryCatch } from "@/server/utils/try-catch";
import { DEFAULT_AI_MODEL_ID } from "@cerocode/constants";
import { subscribe } from "@inngest/realtime";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request.headers);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parseResult = chatSchema.safeParse(body);

  if (!parseResult.success || parseResult.error) {
    return new NextResponse(JSON.stringify({ error: parseResult.error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const selectedAiModel = parseResult.data.aiModel ?? DEFAULT_AI_MODEL_ID;
  let finalConversationId = parseResult.data.conversationId;

  // conversationId not provided, create a new conversation
  if (!parseResult.data.conversationId) {
    const { data: conversationData, error: conversationError } = await tryCatch(
      db
        .insert(conversation)
        .values({
          userId: user.id,
          shortTitle: parseResult.data.message.slice(0, 50),
        })
        .returning()
    );

    const newConversation = conversationData?.at(0);

    if (conversationError || !newConversation) {
      console.error("Error creating conversation:", conversationError);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    finalConversationId = newConversation.id;
  }

  const { error: inngestError } = await tryCatch(
    inngest.send({
      name: "chat/process",
      data: {
        message: parseResult.data.message,
        userId: user.id,
        conversationId: finalConversationId,
        aiModel: selectedAiModel,
        tools: parseResult.data.tools,
      },
    })
  );

  if (inngestError) {
    console.error("Error sending inngest event:", inngestError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  const { data: stream, error: streamError } = await tryCatch(
    subscribe({
      app: inngest,
      channel: `chat.${finalConversationId}`,
      topics: ["token", "done", "error"],
    })
  );

  if (streamError) {
    console.error("Error subscribing to stream:", streamError);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  // Create a transform stream to prepend the conversationId
  const transformStream = new TransformStream({
    start(controller) {
      // Send conversationId as the first message
      const initMessage =
        JSON.stringify({ topic: "init", data: { conversationId: finalConversationId } }) +
        "\n";
      controller.enqueue(new TextEncoder().encode(initMessage));
    },
    transform(chunk, controller) {
      controller.enqueue(chunk);
    },
  });

  // Pipe the original stream through the transform
  stream.getEncodedStream().pipeTo(transformStream.writable);

  return new Response(transformStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
