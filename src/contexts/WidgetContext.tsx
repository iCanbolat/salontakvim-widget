/**
 * Widget Context
 * Manages widget configuration and global state
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { WidgetState } from "@/types";
import { ApiService, ApiRequestError } from "@/services";

interface WidgetContextValue extends WidgetState {
  // Actions
  fetchConfig: () => Promise<void>;
  setError: (error: string | null) => void;
  apiService: ApiService | null;
}

const WidgetContext = createContext<WidgetContextValue | undefined>(undefined);

interface WidgetProviderProps {
  children: ReactNode;
  widgetKey: string;
  slug?: string;
  apiBaseUrl?: string;
  token?: string;
}

export function WidgetProvider({
  children,
  widgetKey,
  slug,
  apiBaseUrl,
  token,
}: WidgetProviderProps) {
  const [state, setState] = useState<WidgetState>({
    config: null,
    isLoading: true,
    error: null,
    widgetKey,
  });

  const apiService = useMemo(
    () =>
      new ApiService({
        widgetKey,
        slug,
        baseUrl: apiBaseUrl,
        token: token,
      }),
    [apiBaseUrl, token, slug, widgetKey],
  );

  /**
   * Fetch widget configuration from API
   */
  const fetchConfig = async () => {
    setState((prev: WidgetState) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const config = await apiService.getWidgetConfig();

      setState((prev: WidgetState) => ({
        ...prev,
        config,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error("Failed to fetch widget config:", error);

      let errorMessage = "Failed to load widget configuration";

      if (error instanceof ApiRequestError) {
        if (error.statusCode === 404) {
          errorMessage = "Widget not found. Please check your widget key.";
        } else if (error.statusCode === 403) {
          errorMessage = "This widget is currently disabled.";
        } else {
          errorMessage = error.message;
        }
      }

      setState((prev: WidgetState) => ({
        ...prev,
        config: null,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  /**
   * Set error manually
   */
  const setError = (error: string | null) => {
    setState((prev: WidgetState) => ({ ...prev, error }));
  };

  /**
   * Fetch config on mount
   */
  useEffect(() => {
    fetchConfig();
  }, [widgetKey, slug, token]); // Re-fetch if widget key/slug or token changes

  const value: WidgetContextValue = {
    ...state,
    fetchConfig,
    setError,
    apiService,
  };

  return (
    <WidgetContext.Provider value={value}>{children}</WidgetContext.Provider>
  );
}

/**
 * Hook to use widget context
 */
export function useWidget(): WidgetContextValue {
  const context = useContext(WidgetContext);

  if (context === undefined) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }

  return context;
}
