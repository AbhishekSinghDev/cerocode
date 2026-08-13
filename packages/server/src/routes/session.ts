import { and, desc, eq } from "@cerocode/database";
import { db } from "@cerocode/database/client";
import { sessions } from "@cerocode/database/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { AuthenticatedEnv } from "../middleware/require-auth";

const createSessionSchema = z.object({
  title: z.string(),
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

    const result = await db
      .select()
      .from(sessions)
      .where(and(eq(sessions.id, id), eq(sessions.userId, userId)));

    if (!result || result.length === 0 || !result[0]) {
      return c.json({ error: "Session not found" }, 404);
    }

    return c.json(result[0]);
  })
  .post("/", createSessionValidator, async (c) => {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    // throw new HTTPException(500, {
    //   message: "Mock error: session creation failed",
    // });

    const userId = c.get("userId");
    const { ...data } = c.req.valid("json");

    const session = await db.transaction(async (tx) => {
      const sessionResult = await tx
        .insert(sessions)
        .values({
          title: data.title,
          userId: userId,
        })
        .returning({
          id: sessions.id,
          title: sessions.title,
          messages: sessions.messages,
          createdAt: sessions.createdAt,
          updatedAt: sessions.updatedAt,
        });

      const session = sessionResult[0];

      if (!session) {
        throw new Error("Failed to create session");
      }

      return session;
    });

    return c.json(session, 201);
  });

export default app;
