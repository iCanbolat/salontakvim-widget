/**
 * API Service
 * Handles all HTTP requests to the backend widget API
 */

import type {
  WidgetConfig,
  ServiceResponse,
  ServiceExtrasResponse,
  StaffResponse,
  LocationResponse,
  AvailabilityResponse,
  CreateAppointmentRequest,
  AppointmentResponse,
  CouponValidationResponse,
  ApiError,
} from "@/types";

// API Configuration
const API_CONFIG = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

/**
 * Custom API Error class
 */
export class ApiRequestError extends Error {
  statusCode: number;
  details?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number,
    details?: Record<string, any>,
  ) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Sleep utility for retry logic
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generic fetch wrapper with error handling and retries
 */
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries = API_CONFIG.retryAttempts,
): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        statusCode: response.status,
        message: response.statusText,
      }));

      throw new ApiRequestError(
        errorData.message || "Request failed",
        errorData.statusCode || response.status,
        errorData.details,
      );
    }

    // Parse successful response
    const data: T = await response.json();
    return data;
  } catch (error) {
    // Handle abort (timeout)
    if (error instanceof Error && error.name === "AbortError") {
      if (retries > 0) {
        await sleep(API_CONFIG.retryDelay);
        return fetchWithRetry<T>(url, options, retries - 1);
      }
      throw new ApiRequestError("Request timeout", 408);
    }

    // Handle API errors
    if (error instanceof ApiRequestError) {
      // Retry on 5xx errors
      if (error.statusCode >= 500 && retries > 0) {
        await sleep(API_CONFIG.retryDelay);
        return fetchWithRetry<T>(url, options, retries - 1);
      }
      throw error;
    }

    // Handle network errors
    if (retries > 0) {
      await sleep(API_CONFIG.retryDelay);
      return fetchWithRetry<T>(url, options, retries - 1);
    }

    throw new ApiRequestError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

/**
 * API Service Class
 */
export class ApiService {
  private widgetKey?: string;
  private slug?: string;
  private baseUrl: string;
  private token?: string;

  constructor(
    widgetKeyOrOptions:
      | string
      | { widgetKey?: string; slug?: string; baseUrl?: string; token?: string },
    baseUrl?: string,
    token?: string,
  ) {
    if (typeof widgetKeyOrOptions === "string") {
      this.widgetKey = widgetKeyOrOptions;
      this.baseUrl = baseUrl || API_CONFIG.baseUrl;
      this.token = token;
    } else {
      const {
        widgetKey,
        slug,
        baseUrl: customBaseUrl,
        token: tokenValue,
      } = widgetKeyOrOptions;
      this.widgetKey = widgetKey;
      this.slug = slug;
      this.baseUrl = customBaseUrl || API_CONFIG.baseUrl;
      this.token = tokenValue;
    }
  }

  /**
   * Build API URL with widget key
   */
  private buildUrl(endpoint: string): string {
    // Normalize baseUrl - remove trailing /api if present to avoid duplication
    let normalizedBaseUrl = this.baseUrl;
    if (normalizedBaseUrl.endsWith("/api")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -4);
    }
    if (normalizedBaseUrl.endsWith("/")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
    }

    const prefix = this.slug
      ? `/api/public/store/${this.slug}`
      : this.widgetKey
        ? `/api/public/widget/${this.widgetKey}`
        : null;

    if (!prefix) {
      throw new Error("ApiService requires a widgetKey or slug");
    }

    // Handle endpoint mapping for store vs widget routes
    // Store routes use different naming: /config -> /widget-config
    let mappedEndpoint = endpoint;
    if (this.slug && endpoint === "/config") {
      mappedEndpoint = "/widget-config";
    }

    const url = new URL(`${normalizedBaseUrl}${prefix}${mappedEndpoint}`);
    if (this.token) {
      url.searchParams.set("token", this.token);
    }

    return url.toString();
  }

  /**
   * Get widget configuration
   */
  async getWidgetConfig(): Promise<WidgetConfig> {
    const url = this.buildUrl("/config");
    return fetchWithRetry<WidgetConfig>(url);
  }

  /**
   * Get available services
   */
  async getServices(locationId?: string): Promise<ServiceResponse> {
    const params = locationId ? `?locationId=${locationId}` : "";
    const url = this.buildUrl(`/services${params}`);
    return fetchWithRetry<ServiceResponse>(url);
  }

  /**
   * Get service extras
   * @param serviceId - Service ID to get extras for
   */
  async getServiceExtras(serviceId: string): Promise<ServiceExtrasResponse> {
    const url = this.buildUrl(`/services/${serviceId}/extras`);
    return fetchWithRetry<ServiceExtrasResponse>(url);
  }

  /**
   * Get staff members
   * @param serviceId - Optional filter by service
   */
  async getStaff(
    serviceId?: string,
    locationId?: string,
  ): Promise<StaffResponse> {
    const params = new URLSearchParams();
    if (serviceId) params.append("serviceId", serviceId);
    if (locationId) params.append("locationId", locationId);
    const query = params.toString();
    const url = this.buildUrl(query ? `/staff?${query}` : "/staff");
    return fetchWithRetry<StaffResponse>(url);
  }

  /**
   * Get locations
   * @param serviceId - Optional filter by service
   */
  async getLocations(serviceId?: string): Promise<LocationResponse> {
    const params = serviceId ? `?serviceId=${serviceId}` : "";
    const url = this.buildUrl(`/locations${params}`);
    return fetchWithRetry<LocationResponse>(url);
  }

  /**
   * Get available time slots
   * @param serviceId - Required service ID
   * @param staffId - Required staff ID
   * @param date - Required date in YYYY-MM-DD format
   * @param locationId - Optional location ID
   */
  async getAvailability(
    serviceId: string,
    staffId: string,
    date: string,
    locationId?: string,
    extrasDurationMinutes?: number,
  ): Promise<AvailabilityResponse> {
    const params = new URLSearchParams({
      serviceId,
      staffId,
      date,
    });

    if (locationId) {
      params.append("locationId", locationId);
    }

    if (extrasDurationMinutes && extrasDurationMinutes > 0) {
      params.append("extrasDurationMinutes", extrasDurationMinutes.toString());
    }

    const url = this.buildUrl(`/availability?${params.toString()}`);
    return fetchWithRetry<AvailabilityResponse>(url);
  }

  /**
   * Create appointment
   * @param appointmentData - Appointment details
   */
  async createAppointment(
    appointmentData: CreateAppointmentRequest,
  ): Promise<AppointmentResponse> {
    const url = this.buildUrl("/appointments");
    return fetchWithRetry<AppointmentResponse>(url, {
      method: "POST",
      body: JSON.stringify(appointmentData),
    });
  }

  /**
   * Validate coupon code
   */
  async validateCoupon(data: {
    code: string;
    serviceId?: string;
    amount?: number;
    guestEmail?: string;
  }): Promise<CouponValidationResponse> {
    const url = this.buildUrl("/coupons/validate");
    return fetchWithRetry<CouponValidationResponse>(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * Update widget key (for re-initialization)
   */
  setWidgetKey(widgetKey: string): void {
    this.widgetKey = widgetKey;
    this.slug = undefined;
  }

  /**
   * Get current widget key
   */
  getWidgetKey(): string | undefined {
    return this.widgetKey;
  }

  setSlug(slug: string): void {
    this.slug = slug;
    this.widgetKey = undefined;
  }

  getSlug(): string | undefined {
    return this.slug;
  }

  setToken(token?: string): void {
    this.token = token;
  }
}

/**
 * Create API service instance
 */
export function createApiService(
  widgetKeyOrOptions:
    | string
    | { widgetKey?: string; slug?: string; baseUrl?: string; token?: string },
  baseUrl?: string,
  token?: string,
): ApiService {
  return new ApiService(widgetKeyOrOptions as any, baseUrl, token);
}

/**
 * Export singleton instance (will be initialized with widget key)
 */
let apiServiceInstance: ApiService | null = null;

export function initializeApiService(
  widgetKeyOrOptions:
    | string
    | { widgetKey?: string; slug?: string; baseUrl?: string; token?: string },
  baseUrl?: string,
  token?: string,
): ApiService {
  apiServiceInstance = createApiService(
    widgetKeyOrOptions as any,
    baseUrl,
    token,
  );
  return apiServiceInstance;
}

export function getApiService(): ApiService {
  if (!apiServiceInstance) {
    throw new Error(
      "API Service not initialized. Call initializeApiService first.",
    );
  }
  return apiServiceInstance;
}
