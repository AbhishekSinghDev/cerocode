import { Hono } from "hono";

import {
  buildLocalCallbackUrl,
  parseOauthCallbackState,
} from "../lib/oauth-callback";

const app = new Hono().get("/callback", (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const error = c.req.query("error");

  const errorDescription = c.req.query("error_description");

  if (error) {
    return c.text(errorDescription ?? error, 400);
  }

  if (!code || !state) {
    return c.text("Missing code or state", 400);
  }

  try {
    const { port } = parseOauthCallbackState(state);

    const redirectUrl = buildLocalCallbackUrl(port, code, state);

    return c.redirect(redirectUrl);
  } catch (error) {
    return c.text("Invalid authentication state", 400);
  }
});

export default app;
