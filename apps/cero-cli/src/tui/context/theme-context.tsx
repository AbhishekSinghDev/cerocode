import { ThemeService } from "@core/config/theme.service";
import { DEFAULT_THEME_ID, getNextThemeId, getThemeById, THEMES } from "@tui/theme/themes";
import {
  createContext,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ThemeColors, ThemeContextValue } from "types/tui.type";

export const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_INDICATOR_TIMEOUT = 3000; // how long to show the theme indicator (ms)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const themeService = useMemo(() => ThemeService.getInstance(), []);

  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    return themeService.getCurrentThemeId();
  });

  const [showThemeIndicator, setShowThemeIndicator] = useState(false);
  const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentThemeDef = useMemo(() => {
    return getThemeById(currentThemeId) ?? getThemeById(DEFAULT_THEME_ID) ?? THEMES[0];
  }, [currentThemeId]);

  const colors = useMemo(() => {
    return currentThemeDef?.colors ?? THEMES[0]?.colors;
  }, [currentThemeDef]);

  const showIndicator = useCallback(() => {
    setShowThemeIndicator(true);

    if (indicatorTimeoutRef.current) {
      clearTimeout(indicatorTimeoutRef.current);
    }

    indicatorTimeoutRef.current = setTimeout(() => {
      setShowThemeIndicator(false);
    }, THEME_INDICATOR_TIMEOUT);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
    };
  }, []);

  // Cycle to next theme
  const nextTheme = useCallback(() => {
    const nextId = getNextThemeId(currentThemeId);
    setCurrentThemeId(nextId);
    themeService.setCurrentThemeId(nextId);
    showIndicator();
  }, [currentThemeId, themeService, showIndicator]);

  // Set theme by ID
  const setThemeById = useCallback(
    (id: string) => {
      const themeDef = getThemeById(id);
      if (themeDef) {
        setCurrentThemeId(id);
        themeService.setCurrentThemeId(id);
        showIndicator();
      }
    },
    [themeService, showIndicator]
  );

  const currentThemeIndex = useMemo(() => {
    return THEMES.findIndex((t) => t.id === currentThemeId);
  }, [currentThemeId]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      colors: colors as ThemeColors,
      currentThemeId,
      currentThemeName: currentThemeDef?.name ?? "Unknown",
      themes: THEMES,
      themeCount: THEMES.length,
      currentThemeIndex,
      showThemeIndicator,
      nextTheme,
      setThemeById,
    }),
    [
      colors,
      currentThemeId,
      currentThemeDef,
      currentThemeIndex,
      showThemeIndicator,
      nextTheme,
      setThemeById,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
