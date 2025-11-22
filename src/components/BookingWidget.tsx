/**
 * BookingWidget Component
 * Main widget component that renders current step based on booking state
 */

import { useEffect } from "react";
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

export function BookingWidget() {
  const { config, isLoading, error } = useWidget();
  const { state, nextStep } = useBooking();

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
      case "service":
        return <ServiceSelection />;

      case "employee":
        return <EmployeeSelection />;

      case "location":
        return <LocationSelection />;

      case "extras":
        return <ExtrasSelection />;

      case "dateTime":
        return <DateTimeSelection />;

      case "customerInfo":
        return <CustomerInfoStep />;

      case "payment":
        // Payment step component would go here
        // For now, show a placeholder or auto-skip via useEffect
        return (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" text="Processing payment..." />
          </div>
        );

      case "confirmation":
        return <ConfirmationStep />;

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

  return (
    <StepsLayout showProgressBar={config.settings.showProgressBar}>
      {renderStep()}
    </StepsLayout>
  );
}
