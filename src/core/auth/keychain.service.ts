import { deletePassword, getPassword, setPassword } from "cross-keychain";
import type { AuthTokens } from "../../types/auth.types.js";
import { APP_NAME } from "../config/constants.js";

export class KeychainService {
  private readonly serviceName = APP_NAME;
  private readonly accountName = "auth-instance";

  async saveTokens(tokens: AuthTokens): Promise<void> {
    await setPassword(
      this.serviceName,
      this.accountName,
      JSON.stringify(tokens)
    );
  }

  async getTokens(): Promise<AuthTokens | null> {
    try {
      const authInstance = await getPassword(
        this.serviceName,
        this.accountName
      );
      return JSON.parse(authInstance || "null");
    } catch (error) {
      return null;
    }
  }

  async clearTokens(): Promise<void> {
    try {
      await deletePassword(this.serviceName, this.accountName);
    } catch (error) {
      // Ignore errors if tokens don't exist
    }
  }

  async hasValidToken(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return false;

    const now = Date.now();
    const expiresAt = tokens.expires_in;

    // Check if token expires in less than 5 minutes
    return expiresAt - now > 5 * 60 * 1000;
  }
}
