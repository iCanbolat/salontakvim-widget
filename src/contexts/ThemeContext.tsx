/**
 * Theme Context
 * Manages dynamic theming and CSS variables
 */

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { ThemeConfig } from "@/types";
import { useWidget } from "./WidgetContext";
import {
  applyTheme as applyThemeUtils,
  applyTypography,
  applyButtonStyles,
} from "@/utils";

interface ThemeContextValue {
  theme: ThemeConfig | null;
  applyTheme: (theme: ThemeConfig) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { config } = useWidget();

  /**
   * Apply theme when config loads
   */
  useEffect(() => {
    if (config?.styling) {
      applyTheme(config.styling);
    }
  }, [config]);

  /**
   * Apply theme function
   */
  const applyTheme = (theme: ThemeConfig) => {
    // Apply color theme
    applyThemeUtils(theme);

    // Apply typography
    applyTypography(theme.fontFamily, theme.fontSize);

    // Apply button styles
    applyButtonStyles(theme.buttonBorderRadius);
  };

  const value: ThemeContextValue = {
    theme: config?.styling || null,
    applyTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to use theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
