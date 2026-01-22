/**
 * API Response Types
 * Based on backend public widget API endpoints
 */

// Generic API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Service related types
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  serviceCount?: number;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  capacity: number;
  bufferTimeBefore: number;
  bufferTimeAfter: number;
  color?: string;
  image?: string;
  categoryId?: string;
  categoryName?: string;
  showBringingAnyoneOption: boolean;
  allowRecurring: boolean;
  position: number;
}

export interface ServiceExtra {
  id: string;
  serviceId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // additional minutes
  maxQuantity: number;
  position: number;
}

export interface ServiceResponse {
  services: Service[];
  categories?: ServiceCategory[];
}

// Service Extras response
export interface ServiceExtrasResponse {
  extras: ServiceExtra[];
}

// Staff related types
export interface Staff {
  id: string;
  userId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  title?: string;
  bio?: string;
  avatar?: string;
  isVisible: boolean;
  services?: string[]; // service IDs this staff can perform
}

export interface StaffResponse {
  staff: Staff[];
}

// Location related types
export interface Location {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  email?: string;
  latitude?: string;
  longitude?: string;
  isVisible: boolean;
}

export interface LocationResponse {
  locations: Location[];
}

// Availability related types
export interface TimeSlot {
  startTime: string; // HH:mm format (e.g., "09:00")
  endTime: string; // HH:mm format (e.g., "10:00")
  available: boolean;
  reason?: string;
}

export interface AvailabilityResponse {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
  serviceId: string;
  staffId?: string;
  locationId?: string;
  extrasDurationMinutes?: number;
}

// Appointment creation types
export interface CreateAppointmentRequest {
  serviceId: string;
  staffId?: string;
  locationId?: string;
  startDateTime: string; // ISO 8601 format
  numberOfPeople?: number;
  guestFirstName?: string;
  guestLastName?: string;
  guestEmail: string;
  guestPhone: string;
  customerNotes?: string;
  extrasData?: AppointmentExtraData[];
  customFieldValues?: CustomFieldValue[];
  couponCode?: string;
}

export interface AppointmentExtraData {
  extraId: string;
  quantity: number;
}

export interface CustomFieldValue {
  customFieldId: string;
  value: string;
}

export interface AppointmentResponse {
  id: string;
  publicNumber: string;
  confirmationCode: string;
  serviceName: string;
  staffName?: string;
  locationName?: string;
  startDateTime: string;
  endDateTime: string;
  duration: number;
  totalPrice: number;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface CouponValidationResponse {
  valid: boolean;
  discountAmount: number;
  finalAmount?: number;
  coupon: {
    code: string;
    name: string;
    type: string;
    value: string;
    validUntil: string;
  };
}

// API Error types
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, any>;
}
