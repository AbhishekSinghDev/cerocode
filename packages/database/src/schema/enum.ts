import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ASSISTANT", "ERROR"]);

export const modeEnum = pgEnum("mode", ["BUILD", "PLAN"]);

export const messageStatusEnum = pgEnum("message_status", [
  "COMPLETE",
  "INTERRUPTED",
]);
