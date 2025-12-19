/**
 * Theme Utils
 * Dynamic theme application utilities
 */

import type { ThemeConfig } from "@/types";

/**
 * Apply theme CSS variables to document root
 */
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;

  // Apply colors
  if (theme.primaryColor) {
    root.style.setProperty("--primary", theme.primaryColor);
  }

  if (theme.secondaryColor) {
    root.style.setProperty("--secondary", theme.secondaryColor);
    // Use secondary color as the foreground for primary surfaces (e.g., button text)
    root.style.setProperty("--primary-foreground", theme.secondaryColor);
  }

  if (theme.sidebarBackgroundColor) {
    root.style.setProperty("--sidebar-bg", theme.sidebarBackgroundColor);
  }

  if (theme.contentBackgroundColor) {
    root.style.setProperty("--content-bg", theme.contentBackgroundColor);
  }

  if (theme.textColor) {
    root.style.setProperty("--foreground", theme.textColor);
  }

  if (theme.headingColor) {
    root.style.setProperty("--heading", theme.headingColor);
  }
}

/**
 * Apply typography styles
 */
export function applyTypography(fontFamily?: string, fontSize?: number): void {
  const root = document.documentElement;

  if (fontFamily) {
    // Set both --font-family and --font-sans for consistency
    root.style.setProperty("--font-family", fontFamily);
    root.style.setProperty("--font-sans", fontFamily);

    // Load Google Font if needed (check if it's not a system font)
    if (
      !fontFamily.includes("system") &&
      !fontFamily.includes("sans-serif") &&
      !fontFamily.includes("-apple-")
    ) {
      loadGoogleFont(fontFamily);
    }
  }

  if (fontSize) {
    root.style.setProperty("--base-font-size", `${fontSize}px`);
  }
}

/**
 * Load Google Font dynamically
 */
export function loadGoogleFont(fontFamily: string): void {
  const fontName = fontFamily.split(",")[0].trim().replace(/['"]/g, "");
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    / /g,
    "+"
  )}:wght@400;500;600;700&display=swap`;

  // Check if font already loaded
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (existingLink) return;

  // Create and append link element
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = fontUrl;
  document.head.appendChild(link);
}

/**
 * Apply button styles
 */
export function applyButtonStyles(borderRadius?: number): void {
  if (borderRadius !== undefined) {
    const root = document.documentElement;
    root.style.setProperty("--radius", `${borderRadius}px`);
  }
}

/**
 * Reset theme to defaults
 */
export function resetTheme(): void {
  const root = document.documentElement;
  const properties = [
    "--primary",
    "--secondary",
    "--primary-foreground",
    "--sidebar-bg",
    "--content-bg",
    "--foreground",
    "--heading",
    "--font-family",
    "--base-font-size",
    "--radius",
  ];

  properties.forEach((prop) => {
    root.style.removeProperty(prop);
  });
}

/**
 * Convert hex color to HSL
 */
export function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
    l * 100
  )}%`;
}

/**
 * Generate color shades from primary color
 */
export function generateColorShades(
  primaryColor: string
): Record<string, string> {
  // This is a simplified version
  // In production, you might want to use a library like tinycolor2
  const hsl = hexToHSL(primaryColor);
  const [h, s, l] = hsl.split(" ").map((v) => parseFloat(v));

  return {
    "50": `${h} ${s}% ${Math.min(l + 40, 95)}%`,
    "100": `${h} ${s}% ${Math.min(l + 30, 90)}%`,
    "200": `${h} ${s}% ${Math.min(l + 20, 85)}%`,
    "300": `${h} ${s}% ${Math.min(l + 10, 80)}%`,
    "400": `${h} ${s}% ${Math.min(l + 5, 75)}%`,
    "500": hsl, // Base color
    "600": `${h} ${s}% ${Math.max(l - 5, 25)}%`,
    "700": `${h} ${s}% ${Math.max(l - 10, 20)}%`,
    "800": `${h} ${s}% ${Math.max(l - 20, 15)}%`,
    "900": `${h} ${s}% ${Math.max(l - 30, 10)}%`,
  };
}
