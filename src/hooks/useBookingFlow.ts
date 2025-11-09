/**
 * useBookingFlow Hook
 * Simplified hook to manage booking flow
 */

import { useBooking } from "@/contexts";
import type { BookingStep } from "@/types";

interface UseBookingFlowReturn {
  currentStep: BookingStep;
  currentStepIndex: number;
  canGoNext: () => boolean;
  canGoPrev: () => boolean;
  canGoBack: boolean;
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  goBack: () => void;
  resetBooking: () => void;
  getPriceBreakdown: () => {
    servicePrice: number;
    extrasPrice: number;
    subtotal: number;
    discount: number;
    total: number;
    currency: string;
  };
}

/**
 * Hook to manage booking flow navigation and state
 */
export function useBookingFlow(): UseBookingFlowReturn {
  const {
    state,
    currentStepIndex,
    canGoNext,
    canGoPrev,
    goToStep,
    nextStep,
    prevStep,
    resetBooking,
    getPriceBreakdown,
  } = useBooking();

  const canGoBack = canGoPrev();
  const goBack = () => {
    if (canGoBack) {
      prevStep();
    }
  };

  return {
    currentStep: state.currentStep,
    currentStepIndex,
    canGoNext,
    canGoPrev,
    canGoBack,
    goToStep,
    nextStep,
    prevStep,
    goBack,
    resetBooking,
    getPriceBreakdown,
  };
}
