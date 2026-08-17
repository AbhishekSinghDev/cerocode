import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

type Settings = {
  themeId?: string;
};

const SETTINGS_DIR = join(homedir(), ".cerocode");
const SETTINGS_FILE = join(SETTINGS_DIR, "settings.json");

export function getSettings(): Settings {
  try {
    const data = readFileSync(SETTINGS_FILE, "utf-8");
    const parsed = JSON.parse(data) as Partial<Settings>;
    return typeof parsed.themeId === "string" ? { themeId: parsed.themeId } : {};
  } catch (error) {
    return {};
  }
}

export function saveSettings(settings: Settings) {
  if (!existsSync(SETTINGS_DIR)) {
    mkdirSync(SETTINGS_DIR, { mode: 0o700 });
  }

  const current = getSettings();
  const merged = { ...current, ...settings };
  writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), "utf-8");
}
