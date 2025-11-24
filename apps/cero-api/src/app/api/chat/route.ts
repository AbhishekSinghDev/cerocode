import { chatSchema } from "@/lib/zod-schema";
import { inngest } from "@/server/inngest/client";
import { getAuthenticatedUser } from "@/server/utils/get-user";
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
    return new NextResponse(
      JSON.stringify({ error: parseResult.error.errors }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const conversationId = crypto.randomUUID();

  await inngest.send({
    name: "chat/process",
    data: {
      data: {
        message: parseResult.data.message,
        userId: user.id,
        conversationId,
      },
    },
  });

  try {
    const stream = await subscribe({
      app: inngest,
      channel: `chat.${conversationId}`,
      topics: ["token", "done", "error"],
    });

    return new Response(stream.getEncodedStream(), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
