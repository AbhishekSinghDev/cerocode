import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { Theme } from "./types";
import { THEMES } from "./themes";
import { getSettings, saveSettings } from "../../lib/settings";

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme, persist?: boolean) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return value;
}

type ThemeProviderProps = {
  children: ReactNode;
};

function getInitialTheme(): Theme {
  const savedId = getSettings().themeId;
  return THEMES.find((t) => t.id === savedId) ?? THEMES[0]!;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setTheme = useCallback((t: Theme, persist = true) => {
    setThemeState(t);
    if (persist) {
      saveSettings({ themeId: t.id });
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}