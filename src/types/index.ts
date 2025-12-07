/**
 * Barrel export for all types
 * Allows importing types from a single location
 */

// Widget types
export type {
  LayoutType,
  SidebarMenuItems,
  FieldRequirements,
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
  AppointmentExtraData,
  CustomFieldValue,
  AppointmentResponse,
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
