import { desc, eq } from "@cerocode/database";
import { db } from "@cerocode/database/client";
import {
  messages,
  modeEnum,
  roleEnum,
  sessions,
} from "@cerocode/database/schema";
import { findSupportedChatModelById } from "@cerocode/shared";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthenticatedEnv } from "../middleware/require-auth";

const createSessionSchema = z.object({
  title: z.string(),
  cwd: z.string().nullable(),
  initialMessage: z
    .object({
      role: z.enum(roleEnum.enumValues),
      content: z.string(),
      mode: z.enum(modeEnum.enumValues),
      model: z
        .string()
        .refine((id) => !!findSupportedChatModelById(id), "Unsupported model"),
    })
    .optional(),
});

const createSessionValidator = zValidator(
  "json",
  createSessionSchema,
  (result, c) => {
    if (!result.success) {
      return c.json({ error: "Invalid request body" }, 400);
    }
  },
);

const app = new Hono<AuthenticatedEnv>()
  .get("/", async (c) => {
    const userId = c.get("userId");

    const result = await db
      .select({
        id: sessions.id,
        title: sessions.title,
        createdAt: sessions.createdAt,
      })
      .from(sessions)
      .where(eq(sessions.userId, userId))
      .orderBy(desc(sessions.createdAt));

    return c.json(result);
  })
  .get("/:id", async (c) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new HTTPException(500, {
    //   message: "Mock error: session loading failed",
    // });

    const id = c.req.param("id");
    const userId = c.get("userId");

    const result = await db.query.sessions.findFirst({
      where: { id: id, userId: userId },
      with: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!result) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(result);
  })
  .post("/", createSessionValidator, async (c) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new HTTPException(500, {
    //   message: "Mock error: session creation failed",
    // });

    const userId = c.get("userId");
    const { initialMessage, ...data } = c.req.valid("json");

    const result = await db.transaction(async (tx) => {
      const sessionResult = await tx
        .insert(sessions)
        .values({
          title: data.title,
          cwd: data.cwd,
          userId: userId,
        })
        .returning({
          id: sessions.id,
          title: sessions.title,
          cwd: sessions.cwd,
          createdAt: sessions.createdAt,
          updatedAt: sessions.updatedAt,
        });

      const session = sessionResult[0];

      if (!session) {
        throw new Error("Failed to create session");
      }

      const messageResult = initialMessage
        ? await tx
            .insert(messages)
            .values({
              content: initialMessage.content,
              role: initialMessage.role,
              model: initialMessage.model,
              mode: initialMessage.mode,
              sessionId: session.id,
              status: "COMPLETE",
            })
            .returning()
        : null;

      return {
        session: {
          ...session,
          messages: messageResult || [],
        },
      };
    });

    return c.json(result, 201);
  });

export default app;
