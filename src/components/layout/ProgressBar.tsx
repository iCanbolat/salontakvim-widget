/**
 * ProgressBar Component
 * Visual progress indicator for booking steps
 */

import { useBooking } from "@/contexts";
import { cn } from "@/lib/utils";
import type { BookingStep } from "@/types";

// Define the order of steps (same as Sidebar)
const STEP_ORDER: BookingStep[] = [
  "location",
  "service",
  "employee",
  "extras",
  "dateTime",
  "customerInfo",
  "payment",
  "confirmation",
];

interface ProgressBarProps {
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  className,
  showPercentage = false,
}: ProgressBarProps) {
  const { state } = useBooking();
  const currentIndex = STEP_ORDER.indexOf(state.currentStep);
  const totalSteps = STEP_ORDER.length;
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className={cn("space-y-1", className)}>
      {/* Minimal progress bar */}
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Optional step counter */}
      {showPercentage && (
        <div className="text-xs text-muted-foreground text-right">
          Step {currentIndex + 1} of {totalSteps}
        </div>
      )}
    </div>
  );
}
