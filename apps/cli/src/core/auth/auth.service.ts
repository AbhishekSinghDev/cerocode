import { CLI_UNIQUE_ID, TOKEN_POLLING_INTERVAL } from "@core/config/constants";
import chalk from "chalk";
import open from "open";
import type { AuthTokens, DeviceAuthResponse } from "types";
import { authClient } from "./auth.client";
import { KeychainService } from "./keychain.service";

export class AuthService {
  private keychainService: KeychainService;

  constructor() {
    this.keychainService = new KeychainService();
  }

  async isAuthenticated(): Promise<boolean> {
    return this.keychainService.hasValidToken();
  }

  async getTokens(): Promise<AuthTokens | null> {
    return this.keychainService.getTokens();
  }

  async requestDeviceCode(): Promise<DeviceAuthResponse> {
    const response = await authClient.device.code({
      client_id: CLI_UNIQUE_ID,
    });

    if (response.error || !response.data) {
      throw new Error(
        response.error?.error_description ??
          "Failed to request device authorization"
      );
    }

    return response.data;
  }

  async openAuthorizationUrl(url: string): Promise<void> {
    try {
      await open(url);
      console.log(chalk.green("✓ Browser opened successfully"));
    } catch (err) {
      console.warn(chalk.yellow("! Could not open browser automatically"));
    }
  }

  async pollForToken(
    deviceCode: string,
    pollingInterval: number = TOKEN_POLLING_INTERVAL
  ): Promise<void> {
    const { data, error } = await authClient.device.token({
      grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      device_code: deviceCode,
      client_id: CLI_UNIQUE_ID,
      fetchOptions: {
        headers: {
          "user-agent": "cero-cli",
        },
      },
    });

    if (data) {
      await this.keychainService.saveTokens({
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        scope: data.scope,
      });
      return;
    } else if (error) {
      switch (error.error) {
        case "authorization_pending":
          await new Promise((resolve) =>
            setTimeout(resolve, pollingInterval * 1000)
          );
          return this.pollForToken(deviceCode, pollingInterval);
        case "slow_down":
          pollingInterval += 5;
          await new Promise((resolve) =>
            setTimeout(resolve, pollingInterval * 1000)
          );
          return this.pollForToken(deviceCode, pollingInterval);
        case "access_denied":
          throw new Error("Access was denied by the user");
        case "expired_token":
          throw new Error("The device code has expired");
        default:
          throw new Error(
            `Authorization error: ${error.error_description || error.error}`
          );
      }
    }
  }

  async logout(): Promise<void> {
    await this.keychainService.clearTokens();
  }
}
