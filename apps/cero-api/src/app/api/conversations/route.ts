import { db } from "@/server/db";
import { conversation } from "@/server/db/schema";
import { getAuthenticatedUser } from "@/server/utils/get-user";
import { tryCatch } from "@/server/utils/try-catch";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request.headers);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: conversations, error } = await tryCatch(
    db
      .select({
        id: conversation.id,
        shortTitle: conversation.shortTitle,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      })
      .from(conversation)
      .where(eq(conversation.userId, user.id))
      .orderBy(desc(conversation.updatedAt))
  );

  if (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ conversations: conversations || [] });
}
