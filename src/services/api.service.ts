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
  CreateWidgetCheckoutRequest,
  WidgetCheckoutSessionResponse,
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

  private normalizeBaseUrl(): string {
    let normalizedBaseUrl = this.baseUrl;
    if (normalizedBaseUrl.endsWith("/api")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -4);
    }
    if (normalizedBaseUrl.endsWith("/")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
    }
    return normalizedBaseUrl;
  }

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
    const normalizedBaseUrl = this.normalizeBaseUrl();

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

  private shouldRefreshToken(error: unknown): boolean {
    if (!(error instanceof ApiRequestError)) {
      return false;
    }
    if (!this.slug) {
      return false;
    }
    if (error.statusCode !== 401 && error.statusCode !== 403) {
      return false;
    }
    const message = (error.message || "").toLowerCase();
    return message.includes("token");
  }

  private async refreshToken(): Promise<boolean> {
    if (!this.slug) {
      return false;
    }

    const baseUrl = this.normalizeBaseUrl();
    const candidates = [
      `${baseUrl}/api/public/embed/${this.slug}/bootstrap`,
      `${baseUrl}/public/embed/${this.slug}/bootstrap`,
    ];

    let response: {
      token: string;
      apiBaseUrl?: string;
      widgetKey?: string;
      slug?: string;
    } | null = null;

    for (const url of candidates) {
      try {
        response = await fetchWithRetry<{
          token: string;
          apiBaseUrl?: string;
          widgetKey?: string;
          slug?: string;
        }>(url);
        break;
      } catch {
        continue;
      }
    }

    if (!response) {
      return false;
    }

    if (response.apiBaseUrl) {
      this.baseUrl = response.apiBaseUrl;
    }
    if (response.widgetKey) {
      this.widgetKey = response.widgetKey;
    }
    if (response.slug) {
      this.slug = response.slug;
    }
    if (response.token) {
      this.token = response.token;
      return true;
    }

    return false;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const url = this.buildUrl(endpoint);

    try {
      return await fetchWithRetry<T>(url, options);
    } catch (error) {
      if (this.shouldRefreshToken(error)) {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          const retryUrl = this.buildUrl(endpoint);
          return fetchWithRetry<T>(retryUrl, options);
        }
      }
      throw error;
    }
  }

  /**
   * Get widget configuration
   */
  async getWidgetConfig(): Promise<WidgetConfig> {
    return this.request<WidgetConfig>("/config");
  }

  /**
   * Get available services
   */
  async getServices(locationId?: string): Promise<ServiceResponse> {
    const params = locationId ? `?locationId=${locationId}` : "";
    return this.request<ServiceResponse>(`/services${params}`);
  }

  /**
   * Get service extras
   * @param serviceId - Service ID to get extras for
   */
  async getServiceExtras(serviceId: string): Promise<ServiceExtrasResponse> {
    return this.request<ServiceExtrasResponse>(`/services/${serviceId}/extras`);
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
    return this.request<StaffResponse>(query ? `/staff?${query}` : "/staff");
  }

  /**
   * Get locations
   * @param serviceId - Optional filter by service
   */
  async getLocations(serviceId?: string): Promise<LocationResponse> {
    const params = serviceId ? `?serviceId=${serviceId}` : "";
    return this.request<LocationResponse>(`/locations${params}`);
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

    return this.request<AvailabilityResponse>(
      `/availability?${params.toString()}`,
    );
  }

  /**
   * Create appointment
   * @param appointmentData - Appointment details
   */
  async createAppointment(
    appointmentData: CreateAppointmentRequest,
  ): Promise<AppointmentResponse> {
    return this.request<AppointmentResponse>("/appointments", {
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
    return this.request<CouponValidationResponse>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createPaymentCheckoutSession(
    data: CreateWidgetCheckoutRequest,
  ): Promise<WidgetCheckoutSessionResponse> {
    return this.request<WidgetCheckoutSessionResponse>(
      "/payments/checkout-session",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
    );
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
