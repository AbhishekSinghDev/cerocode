import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { messageStatusEnum, modeEnum, roleEnum } from "./enum";

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 36 })
      .$defaultFn(() => uuidv7())
      .primaryKey(),
    userId: varchar("user_id", { length: 36 }).notNull(),
    title: text("title").notNull(),
    cwd: text("cwd"),
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

export const messages = pgTable("messages", {
  id: varchar("id", { length: 36 })
    .$defaultFn(() => uuidv7())
    .primaryKey(),
  sessionId: varchar("session_id", { length: 36 })
    .references(() => sessions.id, { onDelete: "cascade" })
    .notNull(),
  role: roleEnum().notNull(),
  status: messageStatusEnum().notNull(),
  model: varchar("model", { length: 255 }).notNull(),
  content: text("content").notNull(),
  parts: jsonb("parts"),
  mode: modeEnum().notNull(),
  duration: integer("duration"),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  }).defaultNow(),
});
