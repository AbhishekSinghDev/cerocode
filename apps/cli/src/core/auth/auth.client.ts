import { ConfigService } from "@core/config/config.service";
import { createAuthClient } from "better-auth/client";
import { deviceAuthorizationClient } from "better-auth/client/plugins";

const configService = ConfigService.getInstance();

export const authClient = createAuthClient({
  baseURL: configService.apiUrl,
  plugins: [deviceAuthorizationClient()],
});
