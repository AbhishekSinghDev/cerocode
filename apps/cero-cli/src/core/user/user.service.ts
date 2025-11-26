import { AuthService } from "@core/auth/auth.service";
import { ConfigService } from "@core/config/config.service";
import type { User } from "types/user.type";

export class UserService {
    private configService = ConfigService.getInstance();
    private authService: AuthService | null = null;

    constructor() {
        this.authService = new AuthService()
    }

    async whoAmI(): Promise<User> {
        if (!this.authService) {
            throw new Error("AuthService not initialized");
        }

        const apiUrl = this.configService.apiUrl;
        const authToken = await this.authService?.getTokens();

        if (!authToken) {
            throw new Error("User is not authenticated");
        }

        const response = await fetch(`${apiUrl}/api/user/whoami`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken.access_token}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to fetch user info");
        }

        const data = await response.json();
        return data.user as User;
    }

}
