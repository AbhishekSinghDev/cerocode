import { DEFAULT_THEME_ID, getThemeById, THEMES } from "./themes";

// Get the default theme (Matrix)
const defaultThemeDef = getThemeById(DEFAULT_THEME_ID);
const fallbackTheme = THEMES[0];
const defaultColors =
  defaultThemeDef?.colors ?? fallbackTheme?.colors ?? THEMES.find(() => true)?.colors;

if (!defaultColors) {
  throw new Error("No themes available");
}

// Export the default colors for backward compatibility
export const colors = defaultColors;

// Export syntax highlighting utilities
export { createSubtleSyntaxStyle, createSyntaxStyle } from "./syntax";

// Export theme utilities
export { deriveSyntaxColors } from "./theme-utils";
