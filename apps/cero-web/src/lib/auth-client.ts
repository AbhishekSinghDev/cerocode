import { env } from "@/env";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_API_URL,
  plugins: [deviceAuthorizationClient()],
});

export type Session = typeof authClient.$Infer.Session;
