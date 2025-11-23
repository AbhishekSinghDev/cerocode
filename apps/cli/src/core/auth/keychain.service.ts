import { APP_NAME } from "@core/config/constants";
import { deletePassword, getPassword, setPassword } from "cross-keychain";
import type { AuthTokens } from "types";

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

    const now = new Date().getTime();
    const expiresAt = now + new Date(tokens.expires_in).getTime() * 1000;

    return expiresAt - now > 5 * 60 * 1000;
  }
}
