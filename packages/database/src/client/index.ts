import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import {
  POOL_CONNECT_TIMEOUT_SECONDS,
  POOL_IDLE_TIMEOUT_SECONDS,
  POOL_MAX_CONNECTIONS,
  POOL_MAX_LIFETIME_SECONDS,
  POOL_PREPARE,
} from "./config";

const client = postgres(process.env.DATABASE_URL!, {
  max: POOL_MAX_CONNECTIONS,
  idle_timeout: POOL_IDLE_TIMEOUT_SECONDS,
  connect_timeout: POOL_CONNECT_TIMEOUT_SECONDS,
  max_lifetime: POOL_MAX_LIFETIME_SECONDS,
  prepare: POOL_PREPARE,
});

export const db = drizzle({
  client: client,
});
