/**
 * Sidebar Component
 * Navigation sidebar for booking steps (desktop only in sidebar layout)
 */

import { useBooking, useWidget } from "@/contexts";
import { cn } from "@/lib/utils";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingStep } from "@/types";
import { useMemo } from "react";

const STEP_LABELS: Record<BookingStep, string> = {
  service: "Choose Service",
  employee: "Select Staff",
  location: "Choose Location",
  dateTime: "Pick Date & Time",
  customerInfo: "Your Information",
  extras: "Add Extras",
  payment: "Payment",
  confirmation: "Confirm Booking",
};

// Define the order of steps
const STEP_ORDER: BookingStep[] = [
  "service",
  "employee",
  "location",
  "extras",
  "dateTime",
  "customerInfo",
  "payment",
  "confirmation",
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const { state } = useBooking();
  const { config } = useWidget();
  const currentStep = state.currentStep;
  const completedSteps = state.completedSteps;

  // Filter steps based on sidebarMenuItems config
  const visibleSteps = useMemo(() => {
    if (!config?.sidebarMenuItems) return STEP_ORDER;

    return STEP_ORDER.filter((step) => {
      // Always show confirmation step
      if (step === "confirmation") return true;

      // Check if step is enabled in config
      return config.sidebarMenuItems[step] !== false;
    });
  }, [config?.sidebarMenuItems]);

  const currentStepIndex = visibleSteps.indexOf(currentStep);

  if (isCollapsed) {
    return (
      <div className="p-4 space-y-3">
        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="w-full"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Collapsed Step Indicators */}
        <nav className="space-y-2">
          {visibleSteps.map((step, index) => {
            const isCompleted = completedSteps.includes(step);
            const isCurrent = step === currentStep;
            const isUpcoming = index > currentStepIndex;

            return (
              <div
                key={step}
                className="flex justify-center"
                title={STEP_LABELS[step]}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-sm transition-colors",
                    isCurrent &&
                      "bg-primary text-primary-foreground ring-2 ring-primary/20",
                    isCompleted && "bg-primary text-primary-foreground",
                    isUpcoming && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header with Toggle Button */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Booking Steps</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete each step to book your appointment
        </p>
      </div>

      {/* Expanded Step List */}
      <nav className="space-y-2">
        {visibleSteps.map((step, index) => {
          const isCompleted = completedSteps.includes(step);
          const isCurrent = step === currentStep;
          const isUpcoming = index > currentStepIndex;

          return (
            <div
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-lg p-3 transition-colors",
                isCurrent && "bg-primary/10 border border-primary/20",
                isCompleted && "text-muted-foreground",
                isUpcoming && "text-muted-foreground/50"
              )}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-medium text-sm",
                  isCurrent && "bg-primary text-primary-foreground",
                  isCompleted && "bg-primary text-primary-foreground",
                  isUpcoming && "bg-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-foreground"
                )}
              >
                {STEP_LABELS[step]}
              </span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
