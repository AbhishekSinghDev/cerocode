import { Hono } from "hono";
import { sentry } from "@sentry/hono/bun";
import { HTTPException } from "hono/http-exception";
import * as Sentry from "@sentry/hono/bun";

import { SENTRY_DSN, SENTRY_TRACES_SAMPLE_RATE, SERVER_IDLE_TIMEOUT, SERVER_PORT } from "./config";
import sessions from "./routes/session";
import chat from "./routes/chat";
import auth from "./routes/auth";
import debug from "./routes/debug";
import { requireAuth } from "./middleware/require-auth";

const app = new Hono();

app.use(
  sentry(app, {
    dsn: SENTRY_DSN,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    enableLogs: true,
    dataCollection: {
      // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/hono/configuration/options/#dataCollection
      // userInfo: false,
      // httpBodies: [],
    },
  }),
);

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    Sentry.logger.warn("Handled HTTP error", {
      status: error.status,
      message: error.message || "Request failed",
      path: c.req.path,
      method: c.req.method,
    });

    return c.json(
      {
        error: error.message || "An error occurred",
      },
      error.status,
    );
  }

  Sentry.logger.warn("Unhandled server error", {
    message: error instanceof Error ? error.message : "Unknown error",
    path: c.req.path,
    method: c.req.method,
  });
  return c.json({ error: "Internal Server Error" }, 500);
});

app.use("/sessions/*", requireAuth);
app.use("/chat/*", requireAuth);

const routes = app
  .route("/auth", auth)
  .route("/sessions", sessions)
  .route("/chat", chat)
  .route("/", debug);

export type AppType = typeof routes;

export default {
  port: SERVER_PORT,
  fetch: app.fetch,
  idleTimeout: SERVER_IDLE_TIMEOUT,
};