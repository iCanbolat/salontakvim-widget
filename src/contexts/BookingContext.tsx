/**
 * Booking Context
 * Manages appointment booking state and flow
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AppointmentState,
  BookingStep,
  SelectedService,
  SelectedStaff,
  SelectedLocation,
  SelectedExtra,
  SelectedDateTime,
  NumberOfPeople,
  CustomerInfo,
  PaymentInfo,
  ConfirmedAppointment,
  PriceBreakdown,
} from "@/types";
import { useWidget } from "./WidgetContext";
import { validationService, storageService } from "@/services";

// All possible booking steps
const ALL_BOOKING_STEPS: BookingStep[] = [
  "location",
  "service",
  "employee",
  "extras",
  "dateTime",
  "customerInfo",
  "payment",
  "confirmation",
];

interface BookingContextValue {
  // State
  state: AppointmentState;

  // Navigation
  currentStepIndex: number;
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Actions - Service
  selectService: (service: SelectedService) => void;
  clearService: () => void;

  // Actions - Staff
  selectStaff: (staff: SelectedStaff) => void;
  clearStaff: () => void;

  // Actions - Location
  selectLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;

  // Actions - Extras
  addExtra: (extra: SelectedExtra) => void;
  removeExtra: (extraId: string) => void;
  updateExtraQuantity: (extraId: string, quantity: number) => void;
  clearExtras: () => void;

  // Actions - DateTime
  selectDateTime: (dateTime: SelectedDateTime) => void;
  clearDateTime: () => void;

  // Actions - Number of People
  setNumberOfPeople: (numberOfPeople: NumberOfPeople) => void;

  // Actions - Customer Info
  setCustomerInfo: (info: CustomerInfo) => void;

  // Actions - Payment
  setPaymentInfo: (info: PaymentInfo) => void;

  // Actions - Confirmation
  setConfirmedAppointment: (appointment: ConfirmedAppointment) => void;

  // Utilities
  getPriceBreakdown: () => PriceBreakdown;
  resetBooking: () => void;
  saveDraft: () => void;
  loadDraft: () => boolean;
}

const BookingContext = createContext<BookingContextValue | undefined>(
  undefined
);

interface BookingProviderProps {
  children: ReactNode;
}

const initialState: AppointmentState = {
  currentStep: "location",
  completedSteps: [],
  selectedService: null,
  selectedStaff: null,
  selectedLocation: null,
  selectedExtras: [],
  selectedDateTime: null,
  numberOfPeople: null,
  customerInfo: null,
  paymentInfo: null,
  validationErrors: {
    service: [],
    employee: [],
    location: [],
    extras: [],
    dateTime: [],
    customerInfo: [],
    payment: [],
    confirmation: [],
  },
  confirmedAppointment: null,
};

export function BookingProvider({ children }: BookingProviderProps) {
  const { config, widgetKey } = useWidget();
  const [state, setState] = useState<AppointmentState>(initialState);

  // Calculate active booking steps based on config
  const bookingSteps = useMemo(() => {
    if (!config?.sidebarMenuItems) return ALL_BOOKING_STEPS;

    return ALL_BOOKING_STEPS.filter((step) => {
      // Always include confirmation
      if (step === "confirmation") return true;

      // Check if step is enabled in config
      return config.sidebarMenuItems[step] !== false;
    });
  }, [config?.sidebarMenuItems]);

  const currentStepIndex = Math.max(bookingSteps.indexOf(state.currentStep), 0);

  /**
   * Check if can go to next step (validation)
   */
  const canGoNext = useCallback(() => {
    if (!config) return false;

    const validation = validationService.validateStep(
      state.currentStep,
      state,
      config.fieldRequirements
    );

    return validation.isValid;
  }, [state, config]);

  /**
   * Check if can go to previous step
   */
  const canGoPrev = useCallback(() => {
    return currentStepIndex > 0;
  }, [currentStepIndex]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((step: BookingStep) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    if (!canGoNext()) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < bookingSteps.length) {
      const nextStep = bookingSteps[nextIndex];
      setState((prev: AppointmentState) => {
        const newState = {
          ...prev,
          currentStep: nextStep,
          completedSteps: [...prev.completedSteps, prev.currentStep],
        };
        // Save draft with new state
        storageService.saveDraft(widgetKey, newState);
        return newState;
      });
    }
  }, [canGoNext, currentStepIndex, bookingSteps, widgetKey]);

  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    if (!canGoPrev()) return;

    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = bookingSteps[prevIndex];
      goToStep(prevStep);
    }
  }, [canGoPrev, currentStepIndex, goToStep, bookingSteps]);

  /**
   * Select service
   */
  const selectService = useCallback((service: SelectedService) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedService: service,
      // Clear dependent selections
      selectedStaff: null,
      selectedExtras: [],
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Clear service
   */
  const clearService = useCallback(() => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedService: null,
      selectedStaff: null,
      selectedExtras: [],
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Select staff
   */
  const selectStaff = useCallback((staff: SelectedStaff) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedStaff: staff,
      // Clear dependent selections
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Clear staff
   */
  const clearStaff = useCallback(() => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedStaff: null,
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Select location
   */
  const selectLocation = useCallback((location: SelectedLocation) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedLocation: location,
      // Clear dependent selections
      selectedService: null,
      selectedStaff: null,
      selectedExtras: [],
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Clear location
   */
  const clearLocation = useCallback(() => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedLocation: null,
      selectedService: null,
      selectedStaff: null,
      selectedExtras: [],
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Add extra
   */
  const addExtra = useCallback((extra: SelectedExtra) => {
    setState((prev: AppointmentState) => {
      const exists = prev.selectedExtras.find(
        (e) => e.extra.id === extra.extra.id
      );
      if (exists) {
        // Update quantity
        return {
          ...prev,
          selectedExtras: prev.selectedExtras.map((e) =>
            e.extra.id === extra.extra.id ? extra : e
          ),
        };
      }
      // Add new
      return {
        ...prev,
        selectedExtras: [...prev.selectedExtras, extra],
      };
    });
  }, []);

  /**
   * Remove extra
   */
  const removeExtra = useCallback((extraId: string) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedExtras: prev.selectedExtras.filter((e) => e.extra.id !== extraId),
    }));
  }, []);

  /**
   * Update extra quantity
   */
  const updateExtraQuantity = useCallback(
    (extraId: string, quantity: number) => {
      setState((prev: AppointmentState) => ({
        ...prev,
        selectedExtras: prev.selectedExtras.map((e) =>
          e.extra.id === extraId ? { ...e, quantity } : e
        ),
      }));
    },
    []
  );

  /**
   * Clear extras
   */
  const clearExtras = useCallback(() => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedExtras: [],
    }));
  }, []);

  /**
   * Select date and time
   */
  const selectDateTime = useCallback((dateTime: SelectedDateTime) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedDateTime: dateTime,
    }));
  }, []);

  /**
   * Clear date and time
   */
  const clearDateTime = useCallback(() => {
    setState((prev: AppointmentState) => ({
      ...prev,
      selectedDateTime: null,
    }));
  }, []);

  /**
   * Set number of people
   */
  const setNumberOfPeople = useCallback((numberOfPeople: NumberOfPeople) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      numberOfPeople,
    }));
  }, []);

  /**
   * Set customer info
   */
  const setCustomerInfo = useCallback((info: CustomerInfo) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      customerInfo: info,
    }));
  }, []);

  /**
   * Set payment info
   */
  const setPaymentInfo = useCallback((info: PaymentInfo) => {
    setState((prev: AppointmentState) => ({
      ...prev,
      paymentInfo: info,
    }));
  }, []);

  /**
   * Set confirmed appointment
   */
  const setConfirmedAppointment = useCallback(
    (appointment: ConfirmedAppointment) => {
      setState((prev: AppointmentState) => ({
        ...prev,
        confirmedAppointment: appointment,
        currentStep: "confirmation",
      }));
      // Clear draft on successful confirmation
      storageService.clearDraft();
    },
    []
  );

  /**
   * Calculate price breakdown
   */
  const getPriceBreakdown = useCallback((): PriceBreakdown => {
    const servicePrice = state.selectedService?.service.price || 0;
    const extrasPrice = state.selectedExtras.reduce(
      (sum, extra) => sum + extra.extra.price * extra.quantity,
      0
    );
    const subtotal = servicePrice + extrasPrice;
    const discount = state.paymentInfo?.discount || 0;
    const total = Math.max(0, subtotal - discount);
    const currency = config?.store.currency || "TRY";

    return {
      servicePrice: Number(servicePrice),
      extrasPrice: Number(extrasPrice),
      subtotal: Number(subtotal),
      discount: Number(discount),
      total: Number(total),
      currency,
    };
  }, [state, config]);

  /**
   * Reset booking
   */
  const resetBooking = useCallback(() => {
    setState(initialState);
    storageService.clearDraft();
  }, []);

  /**
   * Save draft to localStorage
   */
  const saveDraft = useCallback(() => {
    storageService.saveDraft(widgetKey, state);
  }, [widgetKey, state]);

  /**
   * Load draft from localStorage
   */
  const loadDraft = useCallback((): boolean => {
    const draft = storageService.loadDraft(widgetKey);
    if (draft) {
      setState((prev: AppointmentState) => ({
        ...prev,
        ...draft,
      }));
      return true;
    }
    return false;
  }, [widgetKey]);

  /**
   * Auto-save draft on state changes
   */
  useEffect(() => {
    // Don't save if no selections made yet
    if (!state.selectedService) {
      return;
    }

    // Debounce save to avoid too frequent writes
    const timeoutId = setTimeout(() => {
      saveDraft();
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [state, saveDraft]);

  /**
   * Load draft on mount
   */
  useEffect(() => {
    // Only load draft once on mount
    const hasDraft = storageService.hasDraft(widgetKey);
    if (hasDraft) {
      loadDraft();
    }
  }, [widgetKey, loadDraft]);

  /**
   * Clear draft when booking is completed
   */
  useEffect(() => {
    if (state.confirmedAppointment) {
      storageService.clearDraft();
    }
  }, [state.confirmedAppointment]);

  const value: BookingContextValue = {
    state,
    currentStepIndex,
    canGoNext,
    canGoPrev,
    goToStep,
    nextStep,
    prevStep,
    selectService,
    clearService,
    selectStaff,
    clearStaff,
    selectLocation,
    clearLocation,
    addExtra,
    removeExtra,
    updateExtraQuantity,
    clearExtras,
    selectDateTime,
    clearDateTime,
    setNumberOfPeople,
    setCustomerInfo,
    setPaymentInfo,
    setConfirmedAppointment,
    getPriceBreakdown,
    resetBooking,
    saveDraft,
    loadDraft,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

/**
 * Hook to use booking context
 */
export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);

  if (context === undefined) {
    throw new Error("useBooking must be used within a BookingProvider");
  }

  return context;
}
