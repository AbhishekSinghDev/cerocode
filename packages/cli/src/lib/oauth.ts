import { saveAuth } from "./auth";
import open from "open";

const LOGIN_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

type OAuthState = {
  nonce: string;
  port: number;
};

function toBase64Url(input: Uint8Array | string) {
  return Buffer.from(input).toString("base64url");
}

async function createPkceChallenge(verifier: string) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(verifier),
  );
  return toBase64Url(new Uint8Array(digest));
}

function encodeState(state: OAuthState) {
  return toBase64Url(JSON.stringify(state));
}

function decodeState(state: string) {
  const [encoded] = state.split(".");
  if (!encoded) {
    throw new Error("Invalid state format");
  }

  return JSON.parse(Buffer.from(encoded, "base64url").toString()) as OAuthState;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function performLogin() {
  const clerkFrontendApi = process.env.CLERK_FRONTEND_API;
  const clerkClientId = process.env.CLERK_OAUTH_CLIENT_ID;
  const apiUrl = process.env.API_URL;

  if (!clerkFrontendApi)
    throw new Error(
      "CLERK_FRONTEND_API is not set in the environment variables.",
    );
  if (!clerkClientId)
    throw new Error(
      "CLERK_OAUTH_CLIENT_ID is not set in the environment variables.",
    );
  if (!apiUrl) {
    throw new Error("API_URL is not set in the environment variables.");
  }

  const nonce = crypto.randomUUID();
  const codeVerifier = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));
  const codeChallenge = await createPkceChallenge(codeVerifier);

  let settled = false;

  return new Promise<{ token: string }>((resolve, reject) => {
    const server = Bun.serve({
      port: 0,
      async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname !== "/callback") {
          return new Response("Not Found", { status: 404 });
        }

        const error = url.searchParams.get("error");
        if (error) {
          const msg = url.searchParams.get("error_description") ?? error;
          settled = true;
          reject(new Error(`OAuth error: ${msg}`));
          setTimeout(() => server.stop(), 500);
          return new Response(`Authentication failed: ${msg}`, { status: 400 });
        }

        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        if (!code || !state) {
          settled = true;
          reject(new Error("Missing code or state in the callback URL."));
          setTimeout(() => server.stop(), 500);
          return new Response("Bad Request", { status: 400 });
        }

        try {
          const payload = decodeState(state);

          if (payload.nonce !== nonce) {
            throw new Error("Invalid state parameter.");
          }
        } catch (error) {
          settled = true;
          reject(
            new Error(`Invalid state parameter: ${getErrorMessage(error)}`),
          );
          setTimeout(() => server.stop(), 500);
          return new Response("Bad Request", { status: 400 });
        }

        try {
          const redirectUrl = `${apiUrl}/auth/callback`;

          const tokenRes = await fetch(`${clerkFrontendApi}/oauth/token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: redirectUrl,
              client_id: clerkClientId,
              code_verifier: codeVerifier,
            }),
          });

          if (!tokenRes.ok) {
            const details = await tokenRes.text();
            throw new Error(details ?? "Failed to exchange code for token");
          }

          const tokenData = (await tokenRes.json()) as { access_token: string };
          settled = true;
          saveAuth({ token: tokenData.access_token });
          resolve({ token: tokenData.access_token });
          setTimeout(() => server.stop(), 500);
          return new Response(
            "Authentication successful! You can close this tab.",
          );
        } catch (error) {
          settled = true;
          reject(
            new Error(
              `Failed to exchange code for token: ${getErrorMessage(error)}`,
            ),
          );
          setTimeout(() => server.stop(), 500);
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    });

    const port = server.port;
    if (typeof port !== "number") {
      server.stop();
      reject(new Error("Failed to start the server."));
      return;
    }

    const state = encodeState({ nonce, port });
    const redirectUri = `${apiUrl}/auth/callback`;

    const authorizationUrl = new URL(`${clerkFrontendApi}/oauth/authorize`);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("client_id", clerkClientId);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("scope", "openid email profile");
    authorizationUrl.searchParams.set("state", state);
    authorizationUrl.searchParams.set("prompt", "login");
    authorizationUrl.searchParams.set("code_challenge", codeChallenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");

    void open(authorizationUrl.toString());

    setTimeout(() => {
      if (!settled) {
        settled = true;
        server.stop();
        reject(new Error("Login timed out. Please try again."));
      }
    }, LOGIN_TIMEOUT_MS);
  });
}
