import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";
import { ConfigService } from "../config/config.service.js";

const configService = ConfigService.getInstance();

export const authClient = createAuthClient({
  baseURL: configService.apiUrl,
  plugins: [deviceAuthorizationClient()],
});
