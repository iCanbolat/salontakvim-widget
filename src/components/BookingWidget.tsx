/**
 * BookingWidget Component
 * Main widget component that renders current step based on booking state
 */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useBooking, useWidget } from "@/contexts";
import { StepsLayout } from "./layout";
import {
  ServiceSelection,
  EmployeeSelection,
  LocationSelection,
  ExtrasSelection,
  DateTimeSelection,
  CustomerInfoStep,
  ConfirmationStep,
} from "./steps";
import { LoadingSpinner } from "./shared";
import type { BookingStep } from "@/types";
import { cn } from "@/lib/utils";

export function BookingWidget() {
  const { config, isLoading, error, apiService } = useWidget();
  const { state, nextStep, currentStepIndex, resetBooking } = useBooking();
  const [direction, setDirection] = useState<"forward" | "backward" | null>(
    null
  );
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [confirmSuccess, setConfirmSuccess] = useState(false);
  const [appointmentId, setAppointmentId] = useState<number | null>(null);
  const prevStepIndexRef = useRef(currentStepIndex);

  // Track navigation direction for entrance animation (sync before paint to avoid flicker)
  useLayoutEffect(() => {
    const prevIndex = prevStepIndexRef.current;
    if (currentStepIndex > prevIndex) {
      setDirection("forward");
    } else if (currentStepIndex < prevIndex) {
      setDirection("backward");
    }
    prevStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  const isStepEnabled = (step: BookingStep) => {
    const sidebarConfig = config?.sidebarMenuItems as
      | Partial<Record<BookingStep, boolean>>
      | undefined;

    if (!sidebarConfig) {
      return true;
    }

    if (step === "confirmation") {
      return true;
    }

    return sidebarConfig[step] !== false;
  };

  // Auto-skip disabled steps
  useEffect(() => {
    if (!config?.sidebarMenuItems) return;

    const currentStep = state.currentStep;

    // Skip if current step is disabled (except confirmation which is always shown)
    if (currentStep !== "confirmation" && !isStepEnabled(currentStep)) {
      nextStep();
    }
  }, [state.currentStep, config?.sidebarMenuItems, nextStep]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center space-y-3 max-w-md">
          <div className="text-destructive text-base font-semibold">
            Failed to load widget
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  // No config
  if (!config) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center space-y-2 max-w-md">
          <div className="text-base font-semibold">Widget not configured</div>
          <p className="text-sm text-muted-foreground">
            Please check your widget key and try again.
          </p>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    if (
      !apiService ||
      !state.selectedService ||
      !state.selectedDateTime ||
      !state.customerInfo
    ) {
      setConfirmError("Missing required booking information");
      return;
    }

    setIsConfirming(true);
    setConfirmError(null);

    try {
      const appointmentData = {
        serviceId: state.selectedService.service.id,
        staffId: state.selectedStaff?.staff?.id || undefined,
        locationId: state.selectedLocation?.location?.id || undefined,
        startDateTime: `${state.selectedDateTime.date}T${state.selectedDateTime.time}:00`,
        numberOfPeople: state.numberOfPeople?.count || 1,
        guestFirstName: state.customerInfo.firstName,
        guestLastName: state.customerInfo.lastName || "",
        guestEmail: state.customerInfo.email || "",
        guestPhone: state.customerInfo.phone || "",
        customerNotes: state.customerInfo.notes || "",
        extrasData: state.selectedExtras.map((extra) => ({
          extraId: extra.extra.id,
          quantity: extra.quantity,
        })),
      };

      const response = await apiService.createAppointment(appointmentData);
      setAppointmentId(response.id);
      setConfirmSuccess(true);
    } catch (err: any) {
      setConfirmError(err?.message || "Failed to create appointment");
      console.error("Appointment creation failed:", err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleStartNew = () => {
    setConfirmSuccess(false);
    setConfirmError(null);
    setAppointmentId(null);
    resetBooking();
  };

  const renderStep = () => {
    // Check if step is disabled in config
    const isStepDisabled =
      state.currentStep !== "confirmation" && !isStepEnabled(state.currentStep);

    if (isStepDisabled) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" text="Loading next step..." />
        </div>
      );
    }

    switch (state.currentStep) {
      case "location":
        return <LocationSelection />;

      case "service":
        return <ServiceSelection />;

      case "employee":
        return <EmployeeSelection />;

      case "extras":
        return <ExtrasSelection />;

      case "dateTime":
        return <DateTimeSelection />;

      case "customerInfo":
        return <CustomerInfoStep />;

      case "payment":
        return (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text="Processing payment..." />
          </div>
        );

      case "confirmation":
        return (
          <ConfirmationStep
            isSuccess={confirmSuccess && !!appointmentId}
            appointmentId={appointmentId}
            error={confirmError}
            onStartNew={handleStartNew}
          />
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Unknown step: {state.currentStep}
            </p>
          </div>
        );
    }
  };

  const containerRadius = config?.styling?.buttonBorderRadius ?? 12;

  return (
    <div
      className="border shadow-lg overflow-hidden"
      style={{
        borderRadius: `${containerRadius}px`,
      }}
    >
      <StepsLayout
        showProgressBar={config.settings.showProgressBar}
        onConfirm={handleConfirm}
        isConfirming={isConfirming}
        isConfirmSuccess={confirmSuccess}
      >
        <div
          key={state.currentStep}
          className={cn(
            "step-transition",
            direction === "forward" && "step-enter-from-right",
            direction === "backward" && "step-enter-from-left"
          )}
        >
          {renderStep()}
        </div>
      </StepsLayout>
    </div>
  );
}
