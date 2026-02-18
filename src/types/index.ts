/**
 * Barrel export for all types
 * Allows importing types from a single location
 */

// Widget types
export type {
  LayoutType,
  SidebarMenuItems,
  ThemeConfig,
  WidgetSettings,
  StoreInfo,
  WidgetConfig,
  WidgetState,
} from "./widget.types";

// API types
export type {
  ApiResponse,
  ApiError,
  ServiceCategory,
  Service,
  ServiceExtra,
  ServiceResponse,
  ServiceExtrasResponse,
  Staff,
  StaffResponse,
  Location,
  LocationResponse,
  TimeSlot,
  AvailabilityResponse,
  CreateAppointmentRequest,
  CreateWidgetCheckoutRequest,
  WidgetCheckoutSessionResponse,
  AppointmentExtraData,
  CustomFieldValue,
  AppointmentResponse,
  CouponValidationResponse,
} from "./api.types";

// Appointment types
export type {
  BookingStep,
  SelectedService,
  SelectedStaff,
  SelectedLocation,
  SelectedExtra,
  SelectedDateTime,
  RecurringData,
  RecurringAppointment,
  CustomerInfo,
  PaymentInfo,
  NumberOfPeople,
  AppointmentState,
  ConfirmedAppointment,
  StepValidation,
  PriceBreakdown,
} from "./appointment.types";
