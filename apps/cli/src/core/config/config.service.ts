export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  get apiUrl(): string {
    return process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://cero.abhisheksingh.me";
  }

  get isDevelopment(): boolean {
    return process.env.NODE_ENV === "development";
  }

  get isProduction(): boolean {
    return process.env.NODE_ENV === "production";
  }
}
