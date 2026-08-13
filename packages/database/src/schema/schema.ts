import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    title: text("title").notNull(),
    messages: jsonb("messages").default([]),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .defaultNow()
      .$onUpdateFn(() => new Date().toISOString()),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);
