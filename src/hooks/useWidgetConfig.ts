/**
 * useWidgetConfig Hook
 * Simplified hook to access widget configuration
 */

import { useWidget } from "@/contexts";
import type { WidgetConfig } from "@/types";

interface UseWidgetConfigReturn {
  config: WidgetConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to access widget configuration
 */
export function useWidgetConfig(): UseWidgetConfigReturn {
  const { config, isLoading, error, fetchConfig } = useWidget();

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };
}
