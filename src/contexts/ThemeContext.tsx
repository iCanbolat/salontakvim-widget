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
  applyTheme: (theme: ThemeConfig, root?: HTMLElement | ShadowRoot) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  shadowRoot?: ShadowRoot;
}

export function ThemeProvider({ children, shadowRoot }: ThemeProviderProps) {
  const { config } = useWidget();

  /**
   * Apply theme when config loads
   */
  useEffect(() => {
    if (config?.styling) {
      // Apply to shadow root if available, otherwise to document
      const root = shadowRoot || document.documentElement;
      applyTheme(config.styling, root);
    }
  }, [config, shadowRoot]);

  /**
   * Apply theme function
   */
  const applyTheme = (theme: ThemeConfig, root?: HTMLElement | ShadowRoot) => {
    const targetRoot = root || shadowRoot || document.documentElement;

    // Apply color theme
    applyThemeUtils(theme, targetRoot);

    // Apply typography
    applyTypography(theme.fontFamily, theme.fontSize, targetRoot);

    // Apply button styles
    applyButtonStyles(theme.buttonBorderRadius, targetRoot);
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
