/**
 * useApi Hook
 * General purpose API data fetching hook
 */

import { useState, useCallback, useEffect } from "react";
import { useWidget } from "@/contexts";
import type { ServiceResponse, StaffResponse, LocationResponse } from "@/types";

type ApiDataType = ServiceResponse | StaffResponse | LocationResponse;

interface UseApiOptions<T> {
  enabled?: boolean; // Auto-fetch control
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Generic hook for API calls
 */
export function useApi<T extends ApiDataType>(
  fetcher: () => Promise<T>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const { enabled = true, onSuccess, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      setData(result);
      setError(null);
      onSuccess?.(result);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setData(null);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, onSuccess, onError]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook to fetch services
 */
export function useServices(
  locationId?: string,
  options: UseApiOptions<ServiceResponse> = {}
) {
  const { apiService } = useWidget();

  return useApi<ServiceResponse>(() => {
    if (!apiService) {
      throw new Error("API service not initialized");
    }
    return apiService.getServices(locationId);
  }, options);
}

/**
 * Hook to fetch staff
 */
export function useStaff(
  serviceId?: string,
  locationId?: string,
  options: UseApiOptions<StaffResponse> = {}
) {
  const { apiService } = useWidget();

  return useApi<StaffResponse>(() => {
    if (!apiService) {
      throw new Error("API service not initialized");
    }
    return apiService.getStaff(serviceId, locationId);
  }, options);
}

/**
 * Hook to fetch locations
 */
export function useLocations(
  serviceId?: string,
  options: UseApiOptions<LocationResponse> = {}
) {
  const { apiService } = useWidget();

  return useApi<LocationResponse>(() => {
    if (!apiService) {
      throw new Error("API service not initialized");
    }
    return apiService.getLocations(serviceId);
  }, options);
}
