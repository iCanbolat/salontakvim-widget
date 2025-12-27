/**
 * useAvailability Hook
 * Fetches and manages availability data
 */

import { useState, useCallback, useEffect } from "react";
import { useWidget } from "@/contexts";
import type { AvailabilityResponse, TimeSlot } from "@/types";

interface UseAvailabilityParams {
  serviceId?: number;
  staffId?: number;
  date?: string; // YYYY-MM-DD
  locationId?: number;
  extrasDurationMinutes?: number;
  enabled?: boolean; // Auto-fetch control
}

interface UseAvailabilityReturn {
  availability: AvailabilityResponse | null;
  slots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  fetchAvailability: () => Promise<void>;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage availability data
 */
export function useAvailability(
  params: UseAvailabilityParams
): UseAvailabilityReturn {
  const { apiService } = useWidget();
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    serviceId,
    staffId,
    date,
    locationId,
    extrasDurationMinutes,
    enabled = true,
  } = params;

  /**
   * Fetch availability from API
   */
  const fetchAvailability = useCallback(async () => {
    // Validate required params
    if (!serviceId || !staffId || !date) {
      setError("Service ID, Staff ID, and Date are required");
      return;
    }

    if (!apiService) {
      setError("API service not initialized");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiService.getAvailability(
        serviceId,
        staffId,
        date,
        locationId,
        extrasDurationMinutes
      );

      setAvailability(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch availability"
      );
      setAvailability(null);
    } finally {
      setIsLoading(false);
    }
  }, [apiService, serviceId, staffId, date, locationId, extrasDurationMinutes]);

  /**
   * Auto-fetch on params change (if enabled)
   */
  useEffect(() => {
    if (enabled && serviceId && staffId && date) {
      fetchAvailability();
    }
  }, [
    enabled,
    serviceId,
    staffId,
    date,
    locationId,
    extrasDurationMinutes,
    fetchAvailability,
  ]);

  return {
    availability,
    slots: availability?.slots || [],
    isLoading,
    error,
    fetchAvailability,
    refetch: fetchAvailability,
  };
}
