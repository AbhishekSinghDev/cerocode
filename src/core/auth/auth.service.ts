import { cancel, log, outro } from "@clack/prompts";
import chalk from "chalk";
import open from "open";
import type { AuthTokens, DeviceAuthResponse } from "../../types/auth.types.js";
import { CLI_UNIQUE_ID, TOKEN_POLLING_INTERVAL } from "../config/constants.js";
import { authClient } from "./auth.client.js";
import { KeychainService } from "./keychain.service.js";

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
      log.success("Browser opened successfully");
    } catch (err) {
      log.warn("Could not open browser automatically");
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
      console.log();
      log.success(chalk.green.bold("✓ Authorization successful!"));
      await this.keychainService.saveTokens({
        access_token: data.access_token,
        token_type: data.token_type,
        expires_in: data.expires_in,
        scope: data.scope,
      });
      outro(chalk.cyan("You're all set! 🎉"));
      return;
    } else if (error) {
      switch (error.error) {
        case "authorization_pending":
          // Still waiting, continue polling
          setTimeout(
            () => this.pollForToken(deviceCode, pollingInterval),
            pollingInterval * 1000
          );
          break;
        case "slow_down":
          pollingInterval += 5;
          log.warn("Polling too fast, slowing down...");
          setTimeout(
            () => this.pollForToken(deviceCode, pollingInterval),
            pollingInterval * 1000
          );
          break;
        case "access_denied":
          log.error(chalk.red("Access was denied by the user"));
          cancel("Authorization cancelled.");
          process.exit(1);
          return;
        case "expired_token":
          log.error(chalk.red("The device code has expired"));
          cancel("Please run the login command again.");
          process.exit(1);
          return;
        default:
          log.error(
            chalk.red(
              `Authorization error: ${error.error_description || error.error}`
            )
          );
          cancel("Operation failed.");
          process.exit(1);
          return;
      }
    }
  }

  async logout(): Promise<void> {
    await this.keychainService.clearTokens();
  }
}
