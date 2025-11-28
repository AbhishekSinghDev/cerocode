import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { APP_NAME } from "./constants";

export interface ThemeConfig {
  currentThemeId: string;
}

const DEFAULT_THEME_ID = "matrix";

export class ThemeService {
  private static instance: ThemeService;
  private configDir: string;
  private configPath: string;
  private config: ThemeConfig;

  private constructor() {
    this.configDir = path.join(os.homedir(), `.${APP_NAME}`);
    this.configPath = path.join(this.configDir, "theme.json");
    this.config = this.loadConfig();
  }

  static getInstance(): ThemeService {
    if (!ThemeService.instance) {
      ThemeService.instance = new ThemeService();
    }
    return ThemeService.instance;
  }

  private ensureConfigDir(): void {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  private loadConfig(): ThemeConfig {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = fs.readFileSync(this.configPath, "utf-8");
        const parsed = JSON.parse(data);
        return {
          currentThemeId: parsed.currentThemeId || DEFAULT_THEME_ID,
        };
      }
    } catch {
      // If config is corrupted, return default
    }
    return { currentThemeId: DEFAULT_THEME_ID };
  }

  private saveConfig(): void {
    try {
      this.ensureConfigDir();
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2), "utf-8");
    } catch (error) {
      // Silently fail if we can't save (e.g., permission issues)
      console.error("Failed to save theme config:", error);
    }
  }

  getCurrentThemeId(): string {
    return this.config.currentThemeId;
  }

  setCurrentThemeId(themeId: string): void {
    this.config.currentThemeId = themeId;
    this.saveConfig();
  }

  /**
   * Reloads the config from disk (useful if external changes were made)
   */
  reload(): void {
    this.config = this.loadConfig();
  }
}
