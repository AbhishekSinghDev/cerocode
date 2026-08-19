export function parseOauthCallbackState(state: string): { port: number } {
  const [encoded] = state.split(".");
  if (!encoded) throw new Error("Invalid state");

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString());
  const port = payload.port;

  if (!port || typeof port !== "number") {
    throw new Error("Invalid port in state");
  }

  return { port };
}

export function buildLocalCallbackUrl(
  port: number,
  code: string,
  state: string,
): string {
  return `http://localhost:${port}/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
}