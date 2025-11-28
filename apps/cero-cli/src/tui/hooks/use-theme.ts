import { useContext } from "react";
import type { ThemeContextValue } from "types/tui.type";
import { ThemeContext } from "../context/theme-context";

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
