import { Hono } from "hono";
import { sentry } from "@sentry/hono/bun";
import { HTTPException } from "hono/http-exception";
import * as Sentry from "@sentry/hono/bun";

import sessions from "./routes/session";
import chat from "./routes/chat";
import auth from "./routes/auth";
import { requireAuth } from "./middleware/require-auth";

const app = new Hono();

app.use(
  sentry(app, {
    dsn: "https://a0ba6f5b52cfe253fc6a17a70c1df14b@o4511868031008768.ingest.de.sentry.io/4511870270505040",
    tracesSampleRate: 1.0,
    enableLogs: true,
    dataCollection: {
      // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/hono/configuration/options/#dataCollection
      // userInfo: false,
      // httpBodies: [],
    },
  }),
);

app.get("/debug-sentry", () => {
  // Send a log before throwing the error
  Sentry.logger.info("User triggered test error", {
    action: "test_error_endpoint",
  });
  // Send a test metric before throwing the error
  Sentry.metrics.count("test_counter", 1);
  throw new Error("My first Sentry error!");
});

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
  .route("/chat", chat);

export type AppType = typeof routes;

export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 255,
};
