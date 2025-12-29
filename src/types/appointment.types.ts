/**
 * Appointment Booking Types
 * Internal state management for the booking flow
 */

import type { Service, ServiceExtra, Staff, Location } from "./api.types";

// Booking step union type (instead of enum for better TypeScript compatibility)
export type BookingStep =
  | "service"
  | "employee"
  | "location"
  | "extras"
  | "dateTime"
  | "customerInfo"
  | "payment"
  | "confirmation";

// Selected service state
export interface SelectedService {
  service: Service;
  categoryName?: string;
}

// Selected staff state
export interface SelectedStaff {
  staff: Staff | null; // null means "Any Employee"
  isAny: boolean;
}

// Selected location state
export interface SelectedLocation {
  location: Location | null; // null means "Any Location"
  isAny: boolean;
}

// Selected extra with quantity
export interface SelectedExtra {
  extra: ServiceExtra;
  quantity: number;
}

// Date and time selection
export interface SelectedDateTime {
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  isRecurring: boolean;
  recurringData?: RecurringData;
}

// Recurring appointment configuration
export interface RecurringData {
  frequency: "daily" | "weekly" | "monthly";
  interval: number; // e.g., every 2 weeks
  endType: "date" | "count";
  endDate?: string; // YYYY-MM-DD
  count?: number;
  appointments?: RecurringAppointment[];
}

export interface RecurringAppointment {
  date: string;
  time: string;
  available: boolean;
}

// Customer information
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
  customFieldValues?: Record<string, string>; // fieldId -> value
}

// Payment information
export interface PaymentInfo {
  method: "cash" | "card" | "online" | "stripe" | "paypal";
  couponCode?: string;
  discount?: number;
  subtotal: number;
  total: number;
}

// Number of people
export interface NumberOfPeople {
  count: number;
  maxCapacity: number;
}

// Complete appointment state
export interface AppointmentState {
  // Current step
  currentStep: BookingStep;
  completedSteps: BookingStep[];

  // Selections
  selectedService: SelectedService | null;
  selectedStaff: SelectedStaff | null;
  selectedLocation: SelectedLocation | null;
  selectedExtras: SelectedExtra[];
  selectedDateTime: SelectedDateTime | null;
  numberOfPeople: NumberOfPeople | null;
  customerInfo: CustomerInfo | null;
  paymentInfo: PaymentInfo | null;

  // Validation
  validationErrors: Record<BookingStep, string[]>;

  // Confirmed appointment
  confirmedAppointment: ConfirmedAppointment | null;
}

// Confirmed appointment details
export interface ConfirmedAppointment {
  id: string;
  confirmationCode: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  staff?: {
    name: string;
    title?: string;
  };
  location?: {
    name: string;
    address?: string;
  };
  dateTime: {
    start: string; // ISO 8601
    end: string; // ISO 8601
    displayDate: string; // e.g., "February 15, 2024"
    displayTime: string; // e.g., "9:00 AM"
  };
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  payment: {
    total: number;
    method: string;
    isPaid: boolean;
  };
  extras?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Step validation result
export interface StepValidation {
  isValid: boolean;
  errors: string[];
}

// Price calculation
export interface PriceBreakdown {
  servicePrice: number;
  extrasPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}
